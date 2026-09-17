// Mirrors AboutContentController::defaultContent() on the backend.

const aboutContentDefaults = {
  hero: {
    eyebrow: "ABOUT NEXUS CAPITAL",
    title_prefix: "Setting New Standards For",
    title_highlight: "Living By The Sea Coast",
    description: "Nexus Capital is a Hurghada-based private real estate investment company built for buyers, sellers, renters, investors, and developers who want trusted Red Sea market guidance.",
    primary_cta: "READ CHAIRMAN'S MESSAGE",
    secondary_cta: "TALK TO OUR TEAM",
    background_image: null,
    chips: ["Hurghada-based expertise", "Red Sea property focus", "Developer and buyer support", "Trust-first service"],
    snapshot: {
      title: "Company Snapshot",
      subtitle: "Local knowledge. International buyer understanding.",
      stats: [
        { value: "01", label: "Unique projects and selected opportunities" },
        { value: "01", label: "City center project category" },
        { value: "01", label: "Seafront project category" },
      ],
      bullets: [
        "Red Sea Coverage: Hurghada, Sahl Hasheesh, El Gouna, Makadi, and Soma Bay.",
        "Curated Portfolio: apartments, villas, commercial units, developments, and investment options.",
        "Buyer-Led Advice: area, project, pricing, and payment-plan clarity before reservation.",
      ],
    },
    feature_cards: [
      { title: "Red Sea Coverage", description: "Hurghada, Sahl Hasheesh, El Gouna, Makadi, Soma Bay, and nearby areas." },
      { title: "Curated Portfolio", description: "Apartments, villas, commercial units, developments, and investment options." },
      { title: "Buyer-Led Advice", description: "Area, project, pricing, and payment-plan clarity before reservation." },
      { title: "Reliable Service", description: "Transparent support for buying, renting, selling, and investing." },
    ],
  },

  company: {
    eyebrow: "OUR COMPANY",
    title: "A premier Red Sea brokerage with a buyer-first standard",
    description: "Nexus Capital provides an extensive selection of properties across Hurghada, Sahl Hasheesh, El Gouna, Makadi, and Soma Bay.",
    card_title: "Trusted guidance across the Red Sea region",
    card_description: "The company serves developers and individual homebuyers across the Red Sea region with a reputation for reliable brokerage service. Our work is shaped by a detailed understanding of domestic and international investor requirements. We focus on fine developments, desirable locations, fair pricing, and long-term client confidence.\n\nWhether you want to buy, rent, or sell an apartment, villa, or commercial unit in the Red Sea zone, Nexus Capital is committed to high-quality service and dependable guidance.",
    help_title: "What we help with",
    help_items: [
      { label: "Buy", description: "compare areas, projects, prices, payment plans, and delivery timelines." },
      { label: "Rent", description: "identify suitable residential or holiday options by location and lifestyle." },
      { label: "Sell", description: "position your Red Sea property with local market knowledge and buyer access." },
      { label: "Invest", description: "evaluate rental potential, location demand, and long-term value." },
    ],
    cta_label: "READ THE MESSAGE",
  },

  chairman: {
    photo: null,
    name: "Ahmed Mohameden",
    title: "Founder and CEO · Real Estate Investment Expert",
    quote: "Our mission is simple: to deliver expertise, transparency, and personalized service — ensuring that every client makes confident and rewarding investment decisions.",
    eyebrow: "CHAIRMAN'S MESSAGE",
    message_title: "Experience, transparency, and personalized service",
    paragraphs: [
      "I'm Ahmed Mohameden, a real estate investment expert and the founder of Nexus Capital. Over the past 11 years, I've built my career in one of Egypt's most dynamic and rapidly evolving sectors — real estate.",
      "My passion for development and Egypt's property industry led me into real estate more than a decade ago. After working with agencies, developers, and investors, I identified a need for a trusted, client-focused company that understood local and international investors.",
      "Nexus Capital specializes in premier properties across Hurghada, Sahl Hasheesh, El Gouna, Makadi, and Soma Bay. The portfolio serves individual homebuyers, developers, and investors pursuing strategic opportunities.",
    ],
    primary_cta: "DISCUSS INVESTMENT",
    secondary_cta: "CONTACT OFFICE",
    side_title: "Selective Representation",
    side_description: "We are selective about the developments we represent, focusing on quality, prime locations, and competitive pricing to help maximize value and returns for clients.",
    side_bullets: ["Prime Red Sea destinations", "Individual homebuyer and developer support", "Clear communication before reservation"],
  },

  certifications: {
    eyebrow: "CERTIFICATIONS & TRUST",
    title: "",
    description: "",
    items: [],
  },

  why_choose: {
    eyebrow: "WHY CHOOSE US",
    title: "The standard behind every client relationship",
    description: "Our goal is to help clients make confident property decisions with local insight, careful selection, transparent communication, and practical investment guidance.",
    items: [
      { number: "01", title: "Market Insight", description: "Hands-on Red Sea market experience across residential, resort, luxury, and commercial real estate." },
      { number: "02", title: "Selective Representation", description: "We focus on quality, prime locations, and competitive pricing so clients can evaluate opportunities with confidence." },
      { number: "03", title: "International Buyer Support", description: "Guidance tailored to domestic and international investors, including remote advice and practical next steps." },
      { number: "04", title: "Developer Collaboration", description: "Support for developers and investors who share a vision for excellence in Egypt's property market." },
      { number: "05", title: "Transparent Process", description: "Clear communication around reservation, documents, payment plans, handover, rental potential, and resale options." },
      { number: "06", title: "Long-Term Stability", description: "Advice designed around financial success, long-term growth, and ownership confidence in the Red Sea region." },
    ],
  },

  destinations: {
    eyebrow: "WHERE WE WORK",
    title: "Premier Red Sea destinations under one expert team",
    description: "Nexus Capital focuses on the locations buyers ask about most: from central Hurghada and Al Ahyaa to premium coastal destinations and resort-led communities.",
    items: [
      { name: "Hurghada", description: "City convenience, tourism demand, practical ownership, ready units, and developer projects.", link_label: "Explore Hurghada properties", image: null },
      { name: "Sahl Hasheesh", description: "Premium coastal positioning for lifestyle buyers who value resort-style presentation.", link_label: "Compare projects", image: null },
      { name: "Al Ahyaa", description: "Value-driven northern Hurghada area for beachfront projects, space, and growth potential.", link_label: "Request options", image: null },
      { name: "Makadi & Soma Bay", description: "Resort-led communities for calmer ownership, premium beach access, and second-home appeal.", link_label: "Ask advisor", image: null },
      { name: "El Gouna", description: "Established lifestyle demand near northern Hurghada with strong buyer interest.", link_label: "View opportunities", image: null },
    ],
  },

  method: {
    eyebrow: "OUR METHOD",
    title: "How we guide your Red Sea property decision",
    description: "Every client journey is different, but the standard is consistent: understand the goal, compare carefully, advise transparently, and support the next step.",
    steps: [
      { number: "1", title: "Understand Your Goal", description: "Holiday home, rental income, relocation, resale, commercial unit, developer launch, or long-term investment needs." },
      { number: "2", title: "Shortlist Carefully", description: "Compare destination, developer, unit types, prices, payment plan, delivery timeline, and expected ownership needs." },
      { number: "3", title: "Explain the Details", description: "Clarify reservation steps, documents, viewings, contracts, handover, furnishing, rental readiness, and resale strategy." },
      { number: "4", title: "Support After Choice", description: "Coordinate follow-up, developer communication, property viewing trips, after-sales questions, and long-term planning." },
    ],
  },

  contact: {
    eyebrow: "GET IN TOUCH",
    title: "Connect with Nexus Capital",
    description: "Use the contact details below or prepare a WhatsApp message for a faster response from the property team.",
    phone_label: "Phone Number",
    email_label: "Email",
    address_label: "Address",
    hours_label: "Business Hours",
    business_hours: "Saturday — Friday · 9am – 5pm",
    form_title: "Send us a message",
    form_description: "Complete the form and continue to WhatsApp with your enquiry already prepared.",
    enquiry_options: ["Buying property", "Selling property", "Renting property", "Developer collaboration", "Investment consultation"],
    submit_label: "CONTINUE ON WHATSAPP",
    form_disclaimer: "Nothing is sent until you review the prepared message and press Send in WhatsApp.",
  },

  cta_section: {
    blog_title: "Research Egypt's Red Sea property market",
    blog_description: "Read buyer guides, project updates, area comparisons, payment-plan explainers, and investment insights from Nexus Capital.",
    blog_cta_label: "VISIT PROPERTY BLOG",
    blog_url: "/blog",
    consult_title: "Ready to own property by the Red Sea?",
    consult_description: "Speak with Nexus Capital and receive a curated shortlist based on your budget, area, and investment goal.",
    consult_cta_label: "BOOK WHATSAPP CONSULTATION",
  },
};

export default aboutContentDefaults;
