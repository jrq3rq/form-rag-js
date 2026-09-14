import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

export const RealEstateTemplate = {
  name: 'Harbor Realty Group',
  icon: '🏡',
  tagline: 'Buy or sell with local market insight',
  description:
    'Share your goals and budget — get a mini market snapshot, qualifying questions, and a clear next step with an agent.',
  highlights: ['Neighborhood specialists', 'Free CMA preview', 'Virtual tours'],
  theme: themes.home,
  assistantName: 'Harbor',
  submitLabel: 'Get my market snapshot',

  form: () => [
    { id: 'sec_you', type: 'section', label: 'You & your goals' },
    {
      id: 'customerName',
      type: 'text',
      label: 'Name',
      required: true,
      placeholder: 'Taylor Brooks',
    },
    {
      id: 'type',
      type: 'select',
      label: 'I am a…',
      required: true,
      options: [
        { value: 'buyer', label: 'Buyer — looking for a home' },
        { value: 'seller', label: 'Seller — preparing to list' },
      ],
    },
    { id: 'sec_property', type: 'section', label: 'Property' },
    {
      id: 'propertyType',
      type: 'select',
      label: 'Property type',
      required: true,
      options: [
        { value: 'house', label: 'Single-family house' },
        { value: 'condo', label: 'Condo / townhome' },
        { value: 'townhouse', label: 'Townhouse' },
        { value: 'land', label: 'Land / lot' },
      ],
    },
    {
      id: 'zip',
      type: 'text',
      label: 'Target ZIP or neighborhood',
      placeholder: 'e.g., 97201 or Pearl District',
      required: true,
    },
    {
      id: 'budget',
      type: 'number',
      label: 'Budget or list price ($)',
      placeholder: 'e.g., 525000',
      min: 0,
      step: 5000,
    },
    {
      id: 'timeline',
      type: 'select',
      label: 'Timeline',
      options: [
        { value: '0-30', label: 'Ready in 30 days' },
        { value: '30-90', label: '1–3 months' },
        { value: '90+', label: 'Just exploring' },
      ],
    },
  ],

  prompt: (data) => {
    const role = data.type === 'buyer' ? 'buyer' : 'seller';

    return buildAssistantPrompt({
      persona: 'Jordan, licensed advisor at Harbor Realty Group',
      businessName: 'Harbor Realty Group',
      voice: 'Consultative, local expert. No hype — focus on fit and timing.',
      contextLines: [
        `Client: ${data.customerName || 'Guest'}`,
        `Role: ${role}`,
        `Property type: ${data.propertyType}`,
        `Area: ${data.zip}`,
        `Budget / price target: ${data.budget ? `$${Number(data.budget).toLocaleString()}` : 'Flexible'}`,
        `Timeline: ${data.timeline || 'Not specified'}`,
      ],
      pricingNotes: [
        role === 'buyer'
          ? 'Discuss pre-approval, closing costs, and comparable ranges — no fabricated listings.'
          : 'Discuss pricing strategy, staging, and net proceeds — no guaranteed sale price.',
      ],
      deliverables: [
        role === 'buyer'
          ? '3 questions to sharpen their search (must-haves, commute, schools)'
          : '3 questions about condition, upgrades, and motivation',
        'Mini market snapshot for their ZIP (trends, buyer/seller leverage — general)',
        'Suggested next step (tour, CMA, or listing consult)',
        'Offer to connect with a human agent for a full CMA',
      ],
      upsells: [
        Number(data.budget) > 1_000_000 ? 'Luxury portfolio & private listings team' : null,
        'Free staging consult for sellers',
      ],
      closing:
        'Invite them to reply YES to schedule a 15-minute call with a Harbor agent.',
    });
  },

  rules: {
    budget: (value) =>
      value > 1_000_000 ? '- Flag luxury tier; mention private listing network.' : null,
    timeline: (value) =>
      value === '0-30' ? '- Priority follow-up within 24 hours.' : null,
  },
};
