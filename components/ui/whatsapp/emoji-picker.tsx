"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface EmojiCategory {
  label: string;
  emojis: string[];
}

export interface EmojiPickerProps {
  /** Called for every emoji picked; the picker stays open so several can be added */
  onSelect: (emoji: string) => void;
  /** Defaults to a compact WhatsApp-like set */
  categories?: EmojiCategory[];
  disabled?: boolean;
  /** Trigger content — defaults to the smiley icon */
  trigger?: React.ReactNode;
  className?: string;
}

const DEFAULT_EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    label: "Smileys",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘",
      "😋", "😛", "😜", "🤪", "🤗", "🤭", "🤫", "🤔", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😌",
      "😔", "😪", "😴", "😷", "🤒", "🥵", "🥶", "😵", "🤯", "🥳", "😎", "🤓", "😕", "😟", "😮", "😲",
      "🥺", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "😤", "😡", "😠", "🤬", "😈", "💀",
    ],
  },
  {
    label: "Gestures",
    emojis: [
      "👋", "🤚", "✋", "👌", "🤌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👍", "👎",
      "✊", "👊", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "👀", "🧠", "🫶",
    ],
  },
  {
    label: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖"],
  },
  {
    label: "Objects",
    emojis: [
      "🔥", "✨", "⭐", "🌟", "💯", "✅", "❌", "⚠️", "🎉", "🎊", "🎁", "🏆", "🚀", "💡", "📌", "📎",
      "📷", "🎬", "🎧", "📱", "💻", "⏰", "📅", "💬", "☕", "🍕", "🍔", "🍺", "🌈", "☀️", "🌙", "⚡",
    ],
  },
];

function SmileyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z" />
    </svg>
  );
}

/**
 * WhatsApp-style emoji button for the compose bar. Opens a popover grid grouped
 * by category; it stays open while picking so several emojis can be added.
 *
 * @example
 * <MessageInput
 *   value={text}
 *   onValueChange={setText}
 *   leftActions={<EmojiPicker onSelect={(e) => setText((t) => t + e)} />}
 * />
 */
function EmojiPicker({
  onSelect,
  categories = DEFAULT_EMOJI_CATEGORIES,
  disabled = false,
  trigger,
  className,
}: EmojiPickerProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        disabled={disabled}
        aria-label="Emoji"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full p-[5px] text-wa-icon-default outline-none transition-colors",
          "hover:text-wa-icon-lighter data-[popup-open]:text-wa-emerald-500 focus-visible:ring-2 focus-visible:ring-wa-emerald-500",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
      >
        {trigger ?? <SmileyIcon />}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top" align="start" sideOffset={10} collisionPadding={8} className="z-50">
          <Popover.Popup
            aria-label="Emoji picker"
            className={cn(
              "font-wa w-[340px] max-w-[calc(100vw-16px)] overflow-hidden rounded-xl bg-wa-panel-bg shadow-[0_4px_20px_rgba(11,20,26,0.3)] outline-none",
              "data-[starting-style]:translate-y-1 data-[starting-style]:opacity-0",
              "data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0",
              "transition-[opacity,transform] duration-150 ease-out"
            )}
          >
            <div className="max-h-[300px] overflow-y-auto px-2 pb-2">
              {categories.map((category) => (
                <section key={category.label} aria-label={category.label}>
                  <p className="sticky top-0 bg-wa-panel-bg px-1 pb-1 pt-2 text-[12px] font-medium text-wa-text-secondary">
                    {category.label}
                  </p>
                  <div className="grid grid-cols-8 gap-[2px]">
                    {category.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        aria-label={emoji}
                        onClick={() => onSelect(emoji)}
                        className="flex h-[36px] w-full items-center justify-center rounded-lg text-[22px] leading-none outline-none transition-[transform,background-color] duration-100 hover:scale-110 hover:bg-wa-hover focus-visible:bg-wa-hover"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { EmojiPicker, DEFAULT_EMOJI_CATEGORIES };
