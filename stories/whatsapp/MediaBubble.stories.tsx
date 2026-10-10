import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ImageBubble } from "@/components/ui/whatsapp/image-bubble";
import { MediaViewer } from "@/components/ui/whatsapp/media-viewer";
import { ReplyPreview } from "@/components/ui/whatsapp/reply-preview";
import { VoiceMessageBubble } from "@/components/ui/whatsapp/voice-message-bubble";
import { FileAttachmentBubble } from "@/components/ui/whatsapp/file-attachment-bubble";

const meta: Meta = {
  title: "WhatsApp/MediaBubble",
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="wa-wallpaper px-4 py-4" style={{ background: "var(--wa-conversation-bg, #f5f0e8)", minWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj;

const LANDSCAPE = "https://picsum.photos/seed/wa/400/300";
const PORTRAIT = "https://picsum.photos/seed/wa2/300/400";

// ─── Image ────────────────────────────────────────────────────────────────────

export const ImageIncoming: Story = {
  name: "Image / Incoming",
  render: () => <ImageBubble variant="incoming" src={LANDSCAPE} timestamp="10:24" showTail />,
};

export const ImageOutgoing: Story = {
  name: "Image / Outgoing",
  render: () => <ImageBubble variant="outgoing" src={PORTRAIT} caption="Japan looks amazing! 🗼" timestamp="10:27" status="delivered" showTail />,
};

/** Outgoing media still sending: dimmed, upload ring, pending clock. */
export const ImageSending: Story = {
  name: "Image / Sending",
  render: () => <ImageBubble variant="outgoing" src={LANDSCAPE} timestamp="10:31" status="sending" showTail />,
};

export const ImageGrid2: Story = {
  name: "Image / Grid 2",
  render: () => <ImageBubble variant="outgoing" images={[LANDSCAPE, PORTRAIT]} timestamp="10:28" status="read" showTail />,
};

export const ImageGrid4: Story = {
  name: "Image / Grid 4",
  render: () => (
    <ImageBubble
      variant="incoming"
      images={[LANDSCAPE, PORTRAIT, LANDSCAPE, PORTRAIT]}
      timestamp="10:30"
      showTail
    />
  ),
};

export const ImageGridOverflow: Story = {
  name: "Image / Grid +N",
  render: () => (
    <ImageBubble
      variant="outgoing"
      images={[LANDSCAPE, PORTRAIT, LANDSCAPE, PORTRAIT, LANDSCAPE, LANDSCAPE]}
      timestamp="10:32"
      status="delivered"
      showTail
    />
  ),
};

export const VideoSingle: Story = {
  name: "Video / Single",
  render: () => (
    <ImageBubble
      variant="incoming"
      media={[{ src: LANDSCAPE, type: "video", duration: "0:42" }]}
      timestamp="10:25"
      showTail
    />
  ),
};

export const VideoGrid: Story = {
  name: "Video / Grid Mixed",
  render: () => (
    <ImageBubble
      variant="outgoing"
      media={[
        { src: LANDSCAPE, type: "video", duration: "0:57" },
        { src: PORTRAIT, type: "image" },
        { src: PORTRAIT, type: "image" },
        { src: LANDSCAPE, type: "video", duration: "1:23" },
      ]}
      timestamp="10:28"
      status="read"
      showTail
    />
  ),
};

export const VideoGridOverflow: Story = {
  name: "Video / Grid +N",
  render: () => (
    <ImageBubble
      variant="incoming"
      media={[
        { src: LANDSCAPE, type: "video", duration: "0:15" },
        { src: PORTRAIT, type: "image" },
        { src: LANDSCAPE, type: "image" },
        { src: PORTRAIT, type: "video", duration: "2:04" },
        { src: LANDSCAPE, type: "video", duration: "0:33" },
        { src: PORTRAIT, type: "image" },
      ]}
      timestamp="10:30"
      showTail
    />
  ),
};

// ─── Voice ────────────────────────────────────────────────────────────────────

export const VoiceIncoming: Story = {
  name: "Voice / Incoming",
  render: () => <VoiceMessageBubble variant="incoming" duration="0:32" timestamp="10:30" showTail />,
};

export const VoiceWithAudio: Story = {
  name: "Voice / With Audio (playable)",
  render: () => (
    <VoiceMessageBubble
      variant="incoming"
      duration="0:42"
      timestamp="10:30"
      audioSrc="/file_example_MP3_700KB.mp3"
      avatarSrc="https://i.pravatar.cc/150?img=3"
      showTail
    />
  ),
};

// ─── File ─────────────────────────────────────────────────────────────────────

export const FileIncoming: Story = {
  name: "File / Incoming",
  render: () => <FileAttachmentBubble variant="incoming" fileName="Project Brief.pdf" fileSize="1.1 MB" fileType="pdf" timestamp="10:15" downloadStatus="idle" showTail />,
};

export const FileDownloading: Story = {
  name: "File / Downloading",
  render: () => <FileAttachmentBubble variant="incoming" fileName="Assets.zip" fileSize="8.4 MB" fileType="zip" timestamp="10:14" downloadStatus="downloading" downloadProgress={60} showTail />,
};

// ─── Conversation (all together) ──────────────────────────────────────────────

export const Conversation: Story = {
  name: "Conversation",
  render: () => (
    <div className="flex flex-col">
      <ImageBubble variant="outgoing" src={LANDSCAPE} caption="Check this out 🔥" timestamp="10:20" status="read" showTail />
      <VoiceMessageBubble variant="incoming" duration="0:18" timestamp="10:22" showTail />
      <FileAttachmentBubble variant="outgoing" fileName="Design Spec.pdf" fileSize="2.3 MB" fileType="pdf" timestamp="10:24" status="delivered" downloadStatus="done" showTail={false} />
      <FileAttachmentBubble variant="incoming" fileName="Assets.zip" fileSize="8.4 MB" fileType="zip" timestamp="10:25" downloadStatus="downloading" downloadProgress={45} showTail={false} />
      <VoiceMessageBubble variant="outgoing" duration="1:04" timestamp="10:27" status="read" isPlaying progress={55} showTail />
      <ImageBubble variant="incoming" src={PORTRAIT} timestamp="10:29" showTail />
    </div>
  ),
};

/** Click an image to open it full screen. */
export const ImageWithViewer: Story = {
  name: "Image / Viewer",
  render: function Render() {
    const [open, setOpen] = React.useState<number | null>(null);
    const srcs = [LANDSCAPE, PORTRAIT];
    return (
      <>
        <ImageBubble variant="incoming" images={srcs} timestamp="10:24" showTail onMediaClick={(i) => setOpen(i)} />
        <MediaViewer items={srcs.map((src) => ({ src, caption: "Trip photos" }))} index={open} onIndexChange={setOpen} title="Alice · 10:24" />
      </>
    );
  },
};

/** A photo sent as a reply: the quote sits above the media, as in WhatsApp. */
export const ImageReply: Story = {
  name: "Image / Reply",
  render: () => (
    <ImageBubble
      variant="incoming"
      src={LANDSCAPE}
      caption="Here it is"
      timestamp="10:31"
      showTail
      quote={<ReplyPreview author="You" body="Can you send a photo of the receipt?" />}
    />
  ),
};

/** Outgoing image that failed to send. */
export const ImageFailed: Story = {
  name: "Image / Failed",
  render: () => <ImageBubble variant="outgoing" src={LANDSCAPE} timestamp="10:32" status="failed" showTail />,
};
