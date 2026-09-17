import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, TextField, MenuItem, Chip, ToggleButton, ToggleButtonGroup, Avatar } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { Link } from "react-router-dom";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";
import { useTranslation } from "react-i18next";

const NxLandsHero = ({ content, brandName, whatsappNumber, email, logoUrl }) => {
  const { t } = useTranslation();
  const hero = content.hero;
  const brief = content.brief_panel;

  const [criteria, setCriteria] = useState("Price");
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    area: "",
    homeType: "",
    budget: "",
    purpose: "",
    notes: "",
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const buildMessage = () =>
    [
      t("nxCommon.buyerBrief.landGreeting", { brand: brandName }),
      `${t("nxCommon.buyerBrief.comparingBy")}: ${criteria}`,
      form.name && `${t("nxCommon.buyerBrief.nameLabel")}: ${form.name}`,
      form.area && `${t("nxCommon.buyerBrief.areaLabel")}: ${form.area}`,
      form.homeType && `${t("nxCommon.buyerBrief.homeTypeLabel")}: ${form.homeType}`,
      form.budget && `${t("nxCommon.buyerBrief.budgetLabel")}: ${form.budget}`,
      form.purpose && `${t("nxCommon.buyerBrief.purposeLabel")}: ${form.purpose}`,
      form.notes && `${t("nxCommon.buyerBrief.preferencesLabel")}: ${form.notes}`,
    ]
      .filter(Boolean)
      .join("\n");

  const handleWhatsApp = async () => {
    if (form.name || form.whatsapp || form.email) {
      try {
        await sendGeneralContactRequest({
          name: form.name || t("nxCommon.form.websiteVisitor"),
          phone: form.whatsapp || undefined,
          email: form.email || undefined,
          subject: `${brandName} land & building brief`,
          message: buildMessage(),
        });
      } catch (err) {
        console.error("Failed to save buyer brief request:", err);
      }
    }
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${brandName} land & building brief`);
    window.location.href = `mailto:${email || ""}?subject=${subject}&body=${encodeURIComponent(buildMessage())}`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: nx.ink,
        backgroundImage: `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`,
        pt: { xs: 5, md: 7 },
        pb: { xs: 7, md: 9 },
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em" }}>
                {hero.eyebrow}
              </Typography>
            </Stack>
            <Chip
              label={hero.badge}
              size="small"
              sx={{ bgcolor: "rgba(201,162,75,0.12)", color: nx.gold, fontWeight: 700, fontSize: "0.68rem", mb: 2 }}
            />
            <Typography
              sx={{
                fontFamily: fontHeading,
                color: nx.textOnDark,
                fontWeight: 600,
                lineHeight: 1.15,
                fontSize: { xs: "2.1rem", sm: "2.6rem", md: "3rem" },
                mb: 3,
              }}
            >
              {hero.title_prefix}{" "}
              <Box component="span" sx={{ color: nx.gold }}>
                {hero.title_highlight}
              </Box>
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, mb: 4 }}>
              {hero.subtitle}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
              <Button
                href="#buy-listings"
                variant="contained"
                startIcon={<SearchRoundedIcon />}
                sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3.5, py: 1.4, borderRadius: 999, fontSize: "0.82rem", "&:hover": { bgcolor: nx.goldLight } }}
              >
                {hero.primary_cta}
              </Button>
              <Button
                href="#buyer-brief"
                variant="outlined"
                startIcon={<ForumRoundedIcon />}
                sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.35)", fontWeight: 700, px: 3.5, py: 1.4, borderRadius: 999, fontSize: "0.82rem", "&:hover": { borderColor: nx.gold, bgcolor: "rgba(201,162,75,0.08)" } }}
              >
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
                    <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: { xs: "1.1rem", md: "1.4rem" } }}>
                      {s.value}
                    </Typography>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.68rem", mt: 0.3 }}>{s.label}</Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5.5 }}>
            <Box id="buyer-brief" sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 }, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Avatar src={logoUrl || undefined} variant="rounded" sx={{ width: 36, height: 36, bgcolor: "rgba(201,162,75,0.12)" }} />
                <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontSize: "1.4rem", fontWeight: 600 }}>
                  {brief.title}
                </Typography>
              </Stack>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.86rem", mb: 3 }}>{brief.subtitle}</Typography>

              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em", mb: 1 }}>
                {brief.eyebrow}
              </Typography>
              <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.92rem", mb: 0.3 }}>{brief.criteria_title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", mb: 1.5 }}>{brief.criteria_description}</Typography>

              <ToggleButtonGroup
                value={criteria}
                exclusive
                onChange={(e, val) => val && setCriteria(val)}
                size="small"
                sx={{ mb: 3, display: "flex" }}
              >
                {(brief.criteria_options || []).map((c) => (
                  <ToggleButton
                    key={c}
                    value={c}
                    sx={{
                      flex: 1,
                      color: nx.textOnDarkMuted,
                      borderColor: "rgba(245,241,230,0.18)",
                      textTransform: "none",
                      "&.Mui-selected": { bgcolor: nx.gold, color: "#171208", "&:hover": { bgcolor: nx.goldLight } },
                    }}
                  >
                    {c}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField placeholder={t("nxCommon.buyerBrief.yourFullName")} value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                  <TextField placeholder={t("nxCommon.buyerBrief.emailPlaceholder")} value={form.email} onChange={update("email")} fullWidth size="small" sx={nxInputSx} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField placeholder={t("nxCommon.buyerBrief.includeCountryCode")} value={form.whatsapp} onChange={update("whatsapp")} fullWidth size="small" sx={nxInputSx} label={t("nxCommon.buyerBrief.whatsappOptional")} />
                  <TextField select label={t("nxCommon.buyerBrief.preferredArea")} value={form.area} onChange={update("area")} fullWidth size="small" sx={nxInputSx}>
                    {(brief.area_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label={t("nxCommon.buyerBrief.homeTypeOrStatus")} value={form.homeType} onChange={update("homeType")} fullWidth size="small" sx={nxInputSx}>
                    {(brief.home_type_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                  <TextField select label={t("nxCommon.buyerBrief.budgetRange")} value={form.budget} onChange={update("budget")} fullWidth size="small" sx={nxInputSx}>
                    {(brief.budget_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </TextField>
                </Stack>
                <TextField select label={t("nxCommon.buyerBrief.purposeOptional")} value={form.purpose} onChange={update("purpose")} fullWidth size="small" sx={nxInputSx}>
                  {(brief.purpose_options || []).map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                </TextField>
                <TextField
                  placeholder={t("nxCommon.buyerBrief.preferencesPlaceholder")}
                  label={t("nxCommon.buyerBrief.preferencesOptional")}
                  value={form.notes}
                  onChange={update("notes")}
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                  sx={nxInputSx}
                />

                <Box sx={{ bgcolor: "rgba(201,162,75,0.08)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5 }}>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.76rem" }}>{brief.helper_note}</Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button onClick={handleWhatsApp} startIcon={<WhatsAppIcon />} fullWidth variant="contained" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.76rem", "&:hover": { bgcolor: nx.goldLight } }}>
                    {brief.submit_whatsapp_label}
                  </Button>
                  <Button onClick={handleEmail} startIcon={<EmailRoundedIcon />} fullWidth variant="outlined" sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.76rem" }}>
                    {brief.submit_email_label}
                  </Button>
                </Stack>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.68rem", textAlign: "center" }}>{brief.form_disclaimer}</Typography>
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

export default NxLandsHero;
