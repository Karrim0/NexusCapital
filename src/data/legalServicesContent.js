// Content for the Legal Services & Property Documentation feature.
// This is intentionally static (not wired to the dashboard CMS) because the
// lawyer's real name, photo, bio, credentials, and license details are not
// yet available — everything marked [PLACEHOLDER] below must be replaced
// with real, verified information before this goes live. Do not invent
// credentials, years of experience, or bar/license numbers.

export const legalServicesContent = {
  hero: {
    eyebrow: "Legal Services & Property Documentation",
    title: "Protect Your Investment Before You Sign",
    description:
      "Buying property in Egypt is an important investment. Our legal consultant provides professional legal support to help you understand, review, and verify the documents related to your property purchase.",
  },

  lawyer: {
    name: "[LAWYER NAME]",
    title: "Real Estate Lawyer & Legal Consultant",
    photo: "[LAWYER PHOTO]",
    bio: "[ADD LAWYER BIO HERE]",
    yearsOfExperience: "[YEARS OF EXPERIENCE]",
    licenseInfo: "[LICENSE / BAR INFORMATION]",
    phone: "[PHONE]",
    email: "[EMAIL]",
    expertise: [
      "Real Estate Law",
      "Property Contracts",
      "Property Due Diligence",
      "Ownership Verification",
      "Property Registration",
      "Power of Attorney",
      "Legal Documentation",
    ],
    languages: ["Arabic", "English", "Russian"],
    ctaLabel: "Request a Legal Consultation",
  },

  services: [
    {
      title: "Property Due Diligence",
      description: "Checking available ownership and property documents before purchase.",
    },
    {
      title: "Contract Review",
      description: "Reviewing sale and purchase agreements and explaining important terms.",
    },
    {
      title: "Ownership Verification",
      description: "Assistance with checking ownership documents and the seller's legal authority.",
    },
    {
      title: "Property Registration",
      description: "Legal assistance with property registration and ownership transfer procedures.",
    },
    {
      title: "Power of Attorney",
      description: "Assistance with preparing and reviewing powers of attorney related to property transactions.",
    },
    {
      title: "Property Documents",
      description: "Reviewing and organizing documents related to the property.",
    },
    {
      title: "Legal Consultation",
      description: "Professional legal consultation before buying, selling, or signing property documents.",
    },
    {
      title: "Support for Foreign Buyers",
      description: "Legal support designed for international clients purchasing property in Hurghada and the Red Sea.",
    },
  ],

  process: [
    {
      number: "01",
      title: "Verify",
      description: "Review the property and available legal documents.",
    },
    {
      number: "02",
      title: "Review",
      description: "Review the contract and explain the important legal terms.",
    },
    {
      number: "03",
      title: "Complete",
      description: "Assist with the required legal documentation and procedures.",
    },
  ],

  trust: {
    title: "Buy With Confidence",
    description:
      "Your property investment deserves more than a good location and a good price. Make sure the legal side is reviewed before you commit.",
    ctaLabel: "Talk to Our Legal Consultant",
  },

  foreignInvestors: {
    title: "Legal Support for International Property Buyers",
    description:
      "Whether you are buying your first property in Hurghada or expanding your investment portfolio in the Red Sea, our legal support helps you better understand the documentation and procedures involved in your transaction.",
    languagesHighlight: "English • Arabic • Russian Support",
  },

  faq: [
    {
      question: "Why should I have my property documents reviewed before buying?",
      answer:
        "A document review helps confirm what you are actually being offered before you commit funds, so any questions about ownership or the contract terms are raised while there is still time to address them.",
    },
    {
      question: "Can the lawyer review my purchase contract?",
      answer:
        "Yes. Our legal consultant can review your sale and purchase agreement and explain the key terms in plain language before you sign.",
    },
    {
      question: "Can you help verify property ownership documents?",
      answer:
        "Yes. We can assist with checking the available ownership documents and the seller's legal authority to sell the property.",
    },
    {
      question: "Can you assist with a Power of Attorney?",
      answer:
        "Yes. Our legal consultant can help prepare and review powers of attorney related to your property transaction.",
    },
    {
      question: "Can foreign buyers receive legal support?",
      answer:
        "Yes. Our legal support is designed with international buyers in mind, and consultations are available in multiple languages.",
    },
    {
      question: "Can you assist with property registration?",
      answer:
        "Yes. We can provide legal assistance with the property registration and ownership transfer procedures required for your transaction.",
    },
    {
      question: "When should I request a legal consultation?",
      answer:
        "Ideally before you sign any contract or make a payment, so the documents and terms can be reviewed while you still have room to ask questions or negotiate.",
    },
  ],

  disclaimer:
    "Legal services and consultations are provided by the designated legal consultant/lawyer. Information on this page is for general informational purposes and does not constitute legal advice. Specific legal advice should be obtained directly from the legal consultant based on the individual transaction.",
};

export default legalServicesContent;
