import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

export const CleaningTemplate = {
  name: 'Sparkle & Co.',
  icon: '✨',
  tagline: 'Home cleaning quotes in seconds',
  description:
    'Build a custom clean — room count, add-ons, and recurring discounts — with a checklist you can share with your crew.',
  highlights: ['Background-checked staff', 'Supplies included', 'Recurring discounts'],
  theme: themes.clean,
  assistantName: 'Sparkle',
  submitLabel: 'See my cleaning plan',

  form: () => [
    { id: 'sec_home', type: 'section', label: 'About your home' },
    {
      id: 'customerName',
      type: 'text',
      label: 'Name',
      placeholder: 'Jordan Lee',
      required: true,
    },
    {
      id: 'rooms',
      type: 'number',
      label: 'Rooms to clean',
      hint: 'Count bedrooms, living areas, and offices — skip unused storage.',
      placeholder: 'e.g., 5',
      required: true,
      min: 1,
      max: 20,
    },
    {
      id: 'homeType',
      type: 'select',
      label: 'Home type',
      options: [
        { value: 'apartment', label: 'Apartment / condo' },
        { value: 'house', label: 'Single-family home' },
        { value: 'office', label: 'Small office' },
      ],
    },
    { id: 'sec_extras', type: 'section', label: 'Extras & schedule' },
    {
      id: 'addOns',
      type: 'multi',
      label: 'Deep-clean add-ons',
      options: [
        { value: 'windows', label: 'Interior windows (+$40)' },
        { value: 'fridge', label: 'Inside fridge (+$25)' },
        { value: 'oven', label: 'Inside oven (+$30)' },
        { value: 'cabinets', label: 'Cabinet fronts (+$35)' },
      ],
    },
    {
      id: 'frequency',
      type: 'select',
      label: 'How often?',
      required: true,
      options: [
        { value: 'one-time', label: 'One-time deep clean' },
        { value: 'weekly', label: 'Weekly (10% off)' },
        { value: 'biweekly', label: 'Every 2 weeks (15% off)' },
        { value: 'monthly', label: 'Monthly (20% off)' },
      ],
    },
  ],

  prompt: (data) => {
    const rooms = Number(data.rooms) || 0;
    const base = rooms * 50;
    const extras = (data.addOns || []).reduce((sum, a) => {
      if (a === 'windows') return sum + 40;
      if (a === 'fridge') return sum + 25;
      if (a === 'oven') return sum + 30;
      if (a === 'cabinets') return sum + 35;
      return sum;
    }, 0);
    const discount =
      data.frequency === 'weekly'
        ? 0.9
        : data.frequency === 'biweekly'
          ? 0.85
          : data.frequency === 'monthly'
            ? 0.8
            : 1;
    const total = (base + extras) * discount;

    return buildAssistantPrompt({
      persona: 'Elena, lead coordinator at Sparkle & Co. residential cleaning',
      businessName: 'Sparkle & Co.',
      voice: 'Calm, detail-oriented. Celebrate a tidy home without being cheesy.',
      contextLines: [
        `Customer: ${data.customerName || 'Guest'}`,
        `Rooms: ${rooms}`,
        `Home type: ${data.homeType || 'Not specified'}`,
        `Add-ons: ${(data.addOns || []).join(', ') || 'None'}`,
        `Frequency: ${data.frequency}`,
      ],
      pricingNotes: [
        `Base (${rooms} rooms × $50): $${base.toFixed(2)}`,
        `Add-ons: $${extras.toFixed(2)}`,
        `After frequency discount: $${total.toFixed(2)} estimated`,
      ],
      deliverables: [
        'Personalized greeting',
        'Itemized quote with recurring discount explained if applicable',
        'Room-by-room mini checklist (what we will tackle)',
        'Suggested time window (morning vs afternoon)',
        'What to do before we arrive (dishes, pets, access)',
      ],
      upsells: [
        rooms > 10 ? 'Whole-home deep clean add-on (+$100)' : null,
        'Move-in / move-out package',
      ],
    });
  },

  rules: {
    rooms: (value) => (value > 10 ? '- Mention whole-home deep clean option.' : null),
    frequency: (value) =>
      value !== 'one-time' ? '- Highlight loyalty discount and preferred recurring day.' : null,
  },
};
