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
  weights: ["900"],
  subsets: ["latin"],
});

const panelSize = 2400;
const panelCenter = panelSize / 2;
const panelRadius = Math.sqrt(2) * panelCenter;

const getPointOnCircle = (angle: number) => {
  const radians = (angle * Math.PI) / 180;

  return {
    x: panelCenter + panelRadius * Math.cos(radians),
    y: panelCenter + panelRadius * Math.sin(radians),
  };
};

const getPieSlicePath = (centerAngle: number, sweepAngle: number) => {
  const start = getPointOnCircle(centerAngle - sweepAngle / 2);
  const end = getPointOnCircle(centerAngle + sweepAngle / 2);

  return [
    `M ${panelCenter} ${panelCenter}`,
    `L ${start.x} ${start.y}`,
    `A ${panelRadius} ${panelRadius} 0 ${sweepAngle > 180 ? 1 : 0} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

type PieSliceProps = {
  centerAngle: number;
  color: string;
  name: string;
  rotation: number;
  sweepAngle: number;
};

const PieSlice: React.FC<PieSliceProps> = ({
  centerAngle,
  color,
  name,
  rotation,
  sweepAngle,
}) => {
  return (
    <Interactive.Div
      name={name}
      style={{
        inset: 0,
        position: "absolute",
        rotate: `${rotation}deg`,
        transformOrigin: "50% 50%",
      }}
    >
      <svg
        height="100%"
        viewBox={`0 0 ${panelSize} ${panelSize}`}
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={getPieSlicePath(centerAngle, sweepAngle)} fill={color} />
      </svg>
    </Interactive.Div>
  );
};

type NamePanelSpinProps = {
  loopDurationInFrames?: number;
  text: string;
};

export const NamePanelSpin: React.FC<NamePanelSpinProps> = ({
  loopDurationInFrames,
  text,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const loopDuration = loopDurationInFrames ?? durationInFrames;
  const progress = frame / loopDuration;
  const cycle = progress * Math.PI * 2;
  const baseRotation = progress * 360;

  // Each offset is periodic and evaluates to zero at both loop boundaries.
  // This changes the panels' instantaneous speed without breaking the seam.
  const slicePairRotation = baseRotation + 10 * Math.sin(cycle);
  const whiteSweepAngle = interpolate(progress, [0, 1], [22, 112], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blueSweepAngle = interpolate(progress, [0, 1], [14, 100], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F6E779",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name={`Black ${text} — unmasked base layer`}
        style={{
          alignItems: "flex-end",
          boxSizing: "border-box",
          color: "#19191B",
          display: "flex",
          fontFamily,
          fontSize: 1161,
          fontWeight: 900,
          inset: 0,
          justifyContent: "center",
          letterSpacing: 0,
          lineHeight: 0.95,
          paddingBottom: 84,
          position: "absolute",
          whiteSpace: "nowrap",
          translate: interpolate(
            frame,
            [0, loopDuration - 1],
            ["-170px 0px", "170px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.linear,
            },
          ),
        }}
      >
        {text}
      </Interactive.Div>

      <Interactive.Div
        name="Blue and white pie overlays"
        style={{
          position: "absolute",
          width: panelSize,
          height: panelSize,
          left: -240,
          top: -660,
        }}
      >
        <PieSlice
          name="Blue pie slice — paired leading sector"
          color="#2D93C9"
          centerAngle={180}
          rotation={slicePairRotation}
          sweepAngle={blueSweepAngle}
        />
        <PieSlice
          name="White pie slice — adjacent trailing sector"
          color="#FAFAF7"
          centerAngle={180 + (blueSweepAngle + whiteSweepAngle) / 2}
          rotation={slicePairRotation}
          sweepAngle={whiteSweepAngle}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
