// Dedicated design tokens for the new Nexus Capital home page.
// Kept separate from the app-wide MUI palette so the rest of the
// dashboard / other pages are not affected by this rebrand.

export const nx = {
  ink: "#0a0c10", // near-black background
  charcoal: "#0f1420",
  panel: "#12182a", // dark cards
  panelBorder: "rgba(201, 162, 75, 0.18)",
  cream: "#f4ede1", // light section background
  creamPaper: "#ffffff",
  gold: "#c9a24b",
  goldLight: "#e3c583",
  goldDark: "#a9822f",
  textOnDark: "#f5f1e6",
  textOnDarkMuted: "rgba(245, 241, 230, 0.68)",
  textOnCream: "#191510",
  textOnCreamMuted: "#6b6255",
  divider: "rgba(201, 162, 75, 0.25)",
  overlay: "rgba(6, 8, 12, 0.6)",
};

export const fontHeading = '"Playfair Display", Georgia, serif';
export const fontBody = '"Montserrat", "Cairo", sans-serif';

export const goldGradient = `linear-gradient(135deg, ${nx.goldLight} 0%, ${nx.gold} 50%, ${nx.goldDark} 100%)`;
