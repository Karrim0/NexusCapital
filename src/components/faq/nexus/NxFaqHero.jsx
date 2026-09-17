import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, TextField, MenuItem } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { Link } from "react-router-dom";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";
import { useTranslation } from "react-i18next";

const trustIcons = [ShieldRoundedIcon, VisibilityRoundedIcon, DescriptionRoundedIcon, ForumRoundedIcon];

const NxFaqHero = ({ content, brandName, whatsappNumber, email }) => {
  const { t } = useTranslation();
  const hero = content.hero;
  const panel = content.request_panel;
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", topic: "", status: "", question: "" });
  const [sending, setSending] = useState(false);
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const buildMessage = () =>
    [
      t("nxFaqHero.greeting"),
      form.name && `${t("nxFaqHero.nameLabel")}: ${form.name}`,
      form.topic && `${t("nxFaqHero.topicLabel")}: ${form.topic}`,
      form.status && `${t("nxFaqHero.statusLabel")}: ${form.status}`,
      form.question && `${t("nxFaqHero.questionLabel")}: ${form.question}`,
    ].filter(Boolean).join("\n");

  const saveRequest = async (channel) => {
    if (!form.name && !form.whatsapp && !form.email) return;
    setSending(true);
    try {
      await sendGeneralContactRequest({
        name: form.name || t("nxCommon.form.websiteVisitor"),
        phone: form.whatsapp || undefined,
        email: form.email || undefined,
        subject: `FAQ question (${channel}): ${form.topic || t("nxFaqHero.generalTopic")}`,
        message: buildMessage(),
      });
    } catch (err) {
      console.error("Failed to save FAQ question:", err);
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = async () => {
    await saveRequest("WhatsApp");
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  const handleEmail = async () => {
    await saveRequest("Email");
    const subject = encodeURIComponent(`FAQ question: ${form.topic || t("nxFaqHero.generalTopic")}`);
    window.location.href = `mailto:${email || ""}?subject=${subject}&body=${encodeURIComponent(buildMessage())}`;
  };

  return (
    <>
      <Box sx={{ position: "relative", bgcolor: nx.ink, backgroundImage: `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`, pt: { xs: 5, md: 7 }, pb: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Typography component={Link} to="/" sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", textDecoration: "none" }}>{t("nxCommon.breadcrumb.home")}</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem" }}>→</Typography>
            <Typography sx={{ color: nx.gold, fontSize: "0.72rem" }}>{t("nxFaqHero.breadcrumbFaq")}</Typography>
          </Stack>

          <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="flex-start">
            <Grid2 size={{ xs: 12, md: 6.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em" }}>{hero.eyebrow}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, lineHeight: 1.1, fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.2rem" }, mb: 3 }}>
                {hero.title_prefix}{" "}
                <Box component="span" sx={{ color: nx.gold }}>{hero.title_highlight}</Box>
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, mb: 4 }}>{hero.description}</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
                <Button href="#faq-browser" variant="contained" startIcon={<SearchRoundedIcon />} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3.5, py: 1.4, borderRadius: 999, fontSize: "0.82rem", "&:hover": { bgcolor: nx.goldLight } }}>
                  {hero.primary_cta}
                </Button>
                <Button href="#ask-question" variant="outlined" startIcon={<WhatsAppIcon />} sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.35)", fontWeight: 700, px: 3.5, py: 1.4, borderRadius: 999, fontSize: "0.82rem", "&:hover": { borderColor: nx.gold, bgcolor: "rgba(201,162,75,0.08)" } }}>
                  {hero.secondary_cta}
                </Button>
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
              <Box id="ask-question" sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 }, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.4rem", fontWeight: 600, mb: 0.5 }}>{panel.title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.86rem", mb: 3 }}>
                  {(panel.subtitle || "").replace("Nexus Capital", brandName || t("nxFaqHero.theTeam"))}
                </Typography>

                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField placeholder={t("nxFaqHero.yourFullName")} value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                    <TextField label={t("nxFaqHero.whatsappOptional")} placeholder={t("nxFaqHero.includeCountryCode")} value={form.whatsapp} onChange={update("whatsapp")} fullWidth size="small" sx={nxInputSx} />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label={t("nxFaqHero.emailRequiredForEmail")} placeholder={t("nxFaqHero.emailPlaceholder")} value={form.email} onChange={update("email")} fullWidth size="small" sx={nxInputSx} />
                    <TextField select label={t("nxFaqHero.questionTopic")} value={form.topic} onChange={update("topic")} fullWidth size="small" sx={nxInputSx}>
                      {(panel.topic_options || []).map((t2) => <MenuItem key={t2} value={t2}>{t2}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <TextField select label={t("nxFaqHero.buyerStatus")} value={form.status} onChange={update("status")} fullWidth size="small" sx={nxInputSx}>
                    {(panel.status_options || []).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>
                  <TextField
                    label={t("nxFaqHero.yourQuestion")}
                    placeholder={t("nxFaqHero.writeYourQuestion")}
                    value={form.question}
                    onChange={update("question")}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    sx={nxInputSx}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button onClick={handleWhatsApp} disabled={sending} startIcon={<WhatsAppIcon />} fullWidth variant="contained" sx={{ bgcolor: "#5ce6d0", color: "#00251c", fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.76rem", "&:hover": { bgcolor: "#7fefda" } }}>
                      {panel.submit_whatsapp_label}
                    </Button>
                    <Button onClick={handleEmail} disabled={sending} startIcon={<EmailRoundedIcon />} fullWidth variant="contained" sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.76rem", "&:hover": { bgcolor: "#1a1f2b" } }}>
                      {panel.submit_email_label}
                    </Button>
                  </Stack>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.66rem", lineHeight: 1.6 }}>{panel.form_disclaimer}</Typography>
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      <Box sx={{ bgcolor: nx.ink, borderTop: `1px solid ${nx.panelBorder}`, py: { xs: 4, md: 5 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={2.5}>
            {(content.trust_items || []).map((item, i) => {
              const Icon = trustIcons[i % trustIcons.length];
              return (
                <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ flexShrink: 0, width: 38, height: 38, borderRadius: 2, bgcolor: "rgba(201,162,75,0.12)", color: nx.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.86rem", mb: 0.3 }}>{item.title}</Typography>
                      <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.76rem", lineHeight: 1.6 }}>{item.description}</Typography>
                    </Box>
                  </Stack>
                </Grid2>
              );
            })}
          </Grid2>
        </Container>
      </Box>
    </>
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

export default NxFaqHero;
