"use client";

import { useEffect, useRef, useState } from "react";

type AudioPlayButtonVariant = "button" | "player";

interface AudioPlayButtonProps {
  src: string;
  label?: string;
  variant?: AudioPlayButtonVariant;
  className?: string;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function PlayIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${className} ml-0.5`}
      aria-hidden
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function PauseIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function LoopIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function AudioPlayButtonCompact({
  src,
  label = "Phát âm",
}: Pick<AudioPlayButtonProps, "src" | "label">) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => {
      if (audio.paused) setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, [src]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        title={isPlaying ? "Tạm dừng" : label}
        aria-label={isPlaying ? "Tạm dừng" : label}
        className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent-soft)] transition-colors hover:bg-[var(--accent)]/20"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <audio ref={audioRef} src={src} preload="none" className="hidden" />
    </div>
  );
}

function AudioPlayButtonPlayer({
  src,
  label = "Nghe audio",
  className = "",
}: Pick<AudioPlayButtonProps, "src" | "label" | "className">) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loop, setLoop] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsSeeking(false);

    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.playbackRate = playbackRate;
    audio.loop = loop;
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = loop;
  }, [loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
      }
    };
    const handlePause = () => {
      if (audio.paused) setIsPlaying(false);
    };
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    if (audio.readyState >= 1) {
      setDuration(audio.duration || 0);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [src, isSeeking]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;

    const nextTime = (value / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`glass-panel w-full max-w-xl rounded-lg border border-white/10 px-3 py-3 sm:px-4 ${className}`.trim()}
    >
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          title={isPlaying ? "Tạm dừng" : label}
          aria-label={isPlaying ? "Tạm dừng" : label}
          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent-soft)] transition-colors hover:bg-[var(--accent)]/20"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-xs tabular-nums text-white/55">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              aria-label="Tua audio"
              onChange={(event) => {
                setIsSeeking(true);
                handleSeek(Number(event.target.value));
              }}
              onMouseUp={() => setIsSeeking(false)}
              onTouchEnd={() => setIsSeeking(false)}
              className="audio-player-seek h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--accent-soft)]"
            />
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-white/55">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-white/55">
              <span>Tốc độ</span>
              <select
                value={playbackRate}
                onChange={(event) => setPlaybackRate(Number(event.target.value))}
                aria-label="Tốc độ phát"
                className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none transition-colors hover:border-white/20"
              >
                {SPEED_OPTIONS.map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setLoop((value) => !value)}
              aria-pressed={loop}
              aria-label={loop ? "Tắt lặp lại" : "Bật lặp lại"}
              title={loop ? "Tắt lặp lại" : "Lặp lại liên tục"}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                loop
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/15 text-[var(--accent-soft)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              <LoopIcon className="h-3.5 w-3.5" />
              Lặp lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudioPlayButton({
  src,
  label,
  variant = "player",
  className,
}: AudioPlayButtonProps) {
  if (variant === "player") {
    return (
      <AudioPlayButtonPlayer src={src} label={label} className={className} />
    );
  }

  return <AudioPlayButtonCompact src={src} label={label} />;
}
