import { loadFont } from "@remotion/google-fonts/Figtree";
import { measureText } from "@remotion/layout-utils";
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

const fontSize = 387;
const zoomedScale = 2.5;

type TrailLayerProps = {
  color: string;
  delayInFrames: number;
  name: string;
  text: string;
  verticalAmplitude: number;
  zIndex: number;
};

const TrailLayer: React.FC<TrailLayerProps> = ({
  color,
  delayInFrames,
  name,
  text,
  verticalAmplitude,
  zIndex,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Interactive.Div
      name={name}
      style={{
        color,
        fontFamily,
        fontSize,
        fontWeight: 900,
        gridArea: "1 / 1",
        letterSpacing: 0,
        lineHeight: 0.95,
        mixBlendMode: "multiply",
        opacity: 1,
        whiteSpace: "nowrap",
        zIndex,
        translate: `0px ${
          Math.sin(((frame - delayInFrames) / fps) * Math.PI * 1.3) *
          verticalAmplitude
        }px`,
      }}
    >
      {text}
    </Interactive.Div>
  );
};

const ColorTrailArtwork: React.FC<{
  text: string;
  verticalAmplitude?: number;
}> = ({ text, verticalAmplitude = 78 }) => {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
      }}
    >
      <TrailLayer
        name={`Vertical yellow ${text} trail`}
        color="#F1E270"
        delayInFrames={12}
        text={text}
        verticalAmplitude={verticalAmplitude}
        zIndex={1}
      />
      <TrailLayer
        name={`Vertical blue ${text} trail`}
        color="#258BCC"
        delayInFrames={6}
        text={text}
        verticalAmplitude={verticalAmplitude}
        zIndex={2}
      />
      <TrailLayer
        name={`Vertical black ${text} leader`}
        color="#19191B"
        delayInFrames={0}
        text={text}
        verticalAmplitude={verticalAmplitude}
        zIndex={3}
      />
    </div>
  );
};

const TrailCanvas: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        isolation: "isolate",
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

type NameColorTrailProps = {
  animationDurationInFrames?: number;
  text: string;
};

export const NameColorTrailZoom: React.FC<NameColorTrailProps> = ({
  animationDurationInFrames = 24,
  text,
}) => {
  const frame = useCurrentFrame();
  const finalFrame = animationDurationInFrames - 1;

  return (
    <TrailCanvas>
      <Interactive.Div
        name="Centered color-trail camera"
        style={{
          alignItems: "center",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          position: "absolute",
          translate: interpolate(
            frame,
            [0, finalFrame],
            ["0px 0px", "0px 90px"],
            {
              easing: Easing.spring({ damping: 200, allowTail: true }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        <Interactive.Div
          name="Color trail scale from 1x to 2.5x"
          style={{
            scale: interpolate(frame, [0, finalFrame], [1, zoomedScale], {
              easing: Easing.spring({ damping: 200, allowTail: true }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              output: "perceptual-scale",
            }),
          }}
        >
          <ColorTrailArtwork text={text} />
        </Interactive.Div>
      </Interactive.Div>
    </TrailCanvas>
  );
};

export const NameColorTrailPan: React.FC<NameColorTrailProps> = ({
  animationDurationInFrames = 24,
  text,
}) => {
  const frame = useCurrentFrame();
  const finalFrame = animationDurationInFrames - 1;
  const characters = Array.from(text);
  const firstCharacter = characters[0] ?? "";
  const lastCharacter = characters[characters.length - 1] ?? "";
  const measurementOptions = {
    fontFamily,
    fontSize,
    fontWeight: 900 as const,
    letterSpacing: "0px",
    validateFontIsLoaded: true,
  };
  const { width: textWidth } = measureText({ text, ...measurementOptions });
  const { width: firstCharacterWidth } = measureText({
    text: firstCharacter,
    ...measurementOptions,
  });
  const { width: lastCharacterWidth } = measureText({
    text: lastCharacter,
    ...measurementOptions,
  });
  const firstCharacterFocus =
    (textWidth / 2 - firstCharacterWidth / 2) * zoomedScale;
  const lastCharacterFocus =
    -(textWidth / 2 - lastCharacterWidth / 2) * zoomedScale;
  const panStrength = interpolate(characters.length, [4, 9], [0.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <TrailCanvas>
      <Interactive.Div
        name="2.5x camera pan from first to last character"
        style={{
          alignItems: "center",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          position: "absolute",
          translate: interpolate(
            frame,
            [0, finalFrame],
            [
              `${firstCharacterFocus * panStrength}px 0px`,
              `${lastCharacterFocus * panStrength}px 0px`,
            ],
            {
              easing: Easing.spring({ damping: 200, allowTail: true }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        <Interactive.Div
          name="Color trail at 2.5x"
          style={{ scale: zoomedScale }}
        >
          <ColorTrailArtwork text={text} verticalAmplitude={78 * 0.3} />
        </Interactive.Div>
      </Interactive.Div>
    </TrailCanvas>
  );
};
