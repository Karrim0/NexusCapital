import { useEffect, useMemo, useState } from "react";
import { Box, Container, Stack, Typography, TextField, MenuItem, InputAdornment, Chip, Button, Checkbox, FormControlLabel } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProjects } from "../../../api/projects";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { DISTRICTS } from "../../../constants/hurghadaDistricts";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");
const PAGE_SIZE = 6;

// Maps the dashboard-editable area quick-filter chip labels to the
// canonical district key stored on each project (set from the same
// District dropdown used in Add/Edit Project). This is what makes
// "click HURGHADA -> see only projects with that district" reliable,
// instead of guessing from free-text location strings.
const AREA_CHIP_TO_DISTRICT_KEY = {
  "HURGHADA": "hurghada_general",
  "AL AHYAA": "al_ahyaa",
  "SAHL HASHEESH": "sahl_hasheesh",
  "SOMA BAY": "soma_bay",
  "MAKADI": "makadi_bay",
};

const districtLabel = (t, key) => {
  const d = DISTRICTS.find((d) => d.key === key);
  return d ? t(d.translationKey) : key;
};

const QUICK_FILTER_MATCHERS = {
  BEACHFRONT: (p) => /beach/i.test((p.facilities || "") + (p.location_advantage || "") + (p.name || "")),
  "READY TO MOVE": (p) => /ready/i.test(p.status || ""),
  "UNDER €50K": (p) => Number(p.starting_price) > 0 && Number(p.starting_price) < 50000,
  "€50K-€100K": (p) => Number(p.starting_price) >= 50000 && Number(p.starting_price) < 100000,
  "€100K-€200K": (p) => Number(p.starting_price) >= 100000 && Number(p.starting_price) < 200000,
  "€200K+": (p) => Number(p.starting_price) >= 200000,
};

const NxProjectsBrowser = ({ content, whatsappNumber }) => {
  const s = content.browser_section;
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(s.sort_options?.[0] || "");
  const [activeFilter, setActiveFilter] = useState("ALL PROJECTS");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const matchesSearch =
        !search || [p.name, p.location, p.district].filter(Boolean).some((v) => String(v).toLowerCase().includes(search.toLowerCase()));

      let matchesQuick = true;
      if (activeFilter !== "ALL PROJECTS") {
        const districtKey = AREA_CHIP_TO_DISTRICT_KEY[activeFilter];
        if (districtKey) {
          matchesQuick = p.district === districtKey;
        } else if (QUICK_FILTER_MATCHERS[activeFilter]) {
          matchesQuick = QUICK_FILTER_MATCHERS[activeFilter](p);
        }
      }
      return matchesSearch && matchesQuick;
    });

    if (sort === "Price: low to high") list = [...list].sort((a, b) => Number(a.starting_price || 0) - Number(b.starting_price || 0));
    else if (sort === "Price: high to low") list = [...list].sort((a, b) => Number(b.starting_price || 0) - Number(a.starting_price || 0));
    else list = [...list].sort((a, b) => (b.is_featured === true) - (a.is_featured === true));

    return list;
  }, [projects, search, activeFilter, sort]);

  const visible = filtered.slice(0, visibleCount);

  const resetFilters = () => {
    setSearch("");
    setActiveFilter("ALL PROJECTS");
    setSort(s.sort_options?.[0] || "");
    setVisibleCount(PAGE_SIZE);
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev));
  };

  const handleCompareWhatsApp = () => {
    const chosen = projects.filter((p) => compareIds.includes(p.id));
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const message = [
      "Hello! I'd like to compare these Red Sea projects:",
      ...chosen.map((p) => `- ${p.name} (${p.location || ""}) — from ${currencySymbol(p.currency)}${p.starting_price ? Number(p.starting_price).toLocaleString() : "N/A"}`),
    ].join("\n");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  const resultsText = (s.results_template || "Showing {shown} of {total} matching projects")
    .replace("{shown}", visible.length)
    .replace("{total}", projects.length);

  return (
    <Box id="projects-browser" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.7rem", sm: "2rem", md: "2.3rem" }, lineHeight: 1.15, mb: 1.5 }}>
          {s.title}
        </Typography>
        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", maxWidth: 640, mb: 4 }}>{s.description}</Typography>

        <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 2, md: 2.5 }, boxShadow: "0 14px 34px rgba(25,21,16,0.06)", mb: 2.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              placeholder={s.search_placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
              sx={{ "& .MuiInputBase-input": { color: nx.textOnCream } }}
            />
            <TextField
              select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              size="small"
              sx={{
                minWidth: { md: 220 },
                "& .MuiSelect-select": { color: nx.textOnCream, fontWeight: 600 },
              }}
            >
              {(s.sort_options || []).map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <Button
              href="#project-finder"
              startIcon={<ForumRoundedIcon fontSize="small" />}
              sx={{ bgcolor: "#5ce6d0", color: "#00251c", fontWeight: 700, fontSize: "0.75rem", borderRadius: 999, px: 2.5, whiteSpace: "nowrap", "&:hover": { bgcolor: "#7fefda" } }}
            >
              {s.ask_advisor_label}
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ mb: 2 }}>
          {(s.quick_filters || []).map((f) => (
            <Chip
              key={f}
              label={f}
              onClick={() => {
                setActiveFilter(f);
                setVisibleCount(PAGE_SIZE);
              }}
              sx={{
                fontWeight: 700,
                fontSize: "0.68rem",
                cursor: "pointer",
                bgcolor: activeFilter === f ? nx.ink : "rgba(25,21,16,0.06)",
                color: activeFilter === f ? nx.textOnDark : nx.textOnCream,
                "&:hover": { bgcolor: activeFilter === f ? nx.ink : "rgba(25,21,16,0.1)" },
              }}
            />
          ))}
          <Button onClick={resetFilters} size="small" sx={{ ml: "auto", color: nx.textOnCreamMuted, fontWeight: 700, fontSize: "0.7rem" }}>
            Reset
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5} sx={{ mb: 3 }}>
          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.82rem" }}>
            {loading ? "Loading projects..." : resultsText}
          </Typography>
          {compareIds.length > 0 && (
            <Button
              onClick={handleCompareWhatsApp}
              startIcon={<WhatsAppIcon fontSize="small" />}
              sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, px: 2.5, "&:hover": { bgcolor: "#1a1f2b" } }}
            >
              {s.compare_button_label} ({compareIds.length})
            </Button>
          )}
        </Stack>

        {!loading && visible.length === 0 && (
          <Typography sx={{ color: nx.textOnCreamMuted, textAlign: "center", py: 6 }}>{s.empty_state}</Typography>
        )}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
          {visible.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              s={s}
              whatsappNumber={whatsappNumber}
              compared={compareIds.includes(p.id)}
              onToggleCompare={() => toggleCompare(p.id)}
            />
          ))}
        </Box>

        {visibleCount < filtered.length && (
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <Button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.78rem", borderRadius: 999, px: 4, py: 1.2, "&:hover": { bgcolor: "#1a1f2b" } }}
            >
              {s.load_more_label}
            </Button>
          </Stack>
        )}

        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.75rem", textAlign: "center", mt: 4 }}>{s.footnote}</Typography>
      </Container>
    </Box>
  );
};

