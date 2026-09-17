import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import PoolIcon from "@mui/icons-material/Pool";
import SecurityIcon from "@mui/icons-material/Security";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import YardIcon from "@mui/icons-material/Yard";
import SpaIcon from "@mui/icons-material/Spa";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { useTranslation } from "react-i18next";

const FEATURE_META_KEYS = {
  landscaped_garden: { key: "landscapedGarden", icon: YardIcon },
  "24_7_security": { key: "security", icon: SecurityIcon },
  cctv_system: { key: "cctv", icon: VideocamIcon },
  fire_system: { key: "fire", icon: LocalFireDepartmentIcon },
  swimming_pool: { key: "pool", icon: PoolIcon },
  fitness_center: { key: "gym", icon: FitnessCenterIcon },
  spa: { key: "spa", icon: SpaIcon },
  restaurant: { key: "restaurant", icon: RestaurantIcon },
  cafe: { key: "cafe", icon: LocalCafeIcon },
  private_beach: { key: "privateBeach", icon: BeachAccessIcon },
};

const prettify = (key) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const NxPropertyFacilities = ({ features = [], videoUrl, whatsappNumber }) => {
  const { t } = useTranslation();
  const facilities = (features.length ? features : ["swimming_pool", "fitness_center", "24_7_security"]).map((key) => {
    const meta = FEATURE_META_KEYS[key];
    if (meta) {
      return { label: t(`nxPropertyFacilities.features.${meta.key}.label`), icon: meta.icon, description: t(`nxPropertyFacilities.features.${meta.key}.description`) };
    }
    return { label: prettify(key), icon: ApartmentRoundedIcon, description: t("nxPropertyFacilities.includedWithResidence") };
  });

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(t("nxPropertyFacilities.discussMessage"))}`, "_blank", "noopener");
  };

  return (
    <>
      <Box id="facilities" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyFacilities.projectFacilities")}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.2 }}>
                {t("nxPropertyFacilities.redSeaLivingBeyond")}
              </Typography>
            </Box>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", maxWidth: 340 }}>
              {t("nxPropertyFacilities.resortStyleFacilities")}
            </Typography>
          </Stack>

          <Grid2 container spacing={2.5}>
            {facilities.map((f, i) => {
              const Icon = f.icon;
              return (
                <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "rgba(201,162,75,0.15)", color: "#a9822f", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
                      <Icon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.92rem", mb: 0.6 }}>{f.label}</Typography>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem", lineHeight: 1.6 }}>{f.description}</Typography>
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>
        </Container>
      </Box>

      {videoUrl && (
        <Box id="video" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Grid2 container spacing={4} alignItems="center">
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                  <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyFacilities.projectFilm")}</Typography>
                </Stack>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.6rem", md: "2rem" }, mb: 2 }}>
                  {t("nxPropertyFacilities.seeItInMotion")}
                </Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem", lineHeight: 1.75, mb: 3 }}>
                  {t("nxPropertyFacilities.exploreArchitecture")}
                </Typography>
                <Button
                  onClick={handleWhatsApp}
                  sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}
                >
                  {t("nxPropertyFacilities.discussThisProperty")}
                </Button>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden", boxShadow: "0 20px 45px rgba(0,0,0,0.4)" }}>
                  <Box sx={{ position: "relative", pt: "56.25%" }}>
                    <Box
                      component="iframe"
                      src={videoUrl}
                      title={t("nxPropertyFacilities.projectFilmTitle")}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                    />
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
          </Container>
        </Box>
      )}
    </>
  );
};

export default NxPropertyFacilities;
