import { loadFont } from "@remotion/google-fonts/Figtree";
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

type ItalicNameSlideProps = {
  animationDurationInFrames?: number;
  text: string;
};

export const ItalicNameSlide: React.FC<ItalicNameSlideProps> = ({
  animationDurationInFrames,
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const animationEndFrame = animationDurationInFrames
    ? animationDurationInFrames - 1
    : 1.5 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      <Interactive.Div
        name={`${text} moves left to right`}
        style={{
          position: "absolute",
          inset: 0,
          translate: interpolate(
            frame,
            [0, animationEndFrame],
            ["-2500px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <Interactive.Div
          name={text}
          style={{
            position: "absolute",
            left: 144,
            top: 82,
            color: "#258BCC",
            fontFamily,
            fontSize: 965,
            fontStyle: "italic",
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 0.95,
            whiteSpace: "nowrap",
            WebkitTextStroke: "27px #FFFFFF",
            paintOrder: "stroke fill",
            translate: "71.4px -85.7px",
            scale: 1.249,
          }}
        >
          {text}
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
