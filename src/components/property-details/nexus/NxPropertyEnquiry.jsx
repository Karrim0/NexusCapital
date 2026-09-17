import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button, Chip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { nx, fontHeading, goldGradient } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";
import { useTranslation } from "react-i18next";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const NxPropertyEnquiry = ({ property, whatsappNumber, phoneNumber, brandName, consultTitle, consultDescription, consultCtaLabel }) => {
  const { t } = useTranslation();
  const timelineOptions = t("nxCommon.options.timelines", { returnObjects: true });
  const [form, setForm] = useState({ name: "", phone: "", plan: "", timeline: "", message: "" });
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const priceLabel = property.price ? `${currencySymbol(property.currency)}${Number(property.price).toLocaleString()}` : t("nxPropertyEnquiry.priceOnRequest");
  const summary = [property.area && `${property.area} sqm`, property.property_type, property.view_category, property.floor, priceLabel].filter(Boolean).join(" · ");

  const buildMessage = () =>
    [
      t("nxPropertyEnquiry.greeting", { title: property.title }),
      summary && `${t("nxPropertyEnquiry.listingLabel")}: ${summary}`,
      form.name && `${t("nxPropertyEnquiry.nameLabel")}: ${form.name}`,
      form.phone && `${t("nxPropertyEnquiry.phoneLabel")}: ${form.phone}`,
      form.plan && `${t("nxPropertyEnquiry.paymentPreferenceLabel")}: ${form.plan}`,
      form.timeline && `${t("nxPropertyEnquiry.timelineLabel")}: ${form.timeline}`,
      form.message && `${t("nxPropertyEnquiry.messageLabel")}: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  const handleWhatsApp = async () => {
    if (form.name || form.phone || form.message) {
      try {
        await sendGeneralContactRequest({
          name: form.name || t("nxCommon.form.websiteVisitor"),
          phone: form.phone || undefined,
          subject: `Property enquiry: ${property.title}`,
          message: buildMessage(),
        });
      } catch (err) {
        console.error("Failed to save property enquiry request:", err);
      }
    }
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  return (
    <>
      <Box id="contact" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 5, md: 6 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyEnquiry.requestCurrentAvailability")}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.9rem", md: "2.4rem" }, lineHeight: 1.2, mb: 2 }}>
                {t("nxPropertyEnquiry.askAboutThis", { area: property.area ? `${property.area} sqm ` : "", type: (property.property_type || "property").toLowerCase() })}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem", lineHeight: 1.8, maxWidth: 460, mb: 3 }}>
                {t("nxPropertyEnquiry.requestDescription", { brand: brandName })}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3 }}>
                <Button
                  onClick={handleWhatsApp}
                  startIcon={<WhatsAppIcon />}
                  sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}
                >
                  {t("nxPropertyEnquiry.whatsappAdvisor")}
                </Button>
                {phoneNumber && (
                  <Button
                    href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                    startIcon={<PhoneRoundedIcon />}
                    variant="outlined"
                    sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem" }}
                  >
                    {t("nxPropertyEnquiry.callPhone", { phone: phoneNumber })}
                  </Button>
                )}
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {t("nxPropertyEnquiry.quickTags", { returnObjects: true }).map((label) => (
                  <Chip key={label} label={label} size="small" sx={{ bgcolor: "rgba(245,241,230,0.06)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontSize: "0.7rem" }} />
                ))}
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 } }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontSize: "1.3rem", fontWeight: 600, mb: 2 }}>
                  {t("nxPropertyEnquiry.sendEnquiryTitle")}
                </Typography>
                <Box sx={{ bgcolor: "rgba(245,241,230,0.05)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5, mb: 2.5 }}>
                  <Typography sx={{ color: nx.textOnDark, fontSize: "0.8rem", fontWeight: 600 }}>{property.title}</Typography>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.75rem" }}>{summary}</Typography>
                </Box>
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField placeholder={t("nxPropertyEnquiry.yourName")} value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                    <TextField placeholder={t("nxPropertyEnquiry.phoneWithCountryCode")} value={form.phone} onChange={update("phone")} fullWidth size="small" sx={nxInputSx} />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField placeholder={t("nxPropertyEnquiry.paymentPreferencePlaceholder")} label={t("nxPropertyEnquiry.paymentPreferenceLabel")} value={form.plan} onChange={update("plan")} fullWidth size="small" sx={nxInputSx} />
                    <TextField select label={t("nxPropertyEnquiry.timelineLabel")} value={form.timeline} onChange={update("timeline")} fullWidth size="small" sx={nxInputSx}>
                      {timelineOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <TextField
                    placeholder={t("nxPropertyEnquiry.messagePlaceholder")}
                    label={t("nxPropertyEnquiry.messageLabel")}
                    value={form.message}
                    onChange={update("message")}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    sx={nxInputSx}
                  />
                  <Button
                    onClick={handleWhatsApp}
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}
                  >
                    {t("nxPropertyEnquiry.sendViaWhatsapp")}
                  </Button>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem", textAlign: "center" }}>
                    {t("nxPropertyEnquiry.noDataStored")}
                  </Typography>
                </Stack>
              </Box>
            </Grid2>
          </Grid2>

          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.68rem", lineHeight: 1.7, mt: 5, pt: 3, borderTop: `1px solid ${nx.panelBorder}` }}>
            {t("nxPropertyEnquiry.legalDisclaimer")}
          </Typography>
        </Container>
      </Box>

      {/* Final CTA banner */}
      <Box sx={{ bgcolor: "#0a0806" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2.5}>
            <Box sx={{ maxWidth: 620 }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.7rem", md: "2.1rem" }, mb: 1 }}>
                {consultTitle}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.92rem", lineHeight: 1.7 }}>{consultDescription}</Typography>
            </Box>
            <Button
              onClick={handleWhatsApp}
              startIcon={<WhatsAppIcon />}
              sx={{ background: goldGradient, color: "#171208", fontWeight: 700, fontSize: "0.82rem", whiteSpace: "nowrap", borderRadius: 999, px: 3.5, py: 1.4, "&:hover": { filter: "brightness(1.05)" } }}
            >
              {consultCtaLabel}
            </Button>
          </Stack>
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

export default NxPropertyEnquiry;
