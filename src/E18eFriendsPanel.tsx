import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { FortyFiveGeometry } from "./FortyFiveGeometry";
import { HorizontalSplitNameSlide } from "./HorizontalSplitNameSlide";
import { ItalicNameSlide } from "./ItalicNameSlide";
import { NameColorTrailPan, NameColorTrailZoom } from "./NameColorTrail";
import { NameCornerPin } from "./NameCornerPin";
import {
  NameLetterCycleVariant1,
  NameLetterCycleVariant2,
} from "./NameLetterCycle";
import { NamePanelSpin } from "./NamePanelSpin";
import { NameScatterBounce } from "./NameScatterBounce";
import { NameWeightSwipe } from "./NameWeightSwipe";
import { PanelSpeakerEndcard } from "./PanelSpeakerEndcard";
import { E18E_PANELISTS } from "./speaker";
import { SplitNameSlide } from "./SplitNameSlide";
import { YellowItalicLetterRise } from "./YellowItalicLetterRise";
import { ZurichOfficeTextBehind } from "./ZurichOfficeTextBehind";

const [alexander, santosh, debbie, scott, james] = E18E_PANELISTS;

export const E18eFriendsPanel: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <Audio
        name="Rhythm Rally — panel edit"
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
        name={`${alexander.firstName} weight swipe — 2 beats`}
        from={55}
        durationInFrames={23}
        premountFor={60}
      >
        <NameWeightSwipe
          animationDurationInFrames={23}
          text={alexander.firstName}
        />
      </Sequence>

      <Sequence
        name={`${alexander.lastName} yellow italic rise — 2 beats`}
        from={78}
        durationInFrames={24}
        premountFor={60}
      >
        <YellowItalicLetterRise
          animationDurationInFrames={24}
          text={alexander.lastName}
        />
      </Sequence>

      <Sequence
        name={`${debbie.firstName} ${debbie.lastName} split — 2 beats`}
        from={102}
        durationInFrames={24}
        premountFor={60}
      >
        <SplitNameSlide
          animationDurationInFrames={24}
          firstName={debbie.firstName}
          lastName={debbie.lastName}
        />
      </Sequence>

      <Sequence
        name={`${santosh.firstName} letter cycle — 2 beats`}
        from={126}
        durationInFrames={24}
        premountFor={60}
      >
        <NameLetterCycleVariant1
          cycleDurationInFrames={24}
          text={santosh.firstName}
        />
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
        name={`${santosh.lastName} color trail zoom — 2 beats`}
        from={174}
        durationInFrames={23}
        premountFor={60}
      >
        <NameColorTrailZoom
          animationDurationInFrames={23}
          text={santosh.lastName}
        />
      </Sequence>

      <Sequence
        name={`${scott.firstName} panel spin — 2 beats`}
        from={197}
        durationInFrames={24}
        premountFor={60}
      >
        <NamePanelSpin loopDurationInFrames={24} text={scott.firstName} />
      </Sequence>

      <Sequence
        name={`${scott.lastName} scatter bounce — 2 beats`}
        from={221}
        durationInFrames={24}
        premountFor={60}
      >
        <Sequence
          name="Scatter bounce animation — 5-frame early offset"
          durationInFrames={29}
          trimBefore={5}
        >
          <NameScatterBounce text={scott.lastName} />
        </Sequence>
      </Sequence>

      <Sequence
        name={`${james.firstName} ${james.lastName} horizontal split — 2 beats`}
        from={245}
        durationInFrames={24}
        premountFor={60}
      >
        <HorizontalSplitNameSlide
          animationDurationInFrames={20}
          firstName={james.firstName}
          lastName={james.lastName}
        />
      </Sequence>

      <Sequence
        name={`${james.lastName} letter cycle — 2 beats`}
        from={269}
        durationInFrames={23}
        premountFor={60}
      >
        <NameLetterCycleVariant2
          cycleDurationInFrames={23}
          text={james.lastName}
        />
      </Sequence>

      <Sequence
        name={`${debbie.firstName} italic — 2 beats`}
        from={292}
        durationInFrames={24}
        premountFor={60}
      >
        <ItalicNameSlide
          animationDurationInFrames={24}
          text={debbie.firstName}
        />
      </Sequence>

      <Sequence
        name={`${debbie.lastName} behind Zurich office — 2 beats`}
        from={316}
        durationInFrames={24}
        premountFor={60}
      >
        <ZurichOfficeTextBehind text={debbie.lastName} />
      </Sequence>

      <Sequence
        name={`${james.firstName} color trail zoom — 2 beats`}
        from={340}
        durationInFrames={24}
        premountFor={60}
      >
        <NameColorTrailZoom
          animationDurationInFrames={24}
          text={james.firstName}
        />
      </Sequence>

      <Sequence
        name={`${james.lastName} corner pin — 2 beats`}
        from={364}
        durationInFrames={23}
        premountFor={60}
      >
        <NameCornerPin
          animationDurationInFrames={23}
          backgroundColor="#19191B"
          text={james.lastName}
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
        name="Panel color trail pan — 2 beats"
        from={411}
        durationInFrames={24}
        premountFor={60}
      >
        <NameColorTrailPan animationDurationInFrames={24} text="Panel" />
      </Sequence>

      <Sequence
        name="Five-speaker panel endcard"
        from={435}
        durationInFrames={169}
        premountFor={60}
      >
        <PanelSpeakerEndcard />
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
