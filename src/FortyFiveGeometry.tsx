import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type DiagonalRevealProps = {
  color: string;
  endFrame: number;
  mode: "blue-bottom-left" | "white-top-right" | "yellow-bottom-right";
  name: string;
  startFrame: number;
};

const DiagonalReveal: React.FC<DiagonalRevealProps> = ({
  color,
  endFrame,
  mode,
  name,
  startFrame,
}) => {
  const frame = useCurrentFrame();

  // The white/blue split is x - y = 420. Yellow uses x + y = 1500.
  // Both line families have a slope of exactly 1 or -1: true 45-degree edges.
  const sweep = interpolate(
    frame,
    [startFrame, endFrame],
    mode === "white-top-right"
      ? [1922, 420]
      : mode === "blue-bottom-left"
        ? [-1082, 420]
        : [3002, 1500],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.spring({
        damping: 200,
        durationRestThreshold: 0.1,
        allowTail: true,
      }),
    },
  );

  return (
    <Interactive.Div
      name={name}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        clipPath:
          mode === "white-top-right"
            ? `polygon(${sweep - 3200}px -3200px, 3200px -3200px, 3200px 3200px, ${sweep + 3200}px 3200px)`
            : mode === "blue-bottom-left"
              ? `polygon(-3200px -3200px, ${sweep - 3200}px -3200px, ${sweep + 3200}px 3200px, -3200px 3200px)`
              : `polygon(${sweep + 3200}px -3200px, 3200px -3200px, 3200px 3200px, ${sweep - 3200}px 3200px)`,
      }}
    />
  );
};

type FortyFiveGeometryProps = {
  animationDurationInFrames?: number;
};

export const FortyFiveGeometry: React.FC<FortyFiveGeometryProps> = ({
  animationDurationInFrames = 58,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const finalFrame = animationDurationInFrames - 1;
  const firstRevealOriginalFrame = 4;
  const originalFinalMotionFrame = 42;
  const overlayStartFrame = Math.min(Math.round(fps * 0.3), finalFrame);
  const retimedFrame = (originalFrame: number) =>
    Math.round(
      interpolate(
        originalFrame,
        [firstRevealOriginalFrame, originalFinalMotionFrame],
        [overlayStartFrame, finalFrame],
      ),
    );
  const lockupTransition = interpolate(
    frame,
    [retimedFrame(24), retimedFrame(32)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.spring({
        damping: 200,
        allowTail: true,
        durationRestThreshold: 0.1,
      }),
      output: "perceptual-scale",
    },
  );
  const lockupLift = interpolate(lockupTransition, [0, 1], [0, -80]);
  const monogramRise = interpolate(lockupTransition, [0, 1], [520, 0]);
  const wordmarkRise = interpolate(lockupTransition, [0, 1], [220, 0]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
      }}
    >
      <Video
        name="Zurich intersection aerial background"
        src={staticFile("video/zurich-intersection-opening.mp4")}
        muted
        objectFit="cover"
        premountFor={60}
        style={{ height: "100%", width: "100%" }}
      />
      <Interactive.Div
        name="Final lockup balance shift"
        style={{
          position: "absolute",
          inset: 0,
          translate: `0px ${lockupLift}px`,
        }}
      >
        <Interactive.Div
          name="Animated centered square mask"
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(${interpolate(lockupTransition, [0, 1], [0, 230])}px ${interpolate(lockupTransition, [0, 1], [0, 650])}px)`,
          }}
        >
          <DiagonalReveal
            name="White from top right"
            color="#FAFAF7"
            mode="white-top-right"
            startFrame={retimedFrame(4)}
            endFrame={retimedFrame(10)}
          />
          <DiagonalReveal
            name="Blue from bottom left"
            color="#2D93C9"
            mode="blue-bottom-left"
            startFrame={retimedFrame(8)}
            endFrame={retimedFrame(14)}
          />
          <DiagonalReveal
            name="Yellow lower-right field"
            color="#F6E779"
            mode="yellow-bottom-right"
            startFrame={retimedFrame(14)}
            endFrame={retimedFrame(20)}
          />
          <svg
            viewBox="0 0 150 150"
            width="620"
            height="620"
            style={{
              position: "absolute",
              left: 650,
              top: 230,
              translate: `0px ${monogramRise}px`,
            }}
          >
            <path
              d="M75.2002 128.771L82.8002 124.165C83.9002 125.968 85.9002 129.572 89.7002 128.972C93.5002 128.371 93.9002 125.968 93.9002 124.165V91.1211H103.2C103.267 102.136 103.4 122.935 103.4 124.466C103.4 128.571 100.9 137.383 89.8002 137.383C80.0002 137.383 76.6002 131.775 75.2002 128.771Z"
              fill="#050505"
            />
            <path
              d="M116.1 123.365L108.4 127.771C109.5 129.64 112 133.462 116.4 135.481C121.2 137.684 128.7 138.185 133.9 135.782C138.503 133.655 141.2 129.373 141.2 124.667C141.2 119.16 139.9 114.453 130.6 110.348C123.1 107.037 120.5 106.142 120.5 102.838C120.5 101.837 121.1 98.7324 125.4 98.7324C128.8 98.7324 130.5 101.436 131.1 102.838L138.5 98.0315C136.9 95.428 133.6 90.5215 125.4 90.5215C117.2 90.5215 111.2 95.428 111.2 102.838C111.2 110.248 115.923 114.687 123.8 117.658C131.5 120.562 131.8 122.804 131.8 124.166C131.8 125.668 130.8 129.073 125.5 129.073C120 129.073 117.133 125.301 116.1 123.365Z"
              fill="#050505"
            />
          </svg>
        </Interactive.Div>
        <Img
          name="ZurichJS wordmark"
          src={staticFile("zurichjs-wordmark.svg")}
          style={{
            position: "absolute",
            left: 650,
            top: 912,
            width: 620,
            height: 111.6,
            translate: `0px ${wordmarkRise}px`,
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
