"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { type MessageStatus, MessageStatusIcon } from "./message-status";
import { ReplyPreview } from "./reply-preview";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export type InteractiveReplyType =
  | "button_reply"
  | "list_reply"
  | "nfm_reply"
  | "button"
  | string;

export interface InteractiveReplyBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  /** The reply title or text shown by the user */
  title: string;
  /** Subtype — e.g. "button_reply", "list_reply", "nfm_reply" */
  replyType?: InteractiveReplyType;
  /** Optional description (for list replies) */
  description?: string;
  /** Author of the quoted message, e.g. "You" */
  quotedAuthor?: string;
  /** Accent color for the quote bar and author name */
  quotedAuthorColor?: string;
  /** Body of the message being replied to */
  quotedText?: string;
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
}

/**
 * A button/list reply as WhatsApp renders it: a quote of the message the
 * user tapped, followed by the chosen option as plain text.
 */
const InteractiveReplyBubble = React.forwardRef<HTMLDivElement, InteractiveReplyBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      title,
      replyType,
      description,
      quotedAuthor,
      quotedAuthorColor,
      quotedText,
      timestamp,
      status,
      showTail = false,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";

    return (
      <div
        className={cn(
          "flex w-full",
          isOutgoing ? "justify-end" : "justify-start",
          showTail ? "mb-[6px]" : "mb-[2px]",
          className
        )}
        data-reply-type={replyType}
        {...props}
        ref={ref}
      >
        <div
          className={cn(
            "font-wa relative max-w-[60%] overflow-visible rounded-lg px-3 pb-[7px] pt-[6px]",
            quotedText && "min-w-[180px] px-[6px] pt-[6px]",
            isOutgoing ? "bg-wa-bubble-outgoing" : "bg-wa-bubble-incoming",
            showTail && (isOutgoing ? "rounded-br-none" : "rounded-bl-none")
          )}
        >
          {showTail && isOutgoing && (
            <svg viewBox="0 0 8 13" width="8" height="13" className="absolute bottom-0 -right-[8px]">
              <path opacity="0.13" d="M5.188 12H0V0.807l6.467 8.625C7.526 10.844 6.958 12 5.188 12z" className="fill-wa-always-black" />
              <path d="M5.188 13H0V1.807l6.467 8.625C7.526 11.844 6.958 13 5.188 13z" className="fill-wa-bubble-outgoing" />
            </svg>
          )}
          {showTail && !isOutgoing && (
            <svg viewBox="0 0 8 13" width="8" height="13" className="absolute bottom-0 -left-[8px]">
              <path opacity="0.13" d="M2.812 12H8V0.807L1.533 9.432C0.474 10.844 1.042 12 2.812 12z" className="fill-wa-always-black" />
              <path d="M2.812 13H8V1.807L1.533 10.432C0.474 11.844 1.042 13 2.812 13z" className="fill-wa-bubble-incoming" />
            </svg>
          )}

          {quotedText && (
            <ReplyPreview
              className="mb-[4px]"
              author={quotedAuthor || "You"}
              authorColor={quotedAuthorColor}
              body={quotedText}
            />
          )}

          <div className={cn(quotedText && "px-[6px]")}>
            <p className="whitespace-pre-wrap break-words text-[14.2px] leading-[19px] text-wa-text-primary">
              {title}
            </p>

            {description && (
              <p className="mt-[2px] text-[12.5px] leading-[17px] text-wa-text-secondary">
                {description}
              </p>
            )}

            <div className="mt-[2px] flex items-center justify-end gap-[3px]">
              {timestamp && (
                <span className="text-[11px] leading-[15px] text-wa-bubble-meta">
                  {timestamp}
                </span>
              )}
              {isOutgoing && status && <MessageStatusIcon status={status} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
InteractiveReplyBubble.displayName = "InteractiveReplyBubble";

export { InteractiveReplyBubble };
