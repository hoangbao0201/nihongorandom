export interface ICharacter {
    display: string;
    answer: string;
    voice?: string | null;
    image?: string | null;
}

export const hiraganaCharactersMap: ICharacter[] = [
    {
        display: 'あ',
        answer: "a",
    },
    {
        display: 'い',
        answer: "i",
    },
    {
        display: 'う',
        answer: "u",
    },
    {
        display: 'え',
        answer: "e",
    },
    {
        display: 'お',
        answer: "o",
    },
    {
        display: 'か',
        answer: "ka",
    },
    {
        display: 'き',
        answer: "ki",
    },
    {
        display: 'く',
        answer: "ku",
    },
    {
        display: 'け',
        answer: "ke",
    },
    {
        display: 'こ',
        answer: "ko",
    },
    {
        display: 'さ',
        answer: "sa",
    },
    {
        display: 'し',
        answer: "shi",
    },
    {
        display: 'す',
        answer: "su",
    },
    {
        display: 'せ',
        answer: "se",
    },
    {
        display: 'そ',
        answer: "so",
    },
    {
        display: 'た',
        answer: "ta",
    },
    {
        display: 'ち',
        answer: "chi",
    },
    {
        display: 'つ',
        answer: "tsu",
    },
    {
        display: 'て',
        answer: "te",
    },
    {
        display: 'と',
        answer: "to",
    },
    {
        display: 'な',
        answer: "na",
    },
    {
        display: 'に',
        answer: "ni",
    },
    {
        display: 'ぬ',
        answer: "nu",
    },
    {
        display: 'ね',
        answer: "ne",
    },
    {
        display: 'の',
        answer: "no",
    },
    {
        display: 'は',
        answer: "ha",
    },
    {
        display: 'ひ',
        answer: "hi",
    },
    {
        display: 'ふ',
        answer: "fu",
    },
    {
        display: 'へ',
        answer: "he",
    },
    {
        display: 'ほ',
        answer: "ho",
    },
    {
        display: 'ま',
        answer: "ma",
    },
    {
        display: 'み',
        answer: "mi",
    },
    {
        display: 'む',
        answer: "mu",
    },
    {
        display: 'め',
        answer: "me",
    },
    {
        display: 'も',
        answer: "mo",
    },
    {
        display: 'や',
        answer: "ya",
    },
    {
        display: 'ゆ',
        answer: "yu",
    },
    {
        display: 'よ',
        answer: "yo",
    },
    {
        display: 'ら',
        answer: "ra",
    },
    {
        display: 'り',
        answer: "ri",
    },
    {
        display: 'る',
        answer: "ru",
    },
    {
        display: 'れ',
        answer: "re",
    },
    {
        display: 'ろ',
        answer: "ro",
    },
    {
        display: 'わ',
        answer: "wa",
    },
    {
        display: 'を',
        answer: "wo",
    },
    {
        display: 'ん',
        answer: "n",
    },
    {
        display: 'が',
        answer: "ga",
    },
    {
        display: 'ぎ',
        answer: "gi",
    },
    {
        display: 'ぐ',
        answer: "gu",
    },
    {
        display: 'げ',
        answer: "ge",
    },
    {
        display: 'ご',
        answer: "go",
    },
    {
        display: 'ざ',
        answer: "za",
    },
    {
        display: 'じ',
        answer: "ji",
    },
    {
        display: 'ず',
        answer: "zu",
    },
    {
        display: 'ぜ',
        answer: "ze",
    },
    {
        display: 'ぞ',
        answer: "zo",
    },
    {
        display: 'だ',
        answer: "da",
    },
    {
        display: 'ぢ',
        answer: "ji",
    },
    {
        display: 'づ',
        answer: "zu",
    },
    {
        display: 'で',
        answer: "de",
    },
    {
        display: 'ど',
        answer: "do",
    },
    {
        display: 'ば',
        answer: "ba",
    },
    {
        display: 'び',
        answer: "bi",
    },
    {
        display: 'ぶ',
        answer: "bu",
    },
    {
        display: 'べ',
        answer: "be",
    },
    {
        display: 'ぼ',
        answer: "bo",
    },
    {
        display: 'ぱ',
        answer: "pa",
    },
    {
        display: 'ぴ',
        answer: "pi",
    },
    {
        display: 'ぷ',
        answer: "pu",
    },
    {
        display: 'ぺ',
        answer: "pe",
    },
    {
        display: 'ぽ',
        answer: "po",
    },
];

