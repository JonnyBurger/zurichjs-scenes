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

const { fontFamily } = loadFont("italic", {
  weights: ["900"],
  subsets: ["latin"],
});

const canvasWidth = 1920;
const fontSize = 820;
const letterSpacing = -42;
const longTextEndX = -130;
const italicOpticalCorrection = 64;

type YellowItalicLetterRiseProps = {
  animationDurationInFrames?: number;
  text: string;
};

export const YellowItalicLetterRise: React.FC<
  YellowItalicLetterRiseProps
> = ({ animationDurationInFrames, text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const animationDuration =
    animationDurationInFrames ?? durationInFrames;
  const textWidth = Array.from(text).reduce(
    (width, letter) =>
      width +
      measureText({
        text: letter,
        fontFamily,
        fontSize,
        fontWeight: 900,
        letterSpacing: `${letterSpacing}px`,
        validateFontIsLoaded: true,
        additionalStyles: {
          fontStyle: "italic",
        },
      }).width,
    0,
  );
  const endTranslateX =
    textWidth <= canvasWidth
      ? Math.max(
          0,
          (canvasWidth - textWidth) / 2 - italicOpticalCorrection,
        )
      : longTextEndX;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name={`${text} moves into frame`}
        style={{
          alignItems: "flex-start",
          display: "flex",
          left: 0,
          position: "absolute",
          top: 118,
          translate: interpolate(
            frame,
            [0, animationDuration - 1],
            ["-1520px 0px", `${endTranslateX}px 0px`],
            {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
          whiteSpace: "nowrap",
        }}
      >
        {text.split("").map((letter, index) => (
          <Interactive.Span
            key={`${letter}-${index}`}
            name={`${letter} rises ${index + 1}`}
            style={{
              color: "#F1E270",
              display: "inline-block",
              fontFamily,
              fontSize,
              fontStyle: "italic",
              fontWeight: 900,
              letterSpacing,
              lineHeight: 0.92,
              translate: interpolate(
                frame - index * 0.8,
                [0, 15],
                ["0px 620px", "0px 0px"],
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
            {letter}
          </Interactive.Span>
        ))}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
