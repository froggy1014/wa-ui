import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { Copy, Reply } from "lucide-react";
import { ChatBubble } from "@/components/ui/whatsapp/chat-bubble";
import { MessageActions } from "@/components/ui/whatsapp/message-actions";
import { MessageInput } from "@/components/ui/whatsapp/message-input";
import { ReplyBar } from "@/components/ui/whatsapp/reply-bar";
import { ReplyPreview } from "@/components/ui/whatsapp/reply-preview";

const meta: Meta<typeof MessageActions> = {
  title: "WhatsApp/MessageActions",
  component: MessageActions,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof MessageActions>;

export const Incoming: Story = {
  render: () => (
    <MessageActions
      variant="incoming"
      onReact={() => {}}
      actions={[
        { label: "Reply", icon: <Reply size={18} />, onClick: () => {} },
        { label: "Copy", icon: <Copy size={18} />, onClick: () => {} },
      ]}
    >
      <ChatBubble variant="incoming" timestamp="10:30" showTail>
        Right-click, long-press, or hover me
      </ChatBubble>
    </MessageActions>
  ),
};

interface Msg {
  id: string;
  variant: "incoming" | "outgoing";
  text: string;
  quote?: { author: string; text: string };
}

/** Reactions and replies wired together, as a chat screen would use them. */
export const ReactAndReply: Story = {
  render: function Render() {
    const [messages, setMessages] = React.useState<Msg[]>([
      { id: "1", variant: "incoming", text: "Did the build pass?" },
      { id: "2", variant: "outgoing", text: "Yes, deploying now 🚀" },
    ]);
    const [reactions, setReactions] = React.useState<Record<string, string>>({});
    const [replyTo, setReplyTo] = React.useState<Msg | null>(null);
    const author = (m: Msg) => (m.variant === "outgoing" ? "You" : "Alice");

    return (
      <div className="flex max-w-md flex-col gap-1 rounded-lg bg-wa-conversation-bg p-3">
        {messages.map((m) => (
          <MessageActions
            key={m.id}
            variant={m.variant}
            selectedReaction={reactions[m.id]}
            onReact={(emoji) => setReactions((r) => ({ ...r, [m.id]: emoji }))}
            actions={[
              { label: "Reply", icon: <Reply size={18} />, onClick: () => setReplyTo(m) },
              { label: "Copy", icon: <Copy size={18} />, onClick: () => navigator.clipboard?.writeText(m.text) },
            ]}
          >
            <ChatBubble
              variant={m.variant}
              timestamp="10:30"
              status={m.variant === "outgoing" ? "read" : undefined}
              reactions={reactions[m.id] ? [{ emoji: reactions[m.id], reacted: true }] : undefined}
            >
              {m.quote && <ReplyPreview author={m.quote.author} body={m.quote.text} />}
              {m.text}
            </ChatBubble>
          </MessageActions>
        ))}
        <div className="mt-2">
          {replyTo && (
            <ReplyBar author={author(replyTo)} body={replyTo.text} onCancel={() => setReplyTo(null)} />
          )}
          <MessageInput
            onSubmit={(text) => {
              setMessages((ms) => [
                ...ms,
                {
                  id: String(ms.length + 1),
                  variant: "outgoing",
                  text,
                  quote: replyTo ? { author: author(replyTo), text: replyTo.text } : undefined,
                },
              ]);
              setReplyTo(null);
            }}
          />
        </div>
      </div>
    );
  },
};

export const ReplyBarOnly: StoryObj<typeof ReplyBar> = {
  render: () => <ReplyBar author="Alice" body="Did the build pass?" onCancel={() => {}} />,
};
