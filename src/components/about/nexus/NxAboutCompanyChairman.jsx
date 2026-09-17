import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxAboutCompanyChairman = ({ content, whatsappNumber }) => {
  const company = content.company;
  const chairman = content.chairman;

  const handleWhatsApp = (text) => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <>
      <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{company.eyebrow}</Typography>
          </Stack>
          <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
                {company.title}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{company.description}</Typography>
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2.5}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1.15rem", mb: 1.5 }}>{company.card_title}</Typography>
                {(company.card_description || "").split("\n\n").map((p, i) => (
                  <Typography key={i} sx={{ color: nx.textOnCreamMuted, fontSize: "0.88rem", lineHeight: 1.8, mb: 2 }}>{p}</Typography>
                ))}
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1rem", mb: 1.5, mt: 2 }}>{company.help_title}</Typography>
                <Stack spacing={1}>
                  {(company.help_items || []).map((item, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 17, mt: 0.2 }} />
                      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem" }}>
                        <Box component="span" sx={{ fontWeight: 700, color: nx.textOnCream }}>{item.label}:</Box> {item.description}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box sx={{ bgcolor: nx.ink, borderRadius: 3, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ height: 260, backgroundImage: `url(${chairman.photo || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: "#1b2436" }} />
                <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 600, fontSize: "1.1rem" }}>{chairman.name}</Typography>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.75rem", mb: 2 }}>{chairman.title}</Typography>
                  <Box sx={{ bgcolor: "rgba(245,241,230,0.05)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 2, mb: 2.5, flex: 1 }}>
                    <Typography sx={{ color: nx.textOnDark, fontSize: "0.85rem", lineHeight: 1.7, fontStyle: "italic" }}>"{chairman.quote}"</Typography>
                  </Box>
                  <Button href="#chairman" fullWidth sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, py: 1.1, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}>
                    {company.cta_label}
                  </Button>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      <Box id="chairman" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 4, md: 6 }}>
            <Grid2 size={{ xs: 12, md: 7.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{chairman.eyebrow}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.9rem", md: "2.3rem" }, lineHeight: 1.2, mb: 3 }}>
                {chairman.message_title}
              </Typography>
              <Stack spacing={2} sx={{ mb: 3, maxWidth: 620 }}>
                {(chairman.paragraphs || []).map((p, i) => (
                  <Typography key={i} sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", lineHeight: 1.85 }}>{p}</Typography>
                ))}
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button onClick={() => handleWhatsApp("Hello! I'd like to discuss an investment opportunity.")} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3, py: 1.1, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}>
                  {chairman.primary_cta}
                </Button>
                <Button href="#contact" variant="outlined" sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, borderRadius: 999, px: 3, py: 1.1, fontSize: "0.78rem" }}>
                  {chairman.secondary_cta}
                </Button>
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4.5 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 3 }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 600, fontSize: "1.15rem", mb: 1.5 }}>{chairman.side_title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 2 }}>{chairman.side_description}</Typography>
                <Stack spacing={1.2}>
                  {(chairman.side_bullets || []).map((b, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 17, mt: 0.2 }} />
                      <Typography sx={{ color: nx.textOnDark, fontSize: "0.82rem" }}>{b}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxAboutCompanyChairman;
