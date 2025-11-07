// templates/realestate.js
export const RealEstateTemplate = {
  name: "Real Estate Agent AI Assistant",
  form: () => [
    {
      id: "type",
      type: "select",
      label: "Buyer or Seller?",
      required: true,
      options: [
        { value: "buyer", label: "Buyer" },
        { value: "seller", label: "Seller" },
      ],
    },
    {
      id: "propertyType",
      type: "select",
      label: "Property Type",
      required: true,
      options: [
        { value: "house", label: "House" },
        { value: "condo", label: "Condo" },
        { value: "townhouse", label: "Townhouse" },
      ],
    },
    {
      id: "budget",
      type: "number",
      label: "Budget/Price Range ($)",
      placeholder: "e.g., 500000",
    },
  ],
  prompt: (data) => {
    const comps = data.type === "buyer" ? "3 similar listings" : "Market value estimate";
    return `You are a real estate agent. Type: ${data.type}. Property: ${data.propertyType}. Budget: ${data.budget || 'Flexible'}. Generate CMA, lead qualification questions, and open house script. End with "Reply with your thoughts or YES to schedule viewing."`;
  },
  rules: {
    budget: (value) => value > 1000000 ? "- Suggest luxury agent referral." : null,
  },
};