import { fetchComps } from '../../lib/compsAPI.js';
import { themes } from '../shared/themes.js';

export const RealEstateProTemplate = {
  name: 'Astra Concierge',
  icon: '🏙️',
  tagline: 'Luxury-ready real estate AI',
  description:
    'Buyer or seller flow with live comp context, qualification, and a clear handoff to your agent.',
  highlights: ['Mini-CMA', 'Lead export', 'Priority hot leads'],
  theme: themes.luxury,
  assistantName: 'Astra',
  submitLabel: 'Start my consultation',

  form: () => [
    { id: 'sec_contact', type: 'section', label: 'Contact' },
    { id: 'name', type: 'text', label: 'Full name', required: true, placeholder: 'Jane Doe' },
    { id: 'email', type: 'email', label: 'Email', required: true, placeholder: 'jane@example.com' },
    { id: 'phone', type: 'tel', label: 'Phone (optional)', placeholder: '(555) 123-4567' },
    { id: 'sec_deal', type: 'section', label: 'Your move' },
    {
      id: 'role',
      type: 'select',
      label: 'I am…',
      required: true,
      options: [
        { value: 'buyer', label: 'Buying a home' },
        { value: 'seller', label: 'Selling my home' },
      ],
    },
    {
      id: 'propertyType',
      type: 'select',
      label: 'Property type',
      required: true,
      options: [
        { value: 'house', label: 'Single-family' },
        { value: 'condo', label: 'Condo' },
        { value: 'townhouse', label: 'Townhouse' },
        { value: 'multifamily', label: 'Multi-family' },
      ],
    },
    { id: 'zip', type: 'text', label: 'ZIP code', required: true, placeholder: '90210' },
    {
      id: 'budget',
      type: 'number',
      label: 'Budget / target price ($)',
      placeholder: '750000',
      min: 0,
      step: 10000,
      hint: 'Used for comp matching — a range is fine.',
    },
    {
      id: 'timeline',
      type: 'select',
      label: 'Timeline',
      required: true,
      options: [
        { value: '0-30', label: 'ASAP (0–30 days)' },
        { value: '30-90', label: '1–3 months' },
        { value: '90+', label: '3+ months' },
        { value: 'browsing', label: 'Just browsing' },
      ],
    },
  ],

  prompt: async (data) => {
    const comps = await fetchComps(data.zip, data.propertyType, data.budget);
    const marketTip =
      data.budget > 1_500_000 ? 'Luxury market: mention private listings and discretion.' : '';
    const compBlock = comps
      .map(
        (c) =>
          `- ${c.address}: $${c.price.toLocaleString()} (${c.beds}bd/${c.baths}ba, ${c.sqft} sqft, sold ${c.daysAgo}d ago)`,
      )
      .join('\n');

    return `
You are Astra, AI concierge for Sarah Johnson, top-producing realtor in ZIP ${data.zip}.

VOICE: Polished, warm, never pushy. Plain text only — no markdown.

CLIENT
- Name: ${data.name}
- Email: ${data.email}${data.phone ? ` | Phone: ${data.phone}` : ''}
- Goal: ${data.role === 'buyer' ? 'Purchase' : 'Sale'} — ${data.propertyType}
- Budget / target: ${data.budget ? `$${Number(data.budget).toLocaleString()}` : 'Flexible'}
- Timeline: ${data.timeline}

RESPONSE STRUCTURE
1. Personal greeting using their name
2. Up to 3 smart qualifying questions (only if gaps remain)
3. Mini-CMA using these comps (cite addresses):
${compBlock}
4. ${data.role === 'buyer' ? 'Suggest 2–3 property profiles to hunt for (not fake addresses)' : 'Pricing strategy + staging tips'}
5. Clear CTA to connect with Sarah for full CMA / private tour

${marketTip}

If timeline is ASAP, note priority follow-up within 1 hour.

Close with: Reply YES to connect with Sarah now.
`.trim();
  },

  rules: {
    budget: (v) => (v > 1_500_000 ? '- Flag as luxury lead; white-glove tone.' : null),
    zip: (v) => `- Anchor all market commentary to ZIP ${v}.`,
    timeline: (v) => (v === '0-30' ? '- Priority: escalate to agent within 1 hour.' : null),
  },

  exportFilename: (data) =>
    `${(data.name || 'lead').replace(/\s+/g, '_')}_realestate_pro.json`,

  exportLead: (data, messages) => ({
    timestamp: new Date().toISOString(),
    template: 'RealEstatePro',
    lead: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      propertyType: data.propertyType,
      zip: data.zip,
      budget: data.budget,
      timeline: data.timeline,
    },
    conversation: messages
      .map((m) => `${m.role === 'user' ? 'Client' : 'Astra'}: ${m.content}`)
      .join('\n\n'),
  }),
};
