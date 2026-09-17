import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button } from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";
import { useTranslation } from "react-i18next";

const NxAboutContact = ({ content, whatsappNumber, phone, email, address }) => {
  const { t } = useTranslation();
  const s = content.contact;
  const [form, setForm] = useState({ name: "", whatsapp: "", enquiryType: "", message: "" });
  const [sending, setSending] = useState(false);
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const buildMessage = () =>
    [
      t("nxCommon.contactForm.greeting"),
      form.name && `${t("nxCommon.contactForm.nameLabel")}: ${form.name}`,
      form.enquiryType && `${t("nxCommon.contactForm.enquiryTypeLabel")}: ${form.enquiryType}`,
      form.message && `${t("nxCommon.contactForm.messageLabel")}: ${form.message}`,
    ].filter(Boolean).join("\n");

  const handleWhatsApp = async () => {
    if (form.name || form.whatsapp) {
      setSending(true);
      try {
        await sendGeneralContactRequest({
          name: form.name || t("nxCommon.form.websiteVisitor"),
          phone: form.whatsapp || undefined,
          subject: `About page enquiry: ${form.enquiryType || t("nxCommon.contactForm.generalEnquiry")}`,
          message: buildMessage(),
        });
      } catch (err) {
        console.error("Failed to save About page enquiry:", err);
      } finally {
        setSending(false);
      }
    }
    const p = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${p}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  const infoCards = [
    { label: s.phone_label, value: phone },
    { label: s.email_label, value: email },
    { label: s.address_label, value: address },
    { label: s.hours_label, value: s.business_hours },
  ];

  return (
    <Box id="contact" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 6 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.9rem", md: "2.4rem" }, lineHeight: 1.2, mb: 2 }}>
              {s.title}
            </Typography>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.92rem", lineHeight: 1.8, mb: 3 }}>{s.description}</Typography>

            <Grid2 container spacing={2}>
              {infoCards.map((c, i) => (
                <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                    <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.05rem", mb: 0.8 }}>{c.label}</Typography>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>{c.value}</Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ bgcolor: nx.ink, borderRadius: 4, p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.5rem", fontWeight: 600, mb: 0.5 }}>{s.form_title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.86rem", mb: 3 }}>{s.form_description}</Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label={t("nxCommon.contactForm.fullNameRequired")} placeholder={t("nxCommon.contactForm.yourFullName")} value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                  <TextField label={t("nxCommon.contactForm.whatsappNumberRequired")} placeholder={t("nxCommon.contactForm.includeCountryCode")} value={form.whatsapp} onChange={update("whatsapp")} fullWidth size="small" sx={nxInputSx} />
                </Stack>
                <TextField select label={t("nxCommon.contactForm.interestedInRequired")} value={form.enquiryType} onChange={update("enquiryType")} fullWidth size="small" sx={nxInputSx}>
                  {(s.enquiry_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
                <TextField
                  label={t("nxCommon.contactForm.yourMessageRequired")}
                  placeholder={t("nxCommon.contactForm.tellUsHowWeCanHelp")}
                  value={form.message}
                  onChange={update("message")}
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  sx={nxInputSx}
                />
                <Button onClick={handleWhatsApp} disabled={sending} startIcon={<WhatsAppIcon />} fullWidth sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}>
                  {s.submit_label}
                </Button>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem", textAlign: "center" }}>{s.form_disclaimer}</Typography>
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

export default NxAboutContact;
