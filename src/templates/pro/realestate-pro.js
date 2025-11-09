// src/templates/pro/realestate-pro.js
import { fetchComps } from '../../lib/compsAPI.js';

export const RealEstateProTemplate = {
  name: 'Astra – AI Real Estate Concierge',

  form: () => [
    { id: 'name', type: 'text', label: 'Your Name', required: true, placeholder: 'Jane Doe' },
    { id: 'email', type: 'email', label: 'Email', required: true, placeholder: 'jane@example.com' },
    { id: 'phone', type: 'tel', label: 'Phone (optional)', placeholder: '(555) 123-4567' },
    {
      id: 'role',
      type: 'select',
      label: 'Are you...',
      required: true,
      options: [
        { value: 'buyer', label: 'Looking to Buy' },
        { value: 'seller', label: 'Selling My Home' },
      ],
    },
    {
      id: 'propertyType',
      type: 'select',
      label: 'Property Type',
      required: true,
      options: [
        { value: 'house', label: 'House' },
        { value: 'condo', label: 'Condo' },
        { value: 'townhouse', label: 'Townhouse' },
        { value: 'multifamily', label: 'Multi-Family' },
      ],
    },
    { id: 'zip', type: 'text', label: 'ZIP Code', required: true, placeholder: '90210' },
    { id: 'budget', type: 'number', label: 'Budget / Target Price ($)', placeholder: '750000', min: 0, step: 10000 },
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
    const marketTip = data.budget > 1_500_000 ? 'Luxury market: consider private listings.' : '';

    return `
You are **Astra**, AI concierge for **Sarah Johnson**, top realtor in ${data.zip}.
Client: ${data.name} (${data.email}${data.phone ? `, ${data.phone}` : ''})
Goal: ${data.role === 'buyer' ? 'Buying' : 'Selling'} a ${data.propertyType}
Budget: $${data.budget?.toLocaleString() || 'Flexible'}
Timeline: ${data.timeline}

**Step 1: Qualify Lead** (max 3 questions)
**Step 2: Mini-CMA**
${comps.map(c => `- ${c.address}: $${c.price.toLocaleString()} (${c.beds}bd/${c.baths}ba, ${c.sqft} sqft, ${c.daysAgo} days ago)`).join('\n')}

**Step 3: Next Step**
${data.role === 'buyer' ? 'Suggest 2–3 matching listings or schedule viewing.' : 'Recommend pricing strategy and staging tips.'}
${marketTip}

**Reply YES to connect with Sarah now and get your full CMA + private tour.**
`.trim();
  },

  rules: {
    budget: v => v > 1_500_000 ? '- Flag as luxury lead' : null,
    zip: v => `- Pull comps for ${v}`,
    timeline: v => v === '0-30' ? '- Priority: escalate within 1 hour' : null,
  },

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
    conversation: messages.map(m => `${m.role === 'user' ? 'Client' : 'Astra'}: ${m.content}`).join('\n\n'),
  }),
};