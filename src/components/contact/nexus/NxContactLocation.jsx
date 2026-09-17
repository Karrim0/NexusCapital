import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { useTranslation } from "react-i18next";

const NxContactLocation = ({ content, address, hours, phone, email, taxRegistration, mapEmbedUrl, mapUrl }) => {
  const { t } = useTranslation();
  const s = content.location_section;
  const [mapLoaded, setMapLoaded] = useState(false);

  const infoRows = [
    { icon: PlaceRoundedIcon, label: t("nxLocation.address"), value: address },
    { icon: AccessTimeRoundedIcon, label: t("nxLocation.businessHours"), value: hours },
    { icon: PhoneRoundedIcon, label: t("nxLocation.phone"), value: phone },
    { icon: EmailRoundedIcon, label: t("nxLocation.email"), value: email },
    { icon: TagRoundedIcon, label: t("nxLocation.taxRegistration"), value: taxRegistration },
  ];

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
        </Stack>
        <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{s.description}</Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, overflow: "hidden", height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
              {mapLoaded && mapEmbedUrl ? (
                <Box component="iframe" src={mapEmbedUrl} title={t("nxLocation.officeLocation")} loading="lazy" sx={{ width: "100%", height: 320, border: 0, display: "block" }} />
              ) : (
                <Box sx={{ textAlign: "center", p: { xs: 3, md: 5 } }}>
                  <MapRoundedIcon sx={{ fontSize: 32, color: "#a9822f", mb: 1.5 }} />
                  <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1rem", mb: 1 }}>{s.map_placeholder_title}</Typography>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.82rem", lineHeight: 1.7, maxWidth: 420, mx: "auto", mb: 2.5 }}>{s.map_placeholder_description}</Typography>
                  <Button
                    onClick={() => setMapLoaded(true)}
                    disabled={!mapEmbedUrl}
                    sx={{ bgcolor: "#0f9d78", color: "#fff", fontWeight: 700, borderRadius: 999, px: 3, py: 1.1, fontSize: "0.78rem", "&:hover": { bgcolor: "#0c7f61" } }}
                  >
                    {s.load_map_label}
                  </Button>
                </Box>
              )}
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.9rem", mb: 0.5 }}>{s.info_title}</Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", lineHeight: 1.7 }}>{s.info_note}</Typography>
              </Box>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box sx={{ bgcolor: nx.ink, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: "1.2rem", mb: 2 }}>{s.info_title}</Typography>
              <Stack spacing={1.8} sx={{ flex: 1 }}>
                {infoRows.map((row, i) => (
                  row.value && (
                    <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                      <row.icon sx={{ color: nx.gold, fontSize: 18, mt: 0.2 }} />
                      <Box>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{row.label}</Typography>
                        <Typography sx={{ color: nx.textOnDark, fontSize: "0.85rem" }}>{row.value}</Typography>
                      </Box>
                    </Stack>
                  )
                ))}
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                {mapUrl && (
                  <Button href={mapUrl} target="_blank" rel="noopener" fullWidth sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, py: 1.1, fontSize: "0.76rem", "&:hover": { bgcolor: nx.goldLight } }}>
                    {s.directions_label}
                  </Button>
                )}
                {phone && (
                  <Button href={`tel:${phone.replace(/\s/g, "")}`} fullWidth variant="outlined" sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, borderRadius: 999, py: 1.1, fontSize: "0.76rem" }}>
                    {s.call_label}
                  </Button>
                )}
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxContactLocation;
