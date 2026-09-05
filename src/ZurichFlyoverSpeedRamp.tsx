import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const getRemappedSourceFrame = (
  frame: number,
  fps: number,
  settleDurationInFrames: number,
) => {
  let sourceFrame = 0;

  for (let outputFrame = 0; outputFrame < frame; outputFrame++) {
    const settleProgress = spring({
      frame: outputFrame,
      fps,
      config: {damping: 200},
      durationInFrames: settleDurationInFrames,
    });

    sourceFrame += interpolate(settleProgress, [0, 1], [10, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      output: "perceptual-scale",
    });
  }

  return sourceFrame;
};

type ZurichFlyoverSpeedRampProps = {
  settleDurationInFrames?: number;
};

export const ZurichFlyoverSpeedRamp: React.FC<
  ZurichFlyoverSpeedRampProps
> = ({settleDurationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceFrame = getRemappedSourceFrame(
    frame,
    fps,
    settleDurationInFrames ?? 60,
  );

  return (
    <AbsoluteFill style={{backgroundColor: "#050505", overflow: "hidden"}}>
      <Video
        name="Zurich flyover — spring speed ramp"
        src={staticFile("video/zurich-flyover-remap-ready.mp4")}
        muted
        objectFit="cover"
        premountFor={60}
        trimBefore={Math.max(0, sourceFrame - frame)}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </AbsoluteFill>
  );
};
