import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

const businessLabels = {
  landscaper: 'Landscaper & lawn care',
  cleaning: 'Professional cleaning',
  handyman: 'Handyman & electrician',
  automotive: 'Automotive repair',
  author: 'Book author coach',
  artist: 'Visual artist commissions',
  realestate: 'Real estate advisor',
};

export const UniversalSMBTemplate = {
  name: 'Business Launchpad',
  icon: '🚀',
  tagline: 'One form — any small business',
  description:
    'Pick your industry, answer a few tailored questions, and get a branded quote or action plan from your AI front desk.',
  highlights: ['7 verticals', 'Smart follow-up chat', 'Lead-ready output'],
  theme: themes.universal,
  assistantName: 'Launchpad',
  submitLabel: 'Generate my plan',

  form: (selectedBusiness = '') => {
    const baseFields = [
      { id: 'sec_start', type: 'section', label: 'Get started' },
      {
        id: 'customerName',
        type: 'text',
        label: 'Your name',
        placeholder: 'Jamie Park',
        required: true,
      },
      {
        id: 'businessType',
        type: 'select',
        label: 'Business type',
        required: true,
        options: [
          { value: 'landscaper', label: '🌿 Landscaper & lawn care' },
          { value: 'cleaning', label: '✨ Professional cleaning' },
          { value: 'handyman', label: '🔧 Handyman & electrician' },
          { value: 'automotive', label: '🚗 Automotive repair' },
          { value: 'author', label: '📖 Book author' },
          { value: 'artist', label: '🎨 Visual artist' },
          { value: 'realestate', label: '🏡 Real estate' },
        ],
      },
    ];

    switch (selectedBusiness) {
      case 'landscaper':
        return [
          ...baseFields,
          { id: 'sec_details', type: 'section', label: 'Lawn details' },
          {
            id: 'yardSize',
            type: 'number',
            label: 'Yard size (sq ft)',
            required: true,
            placeholder: '2500',
          },
          { id: 'edging', type: 'checkbox', label: 'Add edging (+$20)' },
          { id: 'fertilizer', type: 'checkbox', label: 'Apply fertilizer (+$35)' },
          {
            id: 'urgency',
            type: 'select',
            label: 'Timing',
            options: [
              { value: 'normal', label: 'Next week' },
              { value: 'asap', label: 'ASAP (+20%)' },
            ],
          },
        ];

      case 'cleaning':
        return [
          ...baseFields,
          { id: 'sec_details', type: 'section', label: 'Cleaning details' },
          { id: 'rooms', type: 'number', label: 'Number of rooms', required: true },
          { id: 'windows', type: 'checkbox', label: 'Clean windows (+$40)' },
          { id: 'fridge', type: 'checkbox', label: 'Clean fridge (+$25)' },
          {
            id: 'urgency',
            type: 'select',
            label: 'Timing',
            options: [
              { value: 'normal', label: 'Next available' },
              { value: 'asap', label: 'Rush (+25%)' },
            ],
          },
        ];

      case 'realestate':
        return [
          ...baseFields,
          { id: 'sec_details', type: 'section', label: 'Property goals' },
          {
            id: 'propertyType',
            type: 'select',
            label: 'Property type',
            options: [
              { value: 'house', label: 'House' },
              { value: 'condo', label: 'Condo' },
              { value: 'townhouse', label: 'Townhouse' },
            ],
          },
          {
            id: 'priceRange',
            type: 'select',
            label: 'Price range',
            options: [
              { value: 'under500k', label: 'Under $500K' },
              { value: '500k-1m', label: '$500K – $1M' },
              { value: 'over1m', label: 'Over $1M' },
            ],
          },
          { id: 'openHouse', type: 'checkbox', label: 'Interested in open house planning' },
        ];

      default:
        return [
          ...baseFields,
          { id: 'sec_details', type: 'section', label: 'Your request' },
          {
            id: 'service',
            type: 'textarea',
            label: 'What do you need?',
            required: true,
            placeholder: 'Describe the job, timeline, and budget…',
          },
          {
            id: 'urgency',
            type: 'select',
            label: 'Urgency',
            options: [
              { value: 'normal', label: 'Standard' },
              { value: 'asap', label: 'ASAP' },
            ],
          },
        ];
    }
  },

  prompt: (data) => {
    const vertical = businessLabels[data.businessType] || data.businessType || 'small business';
    const details = [];

    if (data.yardSize) details.push(`Yard: ${data.yardSize} sq ft`);
    if (data.edging) details.push('Wants edging (+$20)');
    if (data.fertilizer) details.push('Wants fertilizer (+$35)');
    if (data.rooms) details.push(`Rooms: ${data.rooms}`);
    if (data.windows) details.push('Window cleaning (+$40)');
    if (data.fridge) details.push('Fridge cleaning (+$25)');
    if (data.propertyType) details.push(`Property type: ${data.propertyType}`);
    if (data.priceRange) details.push(`Price range: ${data.priceRange}`);
    if (data.openHouse) details.push('Interested in open house planning');
    if (data.service) details.push(`Request: ${data.service}`);
    if (data.urgency)
      details.push(`Timing: ${data.urgency === 'asap' ? 'Rush' : 'Standard'}`);

    return buildAssistantPrompt({
      persona: `the front-desk AI specialist for a ${vertical} business`,
      voice: `Speak as that industry expert. Match tone to ${vertical}.`,
      contextLines: [
        `Customer: ${data.customerName || 'Guest'}`,
        `Vertical: ${vertical}`,
        ...details,
      ],
      pricingNotes: [
        'Use rough industry-standard pricing when numbers were provided in context.',
        'If details are missing, ask one clarifying question at the end.',
      ],
      deliverables: [
        'Industry-appropriate greeting',
        'Quote or action plan with clear line items or steps',
        'Timeline or next appointment suggestion',
        'One relevant upsell only if it fits',
      ],
      closing: 'Invite them to reply YES to confirm or book.',
    });
  },

  rules: {
    landscaper: '- Suggest edging for yards over 5,000 sq ft.',
    cleaning: '- Mention window and appliance add-ons.',
    realestate: '- Include a local market tip and offer a CMA follow-up.',
    urgency: (value) => (value === 'asap' ? '- Priority scheduling language.' : null),
  },
};
