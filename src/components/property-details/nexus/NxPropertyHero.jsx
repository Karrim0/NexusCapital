import { useState, useEffect } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, Chip, Breadcrumbs } from "@mui/material";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const NxPropertyHero = ({ property, whatsappNumber, hasVideo, hasMap }) => {
  const { t } = useTranslation();
  const NAV_TABS = [
    { id: "gallery", label: t("nxPropertyHero.gallery") },
    { id: "property", label: t("nxPropertyHero.property") },
    { id: "highlights", label: t("nxPropertyHero.highlights") },
    { id: "facilities", label: t("nxPropertyHero.facilities") },
    { id: "video", label: t("nxPropertyHero.video") },
    { id: "payment", label: t("nxPropertyHero.payment") },
    { id: "location", label: t("nxPropertyHero.location") },
    { id: "faq", label: t("nxPropertyHero.faq") },
    { id: "contact", label: t("nxPropertyHero.contact") },
  ];
  const [activeTab, setActiveTab] = useState("gallery");

  useEffect(() => {
    const onScroll = () => {
      let current = "gallery";
      for (const tab of NAV_TABS) {
        const el = document.getElementById(tab.id);
        if (el && el.getBoundingClientRect().top < 160) current = tab.id;
      }
      setActiveTab(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tabs = NAV_TABS.filter((t2) => (t2.id !== "video" || hasVideo) && (t2.id !== "location" || hasMap));

  const badges = [
    property.is_rented ? t("nxPropertyHero.rented") : null,
    property.is_sold ? t("nxPropertyHero.sold") : null,
    property.has_offer ? t("nxPropertyHero.offer") : null,
    property.contract_type,
    property.badge,
    property.delivery_date ? `${t("nxPropertyHero.delivery")} ${property.delivery_date}` : null,
  ].filter(Boolean);

  const specs = [
    { label: t("nxPropertyHero.area"), value: property.area ? `${property.area} sqm` : "—" },
    { label: t("nxPropertyHero.layout"), value: property.property_type || "—" },
    { label: t("nxPropertyHero.view"), value: property.view_category || property.badge || "—" },
    { label: t("nxPropertyHero.floor"), value: property.floor || "—" },
  ];

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(t("nxPropertyHero.whatsappInterestMessage", { title: property.title, location: property.location || "" }));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <>
      <Box sx={{ position: "relative", bgcolor: nx.ink, minHeight: { md: 560 } }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: property.image
              ? `linear-gradient(90deg, rgba(6,8,12,0.94) 25%, rgba(6,8,12,0.55) 65%, rgba(6,8,12,0.25) 100%), url(${property.image})`
              : `linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", py: { xs: 4, md: 6 } }}>
          <Breadcrumbs sx={{ mb: 3, "& .MuiBreadcrumbs-separator": { color: nx.textOnDarkMuted } }}>
            <Typography component={Link} to="/" sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", textDecoration: "none" }}>{t("nxCommon.breadcrumb.home")}</Typography>
            <Typography component={Link} to="/buy" sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", textDecoration: "none" }}>{t("nxPropertyHero.buyAHome")}</Typography>
            <Typography sx={{ color: nx.gold, fontSize: "0.8rem" }}>{property.title}</Typography>
          </Breadcrumbs>

          <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                {badges.map((b, i) => (
                  <Chip
                    key={i}
                    label={b}
                    size="small"
                    sx={
                      b === t("nxPropertyHero.rented") || b === t("nxPropertyHero.sold")
                        ? { bgcolor: nx.ink, color: nx.goldLight, border: `1px solid ${nx.gold}`, fontWeight: 800, fontSize: "0.68rem" }
                        : b === t("nxPropertyHero.offer")
                        ? { background: "linear-gradient(90deg,#f0a94e,#e8935a)", color: "#2a1608", fontWeight: 800, fontSize: "0.68rem" }
                        : { bgcolor: "rgba(245,241,230,0.08)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, fontWeight: 700, fontSize: "0.68rem" }
                    }
                  />
                ))}
              </Stack>

              {(property.project_name || property.location) && (
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.8rem", mb: 1 }}>
                  {[property.project_name, property.location].filter(Boolean).join(" · ")}
                </Typography>
              )}

              <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, lineHeight: 1.12, fontSize: { xs: "2rem", sm: "2.6rem", md: "3.1rem" }, mb: 3, textTransform: "uppercase" }}>
                {property.title}
              </Typography>

              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "1rem", lineHeight: 1.8, maxWidth: 560, mb: 4 }}>
                {property.short_description || t("nxPropertyHero2.descriptionTemplate", { type: property.property_type ? property.property_type.toLowerCase() : t("nxPropertyHero2.property"), location: property.location || t("nxPropertyHero2.primeRedSeaLocation") })}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  href="#gallery"
                  variant="contained"
                  startIcon={<PhotoLibraryRoundedIcon />}
                  sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}
                >
                  {t("nxPropertyHero2.viewGallery")}
                </Button>
                <Button
                  href="#payment"
                  variant="outlined"
                  startIcon={<PaymentsRoundedIcon />}
                  sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem" }}
                >
                  {t("nxPropertyHero2.paymentPlan")}
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  sx={{ color: "#5ce6d0", borderColor: "rgba(92,230,208,0.4)", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem" }}
                >
                  {t("nxPropertyHero2.askAboutThisProperty")}
                </Button>
                {property.booking_url && !property.is_rented && (
                  <Button
                    component="a"
                    href={property.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<EventAvailableRoundedIcon />}
                    sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, px: 3, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}
                  >
                    {t("nxPropertyHero2.bookNow")}
                  </Button>
                )}
              </Stack>

              <Grid2 container spacing={1.5}>
                {specs.map((s) => (
                  <Grid2 key={s.label} size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ bgcolor: "rgba(245,241,230,0.05)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5 }}>
                      <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</Typography>
                      <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.85rem" }}>{s.value}</Typography>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
                <Box sx={{ height: 260, backgroundImage: `url(${property.image || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: "#1b2436" }} />
                <Box sx={{ bgcolor: nx.panel, p: 3 }}>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem", letterSpacing: "0.08em", mb: 0.5 }}>{t("nxPropertyHero2.propertyPrice")}</Typography>
                  <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "2rem" }}>
                    {property.price ? `${currencySymbol(property.currency)}${Number(property.price).toLocaleString()}` : t("nxPropertyHero2.priceOnRequest")}
                  </Typography>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", mt: 0.5 }}>
                    {t("nxPropertyHero2.indicativeConversion")}
                  </Typography>
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
              { label: t("nxPropertyHero2.quickFacts.propertyPrice"), value: property.price ? `${currencySymbol(property.currency)}${Number(property.price).toLocaleString()}` : t("nxPropertyHero2.onRequest") },
              { label: t("nxPropertyHero2.quickFacts.area"), value: property.area ? `${property.area} sqm` : "—" },
              { label: t("nxPropertyHero2.quickFacts.property"), value: property.property_type || "—" },
              { label: t("nxPropertyHero2.quickFacts.view"), value: property.view_category || "—" },
              { label: t("nxPropertyHero2.quickFacts.floor"), value: property.floor || "—" },
              { label: t("nxPropertyHero2.quickFacts.payment"), value: property.down_payment_percent ? t("nxPropertyHero2.fromPercentDown", { percent: property.down_payment_percent }) : t("nxPropertyHero2.flexible") },
              { label: t("nxPropertyHero2.quickFacts.delivery"), value: property.delivery_date || "—" },
            ].map((item, i) => (
              <Box key={i} sx={{ py: 1.5, px: 2.5, flex: 1, minWidth: 0 }}>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</Typography>
                <Typography noWrap sx={{ color: item.label === t("nxPropertyHero2.quickFacts.propertyPrice") ? nx.gold : nx.textOnCream, fontWeight: 700, fontSize: "0.85rem" }}>{item.value}</Typography>
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
                  color: activeTab === tab.id ? nx.gold : nx.textOnCreamMuted,
                  textDecoration: "none",
                  borderBottom: activeTab === tab.id ? `2px solid ${nx.gold}` : "2px solid transparent",
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

export default NxPropertyHero;
