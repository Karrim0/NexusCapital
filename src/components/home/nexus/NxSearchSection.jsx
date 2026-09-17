import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button, Chip } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { DISTRICT_GROUPS, DISTRICTS } from "../../../constants/hurghadaDistricts";

const ALL_LOCATIONS = "__all__";
const propertyTypes = ["Any property type", "Apartment", "Villa", "Duplex", "Studio", "Land"];
const budgets = ["Any budget", "Up to €50,000", "€50,000 - €100,000", "€100,000 - €250,000", "€250,000+"];

const NxSearchSection = ({ content }) => {
  const s = content.search_section;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [location, setLocation] = useState(ALL_LOCATIONS);
  const [type, setType] = useState(propertyTypes[0]);
  const [budget, setBudget] = useState(budgets[0]);

  const BUDGET_RANGES = {
    "Up to €50,000": [0, 50000],
    "€50,000 - €100,000": [50000, 100000],
    "€100,000 - €250,000": [100000, 250000],
    "€250,000+": [250000, ""],
  };

  const openListings = () => {
    const params = new URLSearchParams();
    // Send the district KEY (not the display label) so it matches
    // property.district exactly on the results page.
    if (location !== ALL_LOCATIONS) params.set("district", location);
    // Results page reads "propertyType", not "type".
    if (type !== propertyTypes[0]) params.set("propertyType", type);
    // Results page reads numeric "priceFrom"/"priceTo", not a display range string.
    if (budget !== budgets[0]) {
      const [from, to] = BUDGET_RANGES[budget] || [];
      if (from !== undefined) params.set("priceFrom", from);
      if (to !== undefined && to !== "") params.set("priceTo", to);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.7rem" }, lineHeight: 1.15 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.98rem", lineHeight: 1.75 }}>
              {s.description}
            </Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 4, p: { xs: 3, md: 4 }, height: "100%", boxShadow: "0 20px 45px rgba(25,21,16,0.06)" }}>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.4rem", mb: 0.5 }}>
                {s.card_title}
              </Typography>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.92rem", mb: 3 }}>
                {s.card_description}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                  select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiSelect-select": { color: nx.textOnCream, fontWeight: 600 },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(25,21,16,0.15)" },
                  }}
                >
                  <MenuItem value={ALL_LOCATIONS}>{t("common.allLocations", "All locations")}</MenuItem>
                  {DISTRICT_GROUPS.map((group) => [
                    <MenuItem key={`group-${group.key}`} disabled sx={{ fontWeight: 700, opacity: 0.7 }}>
                      {t(group.translationKey)}
                    </MenuItem>,
                    ...DISTRICTS.filter((d) => d.group === group.key).map((district) => (
                      <MenuItem key={district.key} value={district.key} sx={{ pl: 3 }}>
                        {t(district.translationKey)}
                      </MenuItem>
                    )),
                  ])}
                </TextField>
                <TextField
                  select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiSelect-select": { color: nx.textOnCream, fontWeight: 600 },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(25,21,16,0.15)" },
                  }}
                >
                  {propertyTypes.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
                <TextField
                  select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiSelect-select": { color: nx.textOnCream, fontWeight: 600 },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(25,21,16,0.15)" },
                  }}
                >
                  {budgets.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                </TextField>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3 }}>
                <Button
                  onClick={openListings}
                  startIcon={<SearchRoundedIcon />}
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: "#1a1f2b" } }}
                >
                  {s.open_listings_label}
                </Button>
                <Button
                  href="#shortlist"
                  startIcon={<ForumRoundedIcon />}
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, py: 1.3, borderRadius: 999, fontSize: "0.8rem", "&:hover": { bgcolor: nx.goldLight } }}
                >
                  {s.ask_matches_label}
                </Button>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {(s.quick_filters || []).map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    size="small"
                    sx={{ bgcolor: "rgba(25,21,16,0.05)", color: nx.textOnCream, fontSize: "0.72rem", fontWeight: 600 }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box sx={{ bgcolor: nx.ink, borderRadius: 4, p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontSize: "1.4rem", fontWeight: 600, mb: 0.5 }}>
                {s.clarity_panel_title}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", mb: 3 }}>
                {s.clarity_panel_description}
              </Typography>
              <Stack spacing={2}>
                {(s.clarity_steps || []).map((step, i) => (
                  <Stack key={i} direction="row" spacing={2} sx={{ bgcolor: "rgba(245,241,230,0.05)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 2 }}>
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: nx.gold,
                        color: "#171208",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Box>
                      <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.9rem", mb: 0.3 }}>
                        {step.title}
                      </Typography>
                      <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.82rem", lineHeight: 1.6 }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxSearchSection;
