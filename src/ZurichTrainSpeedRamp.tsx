import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const settleDurationInFrames = 18;

const getRemappedSourceFrame = (frame: number, fps: number) => {
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

export const ZurichTrainSpeedRamp: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sourceFrame = getRemappedSourceFrame(frame, fps);

  return (
    <AbsoluteFill style={{backgroundColor: "#050505", overflow: "hidden"}}>
      <Video
        name="Zurich aerial train — spring speed ramp"
        src={staticFile("video/zurich-train-remap-ready.mp4")}
        muted
        objectFit="cover"
        premountFor={60}
        trimBefore={Math.max(0, sourceFrame - frame)}
        style={{height: "100%", width: "100%"}}
      />
    </AbsoluteFill>
  );
};
