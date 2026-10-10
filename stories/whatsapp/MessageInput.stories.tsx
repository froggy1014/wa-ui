import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { EmojiPicker } from "@/components/ui/whatsapp/emoji-picker";
import { MessageInput } from "@/components/ui/whatsapp/message-input";

const meta: Meta<typeof MessageInput> = {
  title: "WhatsApp/MessageInput",
  component: MessageInput,
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
  decorators: [
    (Story) => (
      <div className="wa-wallpaper min-h-[120px] flex items-end">
        <div className="w-full">
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof MessageInput>;

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
      <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm5.603 0c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zM11.984 1.006C5.926 1.006 1.006 5.926 1.006 11.984s4.92 10.978 10.978 10.978 10.978-4.92 10.978-10.978S18.042 1.006 11.984 1.006zm0 19.422a8.451 8.451 0 0 1-8.444-8.444 8.451 8.451 0 0 1 8.444-8.444 8.451 8.451 0 0 1 8.444 8.444 8.451 8.451 0 0 1-8.444 8.444zm5.395-5.576a.67.67 0 0 0-.567-.881c-.018-.002-.037-.003-.055-.003h-.004c-.137 0-.28.039-.527.236-.594.477-2.121 1.609-4.258 1.609-2.139 0-3.613-1.091-4.228-1.588-.236-.19-.393-.25-.537-.25a.676.676 0 0 0-.628.884c.04.107.092.2.156.284.497.667 2.102 2.391 5.237 2.391 3.13 0 4.745-1.73 5.243-2.4a.86.86 0 0 0 .168-.282z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
      <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.003H4.761c0 4.001 3.178 7.297 7.061 7.885v3.884h.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-1z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
      <path d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
    </svg>
  );
}

const iconBtn = "p-[5px] text-wa-icon-default transition-colors hover:text-wa-icon-lighter";

export const Default: Story = {
  args: {
    leftActions: (
      <>
        <button type="button" className={iconBtn} aria-label="Add">
          <PlusIcon />
        </button>
        <button type="button" className={iconBtn} aria-label="Emoji">
          <EmojiIcon />
        </button>
      </>
    ),
    rightAction: ({ hasMessage, submit }) =>
      hasMessage ? (
        <button type="button" className={iconBtn} aria-label="Send" onClick={submit}>
          <SendIcon />
        </button>
      ) : (
        <button type="button" className={iconBtn} aria-label="Voice message">
          <MicIcon />
        </button>
      ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    leftActions: (
      <>
        <button type="button" className={iconBtn} aria-label="Add" disabled>
          <PlusIcon />
        </button>
        <button type="button" className={iconBtn} aria-label="Emoji" disabled>
          <EmojiIcon />
        </button>
      </>
    ),
    rightAction: (
      <button type="button" className={iconBtn} aria-label="Voice message" disabled>
        <MicIcon />
      </button>
    ),
  },
};

export const InputOnly: Story = {
  args: {
    placeholder: "No actions, just input",
  },
};

/** Controlled value with the emoji picker inserting into the draft. */
export const WithEmojiPicker: Story = {
  render: function Render() {
    const [text, setText] = React.useState("");
    return (
      <MessageInput
        value={text}
        onValueChange={setText}
        leftActions={<EmojiPicker onSelect={(emoji) => setText((t) => t + emoji)} />}
        rightAction={({ hasMessage, submit }) =>
          hasMessage ? (
            <button type="button" className={iconBtn} aria-label="Send" onClick={submit}>
              <SendIcon />
            </button>
          ) : null
        }
        onSubmit={() => setText("")}
      />
    );
  },
};
