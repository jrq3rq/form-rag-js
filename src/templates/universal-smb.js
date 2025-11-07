// templates/universal-smb.js
export const UniversalSMBTemplate = {
  name: "Universal SMB AI Bot",
  form: (selectedBusiness = '') => {
    const baseFields = [
      {
        id: "businessType",
        type: "select",
        label: "Your Business Type",
        required: true,
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
    ];

    switch (selectedBusiness) {
      case "landscaper":
        return [
          ...baseFields,
          { id: "yardSize", type: "number", label: "Yard Size (sq ft)", required: true },
          { id: "edging", type: "checkbox", label: "Add Edging (+$20)" },
          { id: "fertilizer", type: "checkbox", label: "Apply Fertilizer (+$35)" },
          { id: "urgency", type: "select", label: "Urgency", options: [
            { value: "normal", label: "Next Week" },
            { value: "asap", label: "ASAP (+20%)" },
          ]},
        ];

      case "cleaning":
        return [
          ...baseFields,
          { id: "rooms", type: "number", label: "Number of Rooms", required: true },
          { id: "windows", type: "checkbox", label: "Clean Windows (+$40)" },
          { id: "fridge", type: "checkbox", label: "Clean Fridge (+$25)" },
          { id: "urgency", type: "select", label: "Urgency", options: [
            { value: "normal", label: "Next Available" },
            { value: "asap", label: "Rush (+25%)" },
          ]},
        ];

      case "realestate":
        return [
          ...baseFields,
          { id: "propertyType", type: "select", label: "Property Type", options: [
            { value: "house", label: "House" },
            { value: "condo", label: "Condo" },
            { value: "townhouse", label: "Townhouse" },
          ]},
          { id: "priceRange", type: "select", label: "Price Range", options: [
            { value: "under500k", label: "Under $500K" },
            { value: "500k-1m", label: "$500K - $1M" },
            { value: "over1m", label: "Over $1M" },
          ]},
          { id: "openHouse", type: "checkbox", label: "Schedule Open House" },
        ];

      default:
        return [
          ...baseFields,
          { id: "service", type: "text", label: "Describe Your Service", required: true },
          { id: "urgency", type: "select", label: "Urgency", options: [
            { value: "normal", label: "Standard" },
            { value: "asap", label: "ASAP" },
          ]},
        ];
    }
  },
  prompt: (data) => {
    const name = data.customerName || "Customer";
    let details = [];

    if (data.yardSize) details.push(`Yard: ${data.yardSize} sq ft`);
    if (data.rooms) details.push(`Rooms: ${data.rooms}`);
    if (data.service) details.push(`Service: ${data.service}`);
    if (data.urgency) details.push(`Urgency: ${data.urgency === 'asap' ? 'Rush' : 'Standard'}`);

    return `You are ${data.businessType} AI assistant.
Customer: ${name}
${details.join('\n') || 'Custom request'}
Generate a friendly quote. End with: Reply YES to confirm.`;
  },
  rules: {
    landscaper: "- Add edging (+$20) if yard > 5000 sq ft.",
    cleaning: "- Add windows (+$40) or fridge (+$25) as upsell.",
    realestate: "- Include local market tip.",
  },
};