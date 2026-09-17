import { Box, Container, Grid2, Stack, Typography, Button, Chip } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxLegalLawyerProfile = ({ lawyer, whatsappNumber }) => {
  const handleContact = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent("Hello! I'd like to request a legal consultation regarding a property purchase.");
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
    }
  };

  const hasRealPhoto = lawyer.photo && !lawyer.photo.startsWith("[");

  return (
    <Box id="lawyer-profile" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                bgcolor: nx.ink,
                borderRadius: 3,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  height: 320,
                  backgroundImage: hasRealPhoto ? `url(${lawyer.photo})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                  bgcolor: "#1b2436",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!hasRealPhoto && (
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.75rem", px: 3, textAlign: "center" }}>
                    {lawyer.photo}
                  </Typography>
                )}
              </Box>
              <Box sx={{ p: 3, flex: 1 }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 600, fontSize: "1.25rem" }}>
                  {lawyer.name}
                </Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", mb: 2 }}>{lawyer.title}</Typography>
                {lawyer.years_of_experience && (
                  <Typography sx={{ color: nx.textOnDark, fontSize: "0.78rem", mb: 0.5 }}>
                    <Box component="span" sx={{ color: nx.textOnDarkMuted }}>Experience: </Box>{lawyer.years_of_experience}
                  </Typography>
                )}
                {lawyer.license_info && (
                  <Typography sx={{ color: nx.textOnDark, fontSize: "0.78rem", mb: 1.5 }}>
                    <Box component="span" sx={{ color: nx.textOnDarkMuted }}>License: </Box>{lawyer.license_info}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <LanguageRoundedIcon sx={{ color: nx.gold, fontSize: 16 }} />
                  <Typography sx={{ color: nx.textOnDark, fontSize: "0.8rem" }}>{(lawyer.languages || []).join(" · ")}</Typography>
                </Stack>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                Legal Consultant
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.6rem", md: "1.9rem" }, mb: 2 }}>
              Professional Profile
            </Typography>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.92rem", lineHeight: 1.8, mb: 3 }}>
              {lawyer.bio}
            </Typography>

            <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.95rem", mb: 1.5 }}>Areas of Expertise</Typography>
            <Grid2 container spacing={1} sx={{ mb: 3 }}>
              {(lawyer.expertise || []).map((item) => (
                <Grid2 key={item} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 17, mt: 0.2 }} />
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem" }}>{item}</Typography>
                  </Stack>
                </Grid2>
              ))}
            </Grid2>

            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
              {(lawyer.languages || []).map((lang) => (
                <Chip key={lang} label={lang} size="small" sx={{ bgcolor: nx.creamPaper, color: nx.textOnCream, border: `1px solid ${nx.divider}`, fontSize: "0.72rem" }} />
              ))}
            </Stack>

            <Button
              onClick={handleContact}
              sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3.5, py: 1.3, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}
            >
              {lawyer.cta_label}
            </Button>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxLegalLawyerProfile;
