import { loadFont } from "@remotion/google-fonts/Figtree";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

export const BREAK_DURATION_IN_FRAMES = 240;

export const Break: React.FC = () => {
  const frame = useCurrentFrame();
  const fontWeight = Math.round(
    interpolate(
      frame,
      [0, BREAK_DURATION_IN_FRAMES / 2, BREAK_DURATION_IN_FRAMES - 1],
      [900, 700, 900],
      {
        easing: [
          Easing.bezier(0.37, 0, 0.63, 1),
          Easing.bezier(0.37, 0, 0.63, 1),
        ],
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <Video
        name="Three Zurich shots — baked forward / reverse montage"
        src={staticFile("video/zurich-break-three-shot-pingpong.mp4")}
        muted
        objectFit="cover"
        premountFor={60}
        style={{ height: "100%", width: "100%" }}
      />

      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.36)" }} />

      <CanvasImage
        name="ZurichJS Conf 2026 logo"
        src={staticFile("zurichjs-conf-2026-logo.svg")}
        style={{
          height: 50,
          left: "50%",
          position: "absolute",
          top: 238,
          translate: "-50% 0px",
          width: 698,
        }}
      />

      <Interactive.Div
        name="BREAK — whole-word variable weight"
        style={{
          alignItems: "center",
          color: "#F6E779",
          display: "flex",
          fontFamily,
          fontSize: 520,
          fontVariationSettings: `'wght' ${fontWeight}`,
          fontWeight,
          inset: 0,
          justifyContent: "center",
          letterSpacing: -28,
          lineHeight: 0.8,
          position: "absolute",
          whiteSpace: "nowrap",
        }}
      >
        BREAK
      </Interactive.Div>

      <Audio
        name="Rhythm Rally — break loop"
        src={staticFile("audio/rhythm-rally_loop-01.wav")}
      />
    </AbsoluteFill>
  );
};
