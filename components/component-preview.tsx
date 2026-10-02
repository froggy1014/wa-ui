"use client";

import { useState } from "react";
import { Code, X, Copy, Check } from "lucide-react";
import { ChatBubble } from "@/components/ui/whatsapp/chat-bubble";
import { ChatHeader } from "@/components/ui/whatsapp/chat-header";
import { ChatListItem } from "@/components/ui/whatsapp/chat-list-item";
import { ChatMenu } from "@/components/ui/whatsapp/chat-menu";
import { MessageInput } from "@/components/ui/whatsapp/message-input";
import { MessageStatusIcon } from "@/components/ui/whatsapp/message-status";
import { DateSeparator } from "@/components/ui/whatsapp/date-separator";
import { TypingIndicator } from "@/components/ui/whatsapp/typing-indicator";
import { ImageBubble } from "@/components/ui/whatsapp/image-bubble";
import { VideoBubble } from "@/components/ui/whatsapp/video-bubble";
import { VoiceMessageBubble } from "@/components/ui/whatsapp/voice-message-bubble";
import { FileAttachmentBubble } from "@/components/ui/whatsapp/file-attachment-bubble";
import { StickerBubble } from "@/components/ui/whatsapp/sticker-bubble";
import { TemplateBubble } from "@/components/ui/whatsapp/template-bubble";
import { CarouselTemplate } from "@/components/ui/whatsapp/carousel-template";
import { InteractiveButtonBubble } from "@/components/ui/whatsapp/interactive-button-bubble";
import { InteractiveReplyBubble } from "@/components/ui/whatsapp/interactive-reply-bubble";
import { ListMessageBubble } from "@/components/ui/whatsapp/list-message-bubble";
import { CtaUrlBubble } from "@/components/ui/whatsapp/cta-url-bubble";
import { CallPermissionBubble } from "@/components/ui/whatsapp/call-permission";
import { ReactionsDisplay } from "@/components/ui/whatsapp/reaction";
import { ReactionPill } from "@/components/ui/whatsapp/reaction-pill";
import { ActionButton } from "@/components/ui/whatsapp/action-button";
import { ContactBubble } from "@/components/ui/whatsapp/contact-bubble";
import { LocationBubble } from "@/components/ui/whatsapp/location-bubble";
import { ReplyPreview } from "@/components/ui/whatsapp/reply-preview";
import { ForwardedLabel } from "@/components/ui/whatsapp/forwarded-label";
import { SystemMessageBubble } from "@/components/ui/whatsapp/system-message-bubble";
import { UnsupportedMessageBubble } from "@/components/ui/whatsapp/unsupported-message-bubble";

const IMG = "https://picsum.photos/seed/wa-ui-preview/400/280";

