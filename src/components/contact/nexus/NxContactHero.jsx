import { Box, Container, Grid2, Stack, Typography, Button, Chip } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const trustIcons = [WhatsAppIcon, ApartmentRoundedIcon, ForumRoundedIcon, SupportAgentRoundedIcon];

const NxContactHero = ({ content, whatsappNumber, phone, email, mapUrl }) => {
  const { t } = useTranslation();
  const hero = content.hero;
  const panel = hero.panel;

  const handleWhatsApp = () => {
    const p = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${p}`, "_blank", "noopener");
  };

  return (
    <>
      <Box sx={{ position: "relative", bgcolor: nx.ink, backgroundImage: `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`, pt: { xs: 5, md: 7 }, pb: { xs: 5, md: 6 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Typography component={Link} to="/" sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", textDecoration: "none" }}>{t("nxCommon.breadcrumb.home")}</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem" }}>→</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem" }}>{t("nxCommon.breadcrumb.contact")}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em" }}>{hero.eyebrow}</Typography>
          </Stack>

          <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="flex-start">
            <Grid2 size={{ xs: 12, md: 6.5 }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, lineHeight: 1.12, fontSize: { xs: "2.1rem", sm: "2.6rem", md: "3.1rem" }, mb: 3 }}>
                {hero.title_prefix}{" "}
                <Box component="span" sx={{ color: nx.gold }}>{hero.title_highlight}</Box>
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, mb: 4 }}>{hero.description}</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <Button onClick={handleWhatsApp} variant="contained" startIcon={<WhatsAppIcon />} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}>
                  {hero.whatsapp_cta}
                </Button>
                {phone && (
                  <Button href={`tel:${phone.replace(/\s/g, "")}`} variant="outlined" startIcon={<PhoneRoundedIcon />} sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.35)", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem" }}>
                    {hero.call_cta}
                  </Button>
                )}
                {email && (
                  <Button href={`mailto:${email}`} variant="outlined" startIcon={<EmailRoundedIcon />} sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.35)", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem" }}>
                    {hero.email_cta}
                  </Button>
                )}
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
                {(hero.chips || []).map((c) => (
                  <Chip key={c} icon={<CheckRoundedIcon sx={{ color: `${nx.gold} !important`, fontSize: 15 }} />} label={c} size="small" sx={{ bgcolor: "rgba(245,241,230,0.06)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontSize: "0.75rem" }} />
                ))}
              </Stack>

              <Grid2 container spacing={1.5}>
                {(hero.quick_info || []).map((info, i) => (
                  <Grid2 key={i} size={4}>
                    <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 1.5 }}>
                      <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.82rem" }}>{info.title || (i === 1 ? phone : "")}</Typography>
                      <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem", mt: 0.2 }}>{info.subtitle}</Typography>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5.5 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 } }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.4rem", fontWeight: 600, mb: 0.5 }}>{panel.title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", mb: 3 }}>{panel.subtitle}</Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  {phone && (
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <PhoneRoundedIcon sx={{ color: nx.gold, fontSize: 18, mt: 0.2 }} />
                      <Box>
                        <Typography component="a" href={`tel:${phone.replace(/\s/g, "")}`} sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>{phone}</Typography>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.76rem" }}>{panel.phone_note}</Typography>
                      </Box>
                    </Stack>
                  )}
                  {email && (
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <EmailRoundedIcon sx={{ color: nx.gold, fontSize: 18, mt: 0.2 }} />
                      <Box>
                        <Typography component="a" href={`mailto:${email}`} sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>{email}</Typography>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.76rem" }}>{panel.email_note}</Typography>
                      </Box>
                    </Stack>
                  )}
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <PlaceRoundedIcon sx={{ color: nx.gold, fontSize: 18, mt: 0.2 }} />
                    <Box>
                      <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.9rem" }}>{panel.address_label}</Typography>
                      <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.76rem" }}>{panel.address_note}</Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Stack spacing={1.5}>
                  <Button href="#contact-form" fullWidth startIcon={<ForumRoundedIcon />} sx={{ bgcolor: "#0f9d78", color: "#fff", fontWeight: 700, borderRadius: 999, py: 1.1, fontSize: "0.78rem", "&:hover": { bgcolor: "#0c7f61" } }}>
                    {panel.form_cta_label}
                  </Button>
                  {mapUrl && (
                    <Button href={mapUrl} target="_blank" rel="noopener" fullWidth startIcon={<PublicRoundedIcon />} sx={{ bgcolor: nx.textOnDark, color: "#171208", fontWeight: 700, borderRadius: 999, py: 1.1, fontSize: "0.78rem", "&:hover": { bgcolor: "#e8e2d3" } }}>
                      {panel.map_cta_label}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      <Box sx={{ bgcolor: nx.cream, py: { xs: 5, md: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 2.5, md: 3 }, boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
            <Grid2 container spacing={2.5}>
              {(content.trust_items || []).map((item, i) => {
                const Icon = trustIcons[i % trustIcons.length];
                return (
                  <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Stack direction="column" spacing={1}>
                      <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "rgba(201,162,75,0.12)", color: "#a9822f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon fontSize="small" />
                      </Box>
                      <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.86rem" }}>{item.title}</Typography>
                      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem", lineHeight: 1.6 }}>{item.description}</Typography>
                    </Stack>
                  </Grid2>
                );
              })}
            </Grid2>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NxContactHero;
