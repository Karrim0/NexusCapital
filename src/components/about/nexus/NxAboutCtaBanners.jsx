import { Box, Container, Stack, Typography, Button } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import { nx, fontHeading, goldGradient } from "../../../theme/nexusHomeTheme";

const NxAboutCtaBanners = ({ content, whatsappNumber }) => {
  const s = content.cta_section;

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.ink }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2.5} sx={{ borderBottom: `1px solid ${nx.panelBorder}`, pb: { xs: 4, md: 5 } }}>
          <Box sx={{ maxWidth: 620 }}>
            <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.6rem", md: "2rem" }, mb: 1 }}>
              {s.blog_title}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.92rem", lineHeight: 1.7 }}>{s.blog_description}</Typography>
          </Box>
          <Button
            component={Link}
            to={s.blog_url || "/blog"}
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.8rem", whiteSpace: "nowrap", border: `1px solid ${nx.panelBorder}`, borderRadius: 999, px: 3, py: 1.2, "&:hover": { bgcolor: "rgba(201,162,75,0.08)" } }}
          >
            {s.blog_cta_label}
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2.5} sx={{ pt: { xs: 4, md: 5 } }}>
          <Box sx={{ maxWidth: 620 }}>
            <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.8rem", md: "2.3rem" }, mb: 1 }}>
              {s.consult_title}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem", lineHeight: 1.7 }}>{s.consult_description}</Typography>
          </Box>
          <Button
            onClick={handleWhatsApp}
            startIcon={<WhatsAppIcon />}
            sx={{
              background: goldGradient,
              color: "#171208",
              fontWeight: 700,
              fontSize: "0.82rem",
              whiteSpace: "nowrap",
              borderRadius: 999,
              px: 3.5,
              py: 1.4,
              "&:hover": { filter: "brightness(1.05)" },
            }}
          >
            {s.consult_cta_label}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default NxAboutCtaBanners;
