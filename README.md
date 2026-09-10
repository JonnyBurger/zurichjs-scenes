# ZurichJS motion graphics

Some design I did for ZurichJS Conf.

## Commands

Fetch the video and generated audio assets before previewing or rendering
(requires Python 3; downloads about 2.1 GB from the fork’s media release and
verifies SHA-256 checksums):

```console
python3 tools/fetch-media.py
```

```console
npm install
npm run dev
```

Render when needed with `npx remotion render FortyFiveGeometry`.

The conference opener is available as `ConferenceOpening` in Remotion Studio.
See [the opening cue sheet](docs/conference-opening.md) for copy and music timing.
The five-minute `Break`, eight-second `BreakIntro`, and repeating `BreakLoop`
compositions are described in [the break playback guide](docs/break.md).

## License

You may NOT use the ZurichJS brand, footage (licensed only for us), and must comply with Remotion's License.  
Other than that, feel free to do whatever.
