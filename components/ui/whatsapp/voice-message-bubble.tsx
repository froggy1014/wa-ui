"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";
import { type MessageStatus, MessageStatusIcon } from "./message-status";

interface VoiceMessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  duration: string;
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
  /** Quoted message shown above the content, e.g. a ReplyPreview when this is a reply */
  quote?: React.ReactNode;
  /** When provided, the component manages playback internally */
  audioSrc?: string;
  /** Avatar image shown on the left when playing (incoming) */
  avatarSrc?: string;
  /** Controlled mode — ignored when audioSrc is set */
  isPlaying?: boolean;
  progress?: number;
  onPlayPause?: () => void;
}

// Deterministic fake waveform bars
const WAVEFORM_BARS = [3, 5, 8, 6, 10, 7, 4, 9, 6, 5, 8, 10, 7, 4, 6, 9, 5, 8, 3, 6, 10, 7, 5, 8, 4, 9, 6, 7, 5, 8];

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={className}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
    </svg>
  );
}


const VoiceMessageBubble = React.forwardRef<HTMLDivElement, VoiceMessageBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      duration,
      timestamp,
      status,
      showTail = false,
      quote,
      audioSrc,
      avatarSrc,
      isPlaying: isPlayingProp = false,
      progress: progressProp = 0,
      onPlayPause,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [internalPlaying, setInternalPlaying] = React.useState(false);
    const [internalProgress, setInternalProgress] = React.useState(0);
    const [internalDuration, setInternalDuration] = React.useState(duration);

    // Use internal state when audioSrc provided, otherwise use props
    const isPlaying = audioSrc ? internalPlaying : isPlayingProp;
    const progress  = audioSrc ? internalProgress : progressProp;

    const handlePlayPause = () => {
      if (!audioSrc) { onPlayPause?.(); return; }
      const audio = audioRef.current;
      if (!audio) return;
      if (internalPlaying) { audio.pause(); } else { audio.play(); }
    };

    const playedBars = Math.floor((progress / 100) * WAVEFORM_BARS.length);
    const activeColor = isOutgoing ? "var(--wa-emerald-600)" : "var(--wa-emerald-500)";
    const inactiveColor = isOutgoing ? "rgba(0,128,105,0.35)" : "rgba(134,150,160,0.5)";

    return (
      <div
        className={cn(
          "flex w-full",
          isOutgoing ? "justify-end" : "justify-start",
          showTail ? "mb-[6px]" : "",
          className
        )}
        {...props}
        ref={ref}
      >
        {audioSrc && (
          <audio
            ref={audioRef}
            src={audioSrc}
            onPlay={() => setInternalPlaying(true)}
            onPause={() => setInternalPlaying(false)}
            onEnded={() => { setInternalPlaying(false); setInternalProgress(0); }}
            onTimeUpdate={() => {
              const audio = audioRef.current;
              if (!audio || !audio.duration) return;
              setInternalProgress((audio.currentTime / audio.duration) * 100);
            }}
            onLoadedMetadata={() => {
              const audio = audioRef.current;
              if (!audio || !audio.duration) return;
              const m = Math.floor(audio.duration / 60);
              const s = Math.floor(audio.duration % 60);
              setInternalDuration(`${m}:${s.toString().padStart(2, "0")}`);
            }}
          />
        )}
        <div
          className={cn(
            "font-wa relative max-w-[var(--wa-msg-max-width)] overflow-visible rounded-lg px-[9px] pb-2 pt-[8px]",
            isOutgoing ? "bg-wa-bubble-outgoing" : "bg-wa-bubble-incoming",
            showTail && (isOutgoing ? "rounded-br-[3px]" : "rounded-bl-[3px]")
          )}
        >
          {showTail && (
            <svg viewBox="0 0 8 13" width="8" height="13" className={cn("absolute bottom-0", isOutgoing ? "-right-[8px]" : "-left-[8px]")}>
              {isOutgoing ? (
                <path d="M5.188 13H0V1.807l6.467 8.625C7.526 11.844 6.958 13 5.188 13z" className="fill-wa-bubble-outgoing" />
              ) : (
                <path d="M1.533 10.432L8 1.807V13H2.812C1.042 13 .474 11.844 1.533 10.432z" className="fill-wa-bubble-incoming" />
              )}
            </svg>
          )}

          {quote}
          <div className="flex items-center gap-[8px]">
            {/* Avatar (shown when playing) or play/pause button */}
            <div className="relative shrink-0 h-[40px] w-[40px]">
              {avatarSrc && (
                <div
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-full transition-opacity duration-200",
                    isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <button
                type="button"
                onClick={handlePlayPause}
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full text-white transition-all duration-200",
                  isOutgoing
                    ? "bg-wa-emerald-600 hover:bg-wa-emerald-500"
                    : "bg-wa-emerald-500 hover:bg-wa-emerald-400",
                  avatarSrc && isPlaying && "opacity-0 hover:opacity-80"
                )}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>

            {/* Waveform + duration */}
            <div className="flex flex-col gap-[4px] overflow-hidden min-w-0 flex-1">
              {/* Waveform bars */}
              <div className="flex items-center gap-[2px] overflow-hidden" style={{ height: 20 }}>
                {WAVEFORM_BARS.map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full transition-colors"
                    style={{
                      height: `${Math.round((h / 10) * 20)}px`,
                      backgroundColor: i < playedBars ? activeColor : inactiveColor,
                    }}
                  />
                ))}
              </div>

              {/* Duration */}
              <span className="text-[12px] leading-[16px] text-wa-text-secondary">
                {isPlaying
                  ? formatProgress(progress, internalDuration)
                  : internalDuration}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="float-right -mb-1 ml-2 mt-0.5 flex items-center gap-[3px]">
            {timestamp && (
              <span className="text-[11px] leading-[15px] text-wa-bubble-meta">
                {timestamp}
              </span>
            )}
            {isOutgoing && status && <MessageStatusIcon status={status} />}
          </div>
        </div>
      </div>
    );
  }
);
VoiceMessageBubble.displayName = "VoiceMessageBubble";

function formatProgress(progress: number, totalDuration: string): string {
  const parts = totalDuration.split(":").map(Number);
  const totalSeconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
  const elapsed = Math.floor((progress / 100) * totalSeconds);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export { VoiceMessageBubble, type VoiceMessageBubbleProps };