const ProjectCard = ({ project: p, s, whatsappNumber, compared, onToggleCompare }) => {
  const { t } = useTranslation();
  const specChips = [
    p.starting_area && p.max_area ? `${p.starting_area}-${p.max_area} SQM` : p.starting_area ? `${p.starting_area} SQM` : null,
    p.down_payment_percent ? `FROM ${p.down_payment_percent}% DOWN` : null,
    p.delivery_date ? `${p.delivery_date} DELIVERY` : null,
  ].filter(Boolean);

  const featureChips = [
    p.location,
    p.district ? districtLabel(t, p.district) : null,
    p.maintenance_fee_percent ? `${p.maintenance_fee_percent}% MAINTENANCE` : null,
  ].filter(Boolean);

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(`Hello! I'm interested in "${p.name}" (${p.location || ""}). Could you share the current price list and payment plan?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, overflow: "hidden", boxShadow: "0 14px 34px rgba(25,21,16,0.06)", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", height: 170, backgroundImage: `url(${p.cover_image || p.main_image || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: "#1b2436" }}>
        {p.district && (
          <Chip label={districtLabel(t, p.district).toUpperCase()} size="small" sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(10,12,16,0.75)", color: nx.textOnDark, fontWeight: 700, fontSize: "0.62rem" }} />
        )}
        <Chip
          label={p.starting_price ? `${currencySymbol(p.currency)}${Number(p.starting_price).toLocaleString()}` : s.request_price_label}
          size="small"
          sx={{ position: "absolute", top: 12, right: 12, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.64rem" }}
        />
      </Box>

      <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.1rem", mb: 0.3 }}>{p.name}</Typography>
        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.74rem", mb: 1, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          {[p.location, p.district ? districtLabel(t, p.district) : null].filter(Boolean).join(" · ")}
        </Typography>
        {p.starting_price ? (
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.92rem", mb: 1 }}>
            From {currencySymbol(p.currency)}{Number(p.starting_price).toLocaleString()}
          </Typography>
        ) : (
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.92rem", mb: 1 }}>{s.request_price_label}</Typography>
        )}
        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", lineHeight: 1.6, mb: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {p.overview || `${p.name} is a residential project in ${p.location || "the Red Sea"}${p.down_payment_percent ? `, with a ${p.down_payment_percent}% down payment` : ""}${p.installment_years ? `, installments over ${p.installment_years} years` : ""}${p.delivery_date ? `, delivery in ${p.delivery_date}` : ""}.`}
        </Typography>

        {specChips.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 1 }}>
            {specChips.map((c, i) => (
              <Chip key={i} label={c} size="small" sx={{ bgcolor: "rgba(25,21,16,0.05)", color: nx.textOnCream, fontSize: "0.64rem", fontWeight: 600 }} />
            ))}
          </Stack>
        )}
        {featureChips.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 2 }}>
            {featureChips.map((c, i) => (
              <Chip key={i} label={c} size="small" variant="outlined" sx={{ fontSize: "0.64rem", fontWeight: 600, color: nx.textOnCream, borderColor: "rgba(25,21,16,0.15)" }} />
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          <Button component={Link} to={`/projects/${p.id}`} fullWidth variant="contained" sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, "&:hover": { bgcolor: "#1a1f2b" } }}>
            {s.view_details_label}
          </Button>
          <Button onClick={handleWhatsApp} fullWidth variant="contained" startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, "&:hover": { bgcolor: nx.goldLight } }}>
            {s.whatsapp_label}
          </Button>
        </Stack>
        <FormControlLabel
          control={<Checkbox size="small" checked={compared} onChange={onToggleCompare} sx={{ color: nx.textOnCreamMuted, "&.Mui-checked": { color: nx.gold } }} />}
          label={<Typography sx={{ fontSize: "0.72rem", color: nx.textOnCreamMuted }}>{s.compare_label}</Typography>}
          sx={{ mt: 0.5, ml: 0 }}
        />
      </Box>
    </Box>
  );
};

export default NxProjectsBrowser;
