"use client";

import * as React from "react";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

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

/** WhatsApp's pending-message clock, shown until the server accepts the message. */
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 15" height="15" width="16" className={className} aria-label="Sending">
      <path d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z" fill="currentColor" />
    </svg>
  );
}

/**
 * Upload indicator for outgoing media that is still sending: dims the media and
 * shows WhatsApp's spinning ring. Place inside a `relative` media container.
 */
export function MediaSendingOverlay({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Sending"
      className={"absolute inset-0 z-[5] flex items-center justify-center bg-black/30 " + (className ?? "")}
    >
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-black/50">
        <svg viewBox="0 0 44 44" width="40" height="40" className="animate-spin" aria-hidden="true">
          <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/25" />
          <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="28 200" className="text-white" />
        </svg>
      </span>
    </div>
  );
}

/** Renders the appropriate status icon for a given MessageStatus. */
export function MessageStatusIcon({ status, className }: { status: MessageStatus; className?: string }) {
  switch (status) {
    case "sending":
      return <span className={className ?? "text-wa-bubble-meta"}><ClockIcon /></span>;
    case "sent":
      return <span className="text-wa-delivered opacity-75"><CheckIcon /></span>;
    case "delivered":
      return <span className="text-wa-delivered"><DoubleCheckIcon /></span>;
    case "read":
      return <span className="text-wa-read"><DoubleCheckIcon /></span>;
    case "failed":
      return (
        <span className="text-wa-text-critical">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </span>
      );
  }
}
