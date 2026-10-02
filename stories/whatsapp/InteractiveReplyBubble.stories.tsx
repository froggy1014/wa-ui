import type { Meta, StoryObj } from "@storybook/react";
import { InteractiveReplyBubble } from "@/components/ui/whatsapp/interactive-reply-bubble";

const meta: Meta<typeof InteractiveReplyBubble> = {
  title: "WhatsApp/InteractiveReplyBubble",
  component: InteractiveReplyBubble,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 440, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof InteractiveReplyBubble>;

export const ButtonReply: Story = {
  args: {
    variant: "incoming",
    title: "Start testing your flow",
    replyType: "button_reply",
    quotedAuthor: "You",
    quotedText: "Ready to try the onboarding flow?",
    timestamp: "5:53 PM",
    showTail: true,
  },
};

export const ListReply: Story = {
  args: {
    variant: "incoming",
    title: "Premium Plan",
    replyType: "list_reply",
    quotedAuthor: "You",
    quotedText: "Pick a plan that fits your team",
    description: "Unlimited messages, priority support",
    timestamp: "2:15 PM",
    showTail: true,
  },
};

export const FlowReply: Story = {
  args: {
    variant: "incoming",
    title: "Form submitted",
    replyType: "nfm_reply",
    timestamp: "3:42 PM",
    showTail: true,
  },
};

export const OutgoingButtonReply: Story = {
  args: {
    variant: "outgoing",
    title: "Yes, I agree",
    replyType: "button_reply",
    quotedAuthor: "Acme Support",
    quotedText: "Do you accept the updated terms?",
    timestamp: "5:54 PM",
    status: "read",
    showTail: true,
  },
};

export const TemplateButtonReply: Story = {
  args: {
    variant: "incoming",
    title: "Get started",
    replyType: "button",
    quotedAuthor: "You",
    quotedText: "Welcome! Tap below to begin.",
    timestamp: "10:30 AM",
    showTail: true,
  },
};

export const WithoutQuote: Story = {
  args: {
    variant: "incoming",
    title: "Messaging",
    replyType: "button_reply",
    timestamp: "9:37 AM",
    showTail: true,
  },
};
