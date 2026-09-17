import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Collapse, TextField, MenuItem, Button } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { nx, fontHeading, goldGradient } from "../../../theme/nexusHomeTheme";
import { sendGeneralContactRequest } from "../../../api/contactRequests";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const defaultFaqs = (project) => {
  const price = project.starting_price ? `${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : null;
  const name = project.name || project.title;
  return [
    { question: `What is ${name}?`, answer: `${name} is a residential project in ${project.location || "the Red Sea"}${project.district ? `, ${project.district}` : ""}, designed around modern coastal architecture, premium finishes, Red Sea lifestyle appeal, and investment value.` },
    { question: `Where is ${name} located?`, answer: `${name} is located in ${project.district || project.location || "the Red Sea area"}.` },
    { question: "What is the starting price?", answer: price ? `The starting price is ${price} for selected available opportunities, subject to live availability and official confirmation.` : "Contact the team for the current starting price and availability." },
    { question: "Is there a limited-time discount?", answer: project.offer_discount_percent ? `Yes. An exclusive ${project.offer_discount_percent}% discount is available ${project.offer_deadline_label || "for a limited time"}, subject to availability and confirmation before reservation.` : "Ask the team whether a current discount applies to this project." },
    { question: "What payment plans are available?", answer: project.down_payment_percent ? `Available options include plans starting from ${project.down_payment_percent}% down payment over ${project.installment_years || "several"} years, plus a cash-payment option with the highest discount.` : "Contact the team for the current payment plan options." },
    { question: "When is delivery?", answer: project.delivery_date ? `The delivery date is ${project.delivery_date}.` : "Contact the team for the current delivery timeline." },
    { question: `Why is ${name} positioned as an investment?`, answer: `It combines a prime ${project.district || project.location || "Red Sea"} location, holiday rental demand, potential long-term capital appreciation, flexible payment plans, and the opportunity to own in a Red Sea coastal project at today's prices.` },
    { question: `Is ${name} suitable for personal use?`, answer: "Yes. The project is designed for both personal coastal living and investment, with a peaceful atmosphere, fresh sea breeze, modern amenities, and a resort-style lifestyle." },
  ];
};

const timelineOptions = ["As soon as possible", "Within 3 months", "Within 6 months", "Just researching"];

