// templates/cleaning.js
export const CleaningTemplate = {
  name: "Professional Cleaning AI Assistant",
  form: () => [
    {
      id: "rooms",
      type: "number",
      label: "Number of Rooms",
      placeholder: "e.g., 5",
      required: true,
      min: 1,
      max: 20,
    },
    {
      id: "addOns",
      type: "multi",
      label: "Add-Ons",
      options: [
        { value: "windows", label: "Windows (+$40)" },
        { value: "fridge", label: "Fridge (+$25)" },
        { value: "oven", label: "Oven (+$30)" },
      ],
    },
    {
      id: "frequency",
      type: "select",
      label: "Frequency",
      options: [
        { value: "one-time", label: "One-Time" },
        { value: "weekly", label: "Weekly (-10%)" },
        { value: "monthly", label: "Monthly (-20%)" },
      ],
    },
  ],
  prompt: (data) => {
    const base = data.rooms * 50;
    const extras = (data.addOns || []).reduce((sum, a) => {
      if (a === "windows") return sum + 40;
      if (a === "fridge") return sum + 25;
      if (a === "oven") return sum + 30;
      return sum;
    }, 0);
    const discount = data.frequency === "weekly" ? 0.9 : data.frequency === "monthly" ? 0.8 : 1;
    const total = (base + extras) * discount;
    return `You are a professional cleaner. Rooms: ${data.rooms}. Add-ons: ${data.addOns?.join(', ') || 'None'}. Frequency: ${data.frequency}. Base: $${base}. Extras: $${extras}. Total: $${total.toFixed(2)}. Generate a friendly quote, cleaning checklist, and scheduling options. End with "Reply with your thoughts or YES to book."`;
  },
  rules: {
    rooms: (value) => value > 10 ? "- Suggest deep clean add-on (+$100)." : null,
  },
};