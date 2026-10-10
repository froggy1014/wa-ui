"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import "@/components/ui/whatsapp/styles/whatsapp.css";

interface MessageInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  onSubmit?: (message: string) => void;
  /** Controlled text — pair with onValueChange, e.g. to insert emojis from outside */
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Custom elements rendered to the left of the text input, inside the rounded input area */
  leftActions?: React.ReactNode;
  /** Custom element rendered to the right of the input area (outside the rounded box).
   *  Can be a render function that receives `{ hasMessage, submit }` to toggle icons based on input state. */
  rightAction?: React.ReactNode | ((ctx: { hasMessage: boolean; submit: () => void }) => React.ReactNode);
  /** Elements at the right end inside the rounded area, as in current WhatsApp Web
   *  (mic, or the send button once there is text). Same render-function form as rightAction. */
  trailingActions?: React.ReactNode | ((ctx: { hasMessage: boolean; submit: () => void }) => React.ReactNode);
}

const MessageInput = React.forwardRef<HTMLDivElement, MessageInputProps>(
  ({ className, onSubmit, value, onValueChange, placeholder = "Type a message", disabled = false, leftActions, rightAction, trailingActions, ...props }, ref) => {
    const [internal, setInternal] = React.useState("");
    const message = value ?? internal;
    const setMessage = (next: string) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };
    const [multiline, setMultiline] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
      if (message.trim() && onSubmit) {
        onSubmit(message.trim());
        setMessage("");
        setMultiline(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = "24px";
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleInput = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "24px";
        const h = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = `${h}px`;
        setMultiline(h > 24);
      }
    };

    // Text set from outside (emoji, draft restore) must resize like typing does.
    React.useEffect(() => {
      handleInput();
    }, [message]);

    const ctx = { hasMessage: message.trim().length > 0, submit: handleSubmit };

    return (
      <div
        ref={ref}
        className={cn(
          "font-wa flex gap-2 bg-wa-compose-bg px-[10px] py-[5px]",
          multiline ? "items-end" : "items-center",
          className
        )}
        {...props}
      >
        {/* Rounded input area */}
        <div className={cn("flex flex-1 gap-1 rounded-[21px] bg-wa-input-bg px-2 py-[5px]", multiline ? "items-end" : "items-center")}>
          {leftActions}
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "max-h-[120px] w-full resize-none bg-transparent px-1 text-[15px] leading-[24px] text-wa-text-primary outline-none",
              "placeholder:text-wa-text-secondary"
            )}
            style={{ height: "24px" }}
          />
          {typeof trailingActions === "function" ? trailingActions(ctx) : trailingActions}
        </div>

        {/* Right action (outside the rounded area) */}
        {typeof rightAction === "function" ? rightAction(ctx) : rightAction}
      </div>
    );
  }
);
MessageInput.displayName = "MessageInput";

export { MessageInput, type MessageInputProps };
