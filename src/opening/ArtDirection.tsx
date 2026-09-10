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
  const entrance = Math.max(0, frame - 18);
  const words = ["IT", "STARTS", "WITH", "US"];
  const wordStarts = [0, 36, 72, 90];
  let wordIndex = 0;
  wordStarts.forEach((start, i) => {
    if (entrance >= start) wordIndex = i;
  });
  const word = words[wordIndex];
  const local = entrance - wordStarts[wordIndex];
  const isUs = word === "US";
  const { impulse } = accentAt(frame);
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden", fontFamily }}>
      <AbsoluteFill style={{ opacity: frame < 18 ? 0 : 1 }}>
        <Img
          src={staticFile("assets/wordmark-conf-white.svg")}
          style={{
            position: "absolute",
            width: 1640,
            left: 140,
            top: 230,
            transform: `translateY(${(1 - settle(entrance + 2)) * 65}px) scale(${1 + (1 - settle(entrance + 2)) * 0.08})`,
          }}
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
              color: isUs ? YELLOW : local < 18 ? WHITE : YELLOW,
              lineHeight: 0.9,
              transform: isUs
                ? `scale(${1 + Math.exp(-local / 4) * 0.18 + impulse * 0.035})`
                : `translateY(${(1 - settle(local)) * 500}px) scale(${1 + impulse * 0.045})`,
            }}
          >
            {word}
          </div>
        </div>
      </AbsoluteFill>
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
  impact?: boolean;
  value: string;
  label: string;
  duration: number;
  light?: boolean;
}> = ({ value, label, duration, light = false, impact = false }) => {
  const frame = useCurrentFrame();
  const midBeat = beatFrame(2);
  const inverse = frame >= midBeat;
  const white = light !== inverse;
  const bg = white ? WHITE : INK;
  const fg = white ? INK : YELLOW;
  const p = frame / (duration - 1);
  const zoom = interpolate(
    p,
    [0, 0.22, 0.72, 1],
    [impact ? 1.06 : 2.6, 1, 1.05, 2.5],
    {
      ...clamp,
      easing: ease,
    },
  );
  const numberSize = value.length === 3 ? 690 : 790;
  const roll = impact ? 1 : settle(frame - 4);
  return (
    <AbsoluteFill
      style={{ background: bg, color: fg, overflow: "hidden", fontFamily }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom}) rotate(${interpolate(p, [0, 0.22, 0.72, 1], [impact ? 0 : -8, 0, 0, 9], { ...clamp, easing: ease })}deg)`,
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
                transform: `translateY(${(impact ? 0 : 1 - settle(frame - i * 2)) * (i % 2 ? -900 : 900)}px)`,
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
  const entry = settle(frame + 2);
  const push = interpolate(frame, [18, duration - 1], [1.015, 1], clamp);
  const kick = 0;
  return (
    <AbsoluteFill
      style={{ background: INK, overflow: "hidden", fontFamily, color: WHITE }}
    >
      <Img
        src={staticFile("assets/wordmark-conf-white.svg")}
        style={{
          position: "absolute",
          width: 1180,
          left: 370,
          top: 270,
          transform: `translateY(${(1 - entry) * -90}px) scale(${1 + (1 - entry) * 0.08})`,
        }}
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
          transform: `translateY(${(1 - entry) * 110}px) scale(${push + kick})`,
        }}
      >
        Let&apos;s start.
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 32,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          opacity: 0.65,
          fontSize: 21,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        <span>made with</span>
        <Img
          src={staticFile("assets/remotion-wordmark-white.png")}
          alt="Remotion"
          style={{ width: 130, height: 60.185, objectFit: "contain" }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Two separate entrances on the measured 9.3s / 9.6s bangs. */
export const MCIntro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: INK, fontFamily, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 35,
          color: YELLOW,
          fontWeight: 900,
          fontSize: 100,
        }}
      >
        OUR MCs
      </div>
      {["CarmenHuidobro", "TonyEdwards"].map((id, i) => {
        const speaker = CONFERENCE_SPEAKERS.find(
          (person) => person.compositionId === id,
        )!;
        const local = frame - (i === 0 ? 9 : 18);
        if (local < 0) return null;
        const kick = Math.exp(-local / 3);
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              top: 175,
              left: 180 + i * 860,
              width: 700,
              transform: `scale(${1 + kick * 0.1}) rotate(${kick * (i ? 4 : -4)}deg)`,
            }}
          >
            <Img
              src={staticFile(speaker.avatarSrc)}
              style={{ width: 700, height: 700, objectFit: "cover" }}
            />
            <div
              style={{
                color: WHITE,
                fontSize: 57,
                fontWeight: 700,
                marginTop: 20,
              }}
            >
              {speaker.firstName} {speaker.lastName}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const lineupSpeakers = CONFERENCE_SPEAKERS.filter(
  (person) =>
    ["CarmenHuidobro", "TonyEdwards"].indexOf(person.compositionId) === -1,
);

/** Every speaker/panelist gets a central portrait. Whole beats accelerate into
 * half beats through the nine-second instrumental phrase, without looping. */
export const SpeakerLineup: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const extraSlots = Math.round(duration / 9) - lineupSpeakers.length;
  const starts = lineupSpeakers.map(
    (_, i) => (i + Math.min(i, extraSlots)) * 9,
  );
  let active = 0;
  starts.forEach((start, i) => {
    if (frame >= start) active = i;
  });
  const local = frame - starts[active];
  const arrival = interpolate(local, [0, 5], [1, 0], { ...clamp, easing: out });
  const speaker = lineupSpeakers[active];
  return (
    <AbsoluteFill
      style={{
        background: active % 2 ? YELLOW : INK,
        overflow: "hidden",
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 48,
          color: active % 2 ? INK : YELLOW,
          fontSize: 58,
          fontWeight: 900,
        }}
      >
        THE LINEUP
      </div>
      {lineupSpeakers.map((person, i) => {
        if (Math.abs(i - active) > 1) return null;
        const offset = i - active;
        return (
          <Img
            key={person.compositionId}
            src={staticFile(person.avatarSrc)}
            style={{
              position: "absolute",
              left: 540 + offset * 970 + arrival * 110,
              top: 80,
              width: 840,
              height: 840,
              objectFit: "cover",
              transform: `perspective(1400px) rotateY(${offset * -22 + arrival * 12}deg) rotate(${offset * 7}deg)`,
              opacity: offset ? 0.45 : 1,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 70,
          right: 70,
          color: active % 2 ? INK : WHITE,
          fontSize: fit(`${speaker.firstName} ${speaker.lastName}`, 1770, 98),
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        {speaker.firstName} {speaker.lastName}
      </div>
    </AbsoluteFill>
  );
};
