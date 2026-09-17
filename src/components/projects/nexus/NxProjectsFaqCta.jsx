import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Collapse, Button } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading, goldGradient } from "../../../theme/nexusHomeTheme";

const NxProjectsFaqCta = ({ content, whatsappNumber }) => {
  const s = content.faq_section;
  const cta = content.cta_section;
  const [openIndex, setOpenIndex] = useState(0);

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}`, "_blank", "noopener");
  };

  return (
    <>
      <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 4, md: 6 }}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2, mb: 2 }}>
                {s.title}
              </Typography>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{s.description}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack spacing={1.5}>
                {(s.items || []).map((item, i) => {
                  const open = openIndex === i;
                  return (
                    <Box key={i} onClick={() => setOpenIndex(open ? -1 : i)} sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, cursor: "pointer", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.92rem" }}>{item.question}</Typography>
                        <ExpandMoreRoundedIcon sx={{ color: nx.gold, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </Stack>
                      <Collapse in={open}>
                        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mt: 1.5 }}>{item.answer}</Typography>
                      </Collapse>
                    </Box>
                  );
                })}
              </Stack>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      <Box sx={{ bgcolor: nx.ink }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2.5} sx={{ borderBottom: `1px solid ${nx.panelBorder}`, pb: { xs: 4, md: 5 } }}>
            <Box sx={{ maxWidth: 620 }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.6rem", md: "2rem" }, mb: 1 }}>
                {cta.compare_title}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.92rem", lineHeight: 1.7 }}>{cta.compare_description}</Typography>
            </Box>
            <Button
              href="#projects-browser"
              startIcon={<WhatsAppIcon />}
              sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.8rem", whiteSpace: "nowrap", borderRadius: 999, px: 3, py: 1.2, "&:hover": { bgcolor: nx.goldLight } }}
            >
              {cta.compare_cta_label}
            </Button>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2.5} sx={{ pt: { xs: 4, md: 5 } }}>
            <Box sx={{ maxWidth: 620 }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.8rem", md: "2.3rem" }, mb: 1 }}>
                {cta.consult_title}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem", lineHeight: 1.7 }}>{cta.consult_description}</Typography>
            </Box>
            <Button
              onClick={handleWhatsApp}
              startIcon={<WhatsAppIcon />}
              sx={{ background: goldGradient, color: "#171208", fontWeight: 700, fontSize: "0.82rem", whiteSpace: "nowrap", borderRadius: 999, px: 3.5, py: 1.4, "&:hover": { filter: "brightness(1.05)" } }}
            >
              {cta.consult_cta_label}
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default NxProjectsFaqCta;
