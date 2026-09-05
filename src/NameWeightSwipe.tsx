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
  weights: ["500", "900"],
  subsets: ["latin"],
});

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
            ["0px 0px", "-140px 0px"],
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
            left: 90,
            top: 346,
            color: "#19191B",
            fontFamily,
            fontSize: 1400,
            fontWeight: weight,
            fontVariationSettings: `'wght' ${weight}`,
            letterSpacing: -24,
            lineHeight: 0.9,
            whiteSpace: "nowrap",
            translate: interpolate(
              frame,
              [11, animationDuration - 1],
              ["0px 0px", "-3100px 0px"],
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
