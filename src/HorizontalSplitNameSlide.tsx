import { loadFont } from "@remotion/google-fonts/Figtree";
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
const panelHeight = 540;
const sharedFontSize = 900;
const horizontalPadding = 72;
const entryDistance = canvasWidth * 4;

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
                  allowTail: true,
                  damping: 200,
                  durationRestThreshold: 0.1,
                }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <svg
            aria-label={firstName}
            height={panelHeight}
            viewBox={`0 0 ${canvasWidth} ${panelHeight}`}
            width={canvasWidth}
            style={{ display: "block", overflow: "visible" }}
          >
            <text
              dominantBaseline="alphabetic"
              fill="#19191B"
              fontFamily={fontFamily}
              fontSize={sharedFontSize}
              fontWeight={900}
              textAnchor="middle"
              x={canvasWidth / 2}
              y={panelHeight}
            >
              {firstName}
            </text>
          </svg>
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
                  allowTail: true,
                  damping: 200,
                  mass: 0.8,
                  stiffness: 130,
                }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <svg
            aria-label={lastName}
            height={panelHeight}
            viewBox={`0 0 ${canvasWidth} ${panelHeight}`}
            width={canvasWidth}
            style={{ display: "block" }}
          >
            <text
              dominantBaseline="alphabetic"
              fill="#F1E270"
              fontFamily={fontFamily}
              fontSize={sharedFontSize}
              fontWeight={900}
              lengthAdjust="spacingAndGlyphs"
              textAnchor="middle"
              textLength={canvasWidth - horizontalPadding * 2}
              x={canvasWidth / 2}
              y={panelHeight}
            >
              {lastName}
            </text>
          </svg>
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
