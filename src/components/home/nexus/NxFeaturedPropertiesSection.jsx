import { useEffect, useMemo, useState, useRef } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, Chip, IconButton } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProperties } from "../../../api/properties";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { DISTRICTS } from "../../../constants/hurghadaDistricts";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const NxFeaturedPropertiesSection = ({ content, whatsappNumber }) => {
  const s = content.featured_section;
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProperties();
        const featured = data.filter((p) => p.is_featured);
        setProperties((featured.length ? featured : data).slice(0, 12));
      } catch {
        setProperties([]);
      }
    })();
  }, []);

  // Dashboard-selected districts, shown as clickable chips that route
  // straight to the matching filtered results — same district keys the
  // Buy/Rent/Lands "District" filter already uses.
  const chipDistricts = useMemo(
    () => (s.district_filters || []).map((key) => DISTRICTS.find((d) => d.key === key)).filter(Boolean),
    [s.district_filters]
  );

  const perPage = 3;
  const pageCount = Math.max(1, Math.ceil(properties.length / perPage));
  const visible = properties.slice(page * perPage, page * perPage + perPage);

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  // Auto-advance the carousel every 5s; pauses while the user hovers
  // the section, resumes automatically once they move away.
  useEffect(() => {
    if (pageCount <= 1 || isPaused) return undefined;
    autoplayRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [pageCount, isPaused]);

  return (
    <Box
      sx={{ bgcolor: nx.cream, py: { xs: 8, md: 12 } }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ maxWidth: 620 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.15 }}>
              {s.title}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/properties"
            variant="contained"
            sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.78rem", flexShrink: 0, "&:hover": { bgcolor: "#1a1f2b" } }}
          >
            {s.cta_label}
          </Button>
        </Stack>

        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", maxWidth: 620, mb: 3 }}>{s.description}</Typography>

        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
          <Chip
            component={Link}
            to="/properties"
            label={t("common.all", "ALL")}
            clickable
            sx={{ fontWeight: 700, fontSize: "0.72rem", bgcolor: "rgba(25,21,16,0.06)", color: nx.textOnCream, "&:hover": { bgcolor: "rgba(25,21,16,0.1)" } }}
          />
          {chipDistricts.map((d) => (
            <Chip
              key={d.key}
              component={Link}
              to={`/properties?district=${d.key}`}
              label={t(d.translationKey)}
              clickable
              sx={{ fontWeight: 700, fontSize: "0.72rem", bgcolor: "rgba(25,21,16,0.06)", color: nx.textOnCream, "&:hover": { bgcolor: nx.ink, color: nx.textOnDark } }}
            />
          ))}
        </Stack>

        {visible.length === 0 ? (
          <Typography sx={{ color: nx.textOnCreamMuted }}>No properties found for this filter yet.</Typography>
        ) : (
          <Stack direction="row" alignItems="center" spacing={2}>
            {pageCount > 1 && (
              <IconButton onClick={goPrev} sx={{ bgcolor: nx.ink, color: nx.textOnDark, "&:hover": { bgcolor: "#1a1f2b" }, display: { xs: "none", md: "inline-flex" } }}>
                <ArrowBackIosNewRoundedIcon fontSize="small" />
              </IconButton>
            )}
            <Grid2 container spacing={3} sx={{ flex: 1 }}>
              {visible.map((p) => (
                <Grid2 key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <FeaturedCard property={p} s={s} whatsappNumber={whatsappNumber} />
                </Grid2>
              ))}
            </Grid2>
            {pageCount > 1 && (
              <IconButton onClick={goNext} sx={{ bgcolor: nx.ink, color: nx.textOnDark, "&:hover": { bgcolor: "#1a1f2b" }, display: { xs: "none", md: "inline-flex" } }}>
                <ArrowForwardIosRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        )}

        {pageCount > 1 && (
          <Typography sx={{ textAlign: "center", color: nx.textOnCreamMuted, fontSize: "0.75rem", mt: 3, letterSpacing: "0.06em" }}>
            {s.helper_note}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

const FeaturedCard = ({ property: p, s, whatsappNumber }) => {
  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(`Hello! I'm interested in "${p.title}" (${p.location || ""}). Could you share more details?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, overflow: "hidden", boxShadow: "0 18px 40px rgba(25,21,16,0.08)", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", height: 190, backgroundImage: `url(${p.image || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: "#1b2436" }}>
        {(p.is_sold || p.is_rented) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(10,12,16,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <Chip
              label={p.is_sold ? "SOLD" : "RENTED"}
              sx={{
                bgcolor: "#0a0c10",
                color: "#f4e2b0",
                border: "2px solid #c9a24b",
                fontWeight: 800,
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                px: 1,
              }}
            />
          </Box>
        )}
        {p.badge && (
          <Chip label={p.badge} size="small" sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(10,12,16,0.75)", color: nx.textOnDark, fontWeight: 700, fontSize: "0.68rem" }} />
        )}
        {p.price && (
          <Chip
            label={`FROM ${currencySymbol(p.currency)}${Number(p.price).toLocaleString()}`}
            size="small"
            sx={{ position: "absolute", top: 12, right: 12, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.68rem" }}
          />
        )}
        {p.has_offer && (
          <Chip
            label="Offer"
            size="small"
            sx={{ position: "absolute", bottom: 12, right: 12, background: "linear-gradient(90deg,#f0a94e,#e8935a)", color: "#2a1608", fontWeight: 800, fontSize: "0.7rem" }}
          />
        )}
      </Box>
      <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.15rem", mb: 0.3 }}>
          {p.title}
        </Typography>
        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {[p.location, p.city].filter(Boolean).join(" · ")}
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 2 }}>
          {[p.bedrooms && `${p.bedrooms} BED`, p.bathrooms && `${p.bathrooms} BATH`, p.area && `${p.area} m²`]
            .filter(Boolean)
            .map((f) => (
              <Chip key={f} label={f} size="small" sx={{ bgcolor: "rgba(25,21,16,0.05)", color: nx.textOnCream, fontSize: "0.68rem", fontWeight: 600 }} />
            ))}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          <Button
            component={Link}
            to={`/properties/${p.id}`}
            fullWidth
            variant="contained"
            sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, "&:hover": { bgcolor: "#1a1f2b" } }}
          >
            {s.details_label}
          </Button>
          <Button
            onClick={handleWhatsApp}
            fullWidth
            variant="contained"
            startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
            sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, "&:hover": { bgcolor: nx.goldLight } }}
          >
            {s.whatsapp_label}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default NxFeaturedPropertiesSection;
