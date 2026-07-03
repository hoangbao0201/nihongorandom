import type { KanjiItem } from "@/lib/kanjiTypes";

export type N5PartId =
  | "tuvung"
  | "nguphap"
  | "luyendoc"
  | "hoithoai"
  | "luyennghe"
  | "baitap"
  | "hantu"
  | "luyenchuhan"
  | "dochieu"
  | "kiemtra"
  | "thamkhao";

export interface IN5TudichBlock {
  kind: "tudich";
  japanese: string;
  japaneseHtml: string;
  vietnamese: string;
  vietnameseHtml: string;
}

export interface IN5SentenceBlock {
  kind: "sentence";
  text: string;
  textHtml: string;
  meaning: string;
}

export interface IN5DialogueRow {
  speaker: string | null;
  speakerHtml: string;
  lines: IN5TudichBlock[];
}

export type IN5ContentBlock =
  | { kind: "html"; contentHtml: string }
  | { kind: "heading"; level: number; text: string; textHtml: string }
  | IN5TudichBlock
  | IN5SentenceBlock
  | {
      kind: "audio";
      style: "controls" | "player";
      url: string;
      contentHtml?: string;
    }
  | {
      kind: "image";
      url: string;
      linkUrl?: string;
      contentHtml?: string;
    }
  | { kind: "table"; contentHtml: string }
  | {
      kind: "dialogue";
      rows: IN5DialogueRow[];
      contentHtml?: string;
    }
  | {
      kind: "slide";
      variant: "default" | "collapsible";
      title: string;
      titleHtml: string;
      contentHtml?: string;
      blocks: IN5ContentBlock[];
    };

export interface IN5TabSection {
  id: string;
  title: string | null;
  titleHtml: string | null;
  contentHtml: string;
  blocks?: IN5ContentBlock[];
}

export interface IN5TuvungEntry {
  kind: "entry";
  index: number;
  word: string;
  wordHtml: string;
  kanji: string;
  kanjiHtml: string;
  sinoVietnamese: string;
  audio: string | null;
  meaning: string;
  meaningHtml: string;
}

export interface IN5TuvungPhrase {
  kind: "phrase";
  index: number;
  text: string;
  textHtml: string;
  audio: string | null;
  meaning: string;
  meaningHtml: string;
}

export interface IN5TuvungDivider {
  kind: "divider";
}

export type IN5TuvungItem = IN5TuvungEntry | IN5TuvungPhrase | IN5TuvungDivider;

export interface IN5TuvungSection {
  key: string;
  label: string | null;
  labelHtml: string | null;
  items: IN5TuvungItem[];
}

export interface IN5TuvungData {
  lesson: number;
  meta?: {
    practiceUrl?: string | null;
    flashcardUrl?: string | null;
  };
  sections: IN5TuvungSection[];
}

export interface IN5HantuEntry {
  index: number;
  kanji: string;
  kanjiHtml: string;
  sinoVietnamese: string;
  kana: string;
  kanaHtml: string;
}

export interface IN5HantuData {
  lesson: number;
  type: "hantu";
  entries: IN5HantuEntry[];
}

export interface IN5ThamkhaoRow {
  cells: { text: string; html: string }[];
  term?: string;
  termHtml?: string;
  meaning?: string;
  meaningHtml?: string;
  country?: string;
  countryHtml?: string;
  person?: string;
  personHtml?: string;
  language?: string;
  languageHtml?: string;
}

export interface IN5ThamkhaoSection {
  title: string;
  titleHtml: string;
  introHtml?: string | null;
  columns: string[];
  rows: IN5ThamkhaoRow[];
  contentHtml?: string;
}

export interface IN5ThamkhaoData {
  lesson: number;
  type: "thamkhao";
  sections: IN5ThamkhaoSection[];
}

export interface IN5QuizOption {
  key: string;
  text: string;
  textHtml: string;
}

export interface IN5QuizQuestion {
  label: string | null;
  labelHtml: string | null;
  prompt: string;
  promptHtml: string;
  options: IN5QuizOption[];
  correctKey?: string;
}

export interface IN5KiemtraSection {
  title: string;
  titleHtml: string;
  questions: IN5QuizQuestion[];
}

export interface IN5KiemtraData {
  lesson: number;
  type: "kiemtra";
  sections: IN5KiemtraSection[];
}

export interface IN5DochieuVocabItem {
  kind: "vocab";
  word: string;
  wordHtml: string;
  kanji: string;
  kanjiHtml: string;
  meaningVi: string;
  meaningViHtml: string;
  meaningEn: string;
  meaningEnHtml: string;
}

export interface IN5DochieuSection {
  id: string;
  title: string | null;
  titleHtml: string | null;
  contentHtml: string;
  items?: IN5DochieuVocabItem[];
  blocks?: IN5ContentBlock[];
}

export interface IN5DochieuData {
  lesson: number;
  type: "dochieu";
  sections: IN5DochieuSection[];
}

export interface IN5LuyenchuhanData {
  lesson: number;
  type: "luyenchuhan";
  kanjis?: KanjiItem[];
}

export interface IN5TabSectionsData {
  lesson: number;
  type: string;
  sections: IN5TabSection[];
}

export type IN5PartData =
  | IN5TuvungData
  | IN5HantuData
  | IN5ThamkhaoData
  | IN5KiemtraData
  | IN5DochieuData
  | IN5LuyenchuhanData
  | IN5TabSectionsData;