const NxProjectFaqEnquiry = ({ project, whatsappNumber, phoneNumber, brandName, consultTitle, consultDescription, consultCtaLabel }) => {
  const faqs = project.project_faqs?.length ? project.project_faqs : defaultFaqs(project);
  const [openIndex, setOpenIndex] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", unitInterest: "", view: "", plan: "", timeline: "", message: "" });
  const [sending, setSending] = useState(false);
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const priceLabel = project.starting_price ? `${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : null;
  const unitInterestOptions = [
    "Current available units",
    priceLabel ? `Starting-price units from ${priceLabel}` : "Starting-price units",
    "Sea-view units",
    "Not sure yet",
  ];

  const buildMessage = () =>
    [
      `Hello! I'd like to request availability for "${project.name || project.title}".`,
      form.name && `Name: ${form.name}`,
      form.phone && `Phone: ${form.phone}`,
      form.unitInterest && `Unit interest: ${form.unitInterest}`,
      form.view && `Preferred view: ${form.view}`,
      form.plan && `Preferred plan: ${form.plan}`,
      form.timeline && `Buying timeline: ${form.timeline}`,
      form.message && `Message: ${form.message}`,
    ].filter(Boolean).join("\n");

  const handleWhatsApp = async () => {
    // Save the enquiry so it also appears in the dashboard's Requests page,
    // then open WhatsApp with the same details ready to send.
    if (form.name || form.phone || form.message) {
      setSending(true);
      try {
        await sendGeneralContactRequest({
          name: form.name || "Website visitor",
          phone: form.phone || undefined,
          subject: `Project enquiry: ${project.name || project.title}`,
          message: buildMessage(),
        });
      } catch (err) {
        console.error("Failed to save project enquiry request:", err);
      } finally {
        setSending(false);
      }
    }

    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener");
  };

  const planOptions = (project.payment_plan_rows?.length ? project.payment_plan_rows : []).map((p) => p.label);

  return (
    <>
      <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }} id="faq">
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 4, md: 6 }}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: "#0f9d78" }} />
                <Typography sx={{ color: "#0f9d78", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>FAQ</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
                {(project.name || project.title || "").toUpperCase()} questions
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack spacing={1.5}>
                {faqs.map((item, i) => {
                  const open = openIndex === i;
                  return (
                    <Box key={i} onClick={() => setOpenIndex(open ? -1 : i)} sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, cursor: "pointer", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.92rem" }}>{item.question}</Typography>
                        <ExpandMoreRoundedIcon sx={{ color: "#0f9d78", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </Stack>
                      <Collapse in={open}>
                        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mt: 1.5 }}>{item.answer}</Typography>
                      </Collapse>
                    </Box>
                  );
                })}
              </Stack>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      <Box id="contact" sx={{ position: "relative", bgcolor: nx.ink, backgroundImage: `linear-gradient(180deg, rgba(6,8,12,0.75) 0%, rgba(6,8,12,0.92) 100%), url(${project.cover_image || ""})`, backgroundSize: "cover", backgroundPosition: "center", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 5, md: 6 }} alignItems="center">
            <Grid2 size={{ xs: 12, md: 6.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: "#5ce6d0" }} />
                <Typography sx={{ color: "#5ce6d0", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>
                  {(project.name || project.title || "").toUpperCase()} · {project.district || project.location || ""}
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.9rem", md: "2.4rem" }, lineHeight: 1.2, mb: 2 }}>
                Request {project.name || project.title} availability{project.starting_price ? ` from ${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : ""}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem", lineHeight: 1.8, maxWidth: 460, mb: 3 }}>
                Send your preferred budget, view, and payment plan. {brandName} will help you confirm availability, floor plans, prices, discounts, delivery date, and reservation steps.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button onClick={handleWhatsApp} startIcon={<WhatsAppIcon />} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}>
                  WhatsApp an Advisor
                </Button>
                {phoneNumber && (
                  <Button href={`tel:${phoneNumber.replace(/\s/g, "")}`} variant="outlined" startIcon={<PhoneRoundedIcon />} sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.8rem" }}>
                    Call Now
                  </Button>
                )}
              </Stack>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5.5 }}>
              <Box sx={{ bgcolor: "rgba(15,25,35,0.85)", border: `1px solid ${nx.panelBorder}`, borderRadius: 4, p: { xs: 3, md: 4 }, backdropFilter: "blur(6px)" }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontSize: "1.3rem", fontWeight: 600, mb: 0.5 }}>Quick enquiry</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", mb: 2.5 }}>Fill this in and it opens WhatsApp with your message ready to send.</Typography>
                <Stack spacing={1.8}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <TextField placeholder="Your name" value={form.name} onChange={update("name")} fullWidth size="small" sx={nxInputSx} />
                    <TextField placeholder="Phone / WhatsApp" value={form.phone} onChange={update("phone")} fullWidth size="small" sx={nxInputSx} />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <TextField select label="Unit interest" value={form.unitInterest} onChange={update("unitInterest")} fullWidth size="small" sx={nxInputSx}>
                      {unitInterestOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </TextField>
                    <TextField select label="Preferred view" value={form.view} onChange={update("view")} fullWidth size="small" sx={nxInputSx}>
                      <MenuItem value="Sea and pool view">Sea and pool view</MenuItem>
                      <MenuItem value="Street view">Street view</MenuItem>
                      <MenuItem value="Open to options">Open to options</MenuItem>
                    </TextField>
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    {planOptions.length > 0 ? (
                      <TextField select label="Preferred plan" value={form.plan} onChange={update("plan")} fullWidth size="small" sx={nxInputSx}>
                        {planOptions.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                      </TextField>
                    ) : (
                      <TextField label="Preferred plan" placeholder="e.g. 15% down · 4 years" value={form.plan} onChange={update("plan")} fullWidth size="small" sx={nxInputSx} />
                    )}
                    <TextField select label="Buying timeline" value={form.timeline} onChange={update("timeline")} fullWidth size="small" sx={nxInputSx}>
                      {timelineOptions.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <TextField
                    placeholder="Budget, preferred plan, view, viewing time, or questions"
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
                    disabled={sending}
                    fullWidth
                    sx={{ background: goldGradient, color: "#171208", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { filter: "brightness(1.05)" } }}
                  >
                    {sending ? "Sending..." : "Send on WhatsApp"}
                  </Button>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem", textAlign: "center" }}>Your details are saved for our team and opened in WhatsApp so you can send them instantly.</Typography>
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

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
    bgcolor: "rgba(245,241,230,0.06)",
    color: nx.textOnDark,
    borderRadius: 1.5,
    "& fieldset": { borderColor: "rgba(245,241,230,0.2)" },
    "&:hover fieldset": { borderColor: "rgba(201,162,75,0.5)" },
    "&.Mui-focused fieldset": { borderColor: nx.gold },
  },
  "& .MuiInputLabel-root": { color: nx.textOnDarkMuted },
  "& .MuiInputBase-input::placeholder": { color: nx.textOnDarkMuted, opacity: 1 },
  "& .MuiSelect-icon": { color: nx.textOnDarkMuted },
};

export default NxProjectFaqEnquiry;
