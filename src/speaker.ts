export type Speaker = {
  avatarSrc: string;
  firstName: string;
  lastName: string;
  sessionTitle?: string;
};

export type ConferenceSpeaker = Speaker & {
  compositionId: string;
};

export const CONFERENCE_SPEAKERS: ConferenceSpeaker[] = [
  {
    compositionId: "AlexanderLichter",
    avatarSrc: "images/speakers/alexander-lichter.png",
    firstName: "Alexander",
    lastName: "Lichter",
    sessionTitle: "e18e & friends - Live Episode",
  },
  {
    compositionId: "ArnauGomezFarell",
    avatarSrc: "images/speakers/arnau-gomez-farell.png",
    firstName: "Arnau",
    lastName: "Gómez Farell",
    sessionTitle:
      "AI inside your documents: build a next-gen rich text editor with Tiptap",
  },
  {
    compositionId: "AtilaFassina",
    avatarSrc: "images/speakers/atila-fassina.png",
    firstName: "Atila",
    lastName: "Fassina",
    sessionTitle:
      "(Re)building a Framework: Lessons, Community, and Impostor Syndrome",
  },
  {
    compositionId: "CarmenHuidobro",
    avatarSrc: "images/speakers/carmen-huidobro.png",
    firstName: "Carmen",
    lastName: "Huidobro",
  },
  {
    compositionId: "DanielAfonso",
    avatarSrc: "images/speakers/daniel-afonso.png",
    firstName: "Daniel",
    lastName: "Afonso",
    sessionTitle: "Chaos to Calm: An Advanced Full-Stack Guide to Reliability",
  },
  {
    compositionId: "DanielNoelDavies",
    avatarSrc: "images/speakers/daniel-noel-davies.png",
    firstName: "Daniel",
    lastName: "Noel-Davies",
    sessionTitle:
      '"Hold My Beer": From Memory Scanning to gRPC in the Pokémon World',
  },
  {
    compositionId: "DanielRoe",
    avatarSrc: "images/speakers/daniel-roe.png",
    firstName: "Daniel",
    lastName: "Roe",
  },
  {
    compositionId: "DebbieOBrien",
    avatarSrc: "images/speakers/debbie-obrien.png",
    firstName: "Debbie",
    lastName: "O'Brien",
    sessionTitle: "Bug Report In, Pull Request Out: Agentic CI with Playwright",
  },
  {
    compositionId: "DominikDorfmeister",
    avatarSrc: "images/speakers/dominik-dorfmeister.png",
    firstName: "Dominik",
    lastName: "Dorfmeister",
    sessionTitle:
      "Dead Code Shouldn’t Exist: How We Removed 28k Lines of Code, One Knip at a Time",
  },
  {
    compositionId: "JamesGarbutt",
    avatarSrc: "images/speakers/james-garbutt.png",
    firstName: "James",
    lastName: "Garbutt",
    sessionTitle: "e18e & friends - Live Episode",
  },
  {
    compositionId: "KevinPowell",
    avatarSrc: "images/speakers/kevin-powell.png",
    firstName: "Kevin",
    lastName: "Powell",
    sessionTitle: "CSS is eating JavaScript",
  },
  {
    compositionId: "MarkErikson",
    avatarSrc: "images/speakers/mark-erikson.png",
    firstName: "Mark",
    lastName: "Erikson",
    sessionTitle:
      "How I Made Immer Twice as Fast: Performance Optimization in Practice",
  },
  {
    compositionId: "MatheusAlbuquerque",
    avatarSrc: "images/speakers/matheus-albuquerque.png",
    firstName: "Matheus",
    lastName: "Albuquerque",
    sessionTitle: "React: Internals and Advanced Performance Patterns",
  },
  {
    compositionId: "PhilippeSerhal",
    avatarSrc: "images/speakers/philippe-serhal.png",
    firstName: "Philippe",
    lastName: "Serhal",
    sessionTitle:
      "How to make full-stack frameworks work on a platform like Netlify",
  },
  {
    compositionId: "RamonaSchwering",
    avatarSrc: "images/speakers/ramona-schwering.png",
    firstName: "Ramona",
    lastName: "Schwering",
    sessionTitle: "Artful Defense: Let's Sketch Web Security",
  },
  {
    compositionId: "SalihGuler",
    avatarSrc: "images/speakers/salih-guler.png",
    firstName: "Salih",
    lastName: "Güler",
    sessionTitle: "Building and Deploying a Multi-Agent AI D&D with TypeScript",
  },
  {
    compositionId: "SantoshYadav",
    avatarSrc: "images/speakers/santosh-yadav.png",
    firstName: "Santosh",
    lastName: "Yadav",
    sessionTitle: "e18e & friends - Live Episode",
  },
  {
    compositionId: "ScottTolinski",
    avatarSrc: "images/speakers/scott-tolinski.png",
    firstName: "Scott",
    lastName: "Tolinski",
    sessionTitle: "The True Cost of AI Coding",
  },
  {
    compositionId: "TejasKumar",
    avatarSrc: "images/speakers/tejas-kumar.png",
    firstName: "Tejas",
    lastName: "Kumar",
    sessionTitle: "Taste: Designing AI Products People Actually Want to Use",
  },
  {
    compositionId: "TonyEdwards",
    avatarSrc: "images/speakers/tony-edwards.png",
    firstName: "Tony",
    lastName: "Edwards",
  },
  {
    compositionId: "TracyLee",
    avatarSrc: "images/speakers/tracy-lee.png",
    firstName: "Tracy",
    lastName: "Lee",
    sessionTitle: "Angular in the Era of Autonomous Engineering",
  },
];

const E18E_PANELIST_COMPOSITION_IDS = [
  "AlexanderLichter",
  "SantoshYadav",
  "DebbieOBrien",
  "ScottTolinski",
  "JamesGarbutt",
] as const;

export const E18E_PANELISTS: ConferenceSpeaker[] =
  E18E_PANELIST_COMPOSITION_IDS.map((compositionId) => {
    const panelist = CONFERENCE_SPEAKERS.find(
      (speaker) => speaker.compositionId === compositionId,
    );

    if (!panelist) {
      throw new Error(`Missing e18e panelist: ${compositionId}`);
    }

    return panelist;
  });

export const DEFAULT_SPEAKER: Speaker = {
  avatarSrc: "images/dominik-avatar.png",
  firstName: "Dominik",
  lastName: "Dorfmeister",
  sessionTitle:
    "Dead Code Shouldn’t Exist: How We Removed 28k Lines of Code, One Knip at a Time",
};
