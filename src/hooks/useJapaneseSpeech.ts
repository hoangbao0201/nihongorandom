"use client";

import { useCallback, useEffect, useState } from "react";
import {
  cancelJapaneseSpeech,
  getJapaneseSpeechState,
  speakJapanese,
  subscribeJapaneseSpeech,
} from "@/src/lib/japaneseSpeechEngine";

export function useJapaneseSpeech() {
  const [{ isReady, isSpeaking }, setSnapshot] = useState(getJapaneseSpeechState);

  useEffect(() => {
    return subscribeJapaneseSpeech(() => {
      setSnapshot(getJapaneseSpeechState());
    });
  }, []);

  const speak = useCallback((text: string) => {
    speakJapanese(text);
  }, []);

  const cancel = useCallback(() => {
    cancelJapaneseSpeech();
  }, []);

  return { speak, cancel, isReady, isSpeaking };
}
