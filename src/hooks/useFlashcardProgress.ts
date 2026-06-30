"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "flashcardKnown";

type KnownMap = Record<string, "known">;

function readStorage(): KnownMap {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as KnownMap;
    }
    return {};
  } catch {
    return {};
  }
}

export function useFlashcardProgress() {
  const [known, setKnown] = useState<KnownMap>({});

  useEffect(() => {
    setKnown(readStorage());
  }, []);

  const persist = useCallback((next: KnownMap) => {
    setKnown(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const isKnown = useCallback((id: string) => known[id] === "known", [known]);

  const markKnown = useCallback(
    (id: string) => {
      persist({ ...known, [id]: "known" });
    },
    [known, persist]
  );

  const markReview = useCallback(
    (id: string) => {
      const next = { ...known };
      delete next[id];
      persist(next);
    },
    [known, persist]
  );

  const reset = useCallback(
    (prefix?: string) => {
      if (!prefix) {
        persist({});
        return;
      }
      const next: KnownMap = {};
      for (const key of Object.keys(known)) {
        if (!key.startsWith(prefix)) {
          next[key] = known[key];
        }
      }
      persist(next);
    },
    [known, persist]
  );

  const knownCount = useCallback(
    (ids: string[]) =>
      ids.reduce((total, id) => (known[id] === "known" ? total + 1 : total), 0),
    [known]
  );

  return { isKnown, markKnown, markReview, reset, knownCount };
}