const PREVIEWS: Record<string, () => React.ReactNode> = {
  "chat-bubble": () => (
    <div className="space-y-1">
      <ChatBubble variant="incoming" timestamp="10:24" showTail>Hey, check this out!</ChatBubble>
      <ChatBubble variant="outgoing" timestamp="10:25" status="read" showTail>Looks amazing</ChatBubble>
    </div>
  ),
  "chat-header": () => (
    <div className="space-y-1">
      <ChatHeader name="Alice" isOnline status="online" />
      <ChatHeader name="Bob" status="last seen today at 9:30" />
    </div>
  ),
  "chat-list-item": () => (
    <div className="space-y-0.5">
      <ChatListItem name="Alice" lastMessage="Hey, are you free today?" timestamp="10:24" unreadCount={2} />
      <ChatListItem name="Bob" lastMessage="Check this out!" timestamp="9:30" isMuted />
    </div>
  ),
  "chat-menu": () => (
    <div className="flex justify-center">
      <ChatMenu items={[{ label: "Contact info" }, { label: "Select messages" }, { label: "Mute" }]} />
    </div>
  ),
  "message-input": () => (
    <MessageInput placeholder="Type a message" />
  ),
  "message-status": () => (
    <div className="flex items-center gap-4 justify-center py-2">
      <span className="flex items-center gap-1 text-xs text-[#667781]">Sent <MessageStatusIcon status="sent" /></span>
      <span className="flex items-center gap-1 text-xs text-[#667781]">Delivered <MessageStatusIcon status="delivered" /></span>
      <span className="flex items-center gap-1 text-xs text-[#667781]">Read <MessageStatusIcon status="read" /></span>
    </div>
  ),
  "date-separator": () => (
    <DateSeparator label="Today" />
  ),
  "typing-indicator": () => (
    <TypingIndicator />
  ),
  "image-bubble": () => (
    <div className="space-y-1">
      <ImageBubble variant="incoming" src={IMG} caption="Beautiful sunset" timestamp="10:24" showTail />
      <ImageBubble variant="outgoing" src={IMG} timestamp="10:25" status="read" showTail />
    </div>
  ),
  "video-bubble": () => (
    <div className="space-y-1">
      <VideoBubble variant="incoming" src="/file_example.mp4" duration="1:24" timestamp="10:24" showTail />
      <VideoBubble variant="outgoing" src="/file_example.mp4" caption="Check this out" duration="1:24" timestamp="10:25" status="read" showTail />
    </div>
  ),
  "voice-message-bubble": () => (
    <div className="overflow-hidden space-y-1">
      <VoiceMessageBubble variant="incoming" duration="0:42" timestamp="10:24" audioSrc="/file_example_MP3_700KB.mp3" showTail />
      <VoiceMessageBubble variant="outgoing" duration="0:18" timestamp="10:25" status="read" audioSrc="/file_example_MP3_700KB.mp3" showTail />
    </div>
  ),
  "file-attachment-bubble": () => (
    <div className="space-y-1">
      <FileAttachmentBubble variant="incoming" fileName="report.pdf" fileSize="2.4 MB" fileType="pdf" timestamp="10:24" downloadStatus="idle" showTail />
      <FileAttachmentBubble variant="outgoing" fileName="invoice.xlsx" fileSize="1.1 MB" fileType="xlsx" timestamp="10:25" downloadStatus="idle" status="delivered" showTail />
    </div>
  ),
  "sticker-bubble": () => (
    <StickerBubble variant="outgoing" src="https://em-content.zobj.net/source/apple/391/waving-hand_1f44b.png" alt="wave" timestamp="10:24" status="read" showTail />
  ),
  "template-bubble": () => (
    <div className="space-y-1">
      <TemplateBubble
        variant="incoming"
        header={{ type: "text", text: "Order Update" }}
        body="Your order #1234 has been shipped!"
        buttons={[{ type: "url", label: "Track Order", url: "#" }]}
        timestamp="10:24"
      />
      <TemplateBubble
        variant="outgoing"
        body="Thanks for signing up! Here's your welcome guide."
        buttons={[{ type: "url", label: "Open Guide", url: "#" }]}
        timestamp="10:25"
      />
    </div>
  ),
  "carousel-template": () => (
    <CarouselTemplate
      body="Check out our latest products"
      timestamp="10:24"
      cards={[
        { body: "Premium Plan - $9.99/mo", buttons: [{ type: "url" as const, label: "Learn more", url: "#" }] },
        { body: "Pro Plan - $19.99/mo", buttons: [{ type: "url" as const, label: "Learn more", url: "#" }] },
      ]}
    />
  ),
  "interactive-button-bubble": () => (
    <div className="space-y-1">
      <InteractiveButtonBubble
        variant="incoming"
        body="Would you like to proceed?"
        buttons={[{ id: "1", title: "Yes" }, { id: "2", title: "No" }]}
        timestamp="10:24"
        showTail
      />
      <InteractiveButtonBubble
        variant="outgoing"
        body="Choose your plan"
        buttons={[{ id: "1", title: "Basic" }, { id: "2", title: "Pro" }]}
        timestamp="10:25"
        status="delivered"
        showTail
      />
    </div>
  ),
  "interactive-reply-bubble": () => (
    <InteractiveReplyBubble
      variant="outgoing"
      title="Yes"
      replyType="button_reply"
      quotedAuthor="Acme Support"
      quotedText="Would you like a demo?"
      timestamp="10:25"
      status="read"
      showTail
    />
  ),
  "list-message-bubble": () => (
    <ListMessageBubble
      variant="incoming"
      body="Choose a category"
      buttonLabel="View options"
      sections={[{ title: "Menu", rows: [{ id: "1", title: "Pizza" }, { id: "2", title: "Burger" }] }]}
      timestamp="10:24"
      showTail
    />
  ),
  "cta-url-bubble": () => (
    <CtaUrlBubble
      variant="incoming"
      body="Visit our website for more details"
      displayText="Open Website"
      url="#"
      timestamp="10:24"
      showTail
    />
  ),
  "call-permission": () => (
    <CallPermissionBubble bizName="Acme Corp" />
  ),
  "reaction": () => (
    <div className="flex justify-center py-2">
      <ReactionsDisplay reactions={[{ emoji: "❤️", count: 3, reacted: true }, { emoji: "👍", count: 1, reacted: false }]} />
    </div>
  ),
  "reaction-pill": () => (
    <div className="flex justify-center gap-2 py-2">
      <ReactionPill emoji="👍" count={5} reacted />
      <ReactionPill emoji="❤️" count={2} />
    </div>
  ),
  "action-button": () => (
    <div className="flex justify-center gap-2 py-2">
      <ActionButton>Reply</ActionButton>
      <ActionButton>Forward</ActionButton>
    </div>
  ),
  "contact-bubble": () => (
    <div className="space-y-1">
      <ContactBubble
        variant="incoming"
        contacts={[{ name: "John Doe", phones: ["+1 234 567 890"] }]}
        timestamp="10:24"
        showTail
      />
      <ContactBubble
        variant="outgoing"
        contacts={[{ name: "Jane Smith", phones: ["+1 987 654 321"] }]}
        timestamp="10:25"
        status="read"
        showTail
      />
    </div>
  ),
  "location-bubble": () => (
    <div className="space-y-1">
      <LocationBubble
        variant="incoming"
        latitude={37.7749}
        longitude={-122.4194}
        name="San Francisco"
        address="California, USA"
        timestamp="10:24"
        showTail
      />
      <LocationBubble
        variant="outgoing"
        latitude={37.5665}
        longitude={126.9780}
        name="Seoul"
        address="South Korea"
        timestamp="10:25"
        status="read"
        showTail
      />
    </div>
  ),
  "reply-preview": () => (
    <ChatBubble variant="outgoing" timestamp="10:25" status="read" showTail>
      <ReplyPreview author="Alice" body="Hey, check this out!" />
      Looks great!
    </ChatBubble>
  ),
  "forwarded-label": () => (
    <ChatBubble variant="incoming" timestamp="10:24" showTail>
      <ForwardedLabel />
      Check out this cool project!
    </ChatBubble>
  ),
  "system-message-bubble": () => (
    <SystemMessageBubble>Messages are end-to-end encrypted</SystemMessageBubble>
  ),
  "unsupported-message-bubble": () => (
    <div className="space-y-1">
      <UnsupportedMessageBubble variant="incoming" timestamp="10:24" showTail />
      <UnsupportedMessageBubble variant="outgoing" timestamp="10:25" status="read" showTail />
    </div>
  ),
};

