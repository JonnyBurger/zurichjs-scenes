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
  weights: ["500", "900"],
  subsets: ["latin"],
});

const canvasWidth = 1920;
const fontSize = 1400;
const letterSpacing = -24;
const horizontalMargin = 30;
const continuousDriftEndX = -140;
const startOpticalCorrection = 36;
const endOpticalCorrection = 46;

const getVisualTextMetrics = (text: string, fontWeight: 500 | 900) => {
  measureText({
    text,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing: `${letterSpacing}px`,
    validateFontIsLoaded: true,
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a canvas context to measure the name");
  }

  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  context.letterSpacing = `${letterSpacing}px`;

  return context.measureText(text);
};

type NameWeightSwipeProps = {
  animationDurationInFrames?: number;
  text: string;
};

export const NameWeightSwipe: React.FC<NameWeightSwipeProps> = ({
  animationDurationInFrames,
  text,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const animationDuration = animationDurationInFrames ?? durationInFrames;
  const startTextMetrics = getVisualTextMetrics(text, 500);
  const endTextMetrics = getVisualTextMetrics(text, 900);
  const textLeft =
    horizontalMargin +
    startTextMetrics.actualBoundingBoxLeft -
    startOpticalCorrection;
  const finalSwipeX =
    canvasWidth -
    horizontalMargin -
    textLeft -
    continuousDriftEndX -
    endTextMetrics.actualBoundingBoxRight +
    endOpticalCorrection;
  const weight = Math.round(
    interpolate(frame, [0, 0.6 * fps], [500, 900], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F1E270",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Continuous drift"
        style={{
          position: "absolute",
          inset: 0,
          translate: interpolate(
            frame,
            [0, animationDuration - 1],
            ["0px 0px", `${continuousDriftEndX}px 0px`],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.linear,
            },
          ),
        }}
      >
        <Interactive.Div
          name={`Huge variable ${text}`}
          style={{
            position: "absolute",
            left: textLeft,
            top: 346,
            color: "#19191B",
            fontFamily,
            fontSize,
            fontWeight: weight,
            fontVariationSettings: `'wght' ${weight}`,
            letterSpacing,
            lineHeight: 0.9,
            whiteSpace: "nowrap",
            translate: interpolate(
              frame,
              [11, animationDuration - 1],
              ["0px 0px", `${finalSwipeX}px 0px`],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.85, 0, 0.15, 1),
              },
            ),
          }}
        >
          {text}
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
