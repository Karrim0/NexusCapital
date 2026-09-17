import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";

const NxProjectsPackage = ({ content, whatsappNumber }) => {
  const s = content.package_section;
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", project: "", budget: "", timeline: "", notes: "" });
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleWhatsApp = async () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const message = [
      "Hello! I'd like a project package (brochure, floor plans, prices, payment plans).",
      form.name && `Name: ${form.name}`,
      form.email && `Email: ${form.email}`,
      form.project && `Preferred project or area: ${form.project}`,
      form.budget && `Budget range: ${form.budget}`,
      form.timeline && `Buying timeline: ${form.timeline}`,
      form.notes && `Package requirements: ${form.notes}`,
    ].filter(Boolean).join("\n");
    if (form.name || form.whatsapp || form.email) {
      try {
        await sendGeneralContactRequest({
          name: form.name || "Website visitor",
          phone: form.whatsapp || undefined,
          email: form.email || undefined,
          subject: "Project package request",
          message,
        });
      } catch (err) {
        console.error("Failed to save project package request:", err);
      }
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="stretch">
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.6rem" }, lineHeight: 1.15, mb: 3 }}>
              {s.title}
            </Typography>
            <Typography sx={{ color: "#5ce6d0", fontSize: "0.95rem", lineHeight: 1.8, mb: 3 }}>{s.description}</Typography>
            <Stack spacing={1.5}>
              {(s.bullets || []).map((b, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                  <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 20, mt: 0.2 }} />
                  <Typography sx={{ color: nx.textOnDark, fontSize: "0.92rem" }}>{b}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ bgcolor: nx.panel, borderRadius: 4, p: { xs: 3, md: 4 }, height: "100%", border: `1px solid ${nx.panelBorder}` }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.4rem", fontWeight: 600, mb: 0.5 }}>{s.form_title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.86rem", mb: 3 }}>{s.form_description}</Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField placeholder="Your full name" value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                  <TextField placeholder="Include country code" label="WhatsApp number" value={form.whatsapp} onChange={update("whatsapp")} fullWidth size="small" sx={nxInputSx} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField placeholder="name@example.com" label="Email address" value={form.email} onChange={update("email")} fullWidth size="small" sx={nxInputSx} />
                  <TextField label="Preferred project or area" value={form.project} onChange={update("project")} fullWidth size="small" placeholder="Any best-match project" sx={nxInputSx} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label="Budget range" value={form.budget} onChange={update("budget")} fullWidth size="small" sx={nxInputSx}>
                    {(content.finder_panel?.budget_options || []).map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                  </TextField>
                  <TextField select label="Buying timeline" value={form.timeline} onChange={update("timeline")} fullWidth size="small" sx={nxInputSx}>
                    {(s.timeline_options || []).map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                </Stack>
                <TextField
                  label="Package requirements"
                  placeholder="Unit type, sea view, payment plan, delivery date, or rental goal."
                  value={form.notes}
                  onChange={update("notes")}
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  sx={nxInputSx}
                />
                <Button onClick={handleWhatsApp} startIcon={<WhatsAppIcon />} fullWidth variant="contained" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}>
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

export default NxProjectsPackage;
