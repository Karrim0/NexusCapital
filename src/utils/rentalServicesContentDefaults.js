// Mirrors RentalServicesContentController::defaultContent() on the backend.

const rentalServicesContentDefaults = {
  hero: {
    eyebrow: "Rental Services",
    title: "Rent With Confidence, Manage With Ease",
    description:
      "Whether you are an owner looking to rent out your property or a tenant looking for a home in Hurghada, our rental team handles listing, screening, contracts, and day-to-day management so you do not have to.",
  },

  manager: {
    name: "[MANAGER NAME]",
    title: "Rental Services Manager",
    photo: "[MANAGER PHOTO]",
    bio: "[ADD MANAGER BIO HERE]",
    years_of_experience: "[YEARS OF EXPERIENCE]",
    license_info: "",
    phone: "[PHONE]",
    email: "[EMAIL]",
    expertise: [
      "Property Listing & Marketing",
      "Tenant Screening",
      "Rental Contracts",
      "Rent Collection",
      "Maintenance Coordination",
      "Short-Term & Holiday Rentals",
    ],
    languages: ["Arabic", "English", "Russian"],
    cta_label: "Request a Rental Consultation",
  },

  services: [
    { title: "Property Listing & Marketing", description: "Preparing and promoting your property to attract qualified tenants." },
    { title: "Tenant Screening & Matching", description: "Finding and vetting tenants suited to your property and terms." },
    { title: "Rental Contract Drafting", description: "Preparing clear rental agreements that protect both owner and tenant." },
    { title: "Rent Collection & Accounting", description: "Handling monthly rent collection and providing owners with clear statements." },
    { title: "Property Maintenance Coordination", description: "Arranging repairs and upkeep so the property stays in good condition." },
    { title: "Furnished Rental Setup", description: "Helping owners prepare furnished units ready for tenants or holiday guests." },
    { title: "Short-Term & Holiday Rentals", description: "Managing short-stay bookings for owners who want flexible rental income." },
    { title: "Support for Overseas Owners", description: "Remote property management for owners who live outside Egypt." },
  ],

  process: [
    { number: "01", title: "List & Assess", description: "Share your property or rental needs, and we assess the right approach." },
    { number: "02", title: "Match & Contract", description: "We match owners with tenants and prepare a clear rental agreement." },
    { number: "03", title: "Manage & Collect", description: "We handle rent collection, maintenance, and ongoing communication." },
  ],

  trust: {
    title: "Rent With Confidence",
    description: "A rented property should be one less thing to worry about. Let our rental team handle the details while you enjoy the return.",
    cta_label: "Talk to Our Rental Team",
  },

  foreign_investors: {
    title: "Rental Management for Overseas Property Owners",
    description:
      "If you live outside Egypt, our rental team can manage your property on your behalf — from finding tenants to collecting rent and coordinating maintenance — with regular updates wherever you are.",
    languages_highlight: "English • Arabic • Russian Support",
  },

  faq: [
    { question: "Can you manage my property if I live abroad?", answer: "Yes. Our rental team can handle listing, tenant screening, contracts, rent collection, and maintenance coordination remotely on your behalf." },
    { question: "How do you find tenants for my property?", answer: "We list and market your property, then screen interested tenants before matching them with your unit and terms." },
    { question: "Do you handle the rental contract?", answer: "Yes. We prepare a clear rental agreement covering the terms, duration, and responsibilities of both owner and tenant." },
    { question: "How is rent collected?", answer: "We coordinate rent collection on the agreed schedule and provide owners with clear statements." },
    { question: "Can you help furnish my property for rental?", answer: "Yes. We can help owners prepare furnished units ready for long-term tenants or short-stay guests." },
    { question: "Do you offer short-term or holiday rental management?", answer: "Yes. We manage short-stay bookings for owners who prefer flexible rental income over long-term leases." },
    { question: "What if maintenance is needed during the rental period?", answer: "We coordinate repairs and upkeep with the owner's approval, so the property stays in good condition throughout the tenancy." },
  ],

  disclaimer:
    "Rental management services are provided by the Nexus Capital rental team. Terms, availability, and pricing are confirmed individually for each property before any agreement is signed.",
};

export default rentalServicesContentDefaults;
