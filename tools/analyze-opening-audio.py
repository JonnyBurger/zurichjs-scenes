"""Reproduce the opening edit's timing analysis. Requires Python 3 + numpy.

Usage: python3 tools/analyze-opening-audio.py
Uses the supplied stereo PCM WAV, without modifying or time-stretching it.
Spectral flux estimates tempo and transient phase; phase is approximate because
the analysis windows smear attacks. The edit uses the nearest 30 fps beat grid.
"""

import json
from pathlib import Path
import wave

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/audio/poppin-bottles-2026-05-07-04-19-31-utc/shorts/poppin-bottles_short-03_60sec.wav"

with wave.open(str(SOURCE)) as wav:
    sample_rate = wav.getframerate()
    frames = wav.getnframes()
    channels = wav.getnchannels()
    if wav.getsampwidth() != 2:
        raise ValueError("This analyzer expects the supplied 16-bit PCM WAV")
    samples = np.frombuffer(wav.readframes(frames), "<i2").astype(float)

mono = samples.reshape(-1, channels).mean(axis=1)[::4] / 32768
rate = sample_rate / 4
hop, size = 128, 1024
windows = np.lib.stride_tricks.sliding_window_view(mono, size)[::hop]
spectrum = np.abs(np.fft.rfft(windows * np.hanning(size)))
flux = np.maximum(np.diff(np.log1p(spectrum * 10), axis=0), 0).sum(axis=1)
flux -= flux.mean()
times = (np.arange(len(flux)) * hop + size / 2) / rate

# Coarse whole-track comb search avoids accumulated tempo drift. Normalize by
# beat count so fast candidates don't win merely by sampling more events.
def best_phase(bpm):
    period = 60 / bpm
    offsets = np.arange(0, period, 0.004)
    scores = [np.interp(np.arange(offset + period, 58, period), times, flux).mean() for offset in offsets]
    index = int(np.argmax(scores))
    return float(scores[index]), float(offsets[index])

coarse = max((best_phase(bpm)[0], bpm) for bpm in np.arange(75, 171, 0.5))[1]
tempo = max((best_phase(bpm)[0], bpm) for bpm in np.arange(coarse - 0.5, coarse + 0.51, 0.01))[1]
score, phase = best_phase(tempo)
# A separate short-window pass locates attacks more precisely than the tempo
# estimator. Report offbeat candidates as well as the nominal main-beat grid.
attack_hop, attack_size = 64, 512
attack_windows = np.lib.stride_tricks.sliding_window_view(mono, attack_size)[::attack_hop]
attack_spectrum = np.abs(np.fft.rfft(attack_windows * np.hanning(attack_size)))
attack_flux = np.maximum(np.diff(np.log1p(attack_spectrum * 10), axis=0), 0).sum(axis=1)
attack_times = (np.arange(len(attack_flux)) * attack_hop + attack_size / 2) / rate
peaks = [i for i in range(1, len(attack_flux) - 1)
         if attack_flux[i] > attack_flux[i - 1] and attack_flux[i] >= attack_flux[i + 1]]
offbeats = []
for nominal in np.arange(0.3, 58.8, 0.6):
    nearby = [i for i in peaks if abs(attack_times[i] - nominal) < 0.065]
    if not nearby:
        continue
    peak = max(nearby, key=lambda i: attack_flux[i])
    if attack_flux[peak] > np.percentile(attack_flux, 94):
        offbeats.append({"detected_seconds": round(float(attack_times[peak]), 3),
                         "edit_frame": round(float(nominal) * 30),
                         "strength": round(float(attack_flux[peak]), 1)})
# Stereo RMS distinguishes the two loud MC bangs from the earlier, quieter
# high-frequency transient. A 5 ms window preserves their differing energy.
stereo = samples.reshape(-1, channels) / 32768
energy_size = round(sample_rate * 0.005)
energy_count = len(stereo) // energy_size
rms = np.sqrt(np.mean(stereo[:energy_count * energy_size].reshape(energy_count, energy_size, channels) ** 2, axis=(1, 2)))
rms_times = (np.arange(energy_count) + 0.5) * energy_size / sample_rate
hero_hits = []
for label, nominal in [("Opening logo", 0.6), ("Carmen", 9.3), ("Tony", 9.6), ("350 attendees", 10.2), ("Final handoff", 58.2)]:
    nearby = np.flatnonzero(np.abs(rms_times - nominal) < 0.035)
    peak = nearby[np.argmax(rms[nearby])]
    hero_hits.append({"content": label, "rms_peak_seconds": round(float(rms_times[peak]), 3), "stereo_rms": round(float(rms[peak]), 3), "edit_frame": round(nominal * 30)})
report = {
    "hero_hits": hero_hits,
    "source": str(SOURCE.relative_to(ROOT)),
    "sample_rate": sample_rate,
    "sample_frames": frames,
    "duration_seconds": frames / sample_rate,
    "estimated_bpm": round(float(tempo), 2),
    "transient_phase_seconds_modulo_beat": round(phase, 3),
    "strong_offbeat_candidates": offbeats,
    "edit_bpm": 100,
    "edit_fps": 30,
    "frames_per_beat": 18,
    "frames_per_bar": 72,
    "composition_frames": round(frames / sample_rate * 30),
    "note": "100 BPM grid begins at file time zero; attacks fall within about one video frame of the grid. Preserve the 60.6-second file tail.",
}
print(json.dumps(report, indent=2))
