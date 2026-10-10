"use client";

import * as React from "react";
import { Button } from "@base-ui/react/button";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";
import { type MessageStatus, MessageStatusIcon } from "./message-status";

// ─── Types ────────────────────────────────────────────────────────────────────

type HeaderType = "text" | "image" | "video" | "document" | "location";

interface LocationHeader {
  name: string;
  address: string;
  imageUrl?: string;
}

interface TemplateHeader {
  type: HeaderType;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  documentName?: string;
  location?: LocationHeader;
}

export type TemplateButton =
  // CTA — opens URL in browser
  | { type: "url";          label: string; url?: string }
  // CTA — initiates phone call
  | { type: "phone_number"; label: string; phone_number?: string }
  // User reply with pre-set text
  | { type: "quick_reply";  label: string }
  // Copies a coupon/promo code to clipboard
  | { type: "copy_code";    label?: string; code?: string }
  // Opens a WhatsApp Flow
  | { type: "flow";         label: string }
  // Opens a WhatsApp Catalog
  | { type: "catalog";      label?: string }
  // One-tap autofill OTP (authentication templates)
  | { type: "otp";          label?: string }
  // Calling permission request (custom display type)
  | { type: "call_permission"; bizName: string };

export interface TemplateBubbleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "incoming" | "outgoing";
  header?: TemplateHeader;
  body: string;
  footer?: string;
  buttons?: TemplateButton[];
  timestamp?: string;
  /** Delivery status ticks, shown for outgoing templates */
  status?: MessageStatus;
  /** Override the default `<a>` element for URL/phone buttons (e.g. Next.js Link) */
  renderAction?: (props: { href: string; children: React.ReactNode; className: string; target?: string; rel?: string }) => React.ReactElement;
}

// ─── Variable highlighting ─────────────────────────────────────────────────

function BodyText({ text }: { text: string }) {
  const parts = text.split(/(\{\{[^}]+\}\}|\{[^}]+\})/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\{/.test(part) ? (
          <span key={i} className="text-wa-emerald-600">
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

// ─── Header variants ──────────────────────────────────────────────────────────

function ImageHeader({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="h-[180px] w-full overflow-hidden rounded-t-lg" style={{ backgroundColor: "var(--wa-placeholder-bg)" }}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <img src="/wa-header-image.png" width={60} height={60} alt="" style={{ filter: "var(--wa-placeholder-icon)" }} />
        </div>
      )}
    </div>
  );
}

function VideoHeader({ videoUrl }: { videoUrl?: string }) {
  return (
    <div className="h-[180px] w-full overflow-hidden rounded-t-lg" style={{ backgroundColor: "var(--wa-placeholder-bg)" }}>
      {videoUrl ? (
        <video src={videoUrl} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <img src="/wa-header-video.png" width={60} height={60} alt="" />
        </div>
      )}
    </div>
  );
}

function DocumentHeader({ documentName }: { documentName?: string }) {
  return (
    <div className="flex h-[130px] w-full flex-col items-center justify-center gap-2 rounded-t-lg" style={{ backgroundColor: "var(--wa-placeholder-bg)" }}>
      <img src="/wa-header-document.png" width={52} height={52} alt="" style={{ filter: "var(--wa-placeholder-icon)" }} />
      {documentName && (
        <span className="text-[12px]" style={{ color: "var(--wa-icon-lighter)" }}>{documentName}</span>
      )}
    </div>
  );
}

function LocationHeader({ location }: { location?: LocationHeader }) {
  return (
    <div className="relative h-[160px] w-full overflow-hidden rounded-t-lg" style={{ backgroundColor: "var(--wa-placeholder-bg)" }}>
      {location?.imageUrl ? (
        <img src={location.imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <img src="/wa-header-location.png" width={60} height={60} alt="" style={{ filter: "var(--wa-placeholder-icon)" }} />
        </div>
      )}
      {(location?.name || location?.address) && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-3 py-2">
          {location.name && (
            <p className="text-[13px] font-medium text-white"><BodyText text={location.name} /></p>
          )}
          {location.address && (
            <p className="text-[12px] text-white/80"><BodyText text={location.address} /></p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ICONS: Partial<Record<TemplateButton["type"], React.ReactNode>> = {
  url:          <img src="/wa-icon-url.png"   width={16} height={16} alt="" style={{ filter: "var(--wa-btn-icon-filter)" }} />,
  phone_number: <img src="/wa-icon-phone.png" width={16} height={16} alt="" style={{ filter: "var(--wa-btn-icon-filter)" }} />,
  quick_reply:  <img src="/wa-icon-phone.png" width={16} height={16} alt="" style={{ filter: "var(--wa-btn-icon-filter)" }} />,
  flow:         <img src="/wa-icon-flow.png"  width={16} height={16} alt="" style={{ filter: "var(--wa-btn-icon-filter)" }} />,
  catalog:      <img src="/wa-icon-url.png"   width={16} height={16} alt="" style={{ filter: "var(--wa-btn-icon-filter)" }} />,
  // copy_code / otp — inline SVG clipboard icon
  copy_code: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ filter: "var(--wa-btn-icon-filter)" }}>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  ),
  otp: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ filter: "var(--wa-btn-icon-filter)" }}>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
  ),
};

