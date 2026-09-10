import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { accentAt } from "./opening/accents";
import type { ReactNode } from "react";
import { NameColorTrailZoom } from "./NameColorTrail";
import { NameCornerPin } from "./NameCornerPin";
import { NamePanelSpin } from "./NamePanelSpin";
import { NameWeightSwipe } from "./NameWeightSwipe";
import { YellowItalicLetterRise } from "./YellowItalicLetterRise";
import { OpeningOffice, OrbitIs } from "./opening/OpeningIntro";
import {
  CounterSplit,
  NumberSequence,
  OpeningBrand,
  OpeningFinale,
  TypeHit,
  TypeRibbons,
  SpeakerLineup,
  MCIntro,
} from "./opening/ArtDirection";
import {
  beatFrame,
  OPENING_AUDIO,
  openingCues,
  type OpeningCue,
} from "./opening/timing";

const Shot: React.FC<{ cue: OpeningCue; duration: number }> = ({
  cue,
  duration,
}) => {
  switch (cue.kind) {
    case "title":
      return <OpeningBrand />;
    case "orbit":
      return <OrbitIs duration={duration} />;
    case "mcs":
      return <MCIntro />;
    case "hit":
      return <TypeHit text={cue.text} duration={duration} light={cue.light} />;
    case "weight":
      return (
        <NameWeightSwipe text={cue.text} animationDurationInFrames={duration} />
      );
    case "italic":
      return (
        <YellowItalicLetterRise
          text={cue.text}
          animationDurationInFrames={duration}
        />
      );
    case "trail":
      return (
        <NameColorTrailZoom
          text={cue.text}
          animationDurationInFrames={duration}
        />
      );
    case "spin":
      return <NamePanelSpin text={cue.text} loopDurationInFrames={duration} />;
    case "warp":
      return (
        <NameCornerPin text={cue.text} animationDurationInFrames={duration} />
      );
    case "speakers":
      return <SpeakerLineup duration={duration} />;
    case "split":
      return (
        <CounterSplit
          top={cue.text}
          bottom={cue.second ?? cue.text}
          duration={duration}
        />
      );
    case "ribbon":
      return <TypeRibbons text={cue.text} duration={duration} />;
    case "stat":
      return (
        <NumberSequence
          impact={cue.text === "350" || cue.text === "12"}
          value={cue.text}
          label={cue.second ?? ""}
          duration={duration}
          light={cue.light}
        />
      );
    case "office":
      return <OpeningOffice text={cue.text} duration={duration} />;
    case "city":
      return (
        <Video
          src={staticFile("video/zurich-flyover-beat-cut.mp4")}
          muted
          playbackRate={24 / duration}
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      );
    case "final":
      return <OpeningFinale duration={duration} />;
  }
};

/** An authored camera kick on every main beat and selected detected attacks.
 * Overscan grows with the translation so the canvas never exposes edge bars.
 * Logos and the closing hold are excluded from this camera entirely.
 */
const BeatCamera: React.FC<{ from: number; children: ReactNode }> = ({
  from,
  children,
}) => {
  const frame = useCurrentFrame();
  const { impulse, index } = accentAt(from + frame);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${1 + impulse * 0.065}) translate(${(index % 2 ? 1 : -1) * impulse * 18}px, ${impulse * -5}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const ConferenceOpening: React.FC = () => (
  <AbsoluteFill style={{ background: "#19191B", overflow: "hidden" }}>
    <Audio
      name="Poppin Bottles — main beats + detected syncopation"
      src={staticFile(OPENING_AUDIO)}
    />
    {openingCues.map((cue) => {
      const from = beatFrame(cue.beat);
      const duration = beatFrame(cue.end) - from;
      const shot = <Shot cue={cue} duration={duration} />;
      return (
        <Sequence
          key={cue.beat}
          name={`${cue.kind}: ${cue.text}${cue.second ? ` / ${cue.second}` : ""} — beat ${cue.beat}`}
          from={from}
          durationInFrames={duration}
          premountFor={18}
        >
          {cue.beat < 16 ||
          cue.kind === "title" ||
          cue.kind === "final" ||
          cue.kind === "speakers" ? (
            shot
          ) : (
            <BeatCamera from={from}>{shot}</BeatCamera>
          )}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
