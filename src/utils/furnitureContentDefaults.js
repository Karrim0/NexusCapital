// Mirrors FurnitureContentController::defaultContent() on the backend.

const furnitureContentDefaults = {
  hero: {
    eyebrow: "Furniture & Furnishing",
    title: "Furnish Your Property, Move-In Ready",
    description:
      "From a single room to a fully ready-to-move apartment, our furnishing team helps owners and investors furnish Red Sea properties quickly, affordably, and to a standard that suits guests, tenants, or your own family.",
  },

  service_types: [
    { title: "Full Apartment Furnishing", description: "" },
    { title: "Bedroom Furniture", description: "" },
    { title: "Living Room & Reception", description: "" },
    { title: "Kitchen & Appliances", description: "" },
    { title: "Bathroom Accessories", description: "" },
    { title: "Lighting", description: "" },
    { title: "Curtains & Decoration", description: "" },
    { title: "TV & Electrical Appliances", description: "" },
    { title: "Complete Ready-to-Move Packages", description: "" },
  ],

  packages: [
    {
      name: "Basic",
      image: "[BASIC PACKAGE IMAGE]",
      description: "Essential furniture and appliances to make a property comfortably livable.",
      included: ["Bedroom set", "Living room seating", "Basic kitchen appliances", "Bathroom essentials"],
      price: "Request a Quote",
    },
    {
      name: "Premium",
      image: "[PREMIUM PACKAGE IMAGE]",
      description: "A fuller furnishing package with better finishes, ideal for rental-ready units.",
      included: ["Full bedroom & living room furniture", "Kitchen & appliances", "Lighting package", "Curtains & decoration"],
      price: "Request a Quote",
    },
    {
      name: "Luxury",
      image: "[LUXURY PACKAGE IMAGE]",
      description: "A complete, high-end, ready-to-move package for owners who want a premium finish.",
      included: ["Complete furniture across all rooms", "Premium appliances & electronics", "Full lighting & decoration", "Move-in ready styling"],
      price: "Request a Quote",
    },
  ],

  cta: {
    title: "Furnish Your Property With Us",
    description: "Tell us about your property and preferred package, and our team will get back to you with a tailored quote.",
    cta_label: "Request a Quote",
  },

  disclaimer:
    "Furnishing packages and pricing are confirmed individually based on property size, location, and selected items. Images are for illustration and may vary from the final delivered furniture.",
};

export default furnitureContentDefaults;