export const katakanaCharactersMap: ICharacter[] = [
    {
        display: 'ア',
        answer: "a",
    },
    {
        display: 'イ',
        answer: "i",
    },
    {
        display: 'ウ',
        answer: "u",
    },
    {
        display: 'エ',
        answer: "e",
    },
    {
        display: 'オ',
        answer: "o",
    },
    {
        display: 'カ',
        answer: "ka",
    },
    {
        display: 'キ',
        answer: "ki",
    },
    {
        display: 'ク',
        answer: "ku",
    },
    {
        display: 'ケ',
        answer: "ke",
    },
    {
        display: 'コ',
        answer: "ko",
    },
    {
        display: 'サ',
        answer: "sa",
    },
    {
        display: 'シ',
        answer: "shi",
    },
    {
        display: 'ス',
        answer: "su",
    },
    {
        display: 'セ',
        answer: "se",
    },
    {
        display: 'ソ',
        answer: "so",
    },
    {
        display: 'タ',
        answer: "ta",
    },
    {
        display: 'チ',
        answer: "chi",
    },
    {
        display: 'ツ',
        answer: "tsu",
    },
    {
        display: 'テ',
        answer: "te",
    },
    {
        display: 'ト',
        answer: "to",
    },
    {
        display: 'ナ',
        answer: "na",
    },
    {
        display: 'ニ',
        answer: "ni",
    },
    {
        display: 'ヌ',
        answer: "nu",
    },
    {
        display: 'ネ',
        answer: "ne",
    },
    {
        display: 'ノ',
        answer: "no",
    },
    {
        display: 'ハ',
        answer: "ha",
    },
    {
        display: 'ヒ',
        answer: "hi",
    },
    {
        display: 'フ',
        answer: "fu",
    },
    {
        display: 'ヘ',
        answer: "he",
    },
    {
        display: 'ホ',
        answer: "ho",
    },
    {
        display: 'マ',
        answer: "ma",
    },
    {
        display: 'ミ',
        answer: "mi",
    },
    {
        display: 'ム',
        answer: "mu",
    },
    {
        display: 'メ',
        answer: "me",
    },
    {
        display: 'モ',
        answer: "mo",
    },
    {
        display: 'ヤ',
        answer: "ya",
    },
    {
        display: 'ユ',
        answer: "yu",
    },
    {
        display: 'ヨ',
        answer: "yo",
    },
    {
        display: 'ラ',
        answer: "ra",
    },
    {
        display: 'リ',
        answer: "ri",
    },
    {
        display: 'ル',
        answer: "ru",
    },
    {
        display: 'レ',
        answer: "re",
    },
    {
        display: 'ロ',
        answer: "ro",
    },
    {
        display: 'ワ',
        answer: "wa",
    },
    {
        display: 'ヲ',
        answer: "wo",
    },
    {
        display: 'ン',
        answer: "n",
    },
    {
        display: 'ガ',
        answer: "ga",
    },
    {
        display: 'ギ',
        answer: "gi",
    },
    {
        display: 'グ',
        answer: "gu",
    },
    {
        display: 'ゲ',
        answer: "ge",
    },
    {
        display: 'ゴ',
        answer: "go",
    },
    {
        display: 'ザ',
        answer: "za",
    },
    {
        display: 'ジ',
        answer: "ji",
    },
    {
        display: 'ズ',
        answer: "zu",
    },
    {
        display: 'ゼ',
        answer: "ze",
    },
    {
        display: 'ゾ',
        answer: "zo",
    },
    {
        display: 'ダ',
        answer: "da",
    },
    {
        display: 'ヂ',
        answer: "ji",
    },
    {
        display: 'ヅ',
        answer: "zu",
    },
    {
        display: 'デ',
        answer: "de",
    },
    {
        display: 'ド',
        answer: "do",
    },
    {
        display: 'バ',
        answer: "ba",
    },
    {
        display: 'ビ',
        answer: "bi",
    },
    {
        display: 'ブ',
        answer: "bu",
    },
    {
        display: 'ベ',
        answer: "be",
    },
    {
        display: 'ボ',
        answer: "bo",
    },
    {
        display: 'パ',
        answer: "pa",
    },
    {
        display: 'ピ',
        answer: "pi",
    },
    {
        display: 'プ',
        answer: "pu",
    },
    {
        display: 'ペ',
        answer: "pe",
    },
    {
        display: 'ポ',
        answer: "po",
    },
];

