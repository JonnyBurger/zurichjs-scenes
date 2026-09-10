# Break playback

All three compositions are 1920 × 1080 at 30 fps.

- `Break`: five minutes including the introduction and return countdown.
- `BreakIntro`: eight-second entrance, ending on the breathing break screen.
- `BreakLoop`: 160-second repeating hold, with no entrance, countdown, or audio fade. Set the exported clip to repeat in the playback system for an open-ended break. Its footage, breathing phase, and music return to their starting state. `BreakIntro` ends at the corresponding visual/audio point for entry into this loop.

The timed composition starts with the original three-shot montage, fading up from black over 2.5 seconds and dissolving into the drone bed between seconds 5–8. All five purchased drone shots rotate in 32-second slots with two-second dissolves. BREAK gently scales by up to 1.2% over an eight-second breathing cycle.

At 4:00, BREAK shrinks over 1.5 seconds and “we'll continue in <seconds> seconds” appears. At 4:50, only the large white 10 remains, counting down once per second through 1. Footage fades fully to black by 4:52. The final second shows 1 on black, then the last 200 ms hits 0 as a quick white flash with a black numeral, fading to black on the final frame. Cut directly to the next speaker intro at 5:00.

The repeating hold uses all six Rhythm Rally loops in a 19-phrase arrangement (1,1,2,2,3,3,4,4,5,5,6,6,5,4,3,2,2,1,1). The WAV joins use sample boundaries and 2 ms edge ramps to prevent clicks, with a sub-millisecond endpoint correction to make the cycle exactly 160 seconds. The timed version uses 36 complete phrases, ending on loop 01, with a pitch-preserving 1.053% tempo increase to fit exactly 300 seconds. Its endpoint is a phrase boundary, so no loop is chopped mid-phrase. It rises with an equal-power sine curve over 12 seconds to 50% gain, then holds that level through the countdown and zero flash, cutting with the clip at 5:00. There is no end fade. The separate eight-second intro reaches the same hold level at its endpoint.

Generated assets are reproducible with `python3 tools/prepare-break.py`. This creates the repeating and timed music beds and an H.264 copy of the ProRes flag shot for browser playback; source files are untouched.

Preview with `npm run dev`. Export with `npx remotion render Break out/break.mp4` (or substitute `BreakIntro` / `BreakLoop`). The playback system must loop `BreakLoop` without inserting a gap. The fixed five-minute version already repeats its media internally.

## Separately supplied video assets

The new video assets are not included in this PR. Before previewing or rendering
the break compositions, provide the five source files under
`public/video/drone-loops/`:

- `4k-drone-aerial-view-of-zurich-city-waterfront-in-2026-01-21-02-19-30-utc.mp4`
- `aerial-drone-wide-cinematic-shot-circling-around-g-2025-12-17-23-11-16-utc.mov`
- `drone-establishing-shot-over-the-city-of-zurich-in-2026-01-21-12-30-54-utc.mp4`
- `zoomed-in-drone-shot-circling-around-grossmunster-2025-12-17-15-37-29-utc.mov`
- `zurich-switzerland-aerial-view-with-swiss-flag-2025-12-17-04-30-25-utc.mov`

Then run `python3 tools/prepare-break.py` to generate
`public/video/generated/break-swiss-flag.mp4`, or supply that generated file
separately. The generated audio beds are included in Git.
