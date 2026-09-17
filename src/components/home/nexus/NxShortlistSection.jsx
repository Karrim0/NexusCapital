import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";

const NxShortlistSection = ({ content, whatsappNumber }) => {
  const { t } = useTranslation();
  const s = content.shortlist_section;
  const areaOptions = t("nxCommon.options.areas", { returnObjects: true });
  const timelineOptions = t("nxCommon.options.timelines", { returnObjects: true });
  const budgetOptions = t("nxCommon.options.budgets", { returnObjects: true });
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", area: "", timeline: "", budget: "", property: "" });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const message = [
      t("nxCommon.whatsappMessages.consultationGreeting"),
      form.name && `${t("nxCommon.whatsappMessages.nameLabel")}: ${form.name}`,
      form.email && `${t("nxCommon.whatsappMessages.emailLabel")}: ${form.email}`,
      form.area && `${t("nxCommon.whatsappMessages.areaLabel")}: ${form.area}`,
      form.timeline && `${t("nxCommon.whatsappMessages.timelineLabel")}: ${form.timeline}`,
      form.budget && `${t("nxCommon.whatsappMessages.budgetLabel")}: ${form.budget}`,
      form.property && `${t("nxCommon.form.propertyType")}: ${form.property}`,
    ]
      .filter(Boolean)
      .join("\n");
    if (form.name || form.whatsapp || form.email || form.property) {
      try {
        await sendGeneralContactRequest({
          name: form.name || t("nxCommon.form.websiteVisitor"),
          phone: form.whatsapp || undefined,
          email: form.email || undefined,
          subject: "Consultation request",
          message,
        });
      } catch (err) {
        console.error("Failed to save consultation request:", err);
      }
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="stretch">
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.6rem" }, lineHeight: 1.15, mb: 3 }}>
              {s.title}
            </Typography>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.98rem", lineHeight: 1.8, mb: 3 }}>
              {s.description}
            </Typography>
            <Stack spacing={1.5}>
              {(s.bullets || []).map((b, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                  <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 20, mt: 0.2 }} />
                  <Typography sx={{ color: nx.textOnCream, fontSize: "0.92rem" }}>{b}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ bgcolor: nx.ink, borderRadius: 4, p: { xs: 3, md: 4 }, height: "100%", border: `1px solid ${nx.panelBorder}` }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.5rem", fontWeight: 600, mb: 0.5 }}>
                {s.form_title}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem", mb: 3 }}>{s.form_description}</Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField placeholder={t("nxCommon.form.fullName")} value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                  <TextField placeholder={t("nxCommon.form.whatsappNumber")} value={form.whatsapp} onChange={update("whatsapp")} fullWidth size="small" sx={nxInputSx} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField placeholder={t("nxCommon.form.emailAddress")} value={form.email} onChange={update("email")} fullWidth size="small" sx={nxInputSx} />
                  <TextField select label={t("nxCommon.form.preferredArea")} value={form.area} onChange={update("area")} fullWidth size="small" sx={nxInputSx}>
                    {areaOptions.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label={t("nxCommon.form.buyingTimeline")} value={form.timeline} onChange={update("timeline")} fullWidth size="small" sx={nxInputSx}>
                    {timelineOptions.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                  <TextField select label={t("nxCommon.form.budgetRange")} value={form.budget} onChange={update("budget")} fullWidth size="small" sx={nxInputSx}>
                    {budgetOptions.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                </Stack>
                <TextField
                  placeholder={t("nxCommon.form.propertyLookingFor")}
                  value={form.property}
                  onChange={update("property")}
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  sx={nxInputSx}
                />
                <Button
                  onClick={handleSubmit}
                  startIcon={<WhatsAppIcon />}
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}
                >
                  {s.submit_label}
                </Button>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", textAlign: "center" }}>{s.form_disclaimer}</Typography>
              </Stack>
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
  "& .MuiInputBase-input::placeholder": { color: nx.textOnDarkMuted, opacity: 1 },
  "& .MuiSelect-icon": { color: nx.textOnDarkMuted },
};

export default NxShortlistSection;
