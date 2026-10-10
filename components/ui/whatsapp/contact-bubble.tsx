"use client";

import * as React from "react";
import { Button } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import { type MessageStatus, MessageStatusIcon } from "./message-status";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface ContactItem {
  /** Formatted display name */
  name: string;
  phones?: string[];
  avatar?: string;
  company?: string;
}

export interface ContactBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  contacts: ContactItem[];
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
  /** Quoted message shown above the content, e.g. a ReplyPreview when this is a reply */
  quote?: React.ReactNode;
  onMessageContact?: (contact: ContactItem) => void;
  onAddContact?: (contact: ContactItem) => void;
}

const AVATAR_COLORS = [
  "#dba685","#53a6fd","#25d366","#fc9775",
  "#ff72a1","#a791ff","#fb5061","#53bdeb",
  "#42c7b8","#ffd279",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function ContactRow({ contact }: { contact: ContactItem }) {
  return (
    <div className="flex items-center gap-3 px-[9px] py-[10px]">
      <div
        className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
        style={{ backgroundColor: contact.avatar ? undefined : getAvatarColor(contact.name) }}
      >
        {contact.avatar
          ? <img src={contact.avatar} alt={contact.name} className="h-full w-full rounded-full object-cover" />
          : getInitials(contact.name)
        }
      </div>
      <div className="min-w-0">
        <p className="text-[14.2px] font-medium leading-[19px] text-wa-text-primary">{contact.name}</p>
        {contact.company && (
          <p className="text-[12px] leading-[16px] text-wa-text-secondary">{contact.company}</p>
        )}
        {contact.phones?.[0] && (
          <p className="text-[12px] leading-[16px] text-wa-text-secondary">{contact.phones[0]}</p>
        )}
      </div>
    </div>
  );
}

const ContactBubble = React.forwardRef<HTMLDivElement, ContactBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      contacts,
      timestamp,
      status,
      showTail = false,
      quote,
      onMessageContact,
      onAddContact,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const primary = contacts[0];
    const extra = contacts.length - 1;

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
            "font-wa relative w-[280px] overflow-hidden rounded-lg",
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

          {quote && (
            <div className={cn("px-[3px] pt-[3px]", isOutgoing ? "bg-wa-bubble-outgoing" : "bg-wa-bubble-incoming")}>{quote}</div>
          )}
          {/* Primary contact */}
          <ContactRow contact={primary} />

          {/* +N more */}
          {extra > 0 && (
            <p className="px-[9px] pb-[6px] text-[13px] text-wa-text-secondary">
              +{extra} more contact{extra > 1 ? "s" : ""}
            </p>
          )}

          {/* Timestamp */}
          <div className="flex justify-end px-[9px] pb-[7px]">
            <div className="flex items-center gap-[3px]">
              {timestamp && <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>}
              {isOutgoing && status && <MessageStatusIcon status={status} />}
            </div>
          </div>

          {/* Actions */}
          {(onMessageContact || onAddContact) && (
            <div className="flex border-t border-wa-border">
              {onMessageContact && (
                <Button
                  onClick={() => onMessageContact(primary)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 py-[10px] text-[13px] font-medium text-wa-emerald-500 hover:bg-wa-hover",
                    onAddContact && "border-r border-wa-border"
                  )}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  Message
                </Button>
              )}
              {onAddContact && (
                <Button
                  onClick={() => onAddContact(primary)}
                  className="flex flex-1 items-center justify-center gap-1 py-[10px] text-[13px] font-medium text-wa-emerald-500 hover:bg-wa-hover"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Add
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
ContactBubble.displayName = "ContactBubble";

export { ContactBubble };
