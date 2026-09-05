import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  Sequence,
  useCurrentFrame,
} from "remotion";
import {
  SpeakerEndcard,
  SPEAKER_ENDCARD_LOGO_ENTRY_SIZE,
  ZurichJsLogo,
} from "./SpeakerEndcard";

const panelIntroDuration = 15;
const oversizedPanelSize = 2400;

const LogoPattern: React.FC = () => {
  return (
    <svg
      height="100%"
      viewBox="0 0 150 150"
      width="100%"
      style={{
        inset: 0,
        overflow: "visible",
        position: "absolute",
      }}
    >
      <path
        d="M149.5 0.300446L149.5 150L0.100006 150L149.5 0.300446Z"
        fill="#F6E779"
      />
      <path
        d="M0.100098 150V0.300781L74.8001 75.2006L0.100098 150Z"
        fill="#2D93C9"
      />
      <path
        d="M149.6 0.300781L74.8001 75.2006L0.100098 0.300781H149.6Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

type FinalSpeakerEndcardProps = {
  animationDurationInFrames?: number;
  avatarSrc: string;
  firstName: string;
  lastName: string;
};

const SpinningLogoMask: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: interpolateColors(
          frame,
          [9, panelIntroDuration - 1],
          ["#050505", "#FFFFFF"],
        ),
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          clipPath: `inset(${interpolate(
            frame,
            [4, panelIntroDuration - 1],
            [0, (1080 - SPEAKER_ENDCARD_LOGO_ENTRY_SIZE) / 2],
            {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )}px ${interpolate(
            frame,
            [4, panelIntroDuration - 1],
            [0, (1920 - SPEAKER_ENDCARD_LOGO_ENTRY_SIZE) / 2],
            {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )}px)`,
        }}
      >
        <div
          style={{
            height: interpolate(
              frame,
              [4, panelIntroDuration - 1],
              [oversizedPanelSize, SPEAKER_ENDCARD_LOGO_ENTRY_SIZE],
              {
                easing: Easing.spring({ damping: 200 }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            left: "50%",
            position: "absolute",
            rotate: interpolate(
              frame,
              [0, panelIntroDuration - 1],
              ["-135deg", "0deg"],
              {
                easing: Easing.spring({ damping: 200 }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            top: "50%",
            translate: "-50% -50%",
            transformOrigin: "50% 50%",
            width: interpolate(
              frame,
              [4, panelIntroDuration - 1],
              [oversizedPanelSize, SPEAKER_ENDCARD_LOGO_ENTRY_SIZE],
              {
                easing: Easing.spring({ damping: 200 }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <LogoPattern />

          <div
            style={{
              inset: 0,
              opacity: interpolate(frame, [9, panelIntroDuration - 1], [0, 1], {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              position: "absolute",
              scale: interpolate(frame, [9, panelIntroDuration - 1], [1.7, 1], {
                easing: Easing.spring({ damping: 200 }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                output: "perceptual-scale",
              }),
            }}
          >
            <ZurichJsLogo />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FinalSpeakerEndcard: React.FC<FinalSpeakerEndcardProps> = ({
  animationDurationInFrames = 169,
  avatarSrc,
  firstName,
  lastName,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <Interactive.Div
        name="Constant 5% endcard pullback"
        style={{
          inset: 0,
          position: "absolute",
          scale: interpolate(
            frame,
            [0, animationDurationInFrames - 1],
            [1.15, 1],
            {
              easing: Easing.linear,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            },
          ),
          transformOrigin: "50% 50%",
        }}
      >
        <Sequence durationInFrames={panelIntroDuration} premountFor={60}>
          <SpinningLogoMask />
        </Sequence>

        <Sequence from={panelIntroDuration} premountFor={60}>
          <SpeakerEndcard
            avatarSrc={avatarSrc}
            firstName={firstName}
            lastName={lastName}
          />
        </Sequence>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
