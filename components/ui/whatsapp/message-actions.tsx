"use client";

import * as React from "react";
import { ContextMenu } from "@base-ui/react/context-menu";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";

export interface MessageAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface MessageActionsProps {
  variant: "incoming" | "outgoing";
  /** The bubble the actions belong to */
  children: React.ReactNode;
  /** Menu rows below the reaction bar — e.g. Reply, Copy, Delete */
  actions?: MessageAction[];
  /** Called with the picked emoji, or "" when the current reaction is picked again (remove) */
  onReact?: (emoji: string) => void;
  /** The viewer's current reaction on this message — highlighted, and picking it again removes it */
  selectedReaction?: string;
  /** Emojis in the quick reaction bar */
  quickReactions?: string[];
  /** Emojis revealed by the "+" button. Pass [] to hide the button. */
  moreReactions?: string[];
  /** Turns off the context menu, long press, and hover button */
  disabled?: boolean;
  className?: string;
}

const DEFAULT_QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const DEFAULT_MORE_REACTIONS = [
  "😀", "😁", "😅", "🤣", "😊", "😍", "🥰", "😘",
  "😎", "🤔", "🤨", "😐", "🙄", "😴", "😭", "😡",
  "🤯", "🥳", "😱", "🤗", "👏", "🙌", "👌", "✌️",
  "🤝", "💪", "👀", "🔥", "✨", "🎉", "💯", "✅",
  "❌", "⭐", "💔", "💚", "🚀", "🙈", "👎", "🤷",
];

function SmileyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z" />
    </svg>
  );
}

function ActionsPopup({
  actions,
  onReact,
  selectedReaction,
  quickReactions,
  moreReactions,
  align,
}: Required<Pick<MessageActionsProps, "quickReactions" | "moreReactions">> &
  Pick<MessageActionsProps, "actions" | "onReact" | "selectedReaction"> & {
    align: "start" | "end";
  }) {
  const [expanded, setExpanded] = React.useState(false);

  const emojiItem = (emoji: string, size: "lg" | "sm") => {
    const selected = emoji === selectedReaction;
    return (
      <Menu.Item
        key={emoji}
        label={emoji}
        aria-label={selected ? `Remove reaction ${emoji}` : `React with ${emoji}`}
        onClick={() => onReact?.(selected ? "" : emoji)}
        className={cn(
          "flex shrink-0 cursor-pointer items-center justify-center rounded-full leading-none outline-none select-none",
          "transition-[transform,background-color] duration-100 hover:scale-110 data-[highlighted]:bg-wa-hover",
          size === "lg" ? "h-[38px] w-[38px] text-[24px]" : "h-[34px] w-[34px] text-[20px]",
          selected && "bg-wa-hover ring-2 ring-wa-emerald-500/60"
        )}
      >
        {emoji}
      </Menu.Item>
    );
  };

  return (
    <Menu.Portal>
      <Menu.Positioner side="bottom" align={align} sideOffset={6} collisionPadding={8} className="z-50">
        <Menu.Popup
          className={cn(
            "font-wa max-w-[calc(100vw-16px)] overflow-hidden rounded-xl bg-wa-panel-bg shadow-[0_4px_20px_rgba(11,20,26,0.3)] outline-none",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "transition-[opacity,transform] duration-150 ease-out"
          )}
        >
          {onReact && (
            <div role="group" aria-label="Reactions" className="flex items-center gap-[2px] px-2 py-[6px]">
              {quickReactions.map((e) => emojiItem(e, "lg"))}
              {moreReactions.length > 0 && (
                <Menu.Item
                  label="More reactions"
                  aria-label={expanded ? "Fewer reactions" : "More reactions"}
                  aria-expanded={expanded}
                  closeOnClick={false}
                  onClick={() => setExpanded((v) => !v)}
                  className={cn(
                    "ml-[2px] flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full outline-none select-none",
                    "bg-wa-hover text-wa-icon-default transition-colors data-[highlighted]:bg-wa-border"
                  )}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    {expanded ? <path d="M5 11h14v2H5z" /> : <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />}
                  </svg>
                </Menu.Item>
              )}
            </div>
          )}

          {onReact && expanded && (
            <div
              role="group"
              aria-label="More reactions"
              className="grid max-h-[180px] grid-cols-8 gap-[2px] overflow-y-auto border-t border-wa-border px-2 py-[6px]"
            >
              {moreReactions.map((e) => emojiItem(e, "sm"))}
            </div>
          )}

          {actions && actions.length > 0 && (
            <div className={cn("py-[6px]", onReact && "border-t border-wa-border")}>
              {actions.map((action) => (
                <Menu.Item
                  key={action.label}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 px-4 py-[10px]",
                    "text-[14.5px] text-wa-text-primary outline-none select-none",
                    "transition-colors data-[highlighted]:bg-wa-hover",
                    action.danger && "text-wa-text-critical",
                    action.disabled && "cursor-not-allowed opacity-40"
                  )}
                >
                  {action.icon && (
                    <span className={cn("shrink-0", action.danger ? "text-wa-text-critical" : "text-wa-icon-default")}>
                      {action.icon}
                    </span>
                  )}
                  {action.label}
                </Menu.Item>
              ))}
            </div>
          )}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}

