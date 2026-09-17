import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, TextField, MenuItem, Chip } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";

const NxProjectsHero = ({ content, whatsappNumber }) => {
  const hero = content.hero;
  const finder = content.finder_panel;

  const [form, setForm] = useState({ name: "", whatsapp: "", area: "", budget: "", priority: "", unitType: "", notes: "" });
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleWhatsApp = async () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const message = [
      "Hello! I'd like a Red Sea project shortlist.",
      form.name && `Name: ${form.name}`,
      form.area && `Preferred area: ${form.area}`,
      form.budget && `Budget range: ${form.budget}`,
      form.priority && `Priority: ${form.priority}`,
      form.unitType && `Unit type: ${form.unitType}`,
      form.notes && `Additional requirements: ${form.notes}`,
    ].filter(Boolean).join("\n");
    if (form.name || form.whatsapp) {
      try {
        await sendGeneralContactRequest({
          name: form.name || "Website visitor",
          phone: form.whatsapp || undefined,
          subject: "Project Finder shortlist request",
          message,
        });
      } catch (err) {
        console.error("Failed to save project finder request:", err);
      }
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: nx.ink,
        backgroundImage: hero.background_image
          ? `linear-gradient(180deg, rgba(10,12,16,0.55) 0%, rgba(10,12,16,0.92) 100%), url(${hero.background_image})`
          : `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        pt: { xs: 5, md: 7 },
        pb: { xs: 7, md: 9 },
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.1em" }}>{hero.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, lineHeight: 1.12, fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.2rem" }, mb: 3 }}>
              {hero.title_prefix}{" "}
              <Box component="span" sx={{ color: nx.gold }}>{hero.title_highlight}</Box>{" "}
              {hero.title_suffix}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, mb: 4 }}>{hero.subtitle}</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
              <Button href="#projects-browser" variant="contained" startIcon={<SearchRoundedIcon />} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3.5, py: 1.4, borderRadius: 999, fontSize: "0.82rem", "&:hover": { bgcolor: nx.goldLight } }}>
                {hero.primary_cta}
              </Button>
              <Button href="#project-finder" variant="outlined" startIcon={<ForumRoundedIcon />} sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.35)", fontWeight: 700, px: 3.5, py: 1.4, borderRadius: 999, fontSize: "0.82rem", "&:hover": { borderColor: nx.gold, bgcolor: "rgba(201,162,75,0.08)" } }}>
                {hero.secondary_cta}
              </Button>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
              {(hero.quick_filters || []).map((f) => (
                <Chip key={f} label={f} size="small" sx={{ bgcolor: "rgba(245,241,230,0.06)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontSize: "0.75rem" }} />
              ))}
            </Stack>

            <Grid2 container spacing={1.5}>
              {(hero.stats || []).map((s, i) => (
                <Grid2 key={i} size={4}>
                  <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, py: 1.8, textAlign: "center" }}>
                    <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: { xs: "1.1rem", md: "1.4rem" } }}>{s.value}</Typography>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.68rem", mt: 0.3 }}>{s.label}</Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5.5 }}>
            <Box id="project-finder" sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 }, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.5rem", fontWeight: 600, mb: 0.5 }}>{finder.title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.86rem", mb: 3 }}>{finder.subtitle}</Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField placeholder="Your full name" value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                  <TextField placeholder="Include country code" label="WhatsApp number" value={form.whatsapp} onChange={update("whatsapp")} fullWidth size="small" sx={nxInputSx} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label="Preferred area" value={form.area} onChange={update("area")} fullWidth size="small" sx={nxInputSx}>
                    {(finder.area_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                  <TextField select label="Budget range" value={form.budget} onChange={update("budget")} fullWidth size="small" sx={nxInputSx}>
                    {(finder.budget_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label="Project priority" value={form.priority} onChange={update("priority")} fullWidth size="small" sx={nxInputSx}>
                    {(finder.priority_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                  <TextField select label="Unit type" value={form.unitType} onChange={update("unitType")} fullWidth size="small" sx={nxInputSx}>
                    {(finder.unit_type_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                </Stack>
                <TextField
                  label="Additional requirements"
                  placeholder="Preferred project, delivery date, payment plan, sea view, or rental goal."
                  value={form.notes}
                  onChange={update("notes")}
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                  sx={nxInputSx}
                />

                <Box sx={{ bgcolor: "rgba(201,162,75,0.08)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5 }}>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.76rem" }}>{finder.helper_note}</Typography>
                </Box>

                <Button onClick={handleWhatsApp} startIcon={<WhatsAppIcon />} fullWidth variant="contained" sx={{ bgcolor: "#5ce6d0", color: "#00251c", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: "#7fefda" } }}>
                  {finder.submit_label}
                </Button>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem", textAlign: "center" }}>{finder.form_disclaimer}</Typography>
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

export default NxProjectsHero;
