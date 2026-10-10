"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";
import { MediaSendingOverlay, type MessageStatus, MessageStatusIcon } from "./message-status";

interface ImageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  /** Single image (shorthand) */
  src?: string;
  /** Multiple image URLs — renders grid layout */
  images?: string[];
  alt?: string;
  caption?: string;
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
  /** Called when an image is clicked (e.g. open a MediaViewer) with its index and src */
  onMediaClick?: (index: number, src: string) => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 11" height="11" width="16" className={className}>
      <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.175a.463.463 0 0 0-.349-.158.467.467 0 0 0-.338.131.537.537 0 0 0-.14.353.54.54 0 0 0 .13.363l2.39 2.576a.465.465 0 0 0 .349.158.457.457 0 0 0 .368-.189l6.596-8.14a.504.504 0 0 0 .103-.36.516.516 0 0 0-.223-.271z" fill="currentColor" />
    </svg>
  );
}

function DoubleCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 11" height="11" width="16" className={className}>
      <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.175a.463.463 0 0 0-.349-.158.467.467 0 0 0-.338.131.537.537 0 0 0-.14.353.54.54 0 0 0 .13.363l2.39 2.576a.465.465 0 0 0 .349.158.457.457 0 0 0 .368-.189l6.596-8.14a.504.504 0 0 0 .103-.36.516.516 0 0 0-.223-.271z" fill="currentColor" />
      <path d="M15.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-1.2-1.298-.728.897 1.58 1.704a.465.465 0 0 0 .349.158.457.457 0 0 0 .368-.189l6.596-8.14a.504.504 0 0 0 .103-.36.516.516 0 0 0-.193-.484z" fill="currentColor" />
    </svg>
  );
}

// ─── Media cell with loading skeleton ────────────────────────────────────────

function ImageCell({
  src,
  overlay,
  className,
  naturalSize = false,
  onClick,
}: {
  src: string;
  overlay?: React.ReactNode;
  className?: string;
  naturalSize?: boolean;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    // The placeholder colour only shows while loading; transparent PNGs then sit on the bubble.
    <div
      className={cn("relative overflow-hidden", !loaded && "bg-wa-gray-800", onClick && "cursor-zoom-in", className)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? "Open image" : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick()) : undefined}
    >
      {!loaded && (
        <div className={cn("animate-pulse bg-wa-gray-700", naturalSize ? "min-h-[160px] w-full" : "absolute inset-0")} />
      )}

      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full object-cover transition-opacity duration-300",
          naturalSize ? "block max-h-[330px]" : "h-full",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />

      {overlay && <div className="absolute inset-0">{overlay}</div>}
    </div>
  );
}

// ─── Grid layouts ─────────────────────────────────────────────────────────────

function ImageGrid({ items, onOpen }: { items: string[]; onOpen?: (index: number) => void }) {
  const open = (i: number) => (onOpen ? () => onOpen(i) : undefined);
  const visible = items.slice(0, 4);
  const extra = items.length - 4;
  const count = visible.length;

  if (count === 1) {
    return <ImageCell src={visible[0]} className="w-full max-h-[330px]" naturalSize onClick={open(0)} />;
  }

  const cellClass = "h-[165px] w-[165px]";

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-[2px]">
        {visible.map((src, i) => (
          <ImageCell key={i} src={src} className={cellClass} onClick={open(i)} />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-[2px]">
        <ImageCell src={visible[0]} className="h-[332px] w-[165px]" onClick={open(0)} />
        <ImageCell src={visible[1]} className={cellClass} onClick={open(1)} />
        <ImageCell src={visible[2]} className={cellClass} onClick={open(2)} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[2px]">
      {visible.map((src, i) => {
        const isLast = i === 3 && extra > 0;
        return (
          <ImageCell
            key={i}
            src={src}
            className={cellClass}
            onClick={open(i)}
            overlay={
              isLast ? (
                <div className="flex h-full items-center justify-center bg-black/50">
                  <span className="text-[22px] font-semibold text-white">+{extra}</span>
                </div>
              ) : undefined
            }
          />
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ImageBubble = React.forwardRef<HTMLDivElement, ImageBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      src,
      images,
      alt = "",
      caption,
      timestamp,
      status,
      showTail = false,
      onMediaClick,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const items: string[] = images ?? (src ? [src] : []);

    const statusIcon = () => {
      if (!isOutgoing || !status) return null;
      if (status === "sending") return <MessageStatusIcon status="sending" className="text-white" />;
      if (status === "sent")
        return <span className="text-white opacity-75"><CheckIcon /></span>;
      if (status === "delivered")
        return <span className="text-white opacity-90"><DoubleCheckIcon /></span>;
      if (status === "read")
        return <span className="text-wa-read"><DoubleCheckIcon /></span>;
    };

    return (
      <div
        className={cn("flex w-full", isOutgoing ? "justify-end" : "justify-start", showTail ? "mb-[6px]" : "", className)}
        {...props}
        ref={ref}
      >
        <div
          className={cn(
            "font-wa relative max-w-[336px] overflow-hidden rounded-lg",
            showTail && (isOutgoing ? "rounded-br-[3px]" : "rounded-bl-[3px]")
          )}
        >
          {showTail && (
            <svg viewBox="0 0 8 13" width="8" height="13" className={cn("absolute bottom-0 z-10", isOutgoing ? "-right-[8px]" : "-left-[8px]")}>
              {isOutgoing
                ? <path d="M5.188 13H0V1.807l6.467 8.625C7.526 11.844 6.958 13 5.188 13z" className="fill-wa-bubble-outgoing" />
                : <path d="M1.533 10.432L8 1.807V13H2.812C1.042 13 .474 11.844 1.533 10.432z" className="fill-wa-bubble-incoming" />
              }
            </svg>
          )}

          {/* Media / Grid */}
          <div className="relative">
            <ImageGrid items={items} onOpen={onMediaClick ? (i) => onMediaClick(i, items[i]) : undefined} />
            {isOutgoing && status === "sending" && <MediaSendingOverlay />}

            {/* Timestamp overlay (no caption) */}
            {!caption && (
              <div className="absolute bottom-[6px] right-[8px] flex items-center gap-[3px] rounded-full bg-black/40 px-[6px] py-[2px]">
                {timestamp && <span className="text-[11px] leading-[15px] text-white">{timestamp}</span>}
                {statusIcon()}
              </div>
            )}
          </div>

          {/* Caption */}
          {caption && (
            <div className={cn("flow-root px-[9px] pb-2 pt-[4px]", isOutgoing ? "bg-wa-bubble-outgoing" : "bg-wa-bubble-incoming")}>
              <div className="float-right -mb-1 ml-2 mt-1 flex items-center gap-[3px]">
                {timestamp && <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>}
                {isOutgoing && status && (
                  status === "sending"
                    ? <MessageStatusIcon status="sending" />
                    : status === "read"
                    ? <span className="text-wa-read"><DoubleCheckIcon /></span>
                    : status === "delivered"
                    ? <span className="text-wa-delivered"><DoubleCheckIcon /></span>
                    : <span className="text-wa-delivered"><CheckIcon /></span>
                )}
              </div>
              <p className="text-[14.2px] leading-[19px] text-wa-text-primary">{caption}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ImageBubble.displayName = "ImageBubble";

export { ImageBubble, type ImageBubbleProps };
