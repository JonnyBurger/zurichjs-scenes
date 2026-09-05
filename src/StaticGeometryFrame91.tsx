import {AbsoluteFill, Interactive} from "remotion";

export const StaticGeometryFrame91: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Static frame 91 geometry"
        style={{
          position: "absolute",
          width: 2400,
          height: 2400,
          left: -240,
          top: -660,
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
