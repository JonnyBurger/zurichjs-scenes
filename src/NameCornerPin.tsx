import { loadFont } from "@remotion/google-fonts/Figtree";
import { measureText } from "@remotion/layout-utils";
import {
  AbsoluteFill,
  Easing,
  HtmlInCanvas,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { heightOnlyWarp } from "./effects/height-only-warp";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

const canvasWidth = 1920;
const canvasHeight = 1080;
const previewHeight = canvasHeight * 2;
const previewSlices = 48;
const horizontalMargin = 50;
const tallEdgeScale = 4;
const shortEdgeScale = 0.25;
const cameraScale = 1.75;
const cameraTravel = ((cameraScale - 1) * canvasHeight) / 2;

const getTextFontSize = (text: string) => {
  const availableWidth = canvasWidth - horizontalMargin * 2;
  let minimumFontSize = 1;
  let maximumFontSize = 620;

  for (let iteration = 0; iteration < 12; iteration++) {
    const candidateFontSize = (minimumFontSize + maximumFontSize) / 2;
    const {width} = measureText({
      text,
      fontFamily,
      fontSize: candidateFontSize,
      fontWeight: 900,
      letterSpacing: "-16px",
      validateFontIsLoaded: true,
    });

    if (width <= availableWidth) {
      minimumFontSize = candidateFontSize;
    } else {
      maximumFontSize = candidateFontSize;
    }
  }

  return minimumFontSize;
};

const TextArtwork: React.FC<{ color: string; text: string }> = ({
  color,
  text,
}) => {
  const fontSize = getTextFontSize(text);

  return (
    <div
      style={{
        alignItems: "center",
        color,
        display: "flex",
        fontFamily,
        fontSize,
        fontWeight: 900,
        height: canvasHeight,
        justifyContent: "center",
        letterSpacing: -16,
        lineHeight: 0.9,
        whiteSpace: "nowrap",
        width: canvasWidth,
      }}
    >
      {text}
    </div>
  );
};

const isHtmlInCanvasSupported = () => {
  if (
    typeof document === "undefined" ||
    typeof HTMLCanvasElement === "undefined"
  ) {
    return false;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as
    | (CanvasRenderingContext2D & { drawElementImage?: unknown })
    | null;

  return (
    typeof context?.drawElementImage === "function" &&
    typeof (canvas as HTMLCanvasElement & { requestPaint?: unknown })
      .requestPaint === "function" &&
    typeof (canvas as HTMLCanvasElement & { captureElementImage?: unknown })
      .captureElementImage === "function" &&
    "transferControlToOffscreen" in HTMLCanvasElement.prototype
  );
};

const SlicedPreview: React.FC<{
  color: string;
  leftEdgeHeight: number;
  rightEdgeHeight: number;
  text: string;
}> = ({ color, leftEdgeHeight, rightEdgeHeight, text }) => {
  const sliceWidth = canvasWidth / previewSlices;

  return (
    <div
      style={{
        height: previewHeight,
        position: "relative",
        width: canvasWidth,
      }}
    >
      {Array.from({ length: previewSlices }, (_, index) => {
        const x = index * sliceWidth;
        const progress = (index + 0.5) / previewSlices;
        const heightScale =
          leftEdgeHeight + (rightEdgeHeight - leftEdgeHeight) * progress;

        return (
          <div
            // This sliced fallback only runs in Studio browsers that do not yet
            // implement the HTML-in-Canvas API used by the rendered version.
            key={index}
            style={{
              height: previewHeight,
              left: x,
              overflow: "hidden",
              position: "absolute",
              top: 0,
              width: sliceWidth + 1,
            }}
          >
            <div
              style={{
                left: -x,
                position: "absolute",
                top: (previewHeight - canvasHeight) / 2,
                transform: `scaleY(${heightScale})`,
                transformOrigin: "center center",
              }}
            >
              <TextArtwork color={color} text={text} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

type NameCornerPinProps = {
  animationDurationInFrames?: number;
  backgroundColor?: string;
  text: string;
  textColor?: string;
};

export const NameCornerPin: React.FC<NameCornerPinProps> = ({
  animationDurationInFrames,
  backgroundColor = "#F6E779",
  text,
  textColor = "#19191B",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const animationEndFrame = animationDurationInFrames
    ? Math.max(1, animationDurationInFrames - 1)
    : 30;
  const panEndFrame = animationDurationInFrames
    ? Math.max(1, animationDurationInFrames - 1)
    : durationInFrames - 1;
  const springProgress = interpolate(frame, [0, animationEndFrame], [0, 1], {
    easing: Easing.spring({
      allowTail: true,
      damping: 200,
    }),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftEdgeHeight = interpolate(
    springProgress,
    [0, 1],
    [tallEdgeScale, shortEdgeScale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      output: "perceptual-scale",
    },
  );
  const rightEdgeHeight = interpolate(
    springProgress,
    [0, 1],
    [shortEdgeScale, tallEdgeScale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      output: "perceptual-scale",
    },
  );
  const htmlInCanvasSupported = isHtmlInCanvasSupported();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Top-to-bottom camera pan"
        style={{
          inset: 0,
          position: "absolute",
          scale: cameraScale,
          transformOrigin: "center center",
          translate: interpolate(
            frame,
            [0, panEndFrame],
            [`0px ${cameraTravel}px`, `0px -${cameraTravel}px`],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        <Interactive.Div
          name="Full-canvas corner-pin surface"
          style={{
            inset: 0,
            position: "absolute",
          }}
        >
          {htmlInCanvasSupported ? (
            <HtmlInCanvas
              name={`${text} corner pin`}
              width={canvasWidth}
              height={canvasHeight}
              pixelDensity={4}
              effects={[
                heightOnlyWarp({
                  leftScale: leftEdgeHeight,
                  rightScale: rightEdgeHeight,
                }),
              ]}
            >
              <TextArtwork color={textColor} text={text} />
            </HtmlInCanvas>
          ) : (
            <div
              style={{
                left: 0,
                position: "absolute",
                top: "50%",
                translate: "0 -50%",
              }}
            >
              <SlicedPreview
                color={textColor}
                leftEdgeHeight={leftEdgeHeight}
                rightEdgeHeight={rightEdgeHeight}
                text={text}
              />
            </div>
          )}
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
