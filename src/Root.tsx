import "./index.css";
import { Composition, Folder } from "remotion";
import { ConferenceOpening } from "./ConferenceOpening";
import { OPENING_DURATION_IN_FRAMES, OPENING_FPS } from "./opening/timing";
import {
  Break,
  BREAK_DURATION_IN_FRAMES,
  BREAK_FPS,
  BREAK_LOOP_DURATION_IN_FRAMES,
  BREAK_INTRO_DURATION_IN_FRAMES,
} from "./Break";
import { FinalSpeakerEndcard } from "./FinalSpeakerEndcard";
import { E18eFriendsPanel } from "./E18eFriendsPanel";
import { FortyFiveGeometry } from "./FortyFiveGeometry";
import { HorizontalSplitNameSlide } from "./HorizontalSplitNameSlide";
import { ItalicNameSlide } from "./ItalicNameSlide";
import { Main } from "./Main";
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
import { RotatingGeometryLoop } from "./RotatingGeometryLoop";
import { SpeakerEndcard } from "./SpeakerEndcard";
import { SplitNameSlide } from "./SplitNameSlide";
import { CONFERENCE_SPEAKERS, DEFAULT_SPEAKER } from "./speaker";
import { StaticGeometryFrame91 } from "./StaticGeometryFrame91";
import { ZurichFlyoverSpeedRamp } from "./ZurichFlyoverSpeedRamp";
import { ZurichOfficeSpeedRamp } from "./ZurichOfficeSpeedRamp";
import { ZurichOfficeTextBehind } from "./ZurichOfficeTextBehind";
import { ZurichStockPreview } from "./ZurichStockPreview";
import { ZurichTrainSpeedRamp } from "./ZurichTrainSpeedRamp";
import { ZurichJSConf } from "./ZurichJSConf";
import { YellowItalicLetterRise } from "./YellowItalicLetterRise";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ConferenceOpening"
        component={ConferenceOpening}
        durationInFrames={OPENING_DURATION_IN_FRAMES}
        fps={OPENING_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="main"
        component={Main}
        durationInFrames={604}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_SPEAKER}
      />

      <Folder name="Scenes">
        <Composition
          id="Break"
          component={Break}
          durationInFrames={BREAK_DURATION_IN_FRAMES}
          fps={BREAK_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="BreakLoop"
          component={Break}
          defaultProps={{ mode: "hold" as const }}
          durationInFrames={BREAK_LOOP_DURATION_IN_FRAMES}
          fps={BREAK_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="BreakIntro"
          component={Break}
          defaultProps={{ mode: "intro" as const }}
          durationInFrames={BREAK_INTRO_DURATION_IN_FRAMES}
          fps={BREAK_FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="FortyFiveGeometry"
          component={FortyFiveGeometry}
          durationInFrames={58}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StaticGeometryFrame91"
          component={StaticGeometryFrame91}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="RotatingGeometryLoop"
          component={RotatingGeometryLoop}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="NamePanelSpin"
          component={NamePanelSpin}
          durationInFrames={30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: DEFAULT_SPEAKER.firstName }}
        />
        <Composition
          id="NameCornerPin"
          component={NameCornerPin}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: "Dorfmeister" }}
        />
        <Composition
          id="SplitNameSlide"
          component={SplitNameSlide}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            firstName: DEFAULT_SPEAKER.firstName,
            lastName: DEFAULT_SPEAKER.lastName,
          }}
        />
        <Composition
          id="HorizontalSplitNameSlide"
          component={HorizontalSplitNameSlide}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            firstName: DEFAULT_SPEAKER.firstName,
            lastName: DEFAULT_SPEAKER.lastName,
          }}
        />
        <Composition
          id="ItalicNameSlide"
          component={ItalicNameSlide}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: DEFAULT_SPEAKER.lastName }}
        />
        <Composition
          id="YellowItalicLetterRise"
          component={YellowItalicLetterRise}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            animationDurationInFrames: 24,
            text: DEFAULT_SPEAKER.lastName,
          }}
        />
        <Composition
          id="NameLetterCycleVariant1"
          component={NameLetterCycleVariant1}
          durationInFrames={45}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: DEFAULT_SPEAKER.firstName }}
        />
        <Composition
          id="NameLetterCycleVariant2"
          component={NameLetterCycleVariant2}
          durationInFrames={45}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: DEFAULT_SPEAKER.lastName }}
        />
        <Composition
          id="SpeakerEndcard"
          component={SpeakerEndcard}
          durationInFrames={154}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={DEFAULT_SPEAKER}
        />
        <Composition
          id="FinalSpeakerEndcard"
          component={FinalSpeakerEndcard}
          durationInFrames={169}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={DEFAULT_SPEAKER}
        />
        <Composition
          id="NameColorTrailZoom"
          component={NameColorTrailZoom}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            animationDurationInFrames: 24,
            text: DEFAULT_SPEAKER.firstName,
          }}
        />
        <Composition
          id="NameColorTrailPan"
          component={NameColorTrailPan}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            animationDurationInFrames: 24,
            text: DEFAULT_SPEAKER.firstName,
          }}
        />
        <Composition
          id="NameWeightSwipe"
          component={NameWeightSwipe}
          durationInFrames={30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: DEFAULT_SPEAKER.firstName }}
        />
        <Composition
          id="NameScatterBounce"
          component={NameScatterBounce}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: "Dorfmeister" }}
        />
        <Composition
          id="ZurichFlyoverSpeedRamp"
          component={ZurichFlyoverSpeedRamp}
          durationInFrames={535}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ZurichFlyoverBeatCut"
          component={ZurichFlyoverSpeedRamp}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ settleDurationInFrames: 18 }}
        />
        <Composition
          id="ZurichOfficeSpeedRamp"
          component={ZurichOfficeSpeedRamp}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ZurichOfficeTextBehind"
          component={ZurichOfficeTextBehind}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: DEFAULT_SPEAKER.lastName }}
        />
        <Composition
          id="ZurichStockPreview"
          component={ZurichStockPreview}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ZurichTrainSpeedRamp"
          component={ZurichTrainSpeedRamp}
          durationInFrames={24}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Speakers">
        <Composition
          id="ZurichJSConf"
          component={ZurichJSConf}
          durationInFrames={604}
          fps={30}
          width={1920}
          height={1080}
        />
        {CONFERENCE_SPEAKERS.filter(
          ({ hasStandaloneComposition }) => hasStandaloneComposition !== false,
        ).map(
          ({ compositionId, avatarSrc, firstName, lastName, sessionTitle }) => (
            <Composition
              key={compositionId}
              id={compositionId}
              component={Main}
              durationInFrames={604}
              fps={30}
              width={1920}
              height={1080}
              defaultProps={{ avatarSrc, firstName, lastName, sessionTitle }}
            />
          ),
        )}
      </Folder>

      <Folder name="Panels">
        <Composition
          id="E18eFriendsPanel"
          component={E18eFriendsPanel}
          durationInFrames={604}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="E18ePanelEndcard"
          component={PanelSpeakerEndcard}
          durationInFrames={169}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
