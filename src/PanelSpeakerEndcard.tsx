import { loadFont } from "@remotion/google-fonts/Figtree";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { E18E_PANELISTS } from "./speaker";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

const avatarSize = 302;
const panelistGap = 36;
const rowWidth = avatarSize * E18E_PANELISTS.length + panelistGap * 4;

const RevealedLine: React.FC<{
  startFrame: number;
  text: string;
}> = ({ startFrame, text }) => {
  const frame = useCurrentFrame();

  return (
    <div>
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          style={{
            color:
              frame < startFrame + index * 0.65 + 3 ? "#2D93C9" : "#050505",
            opacity: frame >= startFrame + index * 0.65 ? 1 : 0,
          }}
        >
          {character}
        </span>
      ))}
    </div>
  );
};

const RevealedName: React.FC<{
  firstName: string;
  lastName: string;
  startFrame: number;
}> = ({ firstName, lastName, startFrame }) => {
  return (
    <>
      <RevealedLine startFrame={startFrame} text={firstName} />
      <RevealedLine
        startFrame={startFrame + firstName.length * 0.65}
        text={lastName}
      />
    </>
  );
};

export const PanelSpeakerEndcard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        fontFamily,
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Panel endcard — constant pullback"
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          inset: 0,
          justifyContent: "center",
          position: "absolute",
          scale: interpolate(frame, [0, 168], [1.08, 1], {
            easing: Easing.linear,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      >
        <Interactive.Div
          name="e18e & friends — panel title"
          style={{
            color: "#050505",
            fontSize: 104,
            fontWeight: 900,
            letterSpacing: -5,
            lineHeight: 0.9,
            marginBottom: 54,
            textAlign: "left",
            width: rowWidth,
          }}
        >
          <RevealedLine startFrame={0} text="e18e & friends" />
        </Interactive.Div>

        <Interactive.Div
          name="Five panelists"
          style={{
            display: "flex",
            gap: panelistGap,
            justifyContent: "center",
          }}
        >
          {E18E_PANELISTS.map((panelist, index) => {
            const avatarStartFrame = 8 + index * 4;
            const nameStartFrame = avatarStartFrame + 11;
            const fullName = `${panelist.firstName} ${panelist.lastName}`;

            return (
              <Interactive.Div
                key={panelist.compositionId}
                name={`${fullName} — panelist card`}
                style={{
                  alignItems: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                  width: avatarSize,
                }}
              >
                <CanvasImage
                  name={`${fullName} avatar`}
                  src={staticFile(panelist.avatarSrc)}
                  style={{
                    height: avatarSize,
                    objectFit: "cover",
                    opacity: interpolate(
                      frame,
                      [avatarStartFrame, avatarStartFrame + 10],
                      [0, 1],
                      {
                        easing: Easing.spring({
                          damping: 200,
                          allowTail: true,
                        }),
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      },
                    ),
                    scale: interpolate(
                      frame,
                      [avatarStartFrame, avatarStartFrame + 16],
                      [0.55, 1],
                      {
                        easing: Easing.spring({ damping: 18, allowTail: true }),
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        output: "perceptual-scale",
                      },
                    ),
                    width: avatarSize,
                  }}
                />

                <Interactive.Div
                  name={`${fullName} — revealed name`}
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    letterSpacing: -2,
                    lineHeight: 0.94,
                    marginTop: 24,
                    minHeight: 91,
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <RevealedName
                    firstName={panelist.firstName}
                    lastName={panelist.lastName}
                    startFrame={nameStartFrame}
                  />
                </Interactive.Div>
              </Interactive.Div>
            );
          })}
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
