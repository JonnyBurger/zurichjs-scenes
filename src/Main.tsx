import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FinalSpeakerEndcard } from "./FinalSpeakerEndcard";
import { FortyFiveGeometry } from "./FortyFiveGeometry";
import { HorizontalSplitNameSlide } from "./HorizontalSplitNameSlide";
import { ItalicNameSlide } from "./ItalicNameSlide";
import { NameColorTrailPan, NameColorTrailZoom } from "./NameColorTrail";
import {
  NameLetterCycleVariant1,
  NameLetterCycleVariant2,
} from "./NameLetterCycle";
import { NameCornerPin } from "./NameCornerPin";
import { NamePanelSpin } from "./NamePanelSpin";
import { NameScatterBounce } from "./NameScatterBounce";
import { NameWeightSwipe } from "./NameWeightSwipe";
import { SplitNameSlide } from "./SplitNameSlide";
import type { Speaker } from "./speaker";
import { YellowItalicLetterRise } from "./YellowItalicLetterRise";
import { ZurichOfficeTextBehind } from "./ZurichOfficeTextBehind";

type MainProps = Speaker & {
  endcardAvatarSrc?: string;
  endcardFirstName?: string;
  endcardLastName?: string;
};

export const Main: React.FC<MainProps> = ({
  avatarSrc,
  endcardAvatarSrc,
  endcardFirstName,
  endcardLastName,
  firstName,
  lastName,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <Audio
        name="Rhythm Rally — 20 second edit"
        src={staticFile("audio/rhythm-rally_short-01_20sec.wav")}
      />

      <Sequence
        name="Opening geometry — 4 beats"
        durationInFrames={55}
        premountFor={60}
      >
        <FortyFiveGeometry animationDurationInFrames={55} />
      </Sequence>

      <Sequence
        name="Weight swipe 01 — 2 beats"
        from={55}
        durationInFrames={23}
        premountFor={60}
      >
        <NameWeightSwipe animationDurationInFrames={23} text={firstName} />
      </Sequence>

      <Sequence
        name={`${lastName} yellow italic letter rise — 2 beats`}
        from={78}
        durationInFrames={24}
        premountFor={60}
      >
        <YellowItalicLetterRise
          animationDurationInFrames={24}
          text={lastName}
        />
      </Sequence>

      <Sequence
        name="Split name 01 — 2 beats"
        from={102}
        durationInFrames={24}
        premountFor={60}
      >
        <SplitNameSlide
          animationDurationInFrames={24}
          firstName={firstName}
          lastName={lastName}
        />
      </Sequence>

      <Sequence
        name={`${firstName} letters — right yellow panel — 2 beats`}
        from={126}
        durationInFrames={24}
        premountFor={60}
      >
        <NameLetterCycleVariant1 cycleDurationInFrames={24} text={firstName} />
      </Sequence>

      <Sequence
        name="Zurich flyover — baked 2-beat cut"
        from={150}
        durationInFrames={24}
        premountFor={60}
      >
        <Video
          name="Zurich flyover — pre-rendered speed ramp"
          src={staticFile("video/zurich-flyover-beat-cut.mp4")}
          muted
          objectFit="cover"
          premountFor={60}
          style={{ height: "100%", width: "100%" }}
        />
      </Sequence>

      <Sequence
        name={`${lastName} color trail zoom 01 — 2 beats`}
        from={174}
        durationInFrames={23}
        premountFor={60}
      >
        <NameColorTrailZoom animationDurationInFrames={23} text={lastName} />
      </Sequence>

      <Sequence
        name="Panel spin 01 — 2 beats"
        from={197}
        durationInFrames={24}
        premountFor={60}
      >
        <NamePanelSpin loopDurationInFrames={24} text={firstName} />
      </Sequence>

      <Sequence
        name={`${lastName} scatter bounce — 2 beats`}
        from={221}
        durationInFrames={24}
        premountFor={60}
      >
        <Sequence
          name="Scatter bounce animation — 5-frame early offset"
          durationInFrames={29}
          trimBefore={5}
        >
          <NameScatterBounce text={lastName} />
        </Sequence>
      </Sequence>

      <Sequence
        name="Horizontal split name — yellow / black — 2 beats"
        from={245}
        durationInFrames={24}
        premountFor={60}
      >
        <HorizontalSplitNameSlide
          animationDurationInFrames={20}
          firstName={firstName}
          lastName={lastName}
        />
      </Sequence>

      <Sequence
        name={`${lastName} letters — left white panel — 2 beats`}
        from={269}
        durationInFrames={23}
        premountFor={60}
      >
        <NameLetterCycleVariant2 cycleDurationInFrames={23} text={lastName} />
      </Sequence>

      <Sequence
        name={`${firstName} italic 02 — 2 beats`}
        from={292}
        durationInFrames={24}
        premountFor={60}
      >
        <ItalicNameSlide animationDurationInFrames={24} text={firstName} />
      </Sequence>

      <Sequence
        name="Zurich glass office — text behind tower — 2 beats"
        from={316}
        durationInFrames={24}
        premountFor={60}
      >
        <ZurichOfficeTextBehind text={lastName} />
      </Sequence>

      <Sequence
        name={`${firstName} color trail zoom 02 — 2 beats`}
        from={340}
        durationInFrames={24}
        premountFor={60}
      >
        <NameColorTrailZoom animationDurationInFrames={24} text={firstName} />
      </Sequence>

      <Sequence
        name={`${lastName} corner pin — inverted yellow / black — 2 beats`}
        from={364}
        durationInFrames={23}
        premountFor={60}
      >
        <NameCornerPin
          animationDurationInFrames={23}
          backgroundColor="#19191B"
          text={lastName}
          textColor="#F6E779"
        />
      </Sequence>

      <Sequence
        name="Zurich aerial train — baked 2-beat cut"
        from={387}
        durationInFrames={24}
        premountFor={60}
      >
        <Video
          name="Zurich aerial train — pre-rendered speed ramp"
          src={staticFile("video/zurich-train-beat-cut.mp4")}
          muted
          objectFit="cover"
          premountFor={60}
          style={{ height: "100%", width: "100%" }}
        />
      </Sequence>

      <Sequence
        name={`${lastName} color trail pan — 2 beats`}
        from={411}
        durationInFrames={24}
        premountFor={60}
      >
        <NameColorTrailPan animationDurationInFrames={24} text={lastName} />
      </Sequence>

      <Sequence
        name="Spinning ZurichJS mask into speaker endcard — 14:50"
        from={435}
        durationInFrames={169}
        premountFor={60}
      >
        <FinalSpeakerEndcard
          avatarSrc={endcardAvatarSrc ?? avatarSrc}
          firstName={endcardFirstName ?? firstName}
          lastName={endcardLastName ?? lastName}
        />
      </Sequence>

      <AbsoluteFill
        name="Final one-second fade to black"
        style={{
          backgroundColor: "#000000",
          opacity: interpolate(frame, [574, 603], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
