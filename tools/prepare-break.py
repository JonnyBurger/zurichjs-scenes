"""Build the sample-aligned 160-second music cycle and browser-safe flag shot.
Run from any directory with Python 3 after npm install. Originals stay untouched.
"""
from pathlib import Path
import os
import array
import audioop
import math
import sys
import subprocess
import wave
import tempfile

ROOT = Path(__file__).resolve().parents[1]
loops = ROOT / 'public/audio/rhythm-rally-2026-05-07-03-15-13-utc/Loops'
order = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 5, 4, 3, 2, 2, 1, 1]
chunks = []
params = None
for index in order:
    with wave.open(str(loops / f'rhythm-rally_loop-{index:02}.wav'), 'rb') as source:
        current = (source.getnchannels(), source.getsampwidth(), source.getframerate())
        if params is not None and current != params:
            raise ValueError('Music loops must share PCM format')
        params = current
        if source.getsampwidth() != 2:
            raise ValueError('Expected 16-bit PCM loops')
        samples = array.array('h', source.readframes(source.getnframes()))
        if sys.byteorder != 'little':
            samples.byteswap()
        # Two-millisecond edge ramps suppress clicks without shifting beats.
        ramp = round(source.getframerate() * 0.002)
        for i in range(ramp):
            gain = math.sin(i / (ramp - 1) * math.pi / 2)
            for channel in range(source.getnchannels()):
                start = i * source.getnchannels() + channel
                end = len(samples) - (i + 1) * source.getnchannels() + channel
                samples[start] = round(samples[start] * gain)
                samples[end] = round(samples[end] * gain)
        if sys.byteorder != 'little':
            samples.byteswap()
        chunks.append(samples.tobytes())
channels, width, rate = params
# The supplied loops round their musical duration by less than one sample each.
# Pad only the missing samples to make 19 bars-of-four loops exactly 160 seconds.
length = 160 * rate * channels * width
pcm = b''.join(chunks)
assert abs(len(pcm) - length) <= 100 * channels * width
pcm = (pcm + pcm[-channels * width:] * 100)[:length]
audio = ROOT / 'public/audio/generated/break-cycle.wav'
audio.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(audio), 'wb') as output:
    output.setnchannels(channels)
    output.setsampwidth(width)
    output.setframerate(rate)
    output.writeframes(pcm)

ffmpeg = next((ROOT / 'node_modules').rglob('ffmpeg')).resolve()
# The timed break contains 36 whole phrases. Speed up by only 1.053%,
# preserving pitch, so the last phrase ends at 5:00 instead of being chopped.
# Finish with loop 01, matching the opening musical phrase.
timed_chunks = (chunks * 2)[:35] + [chunks[0]]
timed_pcm = b''.join(timed_chunks)
tempo = (len(timed_pcm) / (rate * channels * width)) / 300
with tempfile.TemporaryDirectory(prefix='break-music-') as temporary:
    source_path = Path(temporary) / 'whole-phrases.wav'
    with wave.open(str(source_path), 'wb') as output:
        output.setnchannels(channels)
        output.setsampwidth(width)
        output.setframerate(rate)
        output.writeframes(timed_pcm)
    subprocess.run([
        str(ffmpeg), '-y', '-v', 'error', '-i', str(source_path),
        '-af', f'atempo={tempo:.12f}',
        '-c:a', 'pcm_s16le', str(Path(temporary) / 'tempo.wav'),
    ], env={**os.environ, 'DYLD_LIBRARY_PATH': str(ffmpeg.parent)}, check=True)
    # atempo has a small window-dependent duration offset. Resample that tiny
    # residual across the entire output instead of truncating the final phrase.
    with wave.open(str(Path(temporary) / 'tempo.wav'), 'rb') as processed:
        actual_frames = processed.getnframes()
        target_frames = 300 * rate
        corrected, _ = audioop.ratecv(processed.readframes(actual_frames), width,
                                    channels, actual_frames, target_frames, None)
    target_bytes = target_frames * channels * width
    corrected = (corrected + bytes(channels * width))[:target_bytes]
    assert len(corrected) == target_bytes
    # Restore a 2 ms click guard on the final endpoint after time stretching.
    tail = array.array('h', corrected)
    if sys.byteorder != 'little':
        tail.byteswap()
    ramp = round(rate * 0.002)
    for i in range(ramp):
        gain = math.sin(i / (ramp - 1) * math.pi / 2)
        for channel in range(channels):
            index = len(tail) - (i + 1) * channels + channel
            tail[index] = round(tail[index] * gain)
    if sys.byteorder != 'little':
        tail.byteswap()
    with wave.open(str(ROOT / 'public/audio/generated/break-timed.wav'), 'wb') as output:
        output.setnchannels(channels)
        output.setsampwidth(width)
        output.setframerate(rate)
        output.writeframes(tail.tobytes())
    print(f'Tempo window correction: {(actual_frames / target_frames - 1) * 100:.5f}%')
print(f'Timed music: 36 complete phrases, tempo multiplier {tempo:.8f}')

video = ROOT / 'public/video/generated/break-swiss-flag.mp4'
video.parent.mkdir(parents=True, exist_ok=True)
if not video.exists():
    subprocess.run([str(ffmpeg), '-y', '-v', 'error', '-i', str(ROOT / 'public/video/drone-loops/zurich-switzerland-aerial-view-with-swiss-flag-2025-12-17-04-30-25-utc.mov'), '-an', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(video)], env={**os.environ, 'DYLD_LIBRARY_PATH': str(ffmpeg.parent)}, check=True)
print('Prepared break-cycle.wav (160 seconds) and break-swiss-flag.mp4')
