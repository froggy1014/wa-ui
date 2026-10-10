import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { TemplateBubble } from "@/components/ui/whatsapp/template-bubble";
import { CarouselTemplate } from "@/components/ui/whatsapp/carousel-template";

const meta: Meta = {
  title: "WhatsApp/Templates",
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
};
export default meta;
type Story = StoryObj;

const bg = { background: "var(--wa-conversation-bg, #f5f0e8)" };

export const Gallery: Story = {
  name: "Gallery — All Types",
  render: () => (
    <div className="wa-wallpaper min-h-screen p-6" style={bg}>
      <div className="flex flex-wrap gap-6">
        {[
          { label: "Text", node: <TemplateBubble body="Hi {{name}}, your appointment is confirmed for {{date}} at {{time}}." footer="Reply STOP to unsubscribe" buttons={[{ type: "url" as const, label: "Reschedule" }]} timestamp="2:36 PM" /> },
          { label: "Image Header", node: <TemplateBubble header={{ type: "image" as const }} body="Check out our latest offer!" buttons={[{ type: "url" as const, label: "View offer" }]} timestamp="2:36 PM" /> },
          { label: "Video Header", node: <TemplateBubble header={{ type: "video" as const }} body="Watch our product demo." buttons={[{ type: "url" as const, label: "Learn more" }]} timestamp="2:36 PM" /> },
          { label: "Document Header", node: <TemplateBubble header={{ type: "document" as const, documentName: "invoice.pdf" }} body="Please find your invoice attached." timestamp="2:45 PM" /> },
          { label: "Location Header", node: <TemplateBubble header={{ type: "location" as const, location: { name: "{{Location name}}", address: "{{Address}}" } }} body="Your delivery location." timestamp="2:45 PM" /> },
          { label: "Quick Reply", node: <TemplateBubble body="Did you make this purchase?" buttons={[{ type: "quick_reply" as const, label: "Yes" }, { type: "quick_reply" as const, label: "No" }]} timestamp="2:36 PM" /> },
          { label: "Copy Code", node: <TemplateBubble body="Hello" buttons={[{ type: "copy_code" as const, label: "Copy offer code" }]} timestamp="2:39 PM" /> },
          { label: "Flow", node: <TemplateBubble body="Rate your recent {{text}} experience." buttons={[{ type: "flow" as const, label: "Take survey" }]} timestamp="2:36 PM" /> },
          { label: "Mixed Buttons", node: <TemplateBubble header={{ type: "text" as const, text: "Order delivered" }} body="Your order {{order_id}} has been delivered." footer="Thank you" buttons={[{ type: "url" as const, label: "View order" }, { type: "quick_reply" as const, label: "Track order" }]} timestamp="2:36 PM" /> },
        ].map(({ label, node }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-wa-text-secondary">{label}</span>
            {node}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Carousel: Story = {
  render: () => (
    <div className="wa-wallpaper min-h-screen p-6" style={bg}>
      <CarouselTemplate
        body="Hey there! Summer is here, we've got the freshest lemons in store to keep you hydrated."
        timestamp="11:59"
        cards={[
          { body: "Rare lemons for those unique cocktails over the rocks on the weekends.", buttons: [{ type: "url", label: "Buy now" }, { type: "quick_reply", label: "More like this" }] },
          { body: "Fresh lemons from Panama to make the most tangy lemonade in the neighborhood.", buttons: [{ type: "url", label: "Buy now" }, { type: "quick_reply", label: "More like this" }] },
          { body: "Lemons to cook up a storm over that oven baked salmon to impress your guests.", buttons: [{ type: "url", label: "Buy now" }, { type: "quick_reply", label: "More like this" }] },
        ]}
      />
    </div>
  ),
};

/** Outgoing template with delivery ticks. */
export const OutgoingWithStatus: Story = {
  render: () => (
    <TemplateBubble
      variant="outgoing"
      body="Your request has been received. We'll get back to you shortly."
      timestamp="10:42"
      status="read"
    />
  ),
};
