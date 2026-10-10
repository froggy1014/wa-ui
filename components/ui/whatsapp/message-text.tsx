"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";

const URL_RE = /\bhttps?:\/\/[^\s<]+[^\s<.,;:!?)"'\]]/g;
const BLOCK_RE = /```([\s\S]+?)```/g;
// WhatsApp only formats when the marker hugs the text and sits at a word boundary.
const INLINE_RE = /(^|[^\p{L}\p{N}])([*_~`])(?!\s)([^\n]*?[^\s])\2(?![\p{L}\p{N}])/gu;

const STYLES: Record<string, string> = {
  "*": "font-semibold",
  _: "italic",
  "~": "line-through",
  "`": "rounded bg-black/[0.06] px-1 font-mono text-[13px] dark:bg-white/[0.08]",
};

function formatInline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const [whole, lead, marker, inner] = m;
    const start = (m.index ?? 0) + lead.length;
    if (start > last) out.push(text.slice(last, start));
    const Tag = marker === "`" ? "code" : marker === "~" ? "s" : marker === "_" ? "em" : "strong";
    out.push(
      <Tag key={`${key}-${i++}`} className={STYLES[marker]}>
        {marker === "`" ? inner : formatInline(inner, `${key}-${i}`)}
      </Tag>
    );
    last = (m.index ?? 0) + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function formatText(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(URL_RE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(...formatInline(text.slice(last, start), `${key}-t${i}`));
    out.push(
      <a
        key={`${key}-u${i++}`}
        href={m[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-wa-sky-blue-400 underline-offset-2 hover:underline"
      >
        {m[0]}
      </a>
    );
    last = start + m[0].length;
  }
  if (last < text.length) out.push(...formatInline(text.slice(last), `${key}-t${i}`));
  return out;
}

/** WhatsApp text formatting: *bold*, _italic_, ~strike~, `code`, ```block``` and clickable links. */
export function formatWhatsAppText(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(BLOCK_RE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(...formatText(text.slice(last, start), `b${i}`));
    out.push(
      <code key={`block-${i++}`} className="my-1 block whitespace-pre-wrap rounded bg-black/[0.06] px-2 py-1 font-mono text-[13px] dark:bg-white/[0.08]">
        {m[1].replace(/^\n|\n$/g, "")}
      </code>
    );
    last = start + m[0].length;
  }
  if (last < text.length) out.push(...formatText(text.slice(last), `b${i}`));
  return out;
}

export interface MessageTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
}

/**
 * Message body text the way WhatsApp renders it: line breaks kept, links
 * clickable, and *bold* / _italic_ / ~strike~ / `code` / ```block``` applied.
 *
 * @example
 * <ChatBubble variant="incoming"><MessageText text="*Order* shipped: https://example.com" /></ChatBubble>
 */
const MessageText = React.forwardRef<HTMLSpanElement, MessageTextProps>(({ text, className, ...props }, ref) => (
  <span ref={ref} className={cn("whitespace-pre-wrap break-words", className)} {...props}>
    {formatWhatsAppText(text)}
  </span>
));
MessageText.displayName = "MessageText";

export { MessageText };
