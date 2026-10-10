"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MediaSendingOverlay, type MessageStatus, MessageStatusIcon } from "./message-status";
import "@/components/ui/whatsapp/styles/whatsapp.css";

interface VideoBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  src: string;
  caption?: string;
  /** e.g. "0:42" */
  duration?: string;
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
}

const VideoBubble = React.forwardRef<HTMLDivElement, VideoBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      src,
      caption,
      duration,
      timestamp,
      status,
      showTail = false,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [loaded, setLoaded] = React.useState(false);
    const [playing, setPlaying] = React.useState(false);

    const togglePlay = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play();
        setPlaying(true);
      } else {
        video.pause();
        setPlaying(false);
      }
    };

    const handleEnded = () => setPlaying(false);

    return (
      <div
        className={cn(
          "flex w-full",
          isOutgoing ? "justify-end" : "justify-start",
          showTail ? "mb-[6px]" : "mb-[2px]",
          className
        )}
        {...props}
        ref={ref}
      >
        <div
          className={cn(
            "font-wa relative max-w-[336px] overflow-hidden rounded-lg",
            showTail && (isOutgoing ? "rounded-br-[3px]" : "rounded-bl-[3px]")
          )}
        >
          {/* Video */}
          <div className="relative cursor-pointer bg-wa-gray-800" onClick={togglePlay}>
            {!loaded && (
              <div className="flex h-[200px] w-[336px] items-center justify-center">
                <div className="animate-pulse bg-wa-gray-700 absolute inset-0" />
              </div>
            )}

            <video
              ref={videoRef}
              src={src}
              onLoadedData={() => setLoaded(true)}
              onEnded={handleEnded}
              playsInline
              preload="metadata"
              className={cn(
                "w-full max-h-[330px] object-cover transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0"
              )}
            />

            {isOutgoing && status === "sending" && <MediaSendingOverlay />}

            {/* Play button overlay */}
            {loaded && !playing && status !== "sending" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Duration badge */}
            {duration && loaded && !playing && (
              <span className="absolute bottom-[6px] left-[6px] rounded bg-black/50 px-[5px] py-[2px] text-[11px] font-medium text-white">
                {duration}
              </span>
            )}

            {/* Timestamp overlay (no caption) */}
            {!caption && loaded && (
              <div className="absolute bottom-[6px] right-[8px] flex items-center gap-[3px] rounded-full bg-black/40 px-[6px] py-[2px]">
                {timestamp && <span className="text-[11px] leading-[15px] text-white">{timestamp}</span>}
                {isOutgoing && status && (
                  <span className="text-white"><MessageStatusIcon status={status} className="text-white" /></span>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          {caption && (
            <div className={cn("px-[9px] pb-[7px] pt-[4px]", isOutgoing ? "bg-wa-bubble-outgoing" : "bg-wa-bubble-incoming")}>
              <p className="text-[14.2px] leading-[19px] text-wa-text-primary">{caption}</p>
              <div className="mt-[2px] flex items-center justify-end gap-[3px]">
                {timestamp && <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>}
                {isOutgoing && status && <MessageStatusIcon status={status} />}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
VideoBubble.displayName = "VideoBubble";

export { VideoBubble, type VideoBubbleProps };
