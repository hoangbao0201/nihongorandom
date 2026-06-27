"use client";

import { useOnlineCount } from "@/src/hooks/useOnlinePresence";
import { isFirebaseConfigured } from "@/src/lib/firebase/client";

export default function OnlineCount() {
  const onlineCount = useOnlineCount();

  if (!isFirebaseConfigured()) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-xs text-white/80 shadow-lg backdrop-blur-sm"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span>
        {onlineCount === null
          ? "Đang kết nối..."
          : `${onlineCount.toLocaleString("vi-VN")} người đang online`}
      </span>
    </div>
  );
}
