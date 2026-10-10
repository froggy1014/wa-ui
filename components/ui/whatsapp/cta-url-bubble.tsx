"use client";

import * as React from "react";
import { Button } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import { type MessageStatus, MessageStatusIcon } from "./message-status";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface CtaUrlBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  body?: string;
  footer?: string;
  /** Button display text */
  displayText: string;
  /** Target URL — renders as <a> when provided */
  url?: string;
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
  /** Override the default `<a>` element for the CTA button (e.g. Next.js Link) */
  renderAction?: (props: { href: string; children: React.ReactNode; className: string; target?: string; rel?: string }) => React.ReactElement;
}

const CtaUrlBubble = React.forwardRef<HTMLDivElement, CtaUrlBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      body,
      footer,
      displayText,
      url,
      timestamp,
      status,
      showTail = false,
      renderAction,
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
        {...props}
        ref={ref}
      >
        <div
          className={cn(
            "font-wa relative w-full max-w-[320px] overflow-hidden rounded-lg",
            isOutgoing ? "bg-wa-bubble-outgoing" : "bg-wa-bubble-incoming",
            showTail && (isOutgoing ? "rounded-br-none" : "rounded-bl-none")
          )}
        >
          <div className="px-[9px] pb-[7px] pt-[6px]">
            {body && <p className="text-[14.2px] leading-[19px] text-wa-text-primary">{body}</p>}
            {footer && (
              <p className="mt-[4px] text-[12.5px] leading-[17px] text-wa-text-secondary">{footer}</p>
            )}
            <div className="mt-[2px] flex items-center justify-end gap-[3px]">
              {timestamp && <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>}
              {isOutgoing && status && <MessageStatusIcon status={status} />}
            </div>
          </div>

          <div className="border-t border-wa-border">
            {renderAction && url ? (
              renderAction({
                href: url,
                className: "flex w-full items-center justify-center gap-1.5 py-[10px] text-[14px] font-medium text-wa-emerald-500 transition-colors hover:bg-wa-hover",
                target: "_blank",
                rel: "noopener noreferrer",
                children: (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                    {displayText}
                  </>
                ),
              })
            ) : (
              <Button
                render={url ? <a href={url} target="_blank" rel="noopener noreferrer" /> : undefined}
                nativeButton={!url}
                className="flex w-full items-center justify-center gap-1.5 py-[10px] text-[14px] font-medium text-wa-emerald-500 transition-colors hover:bg-wa-hover"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                </svg>
                {displayText}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
CtaUrlBubble.displayName = "CtaUrlBubble";

export { CtaUrlBubble };
