import { loadFont } from "@remotion/google-fonts/Figtree";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

type NameLetterCycleProps = {
  cycleDurationInFrames?: number;
  text: string;
};

type NameLetterCycleSceneProps = NameLetterCycleProps & {
  panelSide: "left" | "right";
};

const NameLetterCycleScene: React.FC<NameLetterCycleSceneProps> = ({
  cycleDurationInFrames,
  panelSide,
  text,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cycleDuration = cycleDurationInFrames ?? durationInFrames;
  const panelWidth = interpolate(
    frame,
    [0, Math.max(1, cycleDuration + 20)],
    [45, 70],
    {
      easing: Easing.spring({
        allowTail: true,
        damping: 200,
      }),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const isPanelOnLeft = panelSide === "left";
  const panelColor = isPanelOnLeft ? "#FFFFFF" : "#F1E270";
  const letterColor = isPanelOnLeft ? "#F1E270" : "#FFFFFF";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isPanelOnLeft ? "#F1E270" : "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Centered Zurich train video"
        style={{
          bottom: 0,
          left: isPanelOnLeft ? undefined : 0,
          overflow: "hidden",
          position: "absolute",
          right: isPanelOnLeft ? 0 : undefined,
          top: 0,
          width: `${100 - panelWidth}%`,
        }}
      >
        <Video
          name="Aerial train leaving Zurich"
          src={staticFile("video/zurich-train-tracking.mp4")}
          muted
          objectFit="cover"
          premountFor={60}
          style={{
            height: "100%",
            objectPosition: "50% 50%",
            width: "100%",
          }}
        />
      </Interactive.Div>

      <Interactive.Div
        name={`${isPanelOnLeft ? "Left white" : "Right yellow"} letter panel`}
        style={{
          backgroundColor: panelColor,
          bottom: 0,
          left: isPanelOnLeft ? 0 : undefined,
          overflow: "hidden",
          position: "absolute",
          right: isPanelOnLeft ? undefined : 0,
          top: 0,
          width: `${panelWidth}%`,
        }}
      >
        <Interactive.Div
          name={`${text} letter`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 79,
            color: letterColor,
            fontFamily,
            fontSize: 973.115,
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 0.95,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {Array.from(text)[
            Math.min(
              Math.max(0, Array.from(text).length - 1),
              Math.floor((frame * Array.from(text).length) / cycleDuration),
            )
          ] ?? ""}
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const NameLetterCycleVariant1: React.FC<NameLetterCycleProps> = (
  props,
) => {
  return <NameLetterCycleScene {...props} panelSide="right" />;
};

export const NameLetterCycleVariant2: React.FC<NameLetterCycleProps> = (
  props,
) => {
  return <NameLetterCycleScene {...props} panelSide="left" />;
};
