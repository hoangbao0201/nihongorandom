import { ICharacter } from "@/config/kana";

const NUMBER_OPTION_MAX: Record<string, number> = {
    "number-1-10": 10,
    "number-10-20": 20,
    "number-20-100": 100,
    "number-100-1000": 1000,
    "number-1000-10000": 10000,
    "number-10000-100000": 100000,
    "number-100000-1000000": 1000000,
    "number-1000000-10000000": 10000000,
};

const DIGITS_ROMAJI = [
    "",
    "ichi",
    "ni",
    "san",
    "yon",
    "go",
    "roku",
    "nana",
    "hachi",
    "kyuu",
];

export function isNumberOption(optionId: string): boolean {
    return optionId in NUMBER_OPTION_MAX;
}

function numberBelow(maxExclusive: number): number {
    return Math.max(1, Math.floor(Math.random() * maxExclusive));
}

export function normalizeSpaces(value: string): string {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function normalizeNumberAnswer(value: string): string {
    return value.trim().replace(/[,\s.]/g, "");
}

export const LISTENING_DIGIT_PLACES = [
    { id: "million", label: "triệu", placeValue: 1_000_000 },
    { id: "ten-thousand", label: "chục nghìn", placeValue: 10_000 },
    { id: "thousand", label: "nghìn", placeValue: 1_000 },
    { id: "hundred", label: "trăm", placeValue: 100 },
    { id: "ten", label: "chục", placeValue: 10 },
    { id: "unit", label: "đơn vị", placeValue: 1 },
] as const;

export type ListeningDigitPlaceId =
    (typeof LISTENING_DIGIT_PLACES)[number]["id"];

export interface ListeningNumberQuestion {
    value: number;
    display: string;
    speakText: string;
}

export function buildListeningNumberQuestion(
    selectedPlaceIds: ListeningDigitPlaceId[]
): ListeningNumberQuestion | null {
    if (selectedPlaceIds.length === 0) {
        return null;
    }

    const selectedPlaces = LISTENING_DIGIT_PLACES.filter((place) =>
        selectedPlaceIds.includes(place.id)
    );

    if (selectedPlaces.length === 0) {
        return null;
    }

    let value = 0;

    for (const place of selectedPlaces) {
        const digit = Math.floor(Math.random() * 9) + 1;
        value += digit * place.placeValue;
    }

    return {
        value,
        display: value.toLocaleString("vi-VN"),
        speakText: value.toString(),
    };
}

function under10000ToRomaji(value: number): string {
    if (value <= 0 || value >= 10000) return "";

    const thousands = Math.floor(value / 1000);
    const hundreds = Math.floor((value % 1000) / 100);
    const tens = Math.floor((value % 100) / 10);
    const ones = value % 10;
    const parts: string[] = [];

    if (thousands > 0) {
        if (thousands === 1) parts.push("sen");
        else if (thousands === 3) parts.push("sanzen");
        else if (thousands === 8) parts.push("hassen");
        else parts.push(`${DIGITS_ROMAJI[thousands]} sen`);
    }

    if (hundreds > 0) {
        if (hundreds === 1) parts.push("hyaku");
        else if (hundreds === 3) parts.push("sanbyaku");
        else if (hundreds === 6) parts.push("roppyaku");
        else if (hundreds === 8) parts.push("happyaku");
        else parts.push(`${DIGITS_ROMAJI[hundreds]} hyaku`);
    }

    if (tens > 0) {
        if (tens === 1) parts.push("juu");
        else parts.push(`${DIGITS_ROMAJI[tens]} juu`);
    }

    if (ones > 0) parts.push(DIGITS_ROMAJI[ones]);

    return parts.join(" ");
}

function numberToRomaji(value: number): string {
    if (value <= 0) return "zero";

    const oku = Math.floor(value / 100000000);
    const man = Math.floor((value % 100000000) / 10000);
    const rest = value % 10000;
    const parts: string[] = [];

    if (oku > 0) {
        const okuText = under10000ToRomaji(oku);
        if (okuText) parts.push(`${okuText} oku`);
    }
    if (man > 0) {
        const manText = under10000ToRomaji(man);
        if (manText) parts.push(`${manText} man`);
    }
    if (rest > 0) {
        parts.push(under10000ToRomaji(rest));
    }

    return parts.join(" ").trim();
}

export function buildNumberQuestion(optionId: string): ICharacter | null {
    const maxExclusive = NUMBER_OPTION_MAX[optionId];
    if (!maxExclusive) return null;

    const number = numberBelow(maxExclusive);
    return {
        display: number.toLocaleString("en-US"),
        answer: numberToRomaji(number),
    };
}
