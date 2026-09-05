import { loadFont } from "@remotion/google-fonts/Figtree";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

const cubeSize = 360;
const entryScale = 1.38;
const scaleEndFrame = 24;
const cubeStartFrame = 0;
const cubeEndFrame = 24;
const speakerLockupWidth = 1152;

export const SPEAKER_ENDCARD_LOGO_ENTRY_SIZE = cubeSize * entryScale;

export const ZurichJsLogo: React.FC = () => {
  return (
    <svg
      aria-label="ZurichJS logo"
      height="100%"
      viewBox="0 0 150 150"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#zurichjs-logo-clip)">
        <path
          d="M149.5 0.300446L149.5 150L0.100006 150L149.5 0.300446Z"
          fill="#F1E271"
        />
        <path
          d="M0.100098 150V0.300781L74.8001 75.2006L0.100098 150Z"
          fill="#248BCC"
        />
        <path
          d="M149.6 0.300781L74.8001 75.2006L0.100098 0.300781H149.6Z"
          fill="white"
        />
        <path
          d="M75.2002 128.771L82.8002 124.165C83.9002 125.968 85.9002 129.572 89.7002 128.972C93.5002 128.371 93.9002 125.968 93.9002 124.165V91.1211H103.2C103.267 102.136 103.4 122.935 103.4 124.466C103.4 128.571 100.9 137.383 89.8002 137.383C80.0002 137.383 76.6002 131.775 75.2002 128.771Z"
          fill="black"
        />
        <path
          d="M116.1 123.364L108.4 127.77C109.5 129.639 112 133.461 116.4 135.48C121.2 137.683 128.7 138.184 133.9 135.781C138.503 133.654 141.2 129.372 141.2 124.666C141.2 119.159 139.9 114.452 130.6 110.347C123.1 107.036 120.5 106.141 120.5 102.837C120.5 101.836 121.1 98.7315 125.4 98.7315C128.8 98.7315 130.5 101.435 131.1 102.837L138.5 98.0305C136.9 95.4271 133.6 90.5205 125.4 90.5205C117.2 90.5205 111.2 95.4271 111.2 102.837C111.2 110.247 115.923 114.686 123.8 117.657C131.5 120.561 131.8 122.803 131.8 124.165C131.8 125.667 130.8 129.072 125.5 129.072C120 129.072 117.133 125.3 116.1 123.364Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="zurichjs-logo-clip">
          <rect fill="white" height="150" width="150" />
        </clipPath>
      </defs>
    </svg>
  );
};

type TypedLineProps = {
  accentColor: string;
  frame: number;
  fps: number;
  name: string;
  startFrame: number;
  text: string;
};

const TypedLine: React.FC<TypedLineProps> = ({
  accentColor,
  frame,
  fps,
  name,
  startFrame,
  text,
}) => {
  const charactersPerSecond = 20;
  const framesPerCharacter = fps / charactersPerSecond;
  const accentDuration = fps / charactersPerSecond;

  return (
    <Interactive.Div name={name}>
      {Array.from(text).map((character, index) => {
        const revealFrame = startFrame + index * framesPerCharacter;
        const isVisible = frame >= revealFrame;
        const isAccented = frame < revealFrame + accentDuration;

        return (
          <span
            key={`${character}-${index}`}
            style={{
              color: isAccented ? accentColor : "#000000",
              opacity: isVisible ? 1 : 0,
            }}
          >
            {character}
          </span>
        );
      })}
    </Interactive.Div>
  );
};

type SpeakerEndcardProps = {
  avatarSrc: string;
  firstName: string;
  lastName: string;
};

export const SpeakerEndcard: React.FC<SpeakerEndcardProps> = ({
  avatarSrc,
  firstName,
  lastName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Speaker lockup"
        style={{
          alignItems: "center",
          display: "flex",
          gap: 44,
          height: 360,
          scale: interpolate(frame, [0, scaleEndFrame], [entryScale, 1], {
            easing: Easing.spring({
              damping: 18,
              stiffness: 180,
              mass: 0.7,
            }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
          width: speakerLockupWidth,
        }}
      >
        <Interactive.Div
          name="ZurichJS logo to speaker cube"
          style={{
            flex: "0 0 auto",
            height: cubeSize,
            perspective: 1800,
            translate: interpolate(
              frame,
              [cubeStartFrame, cubeEndFrame],
              [`${(speakerLockupWidth - cubeSize) / 2}px 0px`, "0px 0px"],
              {
                easing: Easing.spring({ damping: 200, allowTail: true }),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            width: cubeSize,
          }}
        >
          <div
            style={{
              height: "100%",
              position: "relative",
              transform: `translateZ(-${cubeSize / 2}px) rotateY(${interpolate(
                frame,
                [cubeStartFrame, cubeEndFrame],
                [0, -90],
                {
                  easing: Easing.spring({ damping: 200, allowTail: true }),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              )}deg)`,
              transformStyle: "preserve-3d",
              width: "100%",
            }}
          >
            <div
              style={{
                backfaceVisibility: "hidden",
                height: "100%",
                position: "absolute",
                transform: `translateZ(${cubeSize / 2}px)`,
                width: "100%",
              }}
            >
              <ZurichJsLogo />
            </div>

            <CanvasImage
              name={`${firstName} ${lastName} avatar`}
              src={staticFile(avatarSrc)}
              style={{
                backfaceVisibility: "hidden",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                transform: `rotateY(90deg) translateZ(${cubeSize / 2}px)`,
                width: "100%",
              }}
            />
          </div>
        </Interactive.Div>

        <Interactive.Div
          name="Speaker name"
          style={{
            color: "#000000",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            fontFamily,
            fontSize: 132,
            fontWeight: 900,
            justifyContent: "center",
            letterSpacing: -6,
            lineHeight: 0.84,
            minWidth: 0,
            whiteSpace: "nowrap",
          }}
        >
          <TypedLine
            accentColor="#F6E779"
            frame={frame}
            fps={fps}
            name={`${firstName} typed in yellow`}
            startFrame={cubeEndFrame - 7}
            text={firstName}
          />
          <TypedLine
            accentColor="#2D93C9"
            frame={frame}
            fps={fps}
            name={`${lastName} typed in blue`}
            startFrame={cubeEndFrame - 7 + fps * 0.3}
            text={lastName}
          />
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
