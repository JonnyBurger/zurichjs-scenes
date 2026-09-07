import { loadFont } from "@remotion/google-fonts/Figtree";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

type ZurichOfficeTextBehindProps = {
  text: string;
};

const layerStyle: React.CSSProperties = {
  height: "100%",
  inset: 0,
  position: "absolute",
  width: "100%",
};

const animationDurationInFrames = 604;

export const ZurichOfficeTextBehind: React.FC<ZurichOfficeTextBehindProps> = ({
  text,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <Video
        name="Zurich office — transparent background plate"
        src={staticFile("video/zurich-office-background.webm")}
        muted
        objectFit="cover"
        premountFor={60}
        style={layerStyle}
      />

      <Interactive.Div
        name={`${text} — between office layers`}
        style={{
          alignItems: "flex-start",
          color: "#F1E270",
          display: "flex",
          fontFamily,
          fontSize: 520,
          fontWeight: 900,
          inset: 0,
          justifyContent: "flex-end",
          letterSpacing: -21,
          lineHeight: 0.84,
          padding: "48px 52px 0 0",
          position: "absolute",
          textAlign: "right",
          translate: interpolate(
            frame,
            [0, animationDurationInFrames - 1],
            ["0px -50px", "-800px -50px"],
            {
              easing: Easing.linear,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Interactive.Div>

      <Video
        name="Zurich office — transparent foreground tower"
        src={staticFile("video/zurich-office-foreground.webm")}
        muted
        objectFit="cover"
        premountFor={60}
        style={layerStyle}
      />
    </AbsoluteFill>
  );
};
