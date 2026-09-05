import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type RotatingGeometryLoopProps = {
  loopDurationInFrames?: number;
};

export const RotatingGeometryLoop: React.FC<RotatingGeometryLoopProps> = ({
  loopDurationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const loopDuration = loopDurationInFrames ?? durationInFrames;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Center-origin rotating geometry"
        style={{
          position: "absolute",
          width: 2400,
          height: 2400,
          left: -240,
          top: -660,
          transformOrigin: "1200px 1200px",
          rotate: interpolate(
            frame,
            [0, loopDuration],
            ["0deg", "360deg"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.linear,
            },
          ),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FAFAF7",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#2D93C9",
            clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#F6E779",
            clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
