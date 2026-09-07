import { loadFont } from "@remotion/google-fonts/Figtree";
import { measureText } from "@remotion/layout-utils";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { beatFrame, OPENING_FPS } from "./timing";
import { accentAt } from "./accents";
import { CONFERENCE_SPEAKERS } from "../speaker";

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "900"],
  subsets: ["latin"],
});
const INK = "#19191B";
const WHITE = "#FAFAF7";
const YELLOW = "#F6E779";
const BLUE = "#2D93C9";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.85, 0, 0.15, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);

const fit = (text: string, width = 1780, max = 860) => {
  const measured = measureText({
    text,
    fontFamily,
    fontSize: 100,
    fontWeight: 900,
    validateFontIsLoaded: true,
  }).width;
  return Math.min(max, (width / measured) * 100);
};
const settle = (frame: number) =>
  spring({
    frame,
    fps: OPENING_FPS,
    config: { damping: 17, stiffness: 230, mass: 0.65 },
  });

/** The supplied logo is always one intact, unfiltered image on a dark field.
 * All rhythmic changes belong to the surrounding typography, never the logo. */
export const OpeningBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ["IT", "STARTS", "WITH", "US"];
  const word = words[Math.min(3, Math.floor(frame / 36))];
  const local = frame % 36;
  const { impulse } = accentAt(frame);
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden", fontFamily }}>
      <Img
        src={staticFile("assets/wordmark-conf-white.svg")}
        style={{ position: "absolute", width: 1640, left: 140, top: 230 }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 435,
          height: 520,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: fit(word, 1640, 480),
            fontWeight: 900,
            color: local < 18 ? WHITE : YELLOW,
            lineHeight: 0.9,
            transform: `translateY(${(1 - settle(local)) * 500}px) scale(${1 + impulse * 0.045})`,
          }}
        >
          {word}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Words hit at readable scale, stretch with the camera, then leave as texture. */
