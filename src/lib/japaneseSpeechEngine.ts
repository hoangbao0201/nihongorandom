type SpeechListener = () => void;

export interface JapaneseSpeechState {
  isReady: boolean;
  isSpeaking: boolean;
}

let state: JapaneseSpeechState = { isReady: false, isSpeaking: false };
let japaneseVoice: SpeechSynthesisVoice | undefined;
let preloaded = false;
let warmedUp = false;
const listeners = new Set<SpeechListener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function setState(patch: Partial<JapaneseSpeechState>) {
  const next = { ...state, ...patch };
  if (next.isReady === state.isReady && next.isSpeaking === state.isSpeaking) {
    return;
  }
  state = next;
  notify();
}

function findJapaneseVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | undefined {
  return (
    voices.find((voice) => voice.lang === "ja-JP") ??
    voices.find((voice) => voice.lang.startsWith("ja"))
  );
}

function warmUpEngine() {
  if (
    warmedUp ||
    typeof window === "undefined" ||
    !window.speechSynthesis ||
    !japaneseVoice
  ) {
    return;
  }

  warmedUp = true;

  const utterance = new SpeechSynthesisUtterance("\u200B");
  utterance.lang = "ja-JP";
  utterance.voice = japaneseVoice;
  utterance.volume = 0;
  utterance.rate = 2;
  window.speechSynthesis.speak(utterance);
}

function syncVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  japaneseVoice = findJapaneseVoice(voices);

  const isReady = voices.length > 0;
  setState({ isReady });

  if (isReady) {
    warmUpEngine();
  }
}

export function preloadJapaneseSpeech() {
  if (preloaded || typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  preloaded = true;
  syncVoices();
  window.speechSynthesis.addEventListener("voiceschanged", syncVoices);
  window.speechSynthesis.getVoices();
}

export function subscribeJapaneseSpeech(listener: SpeechListener): () => void {
  preloadJapaneseSpeech();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getJapaneseSpeechState(): JapaneseSpeechState {
  return state;
}

export function speakJapanese(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) {
    return;
  }

  preloadJapaneseSpeech();
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 1.05;

  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  utterance.onstart = () => setState({ isSpeaking: true });
  utterance.onend = () => setState({ isSpeaking: false });
  utterance.onerror = () => setState({ isSpeaking: false });

  window.speechSynthesis.speak(utterance);
}

export function cancelJapaneseSpeech() {
  window.speechSynthesis?.cancel();
  setState({ isSpeaking: false });
}
