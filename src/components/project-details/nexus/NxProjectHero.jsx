import { useState, useEffect } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, Chip, Breadcrumbs } from "@mui/material";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const NAV_TABS = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Gallery" },
  { id: "residences", label: "Residences" },
  { id: "investment", label: "Investment" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "offer", label: "Offer" },
  { id: "payment", label: "Payment" },
  { id: "location", label: "Location" },
  { id: "journey", label: "Buyer Journey" },
  { id: "faq", label: "FAQ" },
];

const splitTitle = (name = "") => {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return [name, ""];
  return [words.slice(0, -1).join(" "), words[words.length - 1]];
};

const NxProjectHero = ({ project, whatsappNumber, hasOffer, hasMap, hasJourney, hasResidences, hasInvestment, hasLifestyle, hasFaq }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [prefix, highlight] = splitTitle(project.name || project.title);

  useEffect(() => {
    const onScroll = () => {
      let current = "overview";
      for (const tab of NAV_TABS) {
        const el = document.getElementById(tab.id);
        if (el && el.getBoundingClientRect().top < 160) current = tab.id;
      }
      setActiveTab(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tabs = NAV_TABS.filter((t) => {
    if (t.id === "residences") return hasResidences;
    if (t.id === "investment") return hasInvestment;
    if (t.id === "lifestyle") return hasLifestyle;
    if (t.id === "offer") return hasOffer;
    if (t.id === "location") return hasMap;
    if (t.id === "journey") return hasJourney;
    if (t.id === "faq") return hasFaq;
    return true;
  });

  const badges = (project.badges && project.badges.length
    ? project.badges
    : [
        "Exclusive Investment Opportunity",
        project.starting_price ? `Starting from ${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : null,
        project.delivery_date ? `Delivery ${project.delivery_date}` : null,
      ]
  ).filter(Boolean);

  const points = [
    project.starting_price && { title: `Starting from ${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}`, description: "Accessible entry into Red Sea coastal ownership." },
    { title: project.location || "Luxury coastal living", description: "A modern lifestyle destination on the Red Sea." },
    project.architectural_vision && { title: "Distinctive architecture", description: project.architectural_vision.split(/[.\n]/)[0]?.slice(0, 70) || "Contemporary design and premium finishes." },
    project.delivery_date && { title: `Delivery in ${project.delivery_date}`, description: project.offer_discount_percent ? `Flexible payment plans with limited-time discounts.` : "Flexible payment plans available." },
  ].filter(Boolean).slice(0, 4);

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(`Hello! I'm interested in "${project.name || project.title}" (${project.location || ""}). Could you share the current price list?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <>
      <Box sx={{ position: "relative", bgcolor: nx.ink, minHeight: { md: 560 }, overflow: "hidden" }}>
        {(project.cover_image || project.main_image) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${project.cover_image || project.main_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(90deg, rgba(6,8,12,0.62) 0%, rgba(6,8,12,0.45) 60%, rgba(6,8,12,0.3) 100%), linear-gradient(180deg, rgba(10,12,16,0.2) 0%, rgba(13,17,25,0.35) 100%)`,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 4, md: 6 } }}>
          <Breadcrumbs sx={{ mb: 3, "& .MuiBreadcrumbs-separator": { color: nx.textOnDarkMuted } }}>
            <Typography component={Link} to="/" sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", textDecoration: "none" }}>Home</Typography>
            <Typography component={Link} to="/projects" sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", textDecoration: "none" }}>Projects</Typography>
            <Typography sx={{ color: nx.gold, fontSize: "0.8rem" }}>{(project.name || project.title || "").toUpperCase()}</Typography>
          </Breadcrumbs>

          <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                {badges.map((b, i) => (
                  <Chip key={i} label={b} size="small" sx={{ bgcolor: "rgba(245,241,230,0.08)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontWeight: 700, fontSize: "0.66rem" }} />
                ))}
              </Stack>

              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.8rem", mb: 1 }}>
                {[project.district, project.location, "Red Sea"].filter(Boolean).join(" · ")}
              </Typography>

              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 700, lineHeight: 1.05, fontSize: { xs: "2.6rem", sm: "3.4rem", md: "4rem" }, mb: 3, textTransform: "uppercase" }}>
                {prefix} <Box component="span" sx={{ color: "#5ce6d0" }}>{highlight}</Box>
              </Typography>

              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, mb: 4 }}>
                {project.overview || project.description || `${project.name} is a residential project in ${project.location || "the Red Sea"} designed for buyers who want elegance, comfort, and a strong investment opportunity.`}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
                <Button href="#gallery" variant="outlined" startIcon={<PhotoLibraryRoundedIcon />} sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.8rem" }}>
                  View Gallery
                </Button>
                <Button href="#payment" variant="outlined" startIcon={<PaymentsRoundedIcon />} sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.8rem" }}>
                  View Payment Plans
                </Button>
                <Button onClick={handleWhatsApp} variant="contained" startIcon={<WhatsAppIcon />} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}>
                  Request Price List
                </Button>
              </Stack>

              <Grid2 container spacing={1.5}>
                {points.map((p, i) => (
                  <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} sx={{ bgcolor: "rgba(245,241,230,0.05)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5 }}>
                      <Typography sx={{ color: "#5ce6d0" }}>✓</Typography>
                      <Box>
                        <Typography sx={{ color: "#5ce6d0", fontWeight: 700, fontSize: "0.78rem" }}>{p.title}</Typography>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.74rem" }}>{p.description}</Typography>
                      </Box>
                    </Stack>
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
                <Box sx={{ height: 260, backgroundImage: `url(${project.cover_image || project.main_image || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: "#1b2436" }} />
                <Box sx={{ bgcolor: nx.panel, p: 3, position: "relative" }}>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem", letterSpacing: "0.08em", mb: 0.5 }}>STARTING PRICE</Typography>
                  <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "2rem" }}>
                    {project.starting_price ? `${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : "Request Price List"}
                  </Typography>
                  {hasOffer && (
                    <Chip label="Offer" size="small" sx={{ position: "absolute", top: 16, right: 16, bgcolor: "#5ce6d0", color: "#00251c", fontWeight: 700 }} />
                  )}
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* Sticky quick facts + section nav */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 20, bgcolor: nx.creamPaper, borderBottom: "1px solid rgba(25,21,16,0.08)", boxShadow: "0 6px 20px rgba(25,21,16,0.06)" }}>
        <Container maxWidth="lg">
          <Stack direction="row" flexWrap="wrap" divider={<Box sx={{ width: "1px", bgcolor: "rgba(25,21,16,0.1)" }} />} sx={{ display: { xs: "none", md: "flex" } }}>
            {[
              { label: "Project", value: project.name || project.title },
              { label: "Location", value: project.location || "—" },
              { label: "Starting Price", value: project.starting_price ? `${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : "On request" },
              { label: "Delivery", value: project.delivery_date || "—" },
              hasOffer ? { label: "Limited Offer", value: `${project.offer_discount_percent}% Discount`, highlight: true } : null,
            ].filter(Boolean).map((item, i) => (
              <Box key={i} sx={{ py: 1.5, px: 2.5, flex: 1, minWidth: 0 }}>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</Typography>
                <Typography noWrap sx={{ color: item.highlight ? "#0f9d78" : nx.textOnCream, fontWeight: 700, fontSize: "0.85rem" }}>{item.value}</Typography>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={2.5} sx={{ py: 1.2, overflowX: "auto" }}>
            {tabs.map((tab) => (
              <Typography
                key={tab.id}
                component="a"
                href={`#${tab.id}`}
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  color: activeTab === tab.id ? "#0f9d78" : nx.textOnCreamMuted,
                  textDecoration: "none",
                  borderBottom: activeTab === tab.id ? "2px solid #0f9d78" : "2px solid transparent",
                  pb: 0.3,
                }}
              >
                {tab.label}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default NxProjectHero;
