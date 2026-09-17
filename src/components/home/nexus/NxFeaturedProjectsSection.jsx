import { useEffect, useState, useRef } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, Chip, IconButton } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProjects } from "../../../api/projects";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

// Same card-grid, auto-advancing style as "Featured Properties", but for
// projects — placed on the home page as its own section.
const NxFeaturedProjectsSection = ({ whatsappNumber }) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjects();
        const all = Array.isArray(data) ? data : [];
        // Show every project (so newly added ones always appear), with
        // Featured-flagged ones surfaced first.
        const sorted = [...all].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        setProjects(sorted.slice(0, 12));
      } catch {
        setProjects([]);
      }
    })();
  }, []);

  const perPage = 3;
  const pageCount = Math.max(1, Math.ceil(projects.length / perPage));
  const visible = projects.slice(page * perPage, page * perPage + perPage);

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  // Auto-advance every 5s; pauses on hover, resumes automatically.
  useEffect(() => {
    if (pageCount <= 1 || isPaused) return undefined;
    autoplayRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [pageCount, isPaused]);

  if (!projects.length) return null;

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
                {t("nxCommon.form.featuredProjects")}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.15 }}>
              {t("nxCommon.form.featuredProjectsTitle")}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/projects"
            variant="contained"
            sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, px: 3, py: 1.2, borderRadius: 999, fontSize: "0.78rem", flexShrink: 0, "&:hover": { bgcolor: "#1a1f2b" } }}
          >
            {t("nxCommon.form.seeAllProjects")}
          </Button>
        </Stack>

        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", maxWidth: 620, mb: 4 }}>
          {t("nxCommon.form.featuredProjectsDescription")}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={2}>
          {pageCount > 1 && (
            <IconButton onClick={goPrev} sx={{ bgcolor: nx.ink, color: nx.textOnDark, "&:hover": { bgcolor: "#1a1f2b" }, display: { xs: "none", md: "inline-flex" } }}>
              <ArrowBackIosNewRoundedIcon fontSize="small" />
            </IconButton>
          )}
          <Grid2 container spacing={3} sx={{ flex: 1 }}>
            {visible.map((p) => (
              <Grid2 key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <FeaturedProjectCard project={p} whatsappNumber={whatsappNumber} />
              </Grid2>
            ))}
          </Grid2>
          {pageCount > 1 && (
            <IconButton onClick={goNext} sx={{ bgcolor: nx.ink, color: nx.textOnDark, "&:hover": { bgcolor: "#1a1f2b" }, display: { xs: "none", md: "inline-flex" } }}>
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        {pageCount > 1 && (
          <Typography sx={{ textAlign: "center", color: nx.textOnCreamMuted, fontSize: "0.75rem", mt: 3, letterSpacing: "0.06em" }}>
            {t("nxCommon.form.rotatesAutomatically")}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

const FeaturedProjectCard = ({ project: p, whatsappNumber }) => {
  const { t } = useTranslation();
  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(t("nxCommon.form.projectWhatsappMessage", { title: p.name || p.title, location: p.location || "" }));
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, overflow: "hidden", boxShadow: "0 18px 40px rgba(25,21,16,0.08)", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", height: 190, backgroundImage: `url(${p.cover_image || p.main_image || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: "#1b2436" }}>
        {p.starting_price && (
          <Chip
            label={`${t("nxCommon.form.from")} ${currencySymbol(p.currency)}${Number(p.starting_price).toLocaleString()}`}
            size="small"
            sx={{ position: "absolute", top: 12, right: 12, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.68rem" }}
          />
        )}
        {p.delivery_date && (
          <Chip label={`${t("nxCommon.form.delivery")} ${p.delivery_date}`} size="small" sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(10,12,16,0.75)", color: nx.textOnDark, fontWeight: 700, fontSize: "0.68rem" }} />
        )}
      </Box>
      <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.15rem", mb: 0.3 }}>
          {p.name || p.title}
        </Typography>
        {p.location && (
          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {p.location}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          <Button
            component={Link}
            to={`/projects/${p.id}`}
            fullWidth
            variant="contained"
            sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, "&:hover": { bgcolor: "#1a1f2b" } }}
          >
            {t("nxCommon.form.viewDetails")}
          </Button>
          <Button
            onClick={handleWhatsApp}
            fullWidth
            variant="contained"
            startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
            sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, "&:hover": { bgcolor: nx.goldLight } }}
          >
            {t("nxCommon.form.whatsapp")}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default NxFeaturedProjectsSection;
