import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxContactHelpDetails = ({ content, whatsappNumber, phone, email, address, mapUrl }) => {
  const h = content.help_section;
  const d = content.details_section;

  const handleWhatsApp = () => {
    const p = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${p}`, "_blank", "noopener");
  };

  const detailValues = [phone, whatsappNumber, email, address];
  const detailLinks = [phone ? `tel:${phone.replace(/\s/g, "")}` : undefined, whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^\d+]/g, "").replace("+", "")}` : undefined, email ? `mailto:${email}` : undefined, mapUrl];

  return (
    <>
      <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{h.eyebrow}</Typography>
          </Stack>
          <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
                {h.title}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{h.description}</Typography>
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2.5} sx={{ mb: { xs: 6, md: 8 } }}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1.15rem", mb: 1.5 }}>{h.card_title}</Typography>
                {(h.paragraphs || []).map((p, i) => (
                  <Typography key={i} sx={{ color: nx.textOnCreamMuted, fontSize: "0.88rem", lineHeight: 1.8, mb: 1.5 }}>{p}</Typography>
                ))}
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {(h.bullets || []).map((b, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 17, mt: 0.2 }} />
                      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem" }}>{b}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box sx={{ bgcolor: nx.ink, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: "1.3rem", mb: 1.5 }}>{h.side_title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem", lineHeight: 1.75, mb: 3 }}>{h.side_description}</Typography>
                <Button onClick={handleWhatsApp} startIcon={<WhatsAppIcon />} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, py: 1.1, fontSize: "0.78rem", alignSelf: "flex-start", "&:hover": { bgcolor: nx.goldLight } }}>
                  {h.side_cta_label}
                </Button>
              </Box>
            </Grid2>
          </Grid2>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{d.eyebrow}</Typography>
          </Stack>
          <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
                {d.title}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{d.description}</Typography>
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2.5}>
            {(d.items || []).map((item, i) => (
              <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
                <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                  <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.15rem", mb: 0.6 }}>{item.title}</Typography>
                  {detailValues[i] && (
                    <Typography sx={{ color: "#a9822f", fontWeight: 700, fontSize: "0.9rem", mb: 0.8 }}>{detailValues[i]}</Typography>
                  )}
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.82rem", lineHeight: 1.6, mb: 1.2 }}>{item.description}</Typography>
                  {detailLinks[i] && (
                    <Typography component="a" href={detailLinks[i]} target={i === 3 ? "_blank" : undefined} rel={i === 3 ? "noopener" : undefined} sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.78rem", textDecoration: "none" }}>
                      {item.link_label} →
                    </Typography>
                  )}
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxContactHelpDetails;
