import { useEffect, useMemo, useState } from "react";
import { Box, Container, Stack, Typography, TextField, MenuItem, InputAdornment, Chip, Button, Checkbox, FormControlLabel } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchProperties } from "../../../api/properties";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { DISTRICTS } from "../../../constants/hurghadaDistricts";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const QUICK_FILTER_MATCHERS = {
  FURNISHED: (p) => /furnished/i.test((p.features || []).join(" ")) || /furnished/i.test(p.badge || ""),
  "LONG-TERM": (p) => /long.?term/i.test(p.listing_type || "") || /long.?term/i.test((p.features || []).join(" ")),
  "SHORT-TERM": (p) => /short.?term/i.test(p.listing_type || "") || /short.?term/i.test((p.features || []).join(" ")),
  "SEA VIEW": (p) => /sea view/i.test((p.features || []).join(" ")) || /sea view/i.test(p.badge || ""),
  "POOL VIEW": (p) => /pool view/i.test((p.features || []).join(" ")) || /pool view/i.test(p.badge || ""),
  "UNDER €500": (p) => Number(p.price) > 0 && Number(p.price) < 500,
  "1 BEDROOM": (p) => Number(p.bedrooms) === 1,
  "2 BEDROOMS": (p) => Number(p.bedrooms) === 2,
};

