import { useEffect, useState, useRef } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, Chip, IconButton } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProperties } from "../../../api/properties";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

// Auto-advancing slide of units with an active offer (has_offer toggle in
// the dashboard) — only renders once at least one such unit exists.
const NxOffersSection = ({ whatsappNumber }) => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProperties();
        const offers = Array.isArray(data) ? data.filter((p) => p.has_offer) : [];
        setProperties(offers.slice(0, 12));
      } catch {
        setProperties([]);
      }
    })();
  }, []);

  const perPage = 3;
  const pageCount = Math.max(1, Math.ceil(properties.length / perPage));
  const visible = properties.slice(page * perPage, page * perPage + perPage);

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  useEffect(() => {
    if (pageCount <= 1 || isPaused) return undefined;
    autoplayRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [pageCount, isPaused]);

  if (!properties.length) return null;

  return (
    <Box
      sx={{ bgcolor: nx.ink, py: { xs: 8, md: 12 } }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ maxWidth: 620 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {t("nxCommon.form.limitedTimeOffers")}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.15 }}>
              {t("nxCommon.form.unitsWithActiveOffer")}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          {pageCount > 1 && (
            <IconButton onClick={goPrev} sx={{ bgcolor: nx.panel, color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, "&:hover": { bgcolor: "#1a1f2b" }, display: { xs: "none", md: "inline-flex" } }}>
              <ArrowBackIosNewRoundedIcon fontSize="small" />
            </IconButton>
          )}
          <Grid2 container spacing={3} sx={{ flex: 1 }}>
            {visible.map((p) => (
              <Grid2 key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <OfferCard property={p} whatsappNumber={whatsappNumber} />
              </Grid2>
            ))}
          </Grid2>
          {pageCount > 1 && (
            <IconButton onClick={goNext} sx={{ bgcolor: nx.panel, color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, "&:hover": { bgcolor: "#1a1f2b" }, display: { xs: "none", md: "inline-flex" } }}>
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

const OfferCard = ({ property: p, whatsappNumber }) => {
  const { t } = useTranslation();
  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(t("nxCommon.form.offerWhatsappMessage", { title: p.title, location: p.location || "" }));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", height: 190, backgroundImage: `url(${p.image || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: "#1b2436" }}>
        <Chip
          label={t("nxCommon.form.offer")}
          size="small"
          sx={{ position: "absolute", top: 12, left: 12, background: "linear-gradient(90deg,#f0a94e,#e8935a)", color: "#2a1608", fontWeight: 800, fontSize: "0.68rem" }}
        />
        {p.price && (
          <Chip
            label={`${t("nxCommon.form.from")} ${currencySymbol(p.currency)}${Number(p.price).toLocaleString()}`}
            size="small"
            sx={{ position: "absolute", top: 12, right: 12, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.68rem" }}
          />
        )}
      </Box>
      <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: "1.15rem", mb: 0.3 }}>
          {p.title}
        </Typography>
        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {[p.location, p.city].filter(Boolean).join(" · ")}
        </Typography>
        {p.price && (
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.92rem", mb: 1 }}>
            {currencySymbol(p.currency)}{Number(p.price).toLocaleString()}
          </Typography>
        )}
        <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 2 }}>
          {[p.bedrooms && `${p.bedrooms} ${t("nxCommon.form.bed")}`, p.bathrooms && `${p.bathrooms} ${t("nxCommon.form.bath")}`, p.area && `${p.area} m²`]
            .filter(Boolean)
            .map((f) => (
              <Chip key={f} label={f} size="small" sx={{ bgcolor: "rgba(245,241,230,0.08)", color: nx.textOnDark, fontSize: "0.68rem", fontWeight: 600 }} />
            ))}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          <Button
            component={Link}
            to={`/properties/${p.id}`}
            fullWidth
            variant="contained"
            sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, "&:hover": { bgcolor: nx.goldLight } }}
          >
            {t("nxCommon.form.viewDetails")}
          </Button>
          <Button
            onClick={handleWhatsApp}
            fullWidth
            variant="outlined"
            startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
            sx={{ borderColor: "rgba(245,241,230,0.3)", color: nx.textOnDark, fontWeight: 700, fontSize: "0.72rem", borderRadius: 999 }}
          >
            {t("nxCommon.form.whatsapp")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default NxOffersSection;
