# Conference opening — approved v4

60.6 seconds, 30 fps. Preview export: `out/conference-opening-preview-v4.mp4`
(1280 × 720). The user approved v4 and requested a final 1920 × 1080 H.264 MP4:
`out/conference-opening-1080p-h264-credit.mp4` (30 fps, 60.6 seconds).

## Local checkpoints

All preceding progress and supplied assets are committed at `5ca3fed` on
`codex/opening-checkpoint-v2`. This revision is on `codex/opening-waveform-edit`.
No branches have been pushed.

## Story and music

The opening wordmark enters on the 0.6s hit, followed by IT / STARTS / WITH / US.
THIS / IS establishes Zurich through the layered office footage and flyover.
ZURICH has fixed placement; white, black and yellow change at 6.6, 6.9 and 7.2s.
The flyover holds 7.8–9.0s. No footage is reused.

OUR MCs is displayed once. Carmen arrives at 9.3s, Tony at 9.6s. The whole 350
attendees statistic lands visibly on the stronger 10.2s drop, without a delayed
digit roll. 31 countries / one room / one community / geek approved lead into
the complete lineup from 21–29.4s. All 19 speakers and panelists have a central
portrait, accelerating from whole beats to half beats; the two MCs were already
introduced separately. The strip never loops.

12 talks / big ideas / real people / new connections replaces the repeated
made-by-the-community passage. Lifting up the Zurich tech scene leads to
this is our moment / Zurich, are you ready? / make some noise. From 38.4s onward,
kinetic typography carries the denser musical accents. The final 58.2s slam
brings in the intact wordmark above white “Let's start.”, then settles through
the audio tail. No added square.

## Timing evidence

`tools/analyze-opening-audio.py` reports spectral flux and 5ms stereo RMS.
Flux alone overweights the quieter 9.0s transient: the MC bangs are at about
9.29 and 9.59s, while the stronger section entrance is about 10.19s.
At 30fps these map to frames 279, 288 and 306. Opening and final impacts map
to frames 18 and 1746. The supplied audio is neither cut nor time-stretched.

The main 100BPM grid uses 18 frames per beat, with selected offbeats in
`src/opening/accents.ts`. Logos, footage and portrait sequences are excluded
from the global camera bump. Existing approved speaker, panel and break
compositions remain unchanged. Branding uses intact supplied SVG wordmarks,
Figtree, black, white, yellow and blue.

Voice timing refinement: US arrives yellow at 3.6s with an immediate scale accent,
holding two beats before THIS. The shuffle now ends at the stronger 29.4s hit;
all 19 portraits remain, and 12 TALKS is immediately readable on that cut.

The closing frame includes a small bottom-center “made with” credit using the
official Remotion white wordmark, sourced from
https://github.com/remotion-dev/brand/blob/main/withtitle-dark/logo-dark.png.
The credit appears only in the closing shot, about 24px tall with 32px bottom spacing.
