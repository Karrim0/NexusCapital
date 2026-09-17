import { useState } from "react";
import {
  Box,
  Container,
  Grid2,
  Stack,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";

const NxHeroSection = ({ content, whatsappNumber }) => {
  const { t } = useTranslation();
  const hero = content.hero;
  const areaOptions = t("nxCommon.options.areas", { returnObjects: true });
  const purposeOptions = t("nxCommon.options.purposes", { returnObjects: true });
  const budgetOptions = t("nxCommon.options.budgets", { returnObjects: true });
  const propertyTypeOptions = t("nxCommon.options.propertyTypes", { returnObjects: true });
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    area: "",
    purpose: "",
    budget: "",
    propertyType: "",
    message: "",
  });

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const buildMessage = () =>
    [
      t("nxCommon.whatsappMessages.shortlistGreeting"),
      form.name && `${t("nxCommon.whatsappMessages.nameLabel")}: ${form.name}`,
      form.area && `${t("nxCommon.whatsappMessages.areaLabel")}: ${form.area}`,
      form.purpose && `${t("nxCommon.whatsappMessages.purposeLabel")}: ${form.purpose}`,
      form.budget && `${t("nxCommon.whatsappMessages.budgetLabel")}: ${form.budget}`,
      form.propertyType && `${t("nxCommon.whatsappMessages.propertyTypeLabel")}: ${form.propertyType}`,
      form.message && `${t("nxCommon.whatsappMessages.notesLabel")}: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  const handleWhatsApp = async () => {
    if (form.name || form.whatsapp || form.message) {
      try {
        await sendGeneralContactRequest({
          name: form.name || t("nxCommon.form.websiteVisitor"),
          phone: form.whatsapp || undefined,
          subject: "Home page property shortlist request",
          message: buildMessage(),
        });
      } catch (err) {
        console.error("Failed to save shortlist request:", err);
      }
    }
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "");
    const text = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${phone.replace("+", "")}?text=${text}`, "_blank", "noopener");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Property shortlist request");
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:${content.topbar?.email || ""}?subject=${subject}&body=${body}`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: nx.ink,
        backgroundImage: hero.background_image
          ? `linear-gradient(180deg, rgba(6,8,12,0.55) 0%, rgba(6,8,12,0.85) 100%), url(${hero.background_image})`
          : `radial-gradient(circle at 20% 20%, rgba(201,162,75,0.14), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>
                {hero.eyebrow}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontFamily: fontHeading,
                color: nx.textOnDark,
                fontWeight: 600,
                lineHeight: 1.12,
                fontSize: { xs: "2.4rem", sm: "3rem", md: "3.6rem" },
                mb: 3,
              }}
            >
              {hero.title_prefix}{" "}
              <Box component="span" sx={{ color: nx.gold }}>
                {hero.title_highlight}
              </Box>{" "}
              {hero.title_suffix}
            </Typography>

            <Typography
              sx={{
                color: nx.textOnDarkMuted,
                fontSize: "1.05rem",
                lineHeight: 1.8,
                maxWidth: 560,
                mb: 4,
              }}
            >
              {hero.subtitle}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
              <Button
                component={Link}
                to="/properties"
                variant="contained"
                startIcon={<SearchRoundedIcon />}
                sx={{
                  bgcolor: nx.gold,
                  color: "#171208",
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 999,
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                  "&:hover": { bgcolor: nx.goldLight },
                }}
              >
                {hero.primary_cta}
              </Button>
              <Button
                href="#shortlist"
                variant="outlined"
                sx={{
                  color: nx.textOnDark,
                  borderColor: "rgba(245,241,230,0.35)",
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 999,
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                  "&:hover": { borderColor: nx.gold, bgcolor: "rgba(201,162,75,0.08)" },
                }}
              >
                {hero.secondary_cta}
              </Button>
            </Stack>

            <Grid2 container spacing={1.5}>
              {(hero.features || []).map((f) => (
                <Grid2 key={f}>
                  <Chip
                    icon={<CheckRoundedIcon sx={{ color: `${nx.gold} !important`, fontSize: 16 }} />}
                    label={f}
                    sx={{
                      bgcolor: "rgba(245,241,230,0.06)",
                      color: nx.textOnDark,
                      border: `1px solid ${nx.panelBorder}`,
                      fontSize: "0.8rem",
                    }}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5.5 }}>
            <Box
              id="shortlist"
              sx={{
                bgcolor: nx.panel,
                border: `1px solid ${nx.panelBorder}`,
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
              }}
            >
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.7rem", fontWeight: 600, mb: 0.5 }}>
                {hero.form_title}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem", mb: 3 }}>
                {hero.form_subtitle}
              </Typography>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    placeholder={t("nxCommon.form.fullName")}
                    value={form.name}
                    onChange={update("name")}
                    fullWidth
                    size="small"
                    sx={nxInputSx}
                  />
                  <TextField
                    placeholder={t("nxCommon.form.whatsappNumber")}
                    value={form.whatsapp}
                    onChange={update("whatsapp")}
                    fullWidth
                    size="small"
                    sx={nxInputSx}
                  />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label={t("nxCommon.form.preferredArea")} value={form.area} onChange={update("area")} fullWidth size="small" sx={nxInputSx}>
                    {areaOptions.map((a) => (
                      <MenuItem key={a} value={a}>{a}</MenuItem>
                    ))}
                  </TextField>
                  <TextField select label={t("nxCommon.form.buyingPurpose")} value={form.purpose} onChange={update("purpose")} fullWidth size="small" sx={nxInputSx}>
                    {purposeOptions.map((a) => (
                      <MenuItem key={a} value={a}>{a}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField select label={t("nxCommon.form.budgetRange")} value={form.budget} onChange={update("budget")} fullWidth size="small" sx={nxInputSx}>
                    {budgetOptions.map((a) => (
                      <MenuItem key={a} value={a}>{a}</MenuItem>
                    ))}
                  </TextField>
                  <TextField select label={t("nxCommon.form.propertyType")} value={form.propertyType} onChange={update("propertyType")} fullWidth size="small" sx={nxInputSx}>
                    {propertyTypeOptions.map((a) => (
                      <MenuItem key={a} value={a}>{a}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <TextField
                  placeholder={t("nxCommon.form.shortlistMessagePlaceholder")}
                  value={form.message}
                  onChange={update("message")}
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                  sx={nxInputSx}
                />

                <Box sx={{ bgcolor: "rgba(201,162,75,0.08)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5 }}>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem" }}>{hero.form_helper}</Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    onClick={handleWhatsApp}
                    startIcon={<WhatsAppIcon />}
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: nx.gold,
                      color: "#171208",
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 999,
                      fontSize: "0.78rem",
                      "&:hover": { bgcolor: nx.goldLight },
                    }}
                  >
                    {hero.submit_whatsapp_label}
                  </Button>
                  <Button
                    onClick={handleEmail}
                    startIcon={<EmailRoundedIcon />}
                    fullWidth
                    variant="outlined"
                    sx={{
                      color: nx.textOnDark,
                      borderColor: "rgba(245,241,230,0.3)",
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 999,
                      fontSize: "0.78rem",
                    }}
                  >
                    {hero.submit_email_label}
                  </Button>
                </Stack>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", textAlign: "center" }}>
                  {hero.form_disclaimer}
                </Typography>
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

export default NxHeroSection;