export const TypeHit: React.FC<{
  text: string;
  duration: number;
  light?: boolean;
}> = ({ text, duration, light = false }) => {
  const frame = useCurrentFrame();
  const p = frame / (duration - 1);
  const size = fit(text);
  const entry = settle(frame);
  const exit = interpolate(p, [0.72, 1], [0, 1], { ...clamp, easing: ease });
  const scale = 1 + (1 - entry) * 0.8 + exit * 0.55;
  const y = (1 - entry) * 160 - exit * 45;
  const rotation = (1 - entry) * -8 + exit * 4;
  return (
    <AbsoluteFill
      style={{
        background: light ? YELLOW : INK,
        color: light ? INK : YELLOW,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {[2, 1, 0].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            fontSize: size,
            lineHeight: 0.9,
            fontWeight: 900,
            whiteSpace: "nowrap",
            color: i === 0 ? (light ? INK : YELLOW) : i === 1 ? BLUE : WHITE,
            opacity:
              i === 0
                ? 1
                : interpolate(p, [0, 0.25, 0.72, 1], [0.8, 0, 0, 0.8], clamp),
            transform: `translate(${i * (1 - entry + exit) * -35}px, ${y + i * (1 - entry + exit) * 60}px) rotate(${rotation}deg) scale(${scale}, ${scale + exit * 0.4})`,
          }}
        >
          {text}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** Two independently moving typographic fields; the split itself keeps moving. */
export const CounterSplit: React.FC<{
  top: string;
  bottom: string;
  duration: number;
}> = ({ top, bottom, duration }) => {
  const frame = useCurrentFrame();
  const p = frame / (duration - 1);
  const divide = interpolate(p, [0, 0.5, 1], [42, 55, 45], { easing: ease });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK, fontFamily }}>
      {[top, bottom].map((text, i) => {
        const y = i === 0 ? 0 : divide;
        const height = i === 0 ? divide : 100 - divide;
        const drift = interpolate(
          p,
          [0, 0.22, 0.68, 1],
          [i ? 1900 : -1900, 0, i ? -30 : 30, i ? -900 : 900],
          { ...clamp, easing: ease },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${y}%`,
              height: `${height}%`,
              overflow: "hidden",
              background: i ? INK : YELLOW,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: i ? YELLOW : INK,
                fontSize: fit(text, 1790, 520),
                fontWeight: 900,
                whiteSpace: "nowrap",
                lineHeight: 0.85,
                transform: `translateX(${drift}px) scaleY(${interpolate(p, [0, 0.5, 1], [1.35, 1.1, 1.5])})`,
              }}
            >
              {text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Numeric macro > readable value and label > full-frame numeric push-through. */
export const NumberSequence: React.FC<{
  value: string;
  label: string;
  duration: number;
  light?: boolean;
}> = ({ value, label, duration, light = false }) => {
  const frame = useCurrentFrame();
  const midBeat = beatFrame(2);
  const inverse = frame >= midBeat;
  const white = light !== inverse;
  const bg = white ? WHITE : INK;
  const fg = white ? INK : YELLOW;
  const p = frame / (duration - 1);
  const zoom = interpolate(p, [0, 0.22, 0.72, 1], [2.6, 1, 1.05, 2.5], {
    ...clamp,
    easing: ease,
  });
  const numberSize = value.length === 3 ? 690 : 790;
  const roll = settle(frame - 4);
  return (
    <AbsoluteFill
      style={{ background: bg, color: fg, overflow: "hidden", fontFamily }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom}) rotate(${interpolate(p, [0, 0.22, 0.72, 1], [-8, 0, 0, 9], { ...clamp, easing: ease })}deg)`,
          transformOrigin: "50% 44%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 30,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: numberSize,
            lineHeight: 1,
            letterSpacing: -22,
          }}
        >
          {value.split("").map((digit, i) => (
            <span
              key={i}
              style={{
                display: "block",
                transform: `translateY(${(1 - settle(frame - i * 2)) * (i % 2 ? -900 : 900)}px)`,
              }}
            >
              {digit}
            </span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 800,
            width: "100%",
            textAlign: "center",
            fontSize: fit(label, 1700, 158),
            lineHeight: 1,
            fontWeight: 900,
            transform: `translateX(${(1 - roll) * 1600}px)`,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** A rotating wall of opposing type belts, derived from the approved split pans. */
export const TypeRibbons: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const frame = useCurrentFrame();
  const p = frame / (duration - 1);
  return (
    <AbsoluteFill style={{ background: WHITE, overflow: "hidden", fontFamily }}>
      <AbsoluteFill
        style={{
          transform: `rotate(${interpolate(p, [0, 0.4, 1], [-20, -7, 12], { easing: ease })}deg) scale(1.25)`,
          justifyContent: "center",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 240,
              flexShrink: 0,
              background: i % 2 ? INK : YELLOW,
              color: i % 2 ? YELLOW : INK,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 245,
                fontWeight: 900,
                lineHeight: 0.9,
                whiteSpace: "nowrap",
                transform: `translateX(${interpolate(p, [0, 1], i % 2 ? [-1650, -100] : [-100, -1650], { easing: out })}px)`,
              }}
            >
              {text} · {text} · {text}
            </div>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Clean stage handoff: unmodified logo above white sentence-case type. */
export const OpeningFinale: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const entry = settle(frame);
  const push = interpolate(frame, [18, duration - 1], [1.015, 1], clamp);
  const kick = frame < 36 ? accentAt(frame).impulse * 0.025 : 0;
  return (
    <AbsoluteFill
      style={{ background: INK, overflow: "hidden", fontFamily, color: WHITE }}
    >
      <Img
        src={staticFile("assets/wordmark-conf-white.svg")}
        style={{ position: "absolute", width: 1180, left: 370, top: 270 }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 460,
          textAlign: "center",
          fontSize: fit("Let's start.", 1740, 335),
          fontWeight: 900,
          lineHeight: 1,
          transform: `translateY(${(1 - entry) * 330}px) scale(${push + kick})`,
        }}
      >
        Let&apos;s start.
      </div>
    </AbsoluteFill>
  );
};

/** Disjoint groups of portraits move through the frame on the half-beats.
 * These are the existing approved speaker assets, including their brand bars.
 */
export const SpeakerRush: React.FC<{
  start: number;
  duration: number;
  speakerIds?: string[];
  label?: string;
}> = ({ start, duration, speakerIds, label = "OUR PEOPLE" }) => {
  const frame = useCurrentFrame();
  const count = Math.ceil(duration / 9);
  const speakers = speakerIds
    ? speakerIds.map((id) => {
        const speaker = CONFERENCE_SPEAKERS.find(
          (candidate) => candidate.compositionId === id,
        );
        if (!speaker) throw new Error(`Unknown opening portrait: ${id}`);
        return speaker;
      })
    : CONFERENCE_SPEAKERS.slice(start, start + count);
  const step = Math.floor(frame / 9);
  const fraction = (frame % 9) / 9;
  const travel = (step + Easing.bezier(0.45, 0, 0.2, 1)(fraction)) * 860;
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden", fontFamily }}>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: -180,
          whiteSpace: "nowrap",
          color: YELLOW,
          fontSize: 320,
          fontWeight: 900,
          opacity: 0.25,
        }}
      >
        {label}. {label}.
      </div>
      {speakers.map((speaker, i) => (
        <div
          key={speaker.compositionId}
          style={{
            position: "absolute",
            left: 530 + i * 860 - travel,
            top: 68,
            width: 820,
            height: 960,
            transform: `rotate(${interpolate(i * 860 - travel, [-860, 0, 860], [-8, 0, 8], clamp)}deg)`,
          }}
        >
          <Img
            src={staticFile(speaker.avatarSrc)}
            style={{ width: 820, height: 820, objectFit: "cover" }}
          />
          <div
            style={{
              color: WHITE,
              marginTop: 22,
              fontSize: fit(
                `${speaker.firstName} ${speaker.lastName}`,
                810,
                58,
              ),
              fontWeight: 700,
              whiteSpace: "nowrap",
              lineHeight: 1.1,
            }}
          >
            {speaker.firstName} {speaker.lastName}
          </div>
        </div>
      ))}
      {speakerIds && (
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 12,
            color: YELLOW,
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};