export const hiraganaContractedCharactersMap: ICharacter[] = [
    {
        display: 'きゃ',
        answer: "kya",
    },
    {
        display: 'きゅ',
        answer: "kyu",
    },
    {
        display: 'きょ',
        answer: "kyo",
    },
    {
        display: 'しゃ',
        answer: "sha",
    },
    {
        display: 'しゅ',
        answer: "shu",
    },
    {
        display: 'しょ',
        answer: "sho",
    },
    {
        display: 'ちゃ',
        answer: "cha",
    },
    {
        display: 'ちゅ',
        answer: "chu",
    },
    {
        display: 'ちょ',
        answer: "cho",
    },
    {
        display: 'にゃ',
        answer: "nya",
    },
    {
        display: 'にゅ',
        answer: "nyu",
    },
    {
        display: 'にょ',
        answer: "nyo",
    },
    {
        display: 'ひゃ',
        answer: "hya",
    },
    {
        display: 'ひゅ',
        answer: "hyu",
    },
    {
        display: 'ひょ',
        answer: "hyo",
    },
    {
        display: 'みゃ',
        answer: "mya",
    },
    {
        display: 'みゅ',
        answer: "myu",
    },
    {
        display: 'みょ',
        answer: "myo",
    },
    {
        display: 'りゃ',
        answer: "rya",
    },
    {
        display: 'りゅ',
        answer: "ryu",
    },
    {
        display: 'りょ',
        answer: "ryo",
    },
    {
        display: 'ぎゃ',
        answer: "gya",
    },
    {
        display: 'ぎゅ',
        answer: "gyu",
    },
    {
        display: 'ぎょ',
        answer: "gyo",
    },
    {
        display: 'じゃ',
        answer: "ja",
    },
    {
        display: 'じゅ',
        answer: "ju",
    },
    {
        display: 'じょ',
        answer: "jo",
    },
    {
        display: 'びゃ',
        answer: "bya",
    },
    {
        display: 'びゅ',
        answer: "byu",
    },
    {
        display: 'びょ',
        answer: "byo",
    },
    {
        display: 'ぴゃ',
        answer: "pya",
    },
    {
        display: 'ぴゅ',
        answer: "pyu",
    },
    {
        display: 'ぴょ',
        answer: "pyo",
    },
]

export const katakanaContractedCharactersMap: ICharacter[] = [
    {
        display: 'キャ',
        answer: "kya",
    },
    {
        display: 'キュ',
        answer: "kyu",
    },
    {
        display: 'キョ',
        answer: "kyo",
    },
    {
        display: 'シャ',
        answer: "sha",
    },
    {
        display: 'シュ',
        answer: "shu",
    },
    {
        display: 'ショ',
        answer: "sho",
    },
    {
        display: 'チャ',
        answer: "cha",
    },
    {
        display: 'チュ',
        answer: "chu",
    },
    {
        display: 'チョ',
        answer: "cho",
    },
    {
        display: 'ニャ',
        answer: "nya",
    },
    {
        display: 'ニュ',
        answer: "nyu",
    },
    {
        display: 'ニョ',
        answer: "nyo",
    },
    {
        display: 'ヒャ',
        answer: "hya",
    },
    {
        display: 'ヒュ',
        answer: "hyu",
    },
    {
        display: 'ヒョ',
        answer: "hyo",
    },
    {
        display: 'ミャ',
        answer: "mya",
    },
    {
        display: 'ミュ',
        answer: "myu",
    },
    {
        display: 'ミョ',
        answer: "myo",
    },
    {
        display: 'リャ',
        answer: "rya",
    },
    {
        display: 'リュ',
        answer: "ryu",
    },
    {
        display: 'リョ',
        answer: "ryo",
    },
    {
        display: 'ギャ',
        answer: "gya",
    },
    {
        display: 'ギュ',
        answer: "gyu",
    },
    {
        display: 'ギョ',
        answer: "gyo",
    },
    {
        display: 'ジャ',
        answer: "ja",
    },
    {
        display: 'ジュ',
        answer: "ju",
    },
    {
        display: 'ジョ',
        answer: "jo",
    },
    {
        display: 'ビャ',
        answer: "bya",
    },
    {
        display: 'ビュ',
        answer: "byu",
    },
    {
        display: 'ビョ',
        answer: "byo",
    },
    {
        display: 'ピャ',
        answer: "pya",
    },
    {
        display: 'ピュ',
        answer: "pyu",
    },
    {
        display: 'ピョ',
        answer: "pyo",
    },
]

export const numberCharactersMap: ICharacter[] = [
    {
        display: '< 10',
        answer: "< 10",
    },
    {
        display: '< 20',
        answer: "< 20",
    },
    {
        display: '< 100',
        answer: "< 100",
    },
    {
        display: '< 1000',
        answer: "< 1000",
    },
    {
        display: '< 10000',
        answer: "< 10000",
    },
    {
        display: '< 100000',
        answer: "< 100000",
    },
    {
        display: '< 1000000',
        answer: "< 1000000",
    },
]

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

