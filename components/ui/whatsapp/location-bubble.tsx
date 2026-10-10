"use client";

import * as React from "react";
import { Button } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import { type MessageStatus, MessageStatusIcon } from "./message-status";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface LocationBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  name?: string;
  address?: string;
  latitude: number;
  longitude: number;
  /** Static map preview image URL */
  mapImageUrl?: string;
  timestamp?: string;
  status?: MessageStatus;
  showTail?: boolean;
  /** Quoted message shown above the content, e.g. a ReplyPreview when this is a reply */
  quote?: React.ReactNode;
  onOpenMap?: () => void;
  /** Override the default Google Maps URL */
  mapsUrl?: string;
  /** Override the default `<a>` element for the CTA button (e.g. Next.js Link) */
  renderAction?: (props: { href: string; children: React.ReactNode; className: string; target?: string; rel?: string }) => React.ReactElement;
}

const LocationBubble = React.forwardRef<HTMLDivElement, LocationBubbleProps>(
  (
    {
      className,
      variant = "incoming",
      name,
      address,
      latitude,
      longitude,
      mapImageUrl,
      timestamp,
      status,
      showTail = false,
      quote,
      onOpenMap,
      mapsUrl: mapsUrlProp,
      renderAction,
      ...props
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const mapsUrl = mapsUrlProp ?? `https://www.google.com/maps?q=${latitude},${longitude}`;

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
          {/* Tail */}
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
          {/* Map preview */}
          <button
            type="button"
            onClick={onOpenMap ?? (() => window.open(mapsUrl, "_blank"))}
            className="relative block h-[160px] w-full overflow-hidden"
            aria-label="Open in Maps"
          >
            {mapImageUrl ? (
              <img src={mapImageUrl} alt="Map" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: "var(--wa-placeholder-bg)" }}>
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style={{ filter: "var(--wa-placeholder-icon)" }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
            )}
            {/* Timestamp overlay on map — only when no name/address */}
            {!name && !address && timestamp && (
              <div className="absolute bottom-[4px] right-[6px] flex items-center gap-[3px] rounded-full bg-black/45 px-[6px] py-[2px]">
                <span className="text-[11px] leading-[15px] text-white">{timestamp}</span>
                {isOutgoing && status && <MessageStatusIcon status={status} />}
              </div>
            )}
          </button>

          {/* Info — only when name or address exists */}
          {(name || address) && (
            <div className="px-[9px] pb-[7px] pt-[6px]">
              {name && (
                <p className="text-[14.2px] font-semibold leading-[19px] text-wa-text-primary">{name}</p>
              )}
              <p className="text-[13px] leading-[18px] text-wa-text-secondary">
                <span className="float-right ml-2 mt-[2px] flex items-center gap-[3px]">
                  {timestamp && (
                    <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>
                  )}
                  {isOutgoing && status && <MessageStatusIcon status={status} />}
                </span>
                {address || "\u00A0"}
              </p>
            </div>
          )}

          {/* Open in Maps CTA */}
          <div className="border-t border-wa-border">
            {renderAction ? (
              renderAction({
                href: mapsUrl,
                className: "flex w-full items-center justify-center gap-1.5 py-[10px] text-[14px] font-medium text-wa-emerald-500 transition-colors hover:bg-wa-hover",
                target: "_blank",
                rel: "noopener noreferrer",
                children: (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Open in Maps
                  </>
                ),
              })
            ) : (
              <Button
                render={<a href={mapsUrl} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
                className="flex w-full items-center justify-center gap-1.5 py-[10px] text-[14px] font-medium text-wa-emerald-500 transition-colors hover:bg-wa-hover"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Open in Maps
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
LocationBubble.displayName = "LocationBubble";

export { LocationBubble };
