"use client";

import * as React from "react";
import { Button } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import { type MessageStatus, MessageStatusIcon } from "./message-status";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface InteractiveButton {
  id?: string;
  title: string;
  disabled?: boolean;
}

export interface InteractiveButtonBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  /** Optional header — text string or media element */
  header?: React.ReactNode;
  body: string;
  footer?: string;
  /** Up to 3 reply buttons */
  buttons: InteractiveButton[];
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
  onButtonClick?: (button: InteractiveButton) => void;
}

const InteractiveButtonBubble = React.forwardRef<HTMLDivElement, InteractiveButtonBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      header,
      body,
      footer,
      buttons,
      timestamp,
      status,
      showTail = false,
      onButtonClick,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const capped = buttons.slice(0, 3);

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

          <div className="px-[9px] pb-[7px] pt-[6px]">
            {header && (
              <div className="mb-[6px] text-[14.2px] font-semibold leading-[19px] text-wa-text-primary">
                {header}
              </div>
            )}
            <p className="text-[14.2px] leading-[19px] text-wa-text-primary">{body}</p>
            {footer && (
              <p className="mt-[4px] text-[12.5px] leading-[17px] text-wa-text-secondary">{footer}</p>
            )}
            <div className="mt-[2px] flex items-center justify-end gap-[3px]">
              {timestamp && <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>}
              {isOutgoing && status && <MessageStatusIcon status={status} />}
            </div>
          </div>

          {capped.length > 0 && (
            <div className="border-t border-wa-border">
              {capped.map((btn, i) => (
                <div key={btn.id ?? i} className={cn(i > 0 && "border-t border-wa-border")}>
                  <Button
                    disabled={btn.disabled}
                    onClick={() => onButtonClick?.(btn)}
                    className="flex w-full items-center justify-center gap-1.5 py-[10px] text-[14px] font-medium text-wa-emerald-500 transition-colors hover:bg-wa-hover disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
                    </svg>
                    {btn.title}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
InteractiveButtonBubble.displayName = "InteractiveButtonBubble";

export { InteractiveButtonBubble };
