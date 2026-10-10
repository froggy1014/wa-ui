"use client";

import * as React from "react";
import { Button } from "@base-ui/react/button";
import { Drawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";
import { type MessageStatus, MessageStatusIcon } from "./message-status";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface ListRow {
  id?: string;
  title: string;
  description?: string;
}

export interface ListSection {
  title?: string;
  rows: ListRow[];
}

export interface ListMessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  body: string;
  footer?: string;
  /** CTA button label */
  buttonLabel: string;
  sections: ListSection[];
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
  onRowSelect?: (row: ListRow) => void;
}

const ListMessageBubble = React.forwardRef<HTMLDivElement, ListMessageBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      body,
      footer,
      buttonLabel,
      sections,
      timestamp,
      status,
      showTail = false,
      onRowSelect,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const [open, setOpen] = React.useState(false);

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
            <p className="text-[14.2px] leading-[19px] text-wa-text-primary">{body}</p>
            {footer && (
              <p className="mt-[4px] text-[12.5px] leading-[17px] text-wa-text-secondary">{footer}</p>
            )}
            <div className="mt-[2px] flex items-center justify-end gap-[3px]">
              {timestamp && <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>}
              {isOutgoing && status && <MessageStatusIcon status={status} />}
            </div>
          </div>

          <div className="border-t border-wa-border">
            <Button
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 py-[10px] text-[14px] font-medium text-wa-emerald-500 transition-colors hover:bg-wa-hover"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
              {buttonLabel}
            </Button>
          </div>
        </div>

        {/* Bottom sheet */}
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Portal>
            <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
            <Drawer.Popup className="fixed bottom-0 left-0 right-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl bg-wa-panel-bg outline-none transition-transform duration-300 ease-out data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full">
              <div className="sticky top-0 flex justify-center bg-wa-panel-bg pt-3 pb-2">
                <div className="h-1 w-10 rounded-full bg-wa-gray-300" />
              </div>
              <Drawer.Title className="px-4 pb-3 text-[17px] font-semibold text-wa-text-primary">
                {buttonLabel}
              </Drawer.Title>
              <div className="pb-8">
                {sections.map((section, si) => (
                  <div key={si}>
                    {section.title && (
                      <p className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-wa-text-secondary">
                        {section.title}
                      </p>
                    )}
                    {section.rows.map((row, ri) => (
                      <button
                        key={row.id ?? ri}
                        type="button"
                        onClick={() => { onRowSelect?.(row); setOpen(false); }}
                        className="flex w-full flex-col px-4 py-3 text-left transition-colors hover:bg-wa-hover"
                      >
                        <span className="text-[15px] text-wa-text-primary">{row.title}</span>
                        {row.description && (
                          <span className="text-[13px] text-wa-text-secondary">{row.description}</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </Drawer.Popup>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    );
  }
);
ListMessageBubble.displayName = "ListMessageBubble";

export { ListMessageBubble };
