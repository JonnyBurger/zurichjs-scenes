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
  weights: ["800"],
  subsets: ["latin"],
});

const fontSize = 1292.335;
const panelWidth = 1920 / 2;
const rotatedLineWidth = fontSize * 0.95;
const leftWordX = (panelWidth - rotatedLineWidth) / 2;
const rightWordX = (panelWidth + rotatedLineWidth) / 2;

type SplitNameSlideProps = {
  animationDurationInFrames?: number;
  firstName: string;
  lastName: string;
};

export const SplitNameSlide: React.FC<SplitNameSlideProps> = ({
  animationDurationInFrames,
  firstName,
  lastName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const animationEndFrame = animationDurationInFrames
    ? animationDurationInFrames - 1
    : 1.75 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
      <Interactive.Div
        name="White panel"
        style={{
          position: "absolute",
          inset: "0 50% 0 0",
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <Interactive.Div
          name={`${firstName} moves up`}
          style={{
            position: "absolute",
            inset: 0,
            translate: interpolate(
              frame,
              [0, animationEndFrame],
              ["0px 900px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({
                  damping: 13,
                  stiffness: 105,
                  mass: 0.9,
                }),
              },
            ),
          }}
        >
          <Interactive.Div
            name={firstName}
            style={{
              position: "absolute",
              left: leftWordX,
              top: 1032,
              rotate: "-90deg",
              transformOrigin: "0 0",
              color: "#258BCC",
              fontFamily,
              fontSize,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 0.95,
              whiteSpace: "nowrap",
              WebkitTextStroke: "13.9572px #FFFFFF",
              paintOrder: "stroke fill",
            }}
          >
            {firstName}
          </Interactive.Div>
        </Interactive.Div>
      </Interactive.Div>

      <Interactive.Div
        name="Blue panel"
        style={{
          position: "absolute",
          inset: "0 0 0 50%",
          backgroundColor: "#258BCC",
          overflow: "hidden",
        }}
      >
        <Interactive.Div
          name={`${lastName} moves down`}
          style={{
            position: "absolute",
            inset: 0,
            translate: interpolate(
              frame,
              [0, animationEndFrame],
              ["0px -900px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.spring({
                  damping: 13,
                  stiffness: 105,
                  mass: 0.9,
                }),
              },
            ),
          }}
        >
          <Interactive.Div
            name={lastName}
            style={{
              position: "absolute",
              left: rightWordX,
              top: -90,
              rotate: "90deg",
              transformOrigin: "0 0",
              color: "#FFFFFF",
              fontFamily,
              fontSize,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 0.95,
              whiteSpace: "nowrap",
            }}
          >
            {lastName}
          </Interactive.Div>
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
