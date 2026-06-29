"use client";

import { useEffect, useState } from "react";
import {
  onDisconnect,
  onValue,
  ref,
  remove,
  serverTimestamp,
  set,
} from "firebase/database";
import { getFirebaseDatabase } from "@/lib/firebase/client";

const SESSION_KEY = "nihongo-presence-session";

function getSessionId() {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const sessionId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function useOnlineCount() {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);

  useEffect(() => {
    const database = getFirebaseDatabase();
    if (!database) {
      return;
    }

    const sessionId = getSessionId();
    const presenceRef = ref(database, `presence/${sessionId}`);
    const connectedRef = ref(database, ".info/connected");
    const presenceListRef = ref(database, "presence");

    let isActive = true;

    const unsubscribeConnected = onValue(connectedRef, (snapshot) => {
      if (!isActive || snapshot.val() !== true) {
        return;
      }

      void onDisconnect(presenceRef)
        .remove()
        .then(() => set(presenceRef, { joinedAt: serverTimestamp() }))
        .catch(() => {});
    });

    const unsubscribePresence = onValue(presenceListRef, (snapshot) => {
      if (!isActive) {
        return;
      }

      setOnlineCount(snapshot.exists() ? snapshot.size : 0);
    });

    return () => {
      isActive = false;
      unsubscribeConnected();
      unsubscribePresence();
      void remove(presenceRef).catch(() => {});
    };
  }, []);

  return onlineCount;
}
