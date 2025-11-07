// templates/landscaper.js
export const LandscaperTemplate = {
  name: "Landscaper & Lawn Care AI Assistant",
  form: () => [
    {
      id: "yardSize",
      type: "number",
      label: "Yard Size (sq ft)",
      placeholder: "e.g., 2500",
      required: true,
      min: 100,
      max: 50000,
    },
    {
      id: "services",
      type: "multi",
      label: "Core Services",
      options: [
        { value: "mowing", label: "Mowing ($0.03/sq ft)" },
        { value: "trimming", label: "Trimming & Edging (+$25)" },
        { value: "fertilizer", label: "Fertilizer (+$0.01/sq ft)" },
      ],
    },
    {
      id: "urgency",
      type: "select",
      label: "Preferred Time",
      options: [
        { value: "weekend", label: "Weekend" },
        { value: "weekday", label: "Weekday" },
        { value: "asap", label: "ASAP (+20%)" },
      ],
    },
  ],
  prompt: (data) => {
    const base = data.yardSize * 0.03;
    const extras = (data.services || []).reduce((sum, s) => {
      if (s === "trimming") return sum + 25;
      if (s === "fertilizer") return sum + (data.yardSize * 0.01);
      return sum;
    }, 0);
    const total = (base + extras) * (data.urgency === "asap" ? 1.2 : 1);
    const upsell = data.yardSize > 5000 ? " (Recommend aeration for $50)" : "";
    return `You are a professional landscaper. Customer yard: ${data.yardSize} sq ft. Services: ${data.services?.join(', ') || 'Basic mowing'}. Urgency: ${data.urgency}. Base: $${base.toFixed(2)}. Extras: $${extras.toFixed(2)}. Total: $${total.toFixed(2)}${upsell}. Generate a friendly quote, schedule suggestion, and next steps. End with "Reply with your thoughts or YES to book."`;
  },
  rules: {
    yardSize: (value) => value > 5000 ? "- Suggest aeration (+$50) for large yards." : null,
  },
};