import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { fontFamily } from "./ArtDirection";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** A small orbital gesture, with each colour following three frames behind.
 * No scale kick: the depth comes from the delayed paths and gentle 3D turn.
 */
export const OrbitIs: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "#19191B",
        overflow: "hidden",
        perspective: 1400,
        fontFamily,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[2, 1, 0].map((layer) => {
        const local = Math.max(0, frame - layer * 3);
        const phase = (local / (duration - 1)) * Math.PI * 2;
        const x = Math.sin(phase) * 44;
        const y = (1 - Math.cos(phase)) * 25;
        const turn = interpolate(local, [0, 7], [-11, 0], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={layer}
            style={{
              position: "absolute",
              fontSize: 860,
              fontWeight: 900,
              lineHeight: 0.9,
              color: ["#F6E779", "#2D93C9", "#FAFAF7"][layer],
              whiteSpace: "nowrap",
              backfaceVisibility: "hidden",
              transform: `translate3d(${x}px, ${y}px, ${-layer * 12}px) rotateY(${turn + Math.sin(phase) * 5}deg) rotateX(${Math.sin(phase) * -3}deg)`,
            }}
          >
            IS
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** The footage remains untouched. Only the type changes direction on beats.
 * Kept separate so approved speaker compositions retain their original motion.
 */
export const OpeningOffice: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const frame = useCurrentFrame();
  const textX = interpolate(frame, [0, 18, duration - 1], [-75, 15, -45], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
  const textY = interpolate(frame, [0, 18, duration - 1], [-12, -55, -30], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  } as const;
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Video
        src={staticFile("video/zurich-office-background.webm")}
        muted
        objectFit="cover"
        style={videoStyle}
      />
      <AbsoluteFill
        style={{
          fontFamily,
          fontSize: 520,
          fontWeight: 900,
          color: "#F1E270",
          letterSpacing: -21,
          lineHeight: 0.84,
          alignItems: "flex-end",
          padding: "48px 52px 0 0",
          whiteSpace: "nowrap",
          transform: `translate(${textX}px, ${textY}px)`,
        }}
      >
        {text}
      </AbsoluteFill>
      <Video
        src={staticFile("video/zurich-office-foreground.webm")}
        muted
        objectFit="cover"
        style={videoStyle}
      />
    </AbsoluteFill>
  );
};
