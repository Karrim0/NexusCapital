import { Box, Container, Grid2, Stack, Typography, Button, Chip } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxTestimonialsSection = ({ content, whatsappNumber }) => {
  const { t } = useTranslation();
  const s = content.testimonials_section;

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
              <Chip label={s.badge} size="small" sx={{ bgcolor: "rgba(25,21,16,0.06)", fontWeight: 700, fontSize: "0.65rem" }} />
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.15, mb: 1.5 }}>
              {s.title}
            </Typography>
            <Stack direction="row" spacing={0.3} sx={{ mb: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarRoundedIcon key={i} sx={{ color: nx.gold, fontSize: 22 }} />
              ))}
            </Stack>

            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, boxShadow: "0 14px 34px rgba(25,21,16,0.06)", mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1rem", mb: 0.5 }}>
                {s.reviews_count} {t("nxCommon.googleReviews")}
              </Typography>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem" }}>{s.reviews_note}</Typography>
            </Box>

            <Stack spacing={1.5}>
              <Button
                href={s.google_reviews_url || undefined}
                target={s.google_reviews_url ? "_blank" : undefined}
                rel="noopener"
                fullWidth
                variant="contained"
                sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}
              >
                {s.read_reviews_label}
              </Button>
              <Button
                onClick={handleWhatsApp}
                startIcon={<WhatsAppIcon />}
                fullWidth
                variant="contained"
                sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.78rem", "&:hover": { bgcolor: "#1a1f2b" } }}
              >
                {s.message_advisor_label}
              </Button>
            </Stack>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <Grid2 container spacing={2.5}>
              {(s.reviews || []).map((r, i) => (
                <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                    <FormatQuoteRoundedIcon sx={{ color: nx.gold, fontSize: 28, mb: 1, transform: "scaleX(-1)" }} />
                    <Typography sx={{ color: nx.textOnCream, fontSize: "0.95rem", lineHeight: 1.7, mb: 2, fontStyle: "italic" }}>
                      "{r.quote}"
                    </Typography>
                    <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.9rem" }}>{r.name}</Typography>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {r.source}
                    </Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxTestimonialsSection;
