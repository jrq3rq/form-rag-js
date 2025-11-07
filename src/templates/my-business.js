// templates/my-business.js
export const MyBusinessTemplate = {
  name: "My Landscaping Co",
  form: [
    {
      id: "customerName",
      type: "text",
      label: "Your Name",
      placeholder: "John Doe",
      required: true,
    },
    {
      id: "yardSize",
      type: "number",
      label: "Yard Size (sq ft)",
      required: true,
      min: 100,
      max: 50000,
    },
    {
      id: "services",
      type: "multi",
      label: "Services Needed",
      options: [
        { value: "mowing", label: "Mowing ($0.03/sq ft)" },
        { value: "edging", label: "Edging (+$20)" },
        { value: "fertilizer", label: "Fertilizer (+$35)" },
      ],
    },
    {
      id: "urgency",
      type: "select",
      label: "When do you need it?",
      options: [
        { value: "next-week", label: "Next Week" },
        { value: "asap", label: "ASAP (+20%)" },
      ],
    },
  ],
  prompt: (data) => {
    const base = data.yardSize * 0.03;
    const extras = (data.services || []).reduce((sum, s) => {
      if (s === "edging") return sum + 20;
      if (s === "fertilizer") return sum + 35;
      return sum;
    }, 0);
    const total = (base + extras) * (data.urgency === "asap" ? 1.2 : 1);

    return `Customer: ${data.customerName}
Yard: ${data.yardSize} sq ft
Services: ${data.services?.join(", ") || "None"}
Urgency: ${data.urgency === "asap" ? "Rush" : "Standard"}
Base: $${base.toFixed(2)}
Extras: $${extras.toFixed(2)}
Total: $${total.toFixed(2)}
Reply YES to book.`;
  },
  rules: {
    yardSize: (value) => value > 5000 ? "- Add edging (+$20) if yard > 5000 sq ft." : null,
  },
};