// ─── Buttons ──────────────────────────────────────────────────────────────────

function TemplateButtonRow({ button, renderAction }: { button: TemplateButton; renderAction?: TemplateBubbleProps["renderAction"] }) {
  const [copied, setCopied] = React.useState(false);
  const base = "flex w-full items-center justify-center gap-1.5 py-[10px] text-[14px] font-medium text-wa-emerald-500";

  if (button.type === "call_permission") {
    return (
      <Button className={cn(base, "flex-col gap-0.5 py-3 text-wa-text-primary")}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wa-emerald-500 text-white">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </div>
          <span className="text-[14px] font-medium">
            Can <span className="font-semibold">{button.bizName}</span> call you?
          </span>
        </div>
      </Button>
    );
  }

  const label =
    button.type === "copy_code" ? (button.label ?? "Copy offer code") :
    button.type === "otp"       ? (button.label ?? "Copy code") :
    button.type === "catalog"   ? (button.label ?? "View catalog") :
    "label" in button           ? button.label : "";

  const isCopyType = button.type === "copy_code" || button.type === "otp";
  const copyCode = isCopyType && "code" in button ? button.code : undefined;

  const handleClick = copyCode
    ? () => {
        navigator.clipboard.writeText(copyCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    : undefined;

  const buttonContent = (
    <>
      {copied ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ filter: "var(--wa-btn-icon-filter)" }}>
          <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
      ) : (
        ICONS[button.type] ?? null
      )}
      {copied ? "Copied!" : label}
    </>
  );

  // Use renderAction if provided for link-type buttons
  const href = button.type === "url" && button.url ? button.url
    : button.type === "phone_number" && button.phone_number ? `tel:${button.phone_number}`
    : undefined;

  if (renderAction && href) {
    return renderAction({
      href,
      children: buttonContent,
      className: base,
      ...(button.type === "url" ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    });
  }

  const renderEl = (() => {
    if (button.type === "url" && button.url)
      return <a href={button.url} target="_blank" rel="noopener noreferrer" />;
    if (button.type === "phone_number" && button.phone_number)
      return <a href={`tel:${button.phone_number}`} />;
    return undefined;
  })();

  return (
    <Button
      render={renderEl}
      nativeButton={renderEl == null}
      className={base}
      onClick={handleClick}
    >
      {buttonContent}
    </Button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TemplateBubble = React.forwardRef<HTMLDivElement, TemplateBubbleProps>(
  ({ className, variant = "incoming", header, body, footer, buttons = [], timestamp, status, renderAction, ...props }, ref) => {
    const hasButtons = buttons.length > 0;
    const isOutgoing = variant === "outgoing";

    return (
      <div
        ref={ref}
        className={cn("font-wa w-full min-w-[200px] max-w-[320px]", className)}
        {...props}
      >
        {/* Bubble */}
        <div className={cn("overflow-hidden rounded-lg shadow-sm", isOutgoing ? "bg-wa-bubble-outgoing" : "bg-wa-bubble-incoming")}>
          {/* Header */}
          {header?.type === "image" && <ImageHeader imageUrl={header.imageUrl} />}
          {header?.type === "video" && <VideoHeader videoUrl={header.videoUrl} />}
          {header?.type === "document" && <DocumentHeader documentName={header.documentName} />}
          {header?.type === "location" && <LocationHeader location={header.location} />}

          {/* Body */}
          <div className="px-[9px] pb-[7px] pt-[6px]">
            {header?.type === "text" && header.text && (
              <p className="mb-1 text-[14.2px] font-bold leading-[19px] text-wa-text-primary">
                <BodyText text={header.text} />
              </p>
            )}
            <p className="text-[14.2px] leading-[19px] text-wa-text-primary">
              <BodyText text={body} />
            </p>
            {footer && (
              <p className="mt-1 text-[12px] leading-[16px] text-wa-text-secondary">
                {footer}
              </p>
            )}
            {timestamp && (
              <div className="mt-[2px] flex items-center justify-end gap-[3px]">
                <span className="text-[11px] leading-[15px] text-wa-bubble-meta">{timestamp}</span>
                {variant === "outgoing" && status && <MessageStatusIcon status={status} />}
              </div>
            )}
          </div>

          {/* Buttons */}
          {hasButtons && (
            <div className="border-t border-wa-border">
              {buttons.map((btn, i) => (
                <div key={i} className={cn(i > 0 && "border-t border-wa-border")}>
                  <TemplateButtonRow button={btn} renderAction={renderAction} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);
TemplateBubble.displayName = "TemplateBubble";

export { TemplateBubble };
