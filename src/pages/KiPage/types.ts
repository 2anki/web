export interface Card {
  id?: string;
  front: string;
  back: string;
  deck?: string;
  tags?: string[];
  media?: string[];
}

export interface Deck {
  name: string;
  id: string;
  cards: {
    name: string;
    back: string;
    tags: string[];
    cloze: boolean;
    number: number;
    enableInput: boolean;
    answer: string;
    media: string[];
  }[];
  settings: {
    useInput: boolean;
    maxOne: boolean;
    noUnderline: boolean;
    isCherry: boolean;
    isAvocado: boolean;
    isAll: boolean;
    isTextOnlyBack: boolean;
    toggleMode: string;
    isCloze: boolean;
    useTags: boolean;
    basicReversed: boolean;
    reversed: boolean;
    removeMP3Links: boolean;
    perserveNewLines: boolean;
    clozeModelName: string;
    basicModelName: string;
    inputModelName: string;
    useNotionId: boolean;
    pageEmoji: string;
  };
  image: string;
  style: string;
}

export interface ProcessingState {
  message: string;
  progress?: number;
  files?: File[];
  text?: string;
  timer?: number;
}

export interface Session {
  id: string;
  name?: string;
  createdAt: string;
  cards: Card[];
  text?: string;
}

export interface SessionHistory {
  sessions: Session[];
  currentSessionId: string;
}
