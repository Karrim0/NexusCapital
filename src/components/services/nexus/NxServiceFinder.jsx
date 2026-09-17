import { useMemo, useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";
import { useTranslation } from "react-i18next";

const NxServiceFinder = ({ content, whatsappNumber }) => {
  const { t } = useTranslation();
  const s = content.finder;
  const situations = Object.keys(s.situation_options || {});
  const [situation, setSituation] = useState(situations[0] || "");
  const [area, setArea] = useState("");
  const [timeline, setTimeline] = useState("");
  const [sending, setSending] = useState(false);

  const recommendation = useMemo(() => s.situation_options?.[situation] || null, [s, situation]);

  const buildMessage = () =>
    [
      t("nxServiceFinder.greeting"),
      situation && `${t("nxServiceFinder.situationLabel")}: ${situation}`,
      recommendation?.service && `${t("nxServiceFinder.recommendedServiceLabel")}: ${recommendation.service}`,
      area && `${t("nxServiceFinder.areaLabel")}: ${area}`,
      timeline && `${t("nxServiceFinder.timelineLabel")}: ${timeline}`,
    ].filter(Boolean).join("\n");

  const handleContact = async () => {
    setSending(true);
    try {
      await sendGeneralContactRequest({
        name: t("nxCommon.form.websiteVisitor"),
        subject: `Service Finder: ${recommendation?.service || situation}`,
        message: buildMessage(),
      });
    } catch (err) {
      console.error("Failed to save service finder request:", err);
    } finally {
      setSending(false);
    }
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem", lineHeight: 1.75 }}>{s.description}</Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%" }}>
              <Stack spacing={2.5}>
                <TextField select label={t("nxServiceFinder.chooseYourSituation")} value={situation} onChange={(e) => setSituation(e.target.value)} fullWidth size="small" sx={nxInputSx}>
                  {situations.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </TextField>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label={t("nxServiceFinder.preferredArea")} value={area} onChange={(e) => setArea(e.target.value)} fullWidth size="small" sx={nxInputSx}>
                    {(s.area_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                  <TextField select label={t("nxServiceFinder.timeline")} value={timeline} onChange={(e) => setTimeline(e.target.value)} fullWidth size="small" sx={nxInputSx}>
                    {(s.timeline_options || []).map((t2) => <MenuItem key={t2} value={t2}>{t2}</MenuItem>)}
                  </TextField>
                </Stack>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.2rem", mb: 1 }}>{s.result_title}</Typography>
              {recommendation && (
                <>
                  <Typography sx={{ color: "#a9822f", fontWeight: 700, fontSize: "0.95rem", mb: 1 }}>{recommendation.service}</Typography>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 2 }}>{recommendation.description}</Typography>
                  <Typography sx={{ color: nx.textOnCream, fontSize: "0.78rem", fontWeight: 700, mb: 0.5 }}>
                    {t("nxServiceFinder.areaColonTimeline", { area: area || t("nxServiceFinder.notSelected"), timeline: timeline || t("nxServiceFinder.notSelected") })}
                  </Typography>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.72rem", mb: 2.5 }}>{s.result_note}</Typography>
                </>
              )}
              <Button
                onClick={handleContact}
                disabled={sending}
                startIcon={<WhatsAppIcon />}
                fullWidth
                sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, borderRadius: 999, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: "#1a1f2b" } }}
              >
                {s.contact_cta_label}
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

const nxInputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(245,241,230,0.04)",
    color: nx.textOnDark,
    borderRadius: 1.5,
    "& fieldset": { borderColor: "rgba(245,241,230,0.18)" },
    "&:hover fieldset": { borderColor: "rgba(201,162,75,0.5)" },
    "&.Mui-focused fieldset": { borderColor: nx.gold },
  },
  "& .MuiInputLabel-root": { color: nx.textOnDarkMuted },
  "& .MuiSelect-icon": { color: nx.textOnDarkMuted },
};

export default NxServiceFinder;
