import { loadFont } from "@remotion/google-fonts/Figtree";
import { useGsapTimeline } from "@remotion/gsap";
import { measureText } from "@remotion/layout-utils";
import { useMemo } from "react";
import { AbsoluteFill, random } from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

const canvasWidth = 1920;
const horizontalPadding = 120;
const maximumFontSize = 360;
const maximumHorizontalScatter = 230;
const maximumVerticalScatter = 220;

const getFontSize = (text: string) => {
  const referenceFontSize = 100;
  const width = Array.from(text).reduce((sum, character) => {
    return (
      sum +
      measureText({
        text: character === " " ? "\u00A0" : character,
        fontFamily,
        fontSize: referenceFontSize,
        fontWeight: 900,
        validateFontIsLoaded: true,
      }).width
    );
  }, 0);

  return Math.min(
    maximumFontSize,
    ((canvasWidth - horizontalPadding * 2) / width) * referenceFontSize,
  );
};

type NameScatterBounceProps = {
  text: string;
};

export const NameScatterBounce: React.FC<NameScatterBounceProps> = ({
  text,
}) => {
  const characters = useMemo(() => Array.from(text), [text]);
  const fontSize = getFontSize(text) * 4.5;
  const offsets = useMemo(() => {
    return characters.map((_, index) => {
      return {
        rotation: (random(`${text}-${index}-rotation`) * 2 - 1) * 58,
        scale: 0.72 + random(`${text}-${index}-scale`) * 0.44,
        x:
          (random(`${text}-${index}-x`) * 2 - 1) * maximumHorizontalScatter,
        y:
          (random(`${text}-${index}-y`) * 2 - 1) * maximumVerticalScatter,
      };
    });
  }, [characters, text]);

  const scope = useGsapTimeline<HTMLDivElement>(
    ({ timeline, selector }) => {
      timeline.fromTo(
        selector("[data-scatter-letter]"),
        {
          rotation: (index) => offsets[index]?.rotation ?? 0,
          scale: (index) => offsets[index]?.scale ?? 1,
          x: (index) => offsets[index]?.x ?? 0,
          y: (index) => offsets[index]?.y ?? 0,
        },
        {
          duration: 1.8,
          ease: "elastic.out(1, 0.6)",
          rotation: 0,
          scale: 1,
          stagger: {
            each: 0.018,
            from: "center",
          },
          x: 0,
          y: 0,
        },
      );
    },
    { dependencies: [offsets] },
  );

  return (
    <AbsoluteFill
      ref={scope}
      style={{
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        color: "#F1E270",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        overflow: "hidden",
      }}
    >
      <h1
        aria-label={text}
        style={{
          display: "block",
          flexShrink: 0,
          fontFamily,
          fontSize,
          fontWeight: 900,
          lineHeight: 0.82,
          margin: 0,
          marginLeft: horizontalPadding,
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {characters.map((character, index) => (
          <span
            data-scatter-letter
            key={`${character}-${index}`}
            style={{
              display: "inline-block",
              transformOrigin: "50% 60%",
              whiteSpace: "pre",
              willChange: "transform",
            }}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </h1>
    </AbsoluteFill>
  );
};
