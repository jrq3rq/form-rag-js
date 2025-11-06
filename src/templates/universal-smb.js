// templates/universal-smb.js
export const UniversalSMBTemplate = {
  name: "Universal SMB AI Bot",
  form: [
    {
      id: "businessType",
      type: "select",
      label: "Your Business Type",
      options: [
        { value: "landscaper", label: "Landscaper & Lawn Care" },
        { value: "cleaning", label: "Professional Cleaning" },
        { value: "handyman", label: "Handyman & Electrician" },
        { value: "automotive", label: "Automotive Repair" },
        { value: "author", label: "Book Author" },
        { value: "artist", label: "Visual Artist" },
        { value: "realestate", label: "Real Estate Agent" },
      ],
    },
    { id: "service", type: "text", label: "Main Service (e.g. Mowing, Deep Clean)" },
    { id: "size", type: "number", label: "Size/Units (sq ft, rooms, pages, etc)" },
    {
      id: "urgency",
      type: "select",
      label: "Urgency",
      options: [
        { value: "normal", label: "Next Week" },
        { value: "asap", label: "ASAP (+20%)" },
      ],
    },
    { id: "upsell", type: "text", label: "Upsell Item (e.g. edging, windows, signed copy)" },
    { id: "pricePerUnit", type: "number", label: "Base Price per Unit (e.g. $0.05/sq ft)" },
    { id: "customerName", type: "text", label: "Customer Name (optional)" },
  ],
  prompt: (data) => {
    const name = data.customerName || "Customer";
    const base = data.size && data.pricePerUnit
      ? `Base: $${(data.size * data.pricePerUnit).toFixed(2)}`
      : "Custom pricing";

    return `You are ${data.businessType} AI assistant.
Customer: ${name}
Service: ${data.service}
Size: ${data.size || "N/A"}
Urgency: ${data.urgency}
${base}
Upsell: ${data.upsell || "None"}
Generate a friendly quote/booking. End with: Reply YES to confirm.`;
  },
  rules: {
    landscaper: "- Add edging (+$20) if yard > 5000 sq ft.",
    cleaning: "- Add windows (+$40) or fridge (+$25) as upsell.",
    handyman: "- Rate: $75/hr. Suggest inspection (+$50).",
    automotive: "- Suggest diagnostic (+$80).",
    author: "- Offer free chapter + signed copy bundle.",
    artist: "- Offer print bundle (3 for $100).",
    realestate: "- Include local market tip.",
  },
};