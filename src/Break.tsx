import { loadFont } from "@remotion/google-fonts/Figtree";
import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  CanvasImage,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "900"],
  subsets: ["latin"],
});

export const BREAK_FPS = 30;
export const BREAK_DURATION_IN_FRAMES = 300 * BREAK_FPS;
export const BREAK_LOOP_DURATION_IN_FRAMES = 160 * BREAK_FPS;
export const BREAK_INTRO_DURATION_IN_FRAMES = 8 * BREAK_FPS;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const droneRoot = "video/drone-loops/";
const shots = [
  `${droneRoot}drone-establishing-shot-over-the-city-of-zurich-in-2026-01-21-12-30-54-utc.mp4`,
  `${droneRoot}aerial-drone-wide-cinematic-shot-circling-around-g-2025-12-17-23-11-16-utc.mov`,
  `${droneRoot}zoomed-in-drone-shot-circling-around-grossmunster-2025-12-17-15-37-29-utc.mov`,
  "video/generated/break-swiss-flag.mp4",
  `${droneRoot}4k-drone-aerial-view-of-zurich-city-waterfront-in-2026-01-21-02-19-30-utc.mp4`,
];

const DroneShot: React.FC<{ src: string; base: boolean }> = ({ src, base }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ opacity: base ? 1 : ease(frame / (2 * fps)) }}>
      <Video
        src={staticFile(src)}
        muted
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

// Incoming footage dissolves over an opaque outgoing shot. The preceding shot
// also exists before frame zero, so the 160-second hold joins back to itself.
const DroneBed: React.FC<{ offset: number }> = ({ offset }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const stride = 32 * fps;
  return (
    <AbsoluteFill>
      {Array.from(
        { length: Math.ceil(durationInFrames / stride) + 1 },
        (_, index) => {
          const slot = index - 1;
          return (
            <Sequence
              key={slot}
              from={slot * stride + offset}
              durationInFrames={34 * fps}
              premountFor={fps}
            >
              <DroneShot
                src={shots[(slot + shots.length) % shots.length]}
                base={slot === -1}
              />
            </Sequence>
          );
        },
      )}
    </AbsoluteFill>
  );
};

// Equal-power entrance, then steady energy through the zero flash and cut.
export const breakVolume = (frame: number, fps: number) => {
  const entrance = Math.sin((clamp(frame / (12 * fps)) * Math.PI) / 2);
  return 0.5 * entrance;
};

type BreakProps = { mode?: "timed" | "hold" | "intro" };

export const Break: React.FC<BreakProps> = ({ mode = "timed" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const seconds = frame / fps;
  const hold = mode === "hold";
  const timed = mode === "timed";
  const remaining = Math.max(1, Math.ceil((durationInFrames - frame) / fps));
  const compact = timed
    ? ease((seconds - (durationInFrames / fps - 60)) / 1.5)
    : 0;
  const finale = timed && frame >= durationInFrames - 10 * fps;
  // Reserve the final 200 ms for zero's flash, keeping the full clip at 5:00.
  const flashFrames = Math.round(0.2 * fps);
  const flashFrame = frame - (durationInFrames - flashFrames);
  const zero = timed && flashFrame >= 0;
  const black = finale
    ? ease((frame - (durationInFrames - 10 * fps)) / (2 * fps))
    : 0;
  const entrance = hold ? 1 : ease(seconds / 2.5);
  const breathe = 1 + (0.012 * (1 - Math.cos((2 * Math.PI * seconds) / 8))) / 2;
  const introOpacity = 1 - ease((seconds - 5) / 3);

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#000", overflow: "hidden", fontFamily }}
    >
      <AbsoluteFill style={{ opacity: entrance }}>
        <DroneBed offset={hold ? 0 : 8 * fps} />
        {!hold && (
          <Sequence durationInFrames={8 * fps}>
            <AbsoluteFill style={{ opacity: introOpacity }}>
              <Video
                name="Original break introduction"
                src={staticFile("video/zurich-break-three-shot-pingpong.mp4")}
                muted
                objectFit="cover"
                style={{ height: "100%", width: "100%" }}
              />
            </AbsoluteFill>
          </Sequence>
        )}
        <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.42)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: black }} />
      {!finale && (
        <AbsoluteFill style={{ opacity: entrance }}>
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
          <AbsoluteFill
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <div
              style={{
                color: "#F6E779",
                fontSize: interpolate(compact, [0, 1], [500, 230]),
                fontWeight: 900,
                letterSpacing: interpolate(compact, [0, 1], [-25, -9]),
                lineHeight: 1,
                transform: `translateY(${-55 * compact}px) scale(${breathe})`,
                whiteSpace: "nowrap",
              }}
            >
              BREAK
            </div>
            {compact > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 650,
                  color: "#fff",
                  fontSize: 52,
                  fontWeight: 500,
                  opacity: compact,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                we&apos;ll continue in{" "}
                <span style={{ fontWeight: 700 }}>{remaining}</span> seconds
              </div>
            )}
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {finale && !zero && (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 460,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -15,
          }}
        >
          <div
            style={{
              transform: `scale(${1 + 0.045 * (1 - ease((frame % fps) / (fps * 0.65)))})`,
            }}
          >
            {remaining}
          </div>
        </AbsoluteFill>
      )}
      {zero && (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          <AbsoluteFill
            style={{
              backgroundColor: "#fff",
              color: "#000",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 460,
              fontWeight: 900,
              opacity: 1 - ease((flashFrame - 1) / (flashFrames - 2)),
            }}
          >
            0
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <Audio
        name={
          timed
            ? "Rhythm Rally — 36 complete phrases in five minutes"
            : "Rhythm Rally — nineteen joined phrases"
        }
        src={staticFile(
          timed
            ? "audio/generated/break-timed.wav"
            : "audio/generated/break-cycle.wav",
        )}
        loop={!timed}
        loopVolumeCurveBehavior="extend"
        trimBefore={mode === "intro" ? 152 * fps : 0}
        volume={(f) =>
          hold
            ? 0.5
            : mode === "intro"
              ? 0.5 *
                Math.sin((clamp((f - 152 * fps) / (8 * fps - 1)) * Math.PI) / 2)
              : breakVolume(f, fps)
        }
      />
    </AbsoluteFill>
  );
};