/**
 * Message-level actions for any bubble: right click (desktop), long press
 * (touch), or the hover smiley button opens a WhatsApp-style menu with a
 * quick reaction bar and action rows such as Reply or Copy.
 *
 * @example
 * <MessageActions
 *   variant="incoming"
 *   selectedReaction="👍"
 *   onReact={(emoji) => react(id, emoji)}
 *   actions={[{ label: "Reply", icon: <Reply size={18} />, onClick: () => setReplyTo(id) }]}
 * >
 *   <ChatBubble variant="incoming">Hello</ChatBubble>
 * </MessageActions>
 */
const MessageActions = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  (
    {
      variant,
      children,
      actions,
      onReact,
      selectedReaction,
      quickReactions = DEFAULT_QUICK_REACTIONS,
      moreReactions = DEFAULT_MORE_REACTIONS,
      disabled = false,
      className,
    },
    ref
  ) => {
    const isOutgoing = variant === "outgoing";
    const hasMenu = !disabled && (!!onReact || (actions?.length ?? 0) > 0);
    const popupProps = { actions, onReact, selectedReaction, quickReactions, moreReactions };

    if (!hasMenu) {
      return (
        <div ref={ref} className={cn("flex w-full", isOutgoing ? "justify-end" : "justify-start", className)}>
          {children}
        </div>
      );
    }

    const hoverButton = (
      <Menu.Root>
        <Menu.Trigger
          aria-label="Message actions"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full",
            "bg-wa-panel-bg/80 text-wa-icon-default shadow-sm outline-none",
            "opacity-0 transition-opacity group-hover/message:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100",
            "focus-visible:ring-2 focus-visible:ring-wa-emerald-500",
            "[@media(hover:none)]:hidden"
          )}
        >
          <SmileyIcon />
        </Menu.Trigger>
        <ActionsPopup {...popupProps} align={isOutgoing ? "end" : "start"} />
      </Menu.Root>
    );

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger
          ref={ref}
          className={cn(
            "group/message flex w-full items-center gap-1",
            isOutgoing ? "justify-end" : "justify-start",
            className
          )}
        >
          {isOutgoing && hoverButton}
          {/* Width caps at the bubble limit of the whole row; inside, bubbles may fill it,
              otherwise their percentage max-width would resolve against this shrink-wrapped box. */}
          <div className="min-w-0 max-w-[var(--wa-msg-max-width)]">
            <div className="[--wa-msg-max-width:100%]">{children}</div>
          </div>
          {!isOutgoing && hoverButton}
        </ContextMenu.Trigger>
        <ActionsPopup {...popupProps} align="start" />
      </ContextMenu.Root>
    );
  }
);
MessageActions.displayName = "MessageActions";

export { MessageActions, DEFAULT_QUICK_REACTIONS, DEFAULT_MORE_REACTIONS };
