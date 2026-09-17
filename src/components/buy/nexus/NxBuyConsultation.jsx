import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { DISTRICT_GROUPS, DISTRICTS } from "../../../constants/hurghadaDistricts";
import { sendGeneralContactRequest } from "../../../api/contactRequests";
import { useTranslation } from "react-i18next";

const NxBuyConsultation = ({ content, whatsappNumber, brandName }) => {
  const s = content.consultation_section;
  const { t } = useTranslation();

  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", area: "", timeline: "", budget: "", priorities: "" });
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const buildMessage = () =>
    [
      `Hello! I'd like buying advice from ${brandName || "Nexus Capital"}.`,
      form.name && `Name: ${form.name}`,
      form.area && `Preferred area: ${form.area}`,
      form.timeline && `Buying timeline: ${form.timeline}`,
      form.budget && `Budget range: ${form.budget}`,
      form.priorities && `Priorities: ${form.priorities}`,
    ].filter(Boolean).join("\n");

  const handleSubmit = async () => {
    if (form.name || form.whatsapp || form.email) {
      try {
        await sendGeneralContactRequest({
          name: form.name || "Website visitor",
          phone: form.whatsapp || undefined,
          email: form.email || undefined,
          subject: "Buy page consultation request",
          message: buildMessage(),
        });
      } catch (err) {
        console.error("Failed to save consultation request:", err);
      }
    }
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  return (
    <Box
      id="consultation"
      sx={{
        position: "relative",
        bgcolor: nx.ink,
        backgroundImage: s.background_image
          ? `linear-gradient(90deg, rgba(10,12,16,0.92) 30%, rgba(10,12,16,0.5) 100%), url(${s.background_image})`
          : `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: { xs: 6, md: 9 },
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, lineHeight: 1.2, fontSize: { xs: "1.9rem", md: "2.4rem" }, mb: 2 }}>
              {s.title}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem", lineHeight: 1.75, maxWidth: 520, mb: 3 }}>
              {s.description}
            </Typography>
            <Stack spacing={1.2}>
              {(s.bullets || []).map((b, i) => (
                <Stack key={i} direction="row" spacing={1.2} alignItems="flex-start">
                  <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 18, mt: 0.2 }} />
                  <Typography sx={{ color: nx.textOnDark, fontSize: "0.88rem" }}>{b}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5.5 }}>
            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 4, p: { xs: 3, md: 4 }, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnCream, fontSize: "1.3rem", fontWeight: 600, mb: 0.5 }}>
                {s.form_title}
              </Typography>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", mb: 3 }}>{s.form_description}</Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="Full name" value={form.name} onChange={update("name")} fullWidth size="small" />
                  <TextField label="WhatsApp number (optional)" placeholder="Include country code" value={form.whatsapp} onChange={update("whatsapp")} fullWidth size="small" />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField label="Email address (optional)" placeholder="name@example.com" value={form.email} onChange={update("email")} fullWidth size="small" />
                  <TextField select label="Preferred area" value={form.area} onChange={update("area")} fullWidth size="small">
                    <MenuItem value=""><em>Select an area</em></MenuItem>
                    {DISTRICT_GROUPS.map((group) => [
                      <MenuItem key={`g-${group.key}`} disabled sx={{ fontWeight: 700, opacity: 0.7 }}>{t(group.translationKey)}</MenuItem>,
                      ...DISTRICTS.filter((d) => d.group === group.key).map((d) => (
                        <MenuItem key={d.key} value={t(d.translationKey)} sx={{ pl: 3 }}>{t(d.translationKey)}</MenuItem>
                      )),
                    ])}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label="Buying timeline" value={form.timeline} onChange={update("timeline")} fullWidth size="small">
                    <MenuItem value=""><em>Select a timeline</em></MenuItem>
                    {(s.timeline_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                  <TextField select label="Budget range" value={form.budget} onChange={update("budget")} fullWidth size="small">
                    <MenuItem value=""><em>Select a budget</em></MenuItem>
                    {(s.budget_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                </Stack>
                <TextField
                  label="Buying priorities (optional)"
                  placeholder="Sea view, ready-to-move, instalments, floor, rental income, or developer payment plan."
                  value={form.priorities}
                  onChange={update("priorities")}
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                />

                <Button
                  onClick={handleSubmit}
                  startIcon={<WhatsAppIcon />}
                  fullWidth
                  sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.82rem", "&:hover": { bgcolor: nx.goldLight } }}
                >
                  {s.submit_label}
                </Button>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.7rem", textAlign: "center" }}>{s.form_disclaimer}</Typography>
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxBuyConsultation;
