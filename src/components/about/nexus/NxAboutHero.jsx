import { Box, Container, Grid2, Stack, Typography, Button, Chip } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const featureIcons = [PlaceRoundedIcon, ApartmentRoundedIcon, SearchRoundedIcon, ShieldRoundedIcon];

const NxAboutHero = ({ content, whatsappNumber }) => {
  const { t } = useTranslation();
  const hero = content.hero;
  const snapshot = hero.snapshot;

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(t("nxCommon.talkToTeamMessage"))}`, "_blank", "noopener");
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          bgcolor: nx.ink,
          backgroundImage: hero.background_image
            ? `linear-gradient(180deg, rgba(6,8,12,0.55) 0%, rgba(6,8,12,0.9) 100%), url(${hero.background_image})`
            : `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: { xs: 5, md: 7 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Typography component={Link} to="/" sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", textDecoration: "none" }}>{t("nxCommon.breadcrumb.home")}</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem" }}>/</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem" }}>{t("nxCommon.breadcrumb.aboutUs")}</Typography>
            <Typography sx={{ color: nx.gold, fontSize: "0.72rem", ml: 1 }}>{hero.eyebrow}</Typography>
          </Stack>

          <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="flex-start">
            <Grid2 size={{ xs: 12, md: 6.5 }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, lineHeight: 1.12, fontSize: { xs: "2.1rem", sm: "2.6rem", md: "3.1rem" }, mb: 3 }}>
                {hero.title_prefix}{" "}
                <Box component="span" sx={{ color: nx.gold }}>{hero.title_highlight}</Box>
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, mb: 4 }}>{hero.description}</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <Button href="#chairman" variant="contained" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3.5, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}>
                  {hero.primary_cta}
                </Button>
                <Button onClick={handleWhatsApp} variant="outlined" sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.35)", fontWeight: 700, px: 3.5, py: 1.3, borderRadius: 999, fontSize: "0.8rem" }}>
                  {hero.secondary_cta}
                </Button>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {(hero.chips || []).map((c) => (
                  <Chip key={c} icon={<CheckRoundedIcon sx={{ color: `${nx.gold} !important`, fontSize: 15 }} />} label={c} size="small" sx={{ bgcolor: "rgba(245,241,230,0.06)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontSize: "0.75rem" }} />
                ))}
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5.5 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 } }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.4rem", fontWeight: 600, mb: 0.5 }}>{snapshot.title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.82rem", mb: 3 }}>{snapshot.subtitle}</Typography>

                <Grid2 container spacing={1.5} sx={{ mb: 3 }}>
                  {(snapshot.stats || []).map((s, i) => (
                    <Grid2 key={i} size={4}>
                      <Box sx={{ bgcolor: "rgba(245,241,230,0.04)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.3, textAlign: "center" }}>
                        <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "1.2rem" }}>{s.value}</Typography>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.62rem", mt: 0.3, lineHeight: 1.3 }}>{s.label}</Typography>
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>

                <Stack spacing={1.3}>
                  {(snapshot.bullets || []).map((b, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 17, mt: 0.2 }} />
                      <Typography sx={{ color: nx.textOnDark, fontSize: "0.82rem", lineHeight: 1.6 }}>{b}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      <Box sx={{ bgcolor: nx.ink, borderTop: `1px solid ${nx.panelBorder}`, py: { xs: 4, md: 5 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={2.5}>
            {(hero.feature_cards || []).map((item, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              return (
                <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ flexShrink: 0, width: 38, height: 38, borderRadius: 2, bgcolor: "rgba(201,162,75,0.12)", color: nx.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.86rem", mb: 0.3 }}>{item.title}</Typography>
                      <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.76rem", lineHeight: 1.6 }}>{item.description}</Typography>
                    </Box>
                  </Stack>
                </Grid2>
              );
            })}
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxAboutHero;
