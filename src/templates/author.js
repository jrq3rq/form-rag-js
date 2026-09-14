import { themes } from './shared/themes.js';
import { buildAssistantPrompt } from './shared/promptStyle.js';

export const AuthorTemplate = {
  name: 'StoryForge Studio',
  icon: '📖',
  tagline: 'From idea to outline',
  description:
    'Whether fiction or memoir — get a structured outline, chapter beats, and a realistic writing schedule.',
  highlights: ['Bestseller coaches', 'Genre templates', 'Accountability check-ins'],
  theme: themes.book,
  assistantName: 'StoryForge',
  submitLabel: 'Build my book plan',

  form: () => [
    { id: 'sec_project', type: 'section', label: 'Your book' },
    {
      id: 'authorName',
      type: 'text',
      label: 'Your name',
      required: true,
      placeholder: 'Riley Chen',
    },
    {
      id: 'genre',
      type: 'select',
      label: 'Genre',
      required: true,
      options: [
        { value: 'fiction', label: 'Fiction — novel or series' },
        { value: 'nonfiction', label: 'Non-fiction — how-to or business' },
        { value: 'memoir', label: 'Memoir / personal story' },
      ],
    },
    {
      id: 'wordGoal',
      type: 'number',
      label: 'Target word count',
      hint: 'Typical novel: 70k–90k. Memoir: 60k–80k.',
      placeholder: 'e.g., 80000',
      required: true,
      min: 5000,
      step: 1000,
    },
    {
      id: 'plot',
      type: 'textarea',
      label: 'Premise or working title',
      placeholder: 'One paragraph on theme, protagonist, and conflict…',
    },
    { id: 'sec_habits', type: 'section', label: 'Writing habits' },
    {
      id: 'pace',
      type: 'select',
      label: 'Words per week you can write',
      options: [
        { value: '500', label: '~500 — nights & weekends' },
        { value: '2000', label: '~2,000 — steady side project' },
        { value: '5000', label: '~5,000 — serious sprint' },
      ],
    },
  ],

  prompt: (data) => {
    const structure =
      data.genre === 'fiction'
        ? '3-act structure with midpoint reversal'
        : data.genre === 'memoir'
          ? 'Thematic chapters with emotional arc'
          : 'Problem → framework → case studies → action steps';

    return buildAssistantPrompt({
      persona: 'Morgan, developmental editor at StoryForge Studio',
      businessName: 'StoryForge Studio',
      voice: 'Encouraging coach. Concrete milestones, no vague motivation.',
      contextLines: [
        `Author: ${data.authorName || 'Guest'}`,
        `Genre: ${data.genre}`,
        `Word goal: ${data.wordGoal}`,
        `Premise: ${data.plot || 'To be developed in session'}`,
        `Weekly pace: ~${data.pace || '2000'} words`,
        `Structure approach: ${structure}`,
      ],
      pricingNotes: [
        'Mention manuscript review packages only if word count exceeds 100k.',
      ],
      deliverables: [
        'High-level outline (8–12 chapter or section titles with one-line summaries)',
        'Recommended weekly word targets to hit their goal',
        'One habit tip tailored to their pace',
        'First writing prompt or exercise to start chapter 1',
      ],
      upsells: [
        Number(data.wordGoal) > 100000 ? 'Developmental edit package (+$500 ballpark)' : null,
        'Accountability check-in bundle',
      ],
      closing: 'Invite them to reply YES to receive a downloadable chapter worksheet.',
    });
  },

  rules: {
    wordGoal: (value) =>
      value > 100000 ? '- Suggest professional developmental edit before querying agents.' : null,
    genre: (value) =>
      value === 'memoir' ? '- Note sensitivity reader for traumatic themes.' : null,
  },
};
