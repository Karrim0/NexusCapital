import { useMemo, useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const parseNumber = (str) => {
  const match = String(str).match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
};

const parsePercent = (str) => {
  const match = String(str).match(/\d+/);
  return match ? parseFloat(match[0]) : 0;
};

const parseYears = (str) => {
  const match = String(str).match(/\d+/);
  return match ? parseFloat(match[0]) : 1;
};

const NxBuyJourney = ({ content }) => {
  const { t } = useTranslation();
  const s = content.journey_section;
  const [priceOpt, setPriceOpt] = useState(s.price_options?.[0] || "");
  const [downOpt, setDownOpt] = useState(s.down_payment_options?.[0] || "");
  const [durationOpt, setDurationOpt] = useState(s.duration_options?.[0] || "");

  const calc = useMemo(() => {
    const price = parseNumber(priceOpt);
    const downPct = parsePercent(downOpt);
    const years = parseYears(durationOpt);
    const downPayment = price * (downPct / 100);
    const balance = price - downPayment;
    const months = Math.max(1, Math.round(years * 12));
    const monthly = balance / months;
    return { downPayment, balance, monthly };
  }, [priceOpt, downOpt, durationOpt]);

  return (
    <Box id="journey" sx={{ bgcolor: nx.ink, backgroundImage: `radial-gradient(circle at 85% 10%, rgba(201,162,75,0.1), transparent 45%)`, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ maxWidth: 560 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
              {s.title_prefix} <Box component="span" sx={{ color: nx.gold }}>{s.title_highlight}</Box>
            </Typography>
          </Box>
          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", maxWidth: 340 }}>{s.description}</Typography>
        </Stack>

        <Grid2 container spacing={2.5} sx={{ mb: 3 }}>
          {(s.steps || []).map((step, i) => (
            <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 2.5, height: "100%" }}>
                <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "rgba(201,162,75,0.15)", color: nx.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", mb: 1.5 }}>
                  {i + 1}
                </Box>
                <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.95rem", mb: 0.8 }}>{step.title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", lineHeight: 1.65 }}>{step.description}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>

        <Grid2 container spacing={2.5}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: { xs: 2.5, md: 3 }, height: "100%" }}>
              <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1rem", mb: 0.5 }}>{s.calculator_title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", mb: 2 }}>{s.calculator_description}</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
                <TextField select value={priceOpt} onChange={(e) => setPriceOpt(e.target.value)} size="small" fullWidth sx={nxInputSx}>
                  {(s.price_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
                <TextField select value={downOpt} onChange={(e) => setDownOpt(e.target.value)} size="small" fullWidth sx={nxInputSx}>
                  {(s.down_payment_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Stack>
              <TextField select value={durationOpt} onChange={(e) => setDurationOpt(e.target.value)} size="small" fullWidth sx={{ ...nxInputSx, mb: 2 }}>
                {(s.duration_options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>

              <Grid2 container spacing={1.5}>
                <Grid2 size={4}>
                  <MetricBox label={t("nxCommon.calculator.downPayment")} value={`€${Math.round(calc.downPayment).toLocaleString()}`} />
                </Grid2>
                <Grid2 size={4}>
                  <MetricBox label={t("nxCommon.calculator.installmentBalance")} value={`€${Math.round(calc.balance).toLocaleString()}`} />
                </Grid2>
                <Grid2 size={4}>
                  <MetricBox label={t("nxCommon.calculator.estimatedMonthlyInstallment")} value={`€${Math.round(calc.monthly).toLocaleString()}`} />
                </Grid2>
              </Grid2>

              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem", mt: 2 }}>{s.calculator_disclaimer}</Typography>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: { xs: 2.5, md: 3 }, height: "100%" }}>
              <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1rem", mb: 2 }}>{s.checklist_title}</Typography>
              <Stack spacing={1.5}>
                {(s.checklist_items || []).map((item, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ borderTop: i > 0 ? `1px solid ${nx.panelBorder}` : "none", pt: i > 0 ? 1.3 : 0 }}>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem" }}>{item.label}</Typography>
                    <Chip label={item.tag} size="small" sx={{ bgcolor: "rgba(201,162,75,0.15)", color: nx.gold, fontWeight: 700, fontSize: "0.66rem" }} />
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

const MetricBox = ({ label, value }) => (
  <Box sx={{ bgcolor: "rgba(245,241,230,0.04)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.2 }}>
    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.6rem" }}>{label}</Typography>
    <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.9rem" }}>{value}</Typography>
  </Box>
);

const nxInputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(245,241,230,0.04)",
    color: nx.textOnDark,
    borderRadius: 1.5,
    "& fieldset": { borderColor: "rgba(245,241,230,0.18)" },
    "&:hover fieldset": { borderColor: "rgba(201,162,75,0.5)" },
    "&.Mui-focused fieldset": { borderColor: nx.gold },
  },
  "& .MuiSelect-icon": { color: nx.textOnDarkMuted },
};

export default NxBuyJourney;