const CODE_SNIPPETS: Record<string, string> = {
  "chat-bubble": `<ChatBubble variant="incoming" timestamp="10:24" showTail>
  Hey, check this out!
</ChatBubble>
<ChatBubble variant="outgoing" timestamp="10:25" status="read" showTail>
  Looks amazing
</ChatBubble>`,
  "chat-header": `<ChatHeader name="Alice" isOnline status="online" />`,
  "chat-list-item": `<ChatListItem
  name="Alice"
  lastMessage="Hey, are you free today?"
  timestamp="10:24"
  unreadCount={2}
/>`,
  "chat-menu": `<ChatMenu
  items={[
    { label: "Contact info" },
    { label: "Select messages" },
    { label: "Mute" },
  ]}
/>`,
  "message-input": `<MessageInput placeholder="Type a message" />`,
  "message-status": `<MessageStatusIcon status="sent" />
<MessageStatusIcon status="delivered" />
<MessageStatusIcon status="read" />`,
  "date-separator": `<DateSeparator label="Today" />`,
  "typing-indicator": `<TypingIndicator />`,
  "image-bubble": `<ImageBubble
  variant="incoming"
  src="/photo.jpg"
  caption="Beautiful sunset"
  timestamp="10:24"
  showTail
/>`,
  "video-bubble": `<VideoBubble
  variant="incoming"
  src="/video.mp4"
  duration="1:24"
  timestamp="10:24"
  showTail
/>`,
  "voice-message-bubble": `<VoiceMessageBubble
  variant="incoming"
  duration="0:42"
  timestamp="10:24"
  audioSrc="/audio.mp3"
  showTail
/>`,
  "file-attachment-bubble": `<FileAttachmentBubble
  variant="incoming"
  fileName="report.pdf"
  fileSize="2.4 MB"
  fileType="pdf"
  timestamp="10:24"
  downloadStatus="idle"
  showTail
/>`,
  "sticker-bubble": `<StickerBubble
  variant="outgoing"
  src="/sticker.png"
  alt="wave"
  timestamp="10:24"
  status="read"
  showTail
/>`,
  "template-bubble": `<TemplateBubble
  variant="incoming"
  header={{ type: "text", text: "Order Update" }}
  body="Your order #1234 has been shipped!"
  buttons={[{ type: "url", label: "Track Order", url: "#" }]}
  timestamp="10:24"
/>`,
  "carousel-template": `<CarouselTemplate
  body="Check out our latest products"
  timestamp="10:24"
  cards={[
    { body: "Premium Plan", buttons: [{ type: "url", label: "Learn more", url: "#" }] },
    { body: "Pro Plan", buttons: [{ type: "url", label: "Learn more", url: "#" }] },
  ]}
/>`,
  "interactive-button-bubble": `<InteractiveButtonBubble
  variant="incoming"
  body="Would you like to proceed?"
  buttons={[
    { id: "1", title: "Yes" },
    { id: "2", title: "No" },
  ]}
  timestamp="10:24"
  showTail
/>`,
  "interactive-reply-bubble": `<InteractiveReplyBubble
  variant="outgoing"
  title="Yes"
  replyType="button_reply"
  quotedAuthor="Acme Support"
  quotedText="Would you like a demo?"
  timestamp="10:25"
  status="read"
  showTail
/>`,
  "list-message-bubble": `<ListMessageBubble
  variant="incoming"
  body="Choose a category"
  buttonLabel="View options"
  sections={[{
    title: "Menu",
    rows: [
      { id: "1", title: "Pizza" },
      { id: "2", title: "Burger" },
    ],
  }]}
  timestamp="10:24"
  showTail
/>`,
  "cta-url-bubble": `<CtaUrlBubble
  variant="incoming"
  body="Visit our website for more details"
  displayText="Open Website"
  url="#"
  timestamp="10:24"
  showTail
/>`,
  "call-permission": `<CallPermissionBubble bizName="Acme Corp" />`,
  "reaction": `<ReactionsDisplay
  reactions={[
    { emoji: "❤️", count: 3, reacted: true },
    { emoji: "👍", count: 1, reacted: false },
  ]}
/>`,
  "reaction-pill": `<ReactionPill emoji="👍" count={5} reacted />
<ReactionPill emoji="❤️" count={2} />`,
  "action-button": `<ActionButton>Reply</ActionButton>
<ActionButton>Forward</ActionButton>`,
  "contact-bubble": `<ContactBubble
  variant="incoming"
  contacts={[{ name: "John Doe", phones: ["+1 234 567 890"] }]}
  timestamp="10:24"
  showTail
/>`,
  "location-bubble": `<LocationBubble
  variant="incoming"
  latitude={37.7749}
  longitude={-122.4194}
  name="San Francisco"
  address="California, USA"
  timestamp="10:24"
  showTail
/>`,
  "reply-preview": `<ChatBubble variant="outgoing" timestamp="10:25" status="read" showTail>
  <ReplyPreview author="Alice" body="Hey, check this out!" />
  Looks great!
</ChatBubble>`,
  "forwarded-label": `<ChatBubble variant="incoming" timestamp="10:24" showTail>
  <ForwardedLabel />
  Check out this cool project!
</ChatBubble>`,
  "system-message-bubble": `<SystemMessageBubble>
  Messages are end-to-end encrypted
</SystemMessageBubble>`,
  "unsupported-message-bubble": `<UnsupportedMessageBubble
  variant="incoming"
  timestamp="10:24"
  showTail
/>`,
};

function CodeCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} aria-label="Copy code" className="p-1 rounded hover:bg-white/10 transition-colors">
      {copied ? <Check size={12} className="text-[#00a884]" /> : <Copy size={12} />}
    </button>
  );
}

const NO_WALLPAPER = new Set([
  "chat-list-item",
]);

export function ComponentPreview({ name }: { name: string }) {
  const [showCode, setShowCode] = useState(false);
  const render = PREVIEWS[name];
  const code = CODE_SNIPPETS[name];
  if (!render) return null;

  const bgClass = NO_WALLPAPER.has(name)
    ? "rounded-lg overflow-hidden p-3"
    : "wa-wallpaper rounded-lg overflow-hidden p-3";

  return (
    <div className="relative">
      {showCode && code ? (
        <div className="bg-[#0d1117] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
            <span className="text-[10px] font-mono text-white/50">tsx</span>
            <div className="flex items-center gap-1">
              <CodeCopyButton text={code} />
              <button onClick={() => setShowCode(false)} className="p-1 rounded hover:bg-white/10 transition-colors text-white/50">
                <X size={12} />
              </button>
            </div>
          </div>
          <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed font-mono text-[#e6edf3]"><code>{code}</code></pre>
        </div>
      ) : (
        <div className={bgClass}>
          {render()}
        </div>
      )}
      {!showCode && code && (
        <button
          onClick={() => setShowCode(true)}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors"
          aria-label="Show code"
        >
          <Code size={14} />
        </button>
      )}
    </div>
  );
}
