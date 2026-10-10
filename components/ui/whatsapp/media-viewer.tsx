"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface MediaViewerItem {
  src: string;
  type?: "image" | "video";
  caption?: string;
}

export interface MediaViewerProps {
  items: MediaViewerItem[];
  /** Index of the open item, or null when closed */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  /** Shown in the top bar, e.g. the sender and time */
  title?: React.ReactNode;
}

function IconButton({ label, onClick, children, href, download }: { label: string; onClick?: () => void; children: React.ReactNode; href?: string; download?: boolean }) {
  const cls = "flex h-10 w-10 items-center justify-center rounded-full text-white/90 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-wa-emerald-500";
  return href ? (
    <a href={href} download={download} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>{children}</a>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>{children}</button>
  );
}

/**
 * Full-screen viewer for chat media, like tapping a photo in WhatsApp:
 * dark backdrop, caption, download, close on Escape or backdrop click,
 * and previous / next (buttons or arrow keys) when there are several items.
 *
 * @example
 * const [open, setOpen] = React.useState<number | null>(null);
 * <ImageBubble images={srcs} onMediaClick={(i) => setOpen(i)} />
 * <MediaViewer items={srcs.map((src) => ({ src }))} index={open} onIndexChange={setOpen} />
 */
function MediaViewer({ items, index, onIndexChange, title }: MediaViewerProps) {
  const item = index !== null ? items[index] : undefined;
  const many = items.length > 1;
  const go = React.useCallback(
    (delta: number) => index !== null && onIndexChange((index + delta + items.length) % items.length),
    [index, items.length, onIndexChange]
  );

  return (
    <Dialog.Root open={!!item} onOpenChange={(open) => !open && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[#0b141a] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          aria-label="Media viewer"
          onKeyDown={(e) => {
            if (!many) return;
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          className="font-wa fixed inset-0 z-50 flex flex-col outline-none"
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="min-w-0 flex-1 truncate text-[14px] text-white/90">{title}</div>
            {item && (
              <IconButton label="Download" href={item.src} download>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" /></svg>
              </IconButton>
            )}
            <Dialog.Close
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-wa-emerald-500"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z" /></svg>
            </Dialog.Close>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-12 pb-4"
            onClick={(e) => e.target === e.currentTarget && onIndexChange(null)}
          >
            {many && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <IconButton label="Previous" onClick={() => go(-1)}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z" /></svg>
                </IconButton>
              </div>
            )}
            {item?.type === "video" ? (
              <video src={item.src} controls autoPlay className="max-h-full max-w-full rounded" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              item && <img src={item.src} alt={item.caption ?? ""} className="max-h-full max-w-full object-contain" />
            )}
            {many && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <IconButton label="Next" onClick={() => go(1)}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M10 6 8.6 7.4l4.6 4.6-4.6 4.6L10 18l6-6z" /></svg>
                </IconButton>
              </div>
            )}
          </div>

          {(item?.caption || many) && (
            <div className={cn("px-4 pb-5 text-center text-[14px] text-white/90")}>
              {item?.caption}
              {many && index !== null && <span className="ml-2 text-white/50">{index + 1} / {items.length}</span>}
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { MediaViewer };
