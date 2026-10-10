"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ReplyPreview, type ReplyPreviewProps } from "./reply-preview";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface ReplyBarProps
  extends Pick<ReplyPreviewProps, "author" | "authorColor" | "body" | "mediaType" | "mediaThumb">,
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Called by the close button and the Escape key */
  onCancel?: () => void;
  /** Called when the quoted strip is clicked — e.g. scroll to the original message */
  onQuoteClick?: () => void;
}

/**
 * "Replying to…" strip shown above the message input while composing a reply.
 * Escape inside the bar (or the ✕ button) cancels the reply.
 *
 * @example
 * {replyTo && (
 *   <ReplyBar author="Alice" body={replyTo.text} onCancel={() => setReplyTo(null)} />
 * )}
 * <MessageInput … />
 */
const ReplyBar = React.forwardRef<HTMLDivElement, ReplyBarProps>(
  (
    { className, author, authorColor, body, mediaType, mediaThumb, onCancel, onQuoteClick, onKeyDown, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={author ? `Replying to ${author}` : "Replying"}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === "Escape" && onCancel) onCancel();
        }}
        className={cn(
          "font-wa flex items-center gap-2 bg-wa-compose-bg px-[10px] pt-[6px]",
          "animate-in fade-in-0 slide-in-from-bottom-2 duration-150",
          className
        )}
        {...props}
      >
        <ReplyPreview
          className="mb-0 flex-1 bg-wa-input-bg"
          author={author}
          authorColor={authorColor}
          body={body}
          mediaType={mediaType}
          mediaThumb={mediaThumb}
          onClick={onQuoteClick}
        />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel reply"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-wa-icon-default transition-colors hover:bg-wa-hover focus-visible:outline-2 focus-visible:outline-wa-emerald-500"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
ReplyBar.displayName = "ReplyBar";

export { ReplyBar };
