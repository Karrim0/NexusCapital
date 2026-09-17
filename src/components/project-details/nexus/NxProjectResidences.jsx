import { Box, Container, Grid2, Stack, Typography, Chip, Button } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const defaultResidences = (project) => [
  {
    badge: project.starting_price ? `From ${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : "Request Price",
    title: "Starting-Price Opportunities",
    description: `Secure a modern coastal residence in ${project.location || "the Red Sea"} at today's prices before future value increases.`,
    cta_label: "Ask for Availability",
  },
  {
    badge: "Smart Look",
    title: "Luxury Coastal Living",
    description: "Contemporary design, sophisticated architecture, premium finishes, and a vibrant Red Sea setting.",
    cta_label: "Request Floor Plans",
  },
  {
    badge: "Sea Lifestyle",
    title: "Sea-View Investment Appeal",
    description: "Selected sea-view opportunities offer strong lifestyle value, attractive rental potential, and future resale appeal.",
    cta_label: "Ask for Sea Views",
  },
];

const NxProjectResidences = ({ project, whatsappNumber }) => {
  const items = project.residence_highlights?.length ? project.residence_highlights : defaultResidences(project);

  const handleWhatsApp = (title) => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(`Hello! I'm interested in "${project.name || project.title}" — ${title}.`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box id="residences" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ maxWidth: 560 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: "#5ce6d0" }} />
              <Typography sx={{ color: "#5ce6d0", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>RESIDENCES</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
              Modern coastal homes designed for living, holidays, and investment
            </Typography>
          </Box>
          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", maxWidth: 340 }}>
            {project.name || project.title} brings together elegant architecture, premium finishing, Red Sea lifestyle appeal, and flexible ownership options for personal use or investment.
          </Typography>
        </Stack>

        <Grid2 container spacing={2.5}>
          {items.map((item, i) => (
            <Grid2 key={i} size={{ xs: 12, sm: 4 }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                {item.badge && (
                  <Chip label={item.badge} size="small" sx={{ alignSelf: "flex-start", bgcolor: "rgba(15,157,120,0.1)", color: "#0f9d78", fontWeight: 700, fontSize: "0.68rem", mb: 1.5 }} />
                )}
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1.05rem", mb: 1 }}>{item.title}</Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 2, flex: 1 }}>{item.description}</Typography>
                <Button
                  onClick={() => handleWhatsApp(item.title)}
                  fullWidth
                  sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, py: 1.1, borderRadius: 999, fontSize: "0.76rem", "&:hover": { bgcolor: "#1a1f2b" } }}
                >
                  {item.cta_label || "Ask for Availability"}
                </Button>
              </Box>
            </Grid2>
          ))}
        </Grid2>

        {Array.isArray(project.unit_types) && project.unit_types.filter((u) => u?.type).length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.4rem", md: "1.7rem" }, lineHeight: 1.2, mb: 3 }}>
              From efficient studios to spacious homes
            </Typography>

            <Grid2 container spacing={2.5} sx={{ mb: 3 }}>
              {project.unit_types.filter((u) => u?.type).map((u, i) => (
                <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
                    {u.size_range && (
                      <Chip label={u.size_range} size="small" sx={{ alignSelf: "flex-start", bgcolor: "rgba(201,162,75,0.15)", color: "#a9822f", fontWeight: 700, fontSize: "0.66rem", mb: 1.5 }} />
                    )}
                    <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1rem", mb: 1 }}>{u.type}</Typography>
                    {u.price_from && (
                      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem" }}>
                        Price from <Box component="span" sx={{ color: nx.textOnCream, fontWeight: 700 }}>{u.price_from}</Box>
                      </Typography>
                    )}
                    {u.cash_price && (
                      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem" }}>
                        Cash from <Box component="span" sx={{ color: nx.textOnCream, fontWeight: 700 }}>{u.cash_price}</Box>
                      </Typography>
                    )}
                    {u.monthly && (
                      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem", mb: 2 }}>
                        Monthly x30 <Box component="span" sx={{ color: nx.textOnCream, fontWeight: 700 }}>{u.monthly}</Box>
                      </Typography>
                    )}
                    <Button
                      onClick={() => handleWhatsApp(`${u.type} unit`)}
                      fullWidth
                      sx={{ mt: "auto", bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, py: 1, borderRadius: 999, fontSize: "0.72rem", "&:hover": { bgcolor: "#1a1f2b" } }}
                    >
                      Ask for {u.type}
                    </Button>
                  </Box>
                </Grid2>
              ))}
            </Grid2>

            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, overflow: "hidden", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
              <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                <Box component="thead">
                  <Box component="tr" sx={{ bgcolor: "rgba(25,21,16,0.04)" }}>
                    {["Unit Type", "Listed Size Range", "Starting Price", "Cash Price", "Monthly x30"].map((h) => (
                      <Box component="th" key={h} sx={{ textAlign: "left", p: 1.5, fontSize: "0.68rem", fontWeight: 700, color: nx.textOnCreamMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {h}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box component="tbody">
                  {project.unit_types.filter((u) => u?.type).map((u, i) => (
                    <Box component="tr" key={i} sx={{ borderTop: "1px solid rgba(25,21,16,0.06)" }}>
                      <Box component="td" sx={{ p: 1.5, fontSize: "0.82rem", fontWeight: 700, color: nx.textOnCream }}>{u.type}</Box>
                      <Box component="td" sx={{ p: 1.5, fontSize: "0.82rem", color: nx.textOnCreamMuted }}>{u.size_range || "—"}</Box>
                      <Box component="td" sx={{ p: 1.5, fontSize: "0.82rem", color: nx.textOnCreamMuted }}>{u.price_from || "—"}</Box>
                      <Box component="td" sx={{ p: 1.5, fontSize: "0.82rem", color: nx.textOnCreamMuted }}>{u.cash_price || "—"}</Box>
                      <Box component="td" sx={{ p: 1.5, fontSize: "0.82rem", color: nx.textOnCreamMuted }}>{u.monthly || "—"}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NxProjectResidences;
