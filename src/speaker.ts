export type Speaker = {
  avatarSrc: string;
  firstName: string;
  lastName: string;
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
  },
  {
    compositionId: "ArnauGomezFarell",
    avatarSrc: "images/speakers/arnau-gomez-farell.png",
    firstName: "Arnau",
    lastName: "Gómez Farell",
  },
  {
    compositionId: "AtilaFassina",
    avatarSrc: "images/speakers/atila-fassina.png",
    firstName: "Atila",
    lastName: "Fassina",
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
  },
  {
    compositionId: "DanielNoelDavies",
    avatarSrc: "images/speakers/daniel-noel-davies.png",
    firstName: "Daniel",
    lastName: "Noel-Davies",
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
  },
  {
    compositionId: "DominikDorfmeister",
    avatarSrc: "images/speakers/dominik-dorfmeister.png",
    firstName: "Dominik",
    lastName: "Dorfmeister",
  },
  {
    compositionId: "JamesGarbutt",
    avatarSrc: "images/speakers/james-garbutt.png",
    firstName: "James",
    lastName: "Garbutt",
  },
  {
    compositionId: "KevinPowell",
    avatarSrc: "images/speakers/kevin-powell.png",
    firstName: "Kevin",
    lastName: "Powell",
  },
  {
    compositionId: "MarkErikson",
    avatarSrc: "images/speakers/mark-erikson.png",
    firstName: "Mark",
    lastName: "Erikson",
  },
  {
    compositionId: "MatheusAlbuquerque",
    avatarSrc: "images/speakers/matheus-albuquerque.png",
    firstName: "Matheus",
    lastName: "Albuquerque",
  },
  {
    compositionId: "PhilippeSerhal",
    avatarSrc: "images/speakers/philippe-serhal.png",
    firstName: "Philippe",
    lastName: "Serhal",
  },
  {
    compositionId: "RamonaSchwering",
    avatarSrc: "images/speakers/ramona-schwering.png",
    firstName: "Ramona",
    lastName: "Schwering",
  },
  {
    compositionId: "SalihGuler",
    avatarSrc: "images/speakers/salih-guler.png",
    firstName: "Salih",
    lastName: "Güler",
  },
  {
    compositionId: "SantoshYadav",
    avatarSrc: "images/speakers/santosh-yadav.png",
    firstName: "Santosh",
    lastName: "Yadav",
  },
  {
    compositionId: "ScottTolinski",
    avatarSrc: "images/speakers/scott-tolinski.png",
    firstName: "Scott",
    lastName: "Tolinski",
  },
  {
    compositionId: "TejasKumar",
    avatarSrc: "images/speakers/tejas-kumar.png",
    firstName: "Tejas",
    lastName: "Kumar",
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
  },
];

export const DEFAULT_SPEAKER: Speaker = {
  avatarSrc: "images/dominik-avatar.png",
  firstName: "Dominik",
  lastName: "Dorfmeister",
};
