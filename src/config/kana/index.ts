import { ICharacter } from "./types";
import {
  hiraganaCharactersMap,
  hiraganaContractedCharactersMap,
} from "./hiragana";
import {
  katakanaCharactersMap,
  katakanaContractedCharactersMap,
} from "./katakana";
import { numberCharactersMap } from "./numbers";

export type { ICharacter } from "./types";
export {
  hiraganaCharactersMap,
  hiraganaContractedCharactersMap,
} from "./hiragana";
export {
  katakanaCharactersMap,
  katakanaContractedCharactersMap,
} from "./katakana";
export { numberCharactersMap } from "./numbers";

// Chép nguyên CHARACTER_DATASETS từ config/data.ts cũ (dòng 883–902).
export const CHARACTER_DATASETS: Record<string, ICharacter[]> = {
    hiragana: hiraganaCharactersMap,
    "hiragana-contracted": hiraganaContractedCharactersMap,
    katakana: katakanaCharactersMap,
    "katakana-contracted": katakanaContractedCharactersMap,
    "number-1-10": numberCharactersMap,
    "number-10-20": numberCharactersMap,
    "number-20-100": numberCharactersMap,
    "number-100-1000": numberCharactersMap,
    "number-1000-10000": numberCharactersMap,
    "number-10000-100000": numberCharactersMap,
    "number-100000-1000000": numberCharactersMap,
    "number-1000000-10000000": numberCharactersMap,
    ...Object.fromEntries(
        Array.from({ length: 25 }, (_, index) => [
            `vocabulary-${index + 1}`,
            [] as ICharacter[],
        ])
    ),
};
