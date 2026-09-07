# Conference opening — working preview

`ConferenceOpening` is the current live preview: 1920 × 1080, 30 fps,
60.6 seconds. **Export preview files only while the edit is in review.**
Run `npm run dev`, select `ConferenceOpening`, and review in Studio. The latest requested export is `out/conference-opening-preview-v2.mp4` (720p).
The older MP4 files are previous revisions.

## Story

The intact conference wordmark opens over **IT / STARTS / WITH / US**. The edit
then establishes Zurich, the people in the room (**350 attendees, 31 countries**),
one shared community, and **GEEK / APPROVED**. **LIFTING / UP / ZURICH / TECH SCENE**
leads into **12 talks** and a fast sequence of the people delivering the event.
**MADE BY THE COMMUNITY / FOR THE COMMUNITY** becomes a second portrait run,
then **THIS IS OUR MOMENT**, **ZURICH, ARE YOU READY?**, and **MAKE SOME NOISE**.
The final handoff is only the conference wordmark above a white **Let's start.**

There is no workshops statistic, award paragraph, or extra closing square.
Each footage source appears once: the layered office shot at 6.6 seconds and the
flyover at 7.8 seconds, now held for 1.2 seconds. All repeat office/flyover/train segments have been removed.
At 9.0 seconds, Carmen Huidobro and Tony Edwards appear under OUR MCs.
The later speaker portrait groups at 27.0, 31.2, and 40.8 seconds retain their
approved ordering and half-beat motion.

## Brand and motion

The supplied `assets/wordmark-conf-white.svg` is always one intact, unfiltered
image on a dark field. It is not sliced, recoloured, stretched, rotated, or used
as a camera texture. The opening's changing typography carries
the rhythm around the logo, with no side triangles; the closing logo stays above the white title.

The approved weight swipes, italic rises, colour trails, spinning sectors,
corner-pin warp and layered office footage remain in use. Before 9.6 seconds,
the camera bumps are disabled: IS follows a small 3D orbit with three-frame
colour delays, and the office plates stay untransformed while ZURICH smoothly
changes direction on the beats. New counter-moving
type, numeric macro-to-readable sequences, rotating community text belts, and
speaker strips extend that same Figtree / black / white / yellow / blue language.
No horizontal framing bars remain on the statistics.

## Audio and beat response

The supplied Poppin Bottles 60-second file measures **60.6 seconds**. Its nominal
**100 BPM** grid gives **18 frames per beat** and **9 per half-beat** at 30 fps.
The 60-second version is retained for this pass to preserve the successful
10–16 second section; the shorter alternative remains an editorial option.

`tools/analyze-opening-audio.py` uses a long-window spectral-flux pass for tempo
and a separate short-window pass for individual attacks. The strong attack at
**9.288 seconds** maps to frame **279**, followed by the main hit at frame **288**.
The portrait change and following statistic cut land on those respective hits.

`src/opening/accents.ts` records selected detected offbeats separately from the
main grid. From 9.6 seconds onward, every main beat triggers a cut, a portrait step,
a typographic change, or an additional camera kick; strong offbeats receive a smaller kick. Logos are
excluded from the camera wrapper. The final title settles through the audio tail.
Overscan grows with the camera offset so edge gaps cannot produce framing bars.
The 16.8–19.2 second stretch now changes content every beat.

## Editing

- `src/opening/timing.ts`: shot order, beat positions, wording, portrait groups.
- `src/opening/OpeningIntro.tsx`: orbital IS and smooth layered office typography.
- `src/opening/accents.ts`: selected offbeat accents and per-frame impulse.
- `src/opening/ArtDirection.tsx`: new typography, portrait strips, opening/ending.
- `src/ConferenceOpening.tsx`: assembly and beat camera around approved effects.

The approved speaker, panel, and break compositions are unchanged. Use live
Studio playback and frame previews while working. The user has authorized a
new preview file for this revision; do not create a full-resolution final export.
