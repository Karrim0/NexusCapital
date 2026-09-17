// Single source of truth for header navigation items.
//
// The dashboard's "Navigation Menu" editor only lets an admin toggle each
// item's visibility and reorder them — it never lets them edit the label
// text or path directly. That keeps two things safe:
//   1. Labels stay fully translated (driven by i18n, not free text typed
//      into one language and shown to everyone).
//   2. Paths can never be mistyped into a broken route.

export const NAV_MENU_ITEMS = {
  home: { path: "/", translationKey: "nav.home" },
  buy: { path: "/buy", translationKey: "nav.buy" },
  rent: { path: "/rent", translationKey: "nav.rent" },
  projects: { path: "/projects", translationKey: "nav.projects" },
  blog: { path: "/blog", translationKey: "nav.blog" },
  services: { path: "/services", translationKey: "nav.services" },
  legalServices: { path: "/legal-services", translationKey: "nav.legalServices" },
  rentalServices: { path: "/rental-services", translationKey: "nav.rentalServices" },
  furniture: { path: "/furniture-furnishing", translationKey: "nav.furniture" },
  faq: { path: "/faq", translationKey: "nav.faq" },
  landsBuildings: { path: "/lands-buildings", translationKey: "nav.landsBuildings" },
  about: { path: "/about", translationKey: "nav.about" },
  team: { path: "/about/team", translationKey: "nav.team" },
  contact: { path: "/contact", translationKey: "nav.contact" },
};

// Sub-items shown in the "Services" dropdown in the header nav. Kept
// separate from DEFAULT_NAV_MENU (which is the flat, admin-reorderable top
// bar) since these always live nested under "Services" rather than as their
// own top-level buttons.
export const SERVICES_DROPDOWN_KEYS = ["services", "legalServices", "rentalServices", "furniture"];

// Sub-items shown in the "About Us" dropdown in the header nav.
export const ABOUT_DROPDOWN_KEYS = ["about", "team"];

export const DEFAULT_NAV_MENU = [
  { key: "home", visible: true },
  { key: "buy", visible: true },
  { key: "rent", visible: true },
  { key: "projects", visible: true },
  { key: "blog", visible: true },
  { key: "services", visible: true },
  { key: "faq", visible: true },
  { key: "landsBuildings", visible: true },
  { key: "about", visible: true },
  { key: "contact", visible: true },
];
