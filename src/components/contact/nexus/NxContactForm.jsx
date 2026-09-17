import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button, Checkbox, FormControlLabel, Alert } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";
import { useTranslation } from "react-i18next";

const NxContactForm = ({ content, whatsappNumber, email }) => {
  const { t } = useTranslation();
  const s = content.form_section;
  const [form, setForm] = useState({
    name: "",
    method: "",
    phone: "",
    email: "",
    enquiryType: "",
    area: "",
    budget: "",
    timeline: "",
    message: "",
    consent: false,
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const buildMessage = () =>
    [
      t("nxContactForm.greeting"),
      form.name && `${t("nxContactForm.nameLabel")}: ${form.name}`,
      form.method && `${t("nxContactForm.methodLabel")}: ${form.method}`,
      form.enquiryType && `${t("nxContactForm.enquiryTypeLabel")}: ${form.enquiryType}`,
      form.area && `${t("nxContactForm.areaLabel")}: ${form.area}`,
      form.budget && `${t("nxContactForm.budgetLabel")}: ${form.budget}`,
      form.timeline && `${t("nxContactForm.timelineLabel")}: ${form.timeline}`,
      form.message && `${t("nxContactForm.messageLabel")}: ${form.message}`,
    ].filter(Boolean).join("\n");

  const validate = () => {
    if (!form.name.trim()) return t("nxContactForm.errorName");
    if (!form.method) return t("nxContactForm.errorMethod");
    if (!form.enquiryType) return t("nxContactForm.errorEnquiryType");
    if (!form.message.trim()) return t("nxContactForm.errorMessage");
    if (!form.phone.trim() && !form.email.trim()) return t("nxContactForm.errorContact");
    if (!form.consent) return t("nxContactForm.errorConsent");
    return "";
  };

  const saveRequest = async () => {
    await sendGeneralContactRequest({
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      subject: `Contact form: ${form.enquiryType}`,
      message: buildMessage(),
    });
  };

  const handleSubmit = async () => {
    const err = validate();
    setError(err);
    if (err) return;
    setSending(true);
    try {
      await saveRequest();
      setSuccess(true);
    } catch (e) {
      console.error("Failed to submit contact form:", e);
      setError(t("nxContactForm.errorGeneric"));
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = async () => {
    const err = validate();
    setError(err);
    if (err) return;
    setSending(true);
    try {
      await saveRequest();
    } catch (e) {
      console.error("Failed to save contact form request:", e);
    } finally {
      setSending(false);
    }
    const p = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${p}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  return (
    <Box id="contact-form" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 6 }}>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.9rem", md: "2.3rem" }, lineHeight: 1.2, mb: 2 }}>
              {s.title}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem", lineHeight: 1.8, mb: 3 }}>{s.description}</Typography>

            <Grid2 container spacing={1.5}>
              {(s.badges || []).map((b, i) => (
                <Grid2 key={i} size={6}>
                  <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 2 }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 1.5, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.7rem", mb: 1 }}>
                      {b.number}
                    </Box>
                    <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.8rem", lineHeight: 1.4 }}>{b.title}</Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontSize: "1.3rem", fontWeight: 600, mb: 0.5 }}>{s.form_title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", mb: 3 }}>{s.form_note}</Typography>

              {success ? (
                <Alert severity="success" sx={{ mb: 2 }}>{t("nxContactForm.successMessage")}</Alert>
              ) : (
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label={t("nxContactForm.fullNameRequired")} placeholder={t("nxContactForm.yourFullName")} value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                    <TextField select label={t("nxContactForm.preferredContactMethodRequired")} value={form.method} onChange={update("method")} fullWidth size="small" sx={nxInputSx}>
                      {(s.contact_method_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label={t("nxContactForm.phoneWhatsapp")} placeholder={t("nxContactForm.includeCountryCode")} value={form.phone} onChange={update("phone")} fullWidth size="small" sx={nxInputSx} />
                    <TextField label={t("nxContactForm.emailAddress")} placeholder={t("nxContactForm.emailPlaceholder")} value={form.email} onChange={update("email")} fullWidth size="small" sx={nxInputSx} />
                  </Stack>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem" }}>{s.method_note}</Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField select label={t("nxContactForm.whatDoYouNeedRequired")} value={form.enquiryType} onChange={update("enquiryType")} fullWidth size="small" sx={nxInputSx}>
                      {(s.enquiry_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                    <TextField select label={t("nxContactForm.preferredAreaOptional")} value={form.area} onChange={update("area")} fullWidth size="small" sx={nxInputSx}>
                      {(s.area_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField select label={t("nxContactForm.budgetRangeOptional")} value={form.budget} onChange={update("budget")} fullWidth size="small" sx={nxInputSx}>
                      {(s.budget_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                    <TextField select label={t("nxContactForm.timelineOptional")} value={form.timeline} onChange={update("timeline")} fullWidth size="small" sx={nxInputSx}>
                      {(s.timeline_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <TextField
                    label={t("nxContactForm.yourMessageRequired")}
                    placeholder={t("nxContactForm.enquiryDetailsPlaceholder")}
                    value={form.message}
                    onChange={update("message")}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    sx={nxInputSx}
                  />

                  <FormControlLabel
                    control={<Checkbox checked={form.consent} onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))} sx={{ color: nx.textOnDarkMuted, "&.Mui-checked": { color: nx.gold } }} />}
                    label={<Typography sx={{ fontSize: "0.74rem", color: nx.textOnDarkMuted, lineHeight: 1.5 }}>{s.consent_label}</Typography>}
                    sx={{ alignItems: "flex-start", ml: 0 }}
                  />

                  {error && <Alert severity="warning">{error}</Alert>}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button onClick={handleSubmit} disabled={sending} startIcon={<EmailRoundedIcon />} fullWidth variant="contained" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}>
                      {s.submit_label}
                    </Button>
                    <Button onClick={handleWhatsApp} disabled={sending} startIcon={<WhatsAppIcon />} fullWidth variant="outlined" sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.78rem" }}>
                      {s.whatsapp_label}
                    </Button>
                  </Stack>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem", textAlign: "center" }}>{s.disclaimer}</Typography>
                </Stack>
              )}
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

export default NxContactForm;
