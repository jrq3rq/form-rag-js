// templates/automotive.js
export const AutomotiveTemplate = {
  name: "Automotive Repair AI Assistant",
  form: () => [
    {
      id: "vehicle",
      type: "text",
      label: "Vehicle (Year/Make/Model)",
      placeholder: "e.g., 2015 Toyota Camry",
      required: true,
    },
    {
      id: "issue",
      type: "select",
      label: "Main Issue",
      required: true,
      options: [
        { value: "brakes", label: "Brakes" },
        { value: "engine", label: "Engine Light" },
        { value: "tires", label: "Tires/Alignment" },
      ],
    },
    {
      id: "mileage",
      type: "number",
      label: "Mileage",
      placeholder: "e.g., 120000",
    },
  ],
  prompt: (data) => {
    const base = data.issue === "brakes" ? 300 : data.issue === "engine" ? 150 : 200;
    const upsell = data.mileage > 100000 ? " (Recommend oil change +$50)" : "";
    return `You are an automotive repair specialist. Vehicle: ${data.vehicle}. Issue: ${data.issue}. Mileage: ${data.mileage || 'N/A'}. Base cost: $${base}. ${upsell}. Generate diagnostic quote, parts list, and appointment options. End with "Reply with your thoughts or YES to book."`;
  },
  rules: {
    mileage: (value) => value > 100000 ? "- Suggest full inspection (+$80)." : null,
  },
};