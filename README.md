
# form-rag-js

**A foundational Form-RAG framework for building AI-powered, conversational business assistants — powered by Grok.**

---

## Install

```bash
npm install form-rag-js
```

---

## Core Concept: **Form → RAG → AI Chat**

`form-rag-js` is **not just a form**. It’s a **modular, extensible RAG (Retrieval-Augmented Generation) system** that:

1. **Collects structured input** via dynamic forms
2. **Constructs intelligent prompts** using templates + conditional rules
3. **Injects context into Grok** for accurate, business-aware responses
4. **Enables ongoing AI chat** with full conversation history
5. **Exports messages** for CRM, email, or automation

> **Use it as a starting point to build *any* AI business agent — fast.**

---

## What It Does (Out of the Box)

```jsx
import { FormRAG, LandscaperTemplate } from 'form-rag-js';

<FormRAG template={LandscaperTemplate} apiKey={process.env.GROK_API_KEY} />
```

- Renders a **smart, adaptive form** (only relevant fields shown)
- On submit → builds a **context-rich prompt** using `constructPrompt()`
- Calls **Grok-3-beta** via xAI API
- Returns a **professional quote + upsell logic + CTA**
- Opens a **persistent AI chat** for negotiation, clarification, booking
- Supports **per-message & full-chat download** (`.txt`)

---

## What You Can Build With It

| Use Case | How to Extend |
|--------|---------------|
| **Lead-gen bots** | Add webhook on download → send to Zapier/CRM |
| **Booking agents** | Parse "YES" replies → trigger calendar invite |
| **E-commerce upsells** | Use `rules` to suggest add-ons based on form data |
| **Custom SMB tools** | Fork a template → add pricing logic, branding, fields |
| **Multi-step funnels** | Use chat to guide users through qualification |
| **Internal tools** | Embed in Notion, Airtable, or React dashboards |

---

## Architecture (Modular & Hackable)

```js
import { FormRAG, constructPrompt } from 'form-rag-js';
import { MyCustomTemplate } from './templates/my-business.js';
```

### Key Exports

| Export | Purpose |
|------|---------|
| `<FormRAG />` | React component — drop-in UI + chat |
| `constructPrompt(data, template)` | Core engine: builds prompt + applies rules |
| `UniversalSMBTemplate` | Dynamic business selector → adaptive forms |
| `*Template` | Pre-built, production-ready SMB agents |

---

## Build Your Own Template (5 Minutes)

```js
// templates/my-coffee-shop.js
export const CoffeeShopTemplate = {
  name: "Coffee Shop Order Bot",
  form: () => [
    {
      id: "drink",
      type: "select",
      label: "Drink",
      required: true,
      options: [
        { value: "latte", label: "Latte ($5)" },
        { value: "cappuccino", label: "Cappuccino ($4.50)" },
      ],
    },
    {
      id: "size",
      type: "select",
      label: "Size",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium (+$1)" },
        { value: "large", label: "Large (+$2)" },
      ],
    },
    {
      id: "addons",
      type: "multi",
      label: "Add-ons",
      options: [
        { value: "oat", label: "Oat Milk (+$0.75)" },
        { value: "shot", label: "Extra Shot (+$1)" },
      ],
    },
  ],
  prompt: (data) => {
    const base = data.drink === "latte" ? 5 : 4.5;
    const sizeUp = data.size === "medium" ? 1 : data.size === "large" ? 2 : 0;
    const extras = (data.addons || []).reduce((sum, a) => {
      return a === "oat" ? sum + 0.75 : sum + 1;
    }, 0);
    const total = base + sizeUp + extras;

    return `You are a friendly barista. Order: ${data.drink} (${data.size}), add-ons: ${data.addons?.join(', ') || 'none'}. Total: $${total.toFixed(2)}. Ask: "Pickup or delivery? Name for order?"`;
  },
  rules: {
    size: (value) => value === "large" ? "- Suggest pastry pairing (+$3)" : null,
  },
};
```

Then use it:

```jsx
import { CoffeeShopTemplate } from './templates/my-coffee-shop.js';

<FormRAG template={CoffeeShopTemplate} apiKey="..." />
```

---

## Advanced: Use `constructPrompt` Without UI

```js
import { constructPrompt } from 'form-rag-js';
import { LandscaperTemplate } from 'form-rag-js';

const formData = {
  yardSize: 6000,
  services: ["mowing", "edging"],
  urgency: "asap"
};

const prompt = constructPrompt(formData, LandscaperTemplate);
// → Includes base prompt + rule: "- Add edging (+$20) if yard > 5000 sq ft."
```

Perfect for **server-side generation**, **email automation**, or **headless bots**.

---

## Included Templates (Ready to Fork)

| Template | Best For |
|---------|----------|
| `UniversalSMBTemplate` | Pick business → auto-adapt form |
| `LandscaperTemplate` | Lawn care quotes with upsells |
| `CleaningTemplate` | Room-based pricing + frequency discounts |
| `HandymanTemplate` | Job-type hourly estimates |
| `AutomotiveTemplate` | Diagnostic quotes by vehicle/issue |
| `RealEstateTemplate` | Buyer/seller qualification + CMA |
| `AuthorTemplate` | Book outlining & word goals |
| `ArtistTemplate` | Commission pricing by medium/size |

> **All templates are 100% editable JS objects** — no build step needed.

---

## Get Your Grok API Key

[https://console.x.ai](https://console.x.ai)

> Uses `grok-3-beta` — fast, affordable, and business-ready.

---

## Roadmap / Ideas to Build On

- [ ] Webhook triggers on "YES" replies
- [ ] Email/SMS follow-up via chat export
- [ ] Multi-language templates
- [ ] Embed mode (no chat, just quote)
- [ ] Analytics dashboard (conversion rates)
- [ ] Template marketplace

---

## Example: Full Custom Flow

```jsx
import { FormRAG } from 'form-rag-js';
import { MyBusinessTemplate } from './templates/my-business.js';

function App() {
  return (
    <FormRAG
      template={MyBusinessTemplate}
      apiKey={import.meta.env.VITE_GROK_KEY}
      onChatUpdate={(messages) => {
        const last = messages[messages.length - 1];
        if (last.role === 'user' && last.content.toLowerCase().includes('yes')) {
          alert('Booking confirmed! Sending calendar link...');
          // Trigger Zapier, send email, etc.
        }
      }}
    />
  );
}
```

---

## Why This Is Foundational

| Feature | Why It Matters |
-------|----------------|
| **Template-driven forms** | No hardcoded UI — scale to 100 industries |
| **Rule-based prompt injection** | AI "remembers" business logic without retraining |
| **Chat persistence** | Turn one-off forms into relationships |
| **Exportable output** | Close the loop with real-world actions |

---

**form-rag-js**
© 2025 [StudioVoice2Fly](https://studiovoice2fly.com) — Built by StudioVoice2Fly • AI strategy & custom tools • [MIT License](./LICENSE)

---

> **Start with a template. End with a business engine.**