const NxRentListingSection = ({ content, whatsappNumber }) => {
  const s = content.listing_section;
  const { t } = useTranslation();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const districtParam = new URLSearchParams(routerLocation.search).get("district") || "";
  const districtInfo = useMemo(() => DISTRICTS.find((d) => d.key === districtParam), [districtParam]);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(s.location_all_label);
  const [type, setType] = useState(s.type_all_label);
  const [budget, setBudget] = useState(s.budget_all_label);
  const [sort, setSort] = useState(s.sort_options?.[0] || "");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [compareIds, setCompareIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const extraParams = districtParam ? { district: districtParam } : {};
        const data = await fetchProperties("rent", { extraParams });
        setProperties(data);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [districtParam]);

  const locations = useMemo(() => {
    const set = new Set(properties.map((p) => p.location || p.city).filter(Boolean));
    return [s.location_all_label, ...Array.from(set)];
  }, [properties, s.location_all_label]);

  const types = useMemo(() => {
    const set = new Set(properties.map((p) => p.property_type).filter(Boolean));
    return [s.type_all_label, ...Array.from(set)];
  }, [properties, s.type_all_label]);

  const budgetRanges = {
    [s.budget_all_label]: null,
    "Up to €500/month": [0, 500],
    "€500 - €1,000/month": [500, 1000],
    "€1,000 - €2,000/month": [1000, 2000],
    "€2,000+/month": [2000, Infinity],
  };

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      const matchesSearch =
        !search ||
        [p.title, p.location, p.city, p.badge].filter(Boolean).some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
      const matchesLocation = location === s.location_all_label || p.location === location || p.city === location;
      const matchesType = type === s.type_all_label || p.property_type === type;
      const range = budgetRanges[budget];
      const matchesBudget = !range || (Number(p.price) >= range[0] && Number(p.price) < range[1]);
      const matchesQuick = activeFilter === "ALL" || (QUICK_FILTER_MATCHERS[activeFilter]?.(p) ?? true);
      return matchesSearch && matchesLocation && matchesType && matchesBudget && matchesQuick;
    });

    if (sort === "Price: low to high") list = [...list].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    else if (sort === "Price: high to low") list = [...list].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    else if (sort === "Size: large to small") list = [...list].sort((a, b) => Number(b.area || 0) - Number(a.area || 0));

    return list;
  }, [properties, search, location, type, budget, activeFilter, sort, s.location_all_label, s.type_all_label]);

  const resetFilters = () => {
    setSearch("");
    setLocation(s.location_all_label);
    setType(s.type_all_label);
    setBudget(s.budget_all_label);
    setActiveFilter("ALL");
    setSort(s.sort_options?.[0] || "");
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const resultsText = (s.results_template || "Showing {shown} of {total} matching properties")
    .replace("{shown}", filtered.length)
    .replace("{total}", properties.length);

  return (
    <Box id="buy-listings" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>
            {s.eyebrow}
          </Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.7rem", sm: "2rem", md: "2.3rem" }, lineHeight: 1.15, mb: 1.5 }}>
          {s.title}
        </Typography>
        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", maxWidth: 640, mb: 4 }}>{s.description}</Typography>

        {/* Search + filter bar */}
        <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 2, md: 2.5 }, boxShadow: "0 14px 34px rgba(25,21,16,0.06)", mb: 2.5 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              placeholder={s.search_placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
            />
            <TextField select value={location} onChange={(e) => setLocation(e.target.value)} size="small" sx={{ minWidth: { md: 170 } }}>
              {locations.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <TextField select value={type} onChange={(e) => setType(e.target.value)} size="small" sx={{ minWidth: { md: 150 } }}>
              {types.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <TextField select value={budget} onChange={(e) => setBudget(e.target.value)} size="small" sx={{ minWidth: { md: 170 } }}>
              {Object.keys(budgetRanges).map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 1.5 }}>
            <TextField select value={sort} onChange={(e) => setSort(e.target.value)} size="small" sx={{ minWidth: { sm: 200 } }}>
              {(s.sort_options || []).map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
          </Stack>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ mb: 1.5 }}>
          {(s.quick_filters || []).map((f) => (
            <Chip
              key={f}
              label={f}
              onClick={() => setActiveFilter(f)}
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                cursor: "pointer",
                bgcolor: activeFilter === f ? nx.ink : "rgba(25,21,16,0.06)",
                color: activeFilter === f ? nx.textOnDark : nx.textOnCream,
                "&:hover": { bgcolor: activeFilter === f ? nx.ink : "rgba(25,21,16,0.1)" },
              }}
            />
          ))}
          <Button
            onClick={resetFilters}
            startIcon={<RestartAltRoundedIcon fontSize="small" />}
            size="small"
            sx={{ ml: "auto", bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.7rem", borderRadius: 999, px: 2, "&:hover": { bgcolor: "#1a1f2b" } }}
          >
            {s.reset_filters_label}
          </Button>
        </Stack>

        {districtInfo && (
          <Chip
            label={`${t("dashboard.addProperty.district", "District")}: ${t(districtInfo.translationKey)}`}
            onDelete={() => {
              const params = new URLSearchParams(routerLocation.search);
              params.delete("district");
              navigate(`${routerLocation.pathname}${params.toString() ? `?${params.toString()}` : ""}`, { replace: true });
            }}
            sx={{ mb: 2, bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, "& .MuiChip-deleteIcon": { color: nx.textOnDark, opacity: 0.7 } }}
          />
        )}

        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.82rem", mb: 3 }}>
          {loading ? "Loading properties..." : resultsText}
        </Typography>

        {!loading && filtered.length === 0 && (
          <Typography sx={{ color: nx.textOnCreamMuted, textAlign: "center", py: 6 }}>{s.empty_state}</Typography>
        )}

        <Stack spacing={2.5}>
          {filtered.map((p) => (
            <ListingCard
              key={p.id}
              property={p}
              s={s}
              whatsappNumber={whatsappNumber}
              compared={compareIds.includes(p.id)}
              onToggleCompare={() => toggleCompare(p.id)}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

const ListingCard = ({ property: p, s, whatsappNumber, compared, onToggleCompare }) => {
  const chips = [
    p.listing_type,
    p.deal_type,
    p.badge,
    p.property_type,
  ].filter(Boolean);

  const specs = [
    p.bedrooms ? `${p.bedrooms} bedroom${p.bedrooms > 1 ? "s" : ""}` : null,
    p.bathrooms ? `${p.bathrooms} bathroom${p.bathrooms > 1 ? "s" : ""}` : "Bathroom details on request",
    p.area ? `${p.area} sqm` : null,
  ].filter(Boolean);

  const description =
    p.description ||
    `A ${p.property_type ? p.property_type.toLowerCase() : "property"} at ${p.title}${p.location ? `, ${p.location}` : ""}. Request live availability, the floor plan, payment terms, and reservation steps.`;

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(`Hello! I'm interested in "${p.title}" (${p.location || ""}). Could you share more details?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, overflow: "hidden", boxShadow: "0 14px 34px rgba(25,21,16,0.06)", display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
      <Box
        sx={{
          position: "relative",
          width: { xs: "100%", sm: 260 },
          height: { xs: 200, sm: "auto" },
          flexShrink: 0,
          backgroundImage: `url(${p.image || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          bgcolor: "#1b2436",
        }}
      >
        {p.property_type && (
          <Chip label={p.property_type.toUpperCase()} size="small" sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(10,12,16,0.75)", color: nx.textOnDark, fontWeight: 700, fontSize: "0.65rem" }} />
        )}
        {p.price && (
          <Chip label={`${currencySymbol(p.currency)}${Number(p.price).toLocaleString()}`} size="small" sx={{ position: "absolute", top: 12, right: 12, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.68rem" }} />
        )}
        {p.is_rented && (
          <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(10,12,16,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Chip
              label="RENTED"
              sx={{ bgcolor: nx.ink, color: nx.goldLight, border: `2px solid ${nx.gold}`, fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.08em", px: 1.5, py: 2, borderRadius: 999, boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}
            />
          </Box>
        )}
        {p.has_offer && (
          <Chip
            label="Offer"
            size="small"
            sx={{ position: "absolute", bottom: 12, right: 12, background: "linear-gradient(90deg,#f0a94e,#e8935a)", color: "#2a1608", fontWeight: 800, fontSize: "0.7rem" }}
          />
        )}
      </Box>

      <Box sx={{ p: { xs: 2.5, sm: 3 }, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.15rem", mb: 0.5 }}>
          {p.title}
        </Typography>
        {(p.location || p.city) && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
            <PlaceRoundedIcon sx={{ fontSize: 15, color: nx.textOnCreamMuted }} />
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem" }}>{[p.location, p.city].filter(Boolean).join(", ")}</Typography>
          </Stack>
        )}
        {p.price && (
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "1rem", mb: 1 }}>
            {currencySymbol(p.currency)}{Number(p.price).toLocaleString()}
          </Typography>
        )}
        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 1.5 }}>{description}</Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mb: 1.5 }}>
          {chips.map((c, i) => (
            <Chip key={i} label={c} size="small" sx={{ bgcolor: "rgba(25,21,16,0.05)", fontSize: "0.68rem", fontWeight: 600 }} />
          ))}
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 2 }}>
          {specs.map((sp, i) => (
            <Box key={i} sx={{ bgcolor: "rgba(25,21,16,0.04)", borderRadius: 1.5, px: 1.5, py: 0.6 }}>
              <Typography sx={{ fontSize: "0.75rem", color: nx.textOnCream }}>{sp}</Typography>
            </Box>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: "auto" }}>
          <Button
            component={Link}
            to={`/properties/${p.id}`}
            fullWidth
            variant="contained"
            sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.75rem", borderRadius: 999, "&:hover": { bgcolor: "#1a1f2b" } }}
          >
            {s.view_listing_label}
          </Button>
          <Button
            onClick={handleWhatsApp}
            fullWidth
            variant="contained"
            startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
            sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.75rem", borderRadius: 999, "&:hover": { bgcolor: nx.goldLight } }}
          >
            {s.whatsapp_label}
          </Button>
          {p.booking_url && !p.is_rented && (
            <Button
              component="a"
              href={p.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              variant="outlined"
              sx={{ borderColor: nx.ink, color: nx.ink, fontWeight: 700, fontSize: "0.75rem", borderRadius: 999, "&:hover": { borderColor: nx.ink, bgcolor: "rgba(10,12,16,0.05)" } }}
            >
              Book Now
            </Button>
          )}
        </Stack>
        <FormControlLabel
          control={<Checkbox size="small" checked={compared} onChange={onToggleCompare} sx={{ color: nx.textOnCreamMuted, "&.Mui-checked": { color: nx.gold } }} />}
          label={<Typography sx={{ fontSize: "0.75rem", color: nx.textOnCreamMuted }}>{s.compare_label}</Typography>}
          sx={{ mt: 0.5, ml: 0 }}
        />
      </Box>
    </Box>
  );
};

export default NxRentListingSection;
