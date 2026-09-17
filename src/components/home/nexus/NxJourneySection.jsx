import { useMemo, useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const priceOptions = [25000, 50000, 75000, 100000, 150000, 250000];
const downOptions = [10, 15, 20, 25, 30];
const yearOptions = [3, 4, 5, 6, 7];

const NxJourneySection = ({ content }) => {
  const { t } = useTranslation();
  const s = content.journey_section;
  const snap = s.payment_snapshot;
  const guide = s.access_guide;

  const [price, setPrice] = useState(snap.default_price || 50000);
  const [downPercent, setDownPercent] = useState(snap.default_down_percent || 15);
  const [years, setYears] = useState(snap.default_years || 5);

  const { downPayment, installmentBalance, monthlyEstimate } = useMemo(() => {
    const down = (Number(price) * Number(downPercent)) / 100;
    const balance = Number(price) - down;
    const monthly = years > 0 ? balance / (years * 12) : balance;
    return { downPayment: down, installmentBalance: balance, monthlyEstimate: monthly };
  }, [price, downPercent, years]);

  const fmt = (n) => `€${Math.round(n).toLocaleString()}`;

  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.7rem" }, lineHeight: 1.15 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.98rem", lineHeight: 1.75 }}>
              {s.description}
            </Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5} sx={{ mb: 4 }}>
          {(s.steps || []).map((step) => (
            <Grid2 key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 3, height: "100%" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "rgba(201,162,75,0.12)",
                    color: nx.gold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    mb: 2,
                    border: `1px solid ${nx.panelBorder}`,
                  }}
                >
                  {step.number}
                </Box>
                <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1rem", mb: 1 }}>{step.title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>{step.description}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>

        <Grid2 container spacing={2.5}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1.1rem", mb: 0.5 }}>{snap.title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", mb: 3 }}>{snap.description}</Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <TextField select label={t("nxCommon.calculator.estimatedPrice")} value={price} onChange={(e) => setPrice(Number(e.target.value))} fullWidth size="small" sx={nxInputSx}>
                  {priceOptions.map((p) => (
                    <MenuItem key={p} value={p}>€{p.toLocaleString()}</MenuItem>
                  ))}
                </TextField>
                <TextField select label={t("nxCommon.calculator.downPayment")} value={downPercent} onChange={(e) => setDownPercent(Number(e.target.value))} fullWidth size="small" sx={nxInputSx}>
                  {downOptions.map((p) => (
                    <MenuItem key={p} value={p}>{t("nxCommon.calculator.downPaymentPercent", { percent: p })}</MenuItem>
                  ))}
                </TextField>
              </Stack>
              <TextField select label={t("nxCommon.calculator.installments")} value={years} onChange={(e) => setYears(Number(e.target.value))} fullWidth size="small" sx={{ ...nxInputSx, mb: 3 }}>
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>{t("nxCommon.calculator.installmentsOverYears", { years: y })}</MenuItem>
                ))}
              </TextField>

              <Grid2 container spacing={1.5}>
                <Grid2 size={4}>
                  <MetricBox label={t("nxCommon.calculator.downPayment")} value={fmt(downPayment)} />
                </Grid2>
                <Grid2 size={4}>
                  <MetricBox label={t("nxCommon.calculator.installmentBalance")} value={fmt(installmentBalance)} />
                </Grid2>
                <Grid2 size={4}>
                  <MetricBox label={t("nxCommon.calculator.monthlyEstimate")} value={fmt(monthlyEstimate)} highlight />
                </Grid2>
              </Grid2>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1.1rem", mb: 0.5 }}>{guide.title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", mb: 3 }}>{guide.description}</Typography>
              <Stack spacing={1.5}>
                {(guide.items || []).map((item, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.2, borderBottom: i < guide.items.length - 1 ? `1px solid ${nx.panelBorder}` : "none" }}>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem" }}>{item.label}</Typography>
                    <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.85rem" }}>{item.value}</Typography>
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

const MetricBox = ({ label, value, highlight }) => (
  <Box sx={{ bgcolor: highlight ? "rgba(201,162,75,0.1)" : "rgba(245,241,230,0.04)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5, textAlign: "center" }}>
    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem", mb: 0.4 }}>{label}</Typography>
    <Typography sx={{ color: highlight ? nx.gold : nx.textOnDark, fontWeight: 700, fontSize: "0.95rem" }}>{value}</Typography>
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
  "& .MuiInputLabel-root": { color: nx.textOnDarkMuted },
  "& .MuiSelect-icon": { color: nx.textOnDarkMuted },
};

export default NxJourneySection;
