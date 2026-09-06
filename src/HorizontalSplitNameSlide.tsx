import { loadFont } from "@remotion/google-fonts/Figtree";
import { measureText } from "@remotion/layout-utils";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

const canvasWidth = 1920;
const maximumFontSize = 900;
const horizontalPadding = 72;
const entryDistance = canvasWidth * 4;

const getSharedFontSize = (firstName: string, lastName: string) => {
  const referenceFontSize = 100;
  const availableWidth = canvasWidth - horizontalPadding * 2;
  const widestText = Math.max(
    measureText({
      text: firstName,
      fontFamily,
      fontSize: referenceFontSize,
      fontWeight: 900,
      validateFontIsLoaded: true,
    }).width,
    measureText({
      text: lastName,
      fontFamily,
      fontSize: referenceFontSize,
      fontWeight: 900,
      validateFontIsLoaded: true,
    }).width,
  );

  return Math.min(
    maximumFontSize,
    (availableWidth / widestText) * referenceFontSize,
  );
};

const BaselineText: React.FC<{
  color: string;
  fontSize: number;
  text: string;
}> = ({ color, fontSize, text }) => {
  return (
    <div
      style={{
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          color,
          display: "inline-block",
          fontFamily,
          fontSize,
          fontWeight: 900,
          lineHeight: 1,
          translate: "0 20%",
          verticalAlign: "baseline",
        }}
      >
        {text}
      </span>
    </div>
  );
};

type HorizontalSplitNameSlideProps = {
  animationDurationInFrames?: number;
  firstName: string;
  lastName: string;
};

export const HorizontalSplitNameSlide: React.FC<
  HorizontalSplitNameSlideProps
> = ({ animationDurationInFrames, firstName, lastName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const animationEndFrame = animationDurationInFrames
    ? animationDurationInFrames - 1
    : 1.75 * fps;
  const sharedFontSize = getSharedFontSize(firstName, lastName) * 3.75;

  return (
    <AbsoluteFill style={{ backgroundColor: "#19191B", overflow: "hidden" }}>
      <Interactive.Div
        name="Yellow upper panel"
        style={{
          backgroundColor: "#F1E270",
          clipPath: "inset(0)",
          inset: "0 0 50% 0",
          overflow: "hidden",
          position: "absolute",
        }}
      >
        <Interactive.Div
          name={`${firstName} moves right`}
          style={{
            inset: 0,
            position: "absolute",
            translate: interpolate(
              frame,
              [0, animationEndFrame],
              [`-${entryDistance}px 0px`, "0px 0px"],
              {
                easing: Easing.spring({
                  damping: 200,
                  durationRestThreshold: 0.1,
                  allowTail: true,
                }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <BaselineText
            color="#19191B"
            fontSize={sharedFontSize}
            text={firstName}
          />
        </Interactive.Div>
      </Interactive.Div>

      <Interactive.Div
        name="Black lower panel"
        style={{
          backgroundColor: "#19191B",
          clipPath: "inset(0)",
          inset: "50% 0 0 0",
          overflow: "hidden",
          position: "absolute",
        }}
      >
        <Interactive.Div
          name={`${lastName} moves left`}
          style={{
            inset: 0,
            position: "absolute",
            translate: interpolate(
              frame,
              [0, animationEndFrame],
              [`${entryDistance}px 0px`, "0px 0px"],
              {
                easing: Easing.spring({
                  damping: 200,
                  allowTail: true,
                }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <BaselineText
            color="#F1E270"
            fontSize={sharedFontSize}
            text={lastName}
          />
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
