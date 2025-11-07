# form-rag-js

**One AI form. Any small business. Powered by Grok.**

---

## Install

```bash
npm install form-rag-js
```

---

## Use

```jsx
import { FormRAG, UniversalSMBTemplate } from 'form-rag-js';

<FormRAG template={UniversalSMBTemplate} apiKey="gsk_..." />
```

Now with full AI chat, message download, and **7 ready-to-use SMB templates**.

---

## What's New in v1.2.11

| Feature | Benefit |
|----------|----------|
| **Full AI Chat** | After submitting the form, users can continue the conversation with Grok. |
| **Download Any Message** | Hover a message → click **Download** → save as `.txt`. |
| **Download Full Chat** | One-click export of the entire conversation. |
| **7 Pre-Built Templates** | No setup needed — just import and go: Landscaper, Cleaning, Handyman, Automotive, Author, Artist, RealEstate. |
| **Minimal Input, Maximum AI** | Only 2–4 fields required. Grok fills in quotes, schedules, and upsells. |
| **Clean, Responsive UI** | Full-width chat input, side-by-side buttons, mobile-ready. |

---

## Example: Landscaper Quote in 3 Fields

```jsx
import { FormRAG, LandscaperTemplate } from 'form-rag-js';

<FormRAG template={LandscaperTemplate} apiKey="gsk_..." />
```

**User fills:**
- Yard size
- Services (mowing, edging, etc.)
- Urgency

**AI returns:**
> "Your 2,500 sq ft lawn will cost $75 (mowing + edging). Add fertilizer for +$25? Reply YES to book."

---

## All Templates

```js
import {
  UniversalSMBTemplate,
  LandscaperTemplate,
  CleaningTemplate,
  HandymanTemplate,
  AutomotiveTemplate,
  AuthorTemplate,
  ArtistTemplate,
  RealEstateTemplate,
} from 'form-rag-js';
```

Each template is fully customizable — just edit the JS file.

---

## Get Grok API Key

[https://console.x.ai](https://console.x.ai)

---

**form-rag-js**
© 2025 [StudioVoice2Fly](https://studiovoice2fly.com) — Released under the [MIT License](./LICENSE).
