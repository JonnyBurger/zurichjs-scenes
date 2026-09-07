/** Supplied edit: 100 BPM, 4/4, 60.6 seconds including the musical tail. */
export const OPENING_FPS = 30;
export const OPENING_BPM = 100;
export const OPENING_DURATION_IN_FRAMES = 1818;
export const OPENING_AUDIO =
  "audio/poppin-bottles-2026-05-07-04-19-31-utc/shorts/poppin-bottles_short-03_60sec.wav";
export const beatFrame = (beat: number) =>
  Math.round((beat * 60 * OPENING_FPS) / OPENING_BPM);

export type ShotKind =
  | "title"
  | "hit"
  | "orbit"
  | "mcs"
  | "weight"
  | "italic"
  | "trail"
  | "split"
  | "spin"
  | "speakers"
  | "warp"
  | "city"
  | "office"
  | "stat"
  | "ribbon"
  | "final";
export type OpeningCue = {
  beat: number;
  end: number;
  kind: ShotKind;
  text: string;
  second?: string;
  light?: boolean;
  speakerStart?: number;
};

/** Cut on beats; these are shots in a montage, not presentation pages. */
export const openingCues: OpeningCue[] = [
  { beat: 0, end: 8, kind: "title", text: "ZurichJS Conf 2026" },
  { beat: 8, end: 10, kind: "hit", text: "THIS", light: true },
  { beat: 10, end: 11, kind: "orbit", text: "IS" },
  { beat: 11, end: 13, kind: "office", text: "ZURICH" },
  { beat: 13, end: 15, kind: "city", text: "flyover" },
  { beat: 15, end: 16, kind: "mcs", text: "Our MCs: Carmen and Tony" },
  { beat: 16, end: 20, kind: "stat", text: "350", second: "ATTENDEES" },
  { beat: 20, end: 22, kind: "split", text: "350", second: "OF US" },
  { beat: 22, end: 24, kind: "weight", text: "350" },
  {
    beat: 24,
    end: 28,
    kind: "stat",
    text: "31",
    second: "COUNTRIES",
    light: true,
  },
  { beat: 28, end: 29, kind: "hit", text: "ONE" },
  { beat: 29, end: 30, kind: "hit", text: "ROOM", light: true },
  { beat: 30, end: 31, kind: "spin", text: "ONE" },
  { beat: 31, end: 32, kind: "hit", text: "COMMUNITY", light: true },
  { beat: 32, end: 34, kind: "ribbon", text: "COMMUNITY" },
  { beat: 34, end: 36, kind: "hit", text: "COMMUNITY", light: true },
  { beat: 36, end: 38, kind: "trail", text: "COMMUNITY" },
  { beat: 38, end: 40, kind: "split", text: "GEEK", second: "APPROVED" },
  { beat: 40, end: 42, kind: "hit", text: "LIFTING" },
  { beat: 42, end: 44, kind: "italic", text: "UP" },
  { beat: 44, end: 45, kind: "hit", text: "ZURICH", light: true },
  { beat: 45, end: 46, kind: "speakers", text: "The voices", speakerStart: 2 },
  { beat: 46, end: 48, kind: "hit", text: "TECH SCENE", light: true },
  { beat: 48, end: 52, kind: "stat", text: "12", second: "TALKS" },
  {
    beat: 52,
    end: 56,
    kind: "speakers",
    text: "Meet the speakers",
    speakerStart: 4,
  },
  { beat: 56, end: 58, kind: "hit", text: "MADE BY" },
  { beat: 58, end: 59, kind: "hit", text: "THE", light: true },
  { beat: 59, end: 62, kind: "ribbon", text: "COMMUNITY" },
  { beat: 62, end: 64, kind: "hit", text: "FOR", light: true },
  { beat: 64, end: 65, kind: "hit", text: "THE" },
  { beat: 65, end: 68, kind: "hit", text: "COMMUNITY", light: true },
  {
    beat: 68,
    end: 72,
    kind: "speakers",
    text: "Our community",
    speakerStart: 12,
  },
  { beat: 72, end: 74, kind: "split", text: "THIS IS", second: "OUR" },
  { beat: 74, end: 76, kind: "weight", text: "MOMENT" },
  { beat: 76, end: 78, kind: "hit", text: "MOMENT" },
  { beat: 78, end: 80, kind: "trail", text: "MOMENT" },
  { beat: 80, end: 82, kind: "hit", text: "ZURICH", light: true },
  { beat: 82, end: 83, kind: "hit", text: "ARE", light: true },
  { beat: 83, end: 84, kind: "hit", text: "YOU" },
  { beat: 84, end: 86, kind: "warp", text: "READY?" },
  { beat: 86, end: 88, kind: "hit", text: "READY?", light: true },
  { beat: 88, end: 90, kind: "hit", text: "MAKE" },
  { beat: 90, end: 92, kind: "italic", text: "SOME" },
  { beat: 92, end: 94, kind: "hit", text: "NOISE", light: true },
  { beat: 94, end: 96, kind: "spin", text: "NOISE" },
  { beat: 96, end: 101, kind: "final", text: "Let's start." },
];
