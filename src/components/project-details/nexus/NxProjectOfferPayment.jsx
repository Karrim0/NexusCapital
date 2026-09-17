import { useMemo, useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, TextField, MenuItem, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const defaultPlanRows = (project) => {
  const down = project.down_payment_percent || 15;
  const years = project.installment_years || 4;
  const cash = project.cash_discount_percent || 25;
  return [
    { label: "Flexible Plan", down_percent: down, duration_label: `${years} years`, discount_percent: 2, best_for: "Lowest entry payment and long installment schedule" },
    { label: "Balanced Plan", down_percent: Math.min(down + 15, 90), duration_label: `${Math.max(years - 1, 1)} years`, discount_percent: 5, best_for: "Higher discount and shorter repayment period" },
    { label: "Accelerated Plan", down_percent: Math.min(down + 35, 90), duration_label: `${Math.max(years - 1.5, 1)} years`, discount_percent: 10, best_for: "Strong discount with faster ownership progress" },
    { label: "Cash Plan", down_percent: 100, duration_label: "Cash payment", discount_percent: cash, best_for: "Maximum discount for cash buyers" },
  ];
};

const NxProjectOfferPayment = ({ project }) => {
  const hasOffer = !!project.offer_discount_percent;
  const rows = project.payment_plan_rows?.length ? project.payment_plan_rows : defaultPlanRows(project);
  const price = Number(project.starting_price) || 0;
  const currency = currencySymbol(project.currency);

  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [customPrice, setCustomPrice] = useState(price || 50000);

  const calc = useMemo(() => {
    const plan = rows[selectedPlanIdx] || rows[0];
    if (!plan) return null;
    const downPct = Number(plan.down_percent) || 0;
    const discountPct = Number(plan.discount_percent) || 0;
    const priceAfterDiscount = customPrice * (1 - discountPct / 100);
    const downPayment = priceAfterDiscount * (downPct / 100);
    const balance = priceAfterDiscount - downPayment;
    const yearsMatch = String(plan.duration_label || "").match(/[\d.]+/);
    const years = yearsMatch ? parseFloat(yearsMatch[0]) : 0;
    const quarters = years > 0 ? Math.round(years * 4) : 0;
    const quarterlyInstallment = quarters > 0 ? balance / quarters : 0;
    return { priceAfterDiscount, downPayment, quarterlyInstallment, quarters };
  }, [rows, selectedPlanIdx, customPrice]);

  return (
    <>
      {hasOffer && (
        <Box id="offer" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Box sx={{ width: 32, height: 2, bgcolor: "#0f9d78" }} />
                  <Typography sx={{ color: "#0f9d78", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>LIMITED-TIME OFFER</Typography>
                </Stack>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.2 }}>
                  Exclusive {project.offer_discount_percent}% discount {project.offer_deadline_label || "for a limited time"}
                </Typography>
              </Box>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", maxWidth: 340 }}>
                Secure your preferred {project.name || project.title} unit today and take advantage of this limited opportunity before prices increase.
              </Typography>
            </Stack>

            <Grid2 container spacing={2}>
              {[
                { label: "Starting Price", value: price ? `${currency}${price.toLocaleString()}` : "On request", note: "Entry price for selected opportunities, subject to availability." },
                { label: "Limited-Time Discount", value: `${project.offer_discount_percent}% OFF`, note: `Available ${project.offer_deadline_label || "for a limited time only"}.` },
                { label: "After Discount", value: price ? `From ${currency}${Math.round(price * (1 - project.offer_discount_percent / 100)).toLocaleString()}` : "—", note: "Illustrative discounted starting price before final unit confirmation." },
                { label: "Delivery Date", value: project.delivery_date || "—", note: "Planned project delivery date." },
              ].map((item, i) => (
                <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.5 }}>{item.label}</Typography>
                    <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1.15rem", mb: 0.5 }}>{item.value}</Typography>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.72rem" }}>{item.note}</Typography>
                  </Box>
                </Grid2>
              ))}
            </Grid2>

            <Button href="#contact" sx={{ mt: 3, bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, borderRadius: 999, px: 3, py: 1.1, fontSize: "0.78rem", "&:hover": { bgcolor: "#1a1f2b" } }}>
              Secure the Discount
            </Button>
          </Container>
        </Box>
      )}

      <Box id="payment" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>
                  {(project.name || project.title || "").toUpperCase()} PAYMENT PLANS
                </Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
                Flexible and various payment plans available
              </Typography>
            </Box>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", maxWidth: 360 }}>
              Choose the payment structure that fits your budget: from the lowest entry payment to the maximum discount for cash buyers.
            </Typography>
          </Stack>

          <Grid2 container spacing={2.5} sx={{ mb: 3 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 3, height: "100%" }}>
                <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1rem", mb: 2 }}>Payment plan summary</Typography>
                <Grid2 container spacing={1.5}>
                  {rows.map((plan, i) => (
                    <Grid2 key={i} size={6}>
                      <Box
                        onClick={() => setSelectedPlanIdx(i)}
                        sx={{
                          cursor: "pointer",
                          bgcolor: selectedPlanIdx === i ? "rgba(201,162,75,0.14)" : "rgba(245,241,230,0.04)",
                          border: `1px solid ${selectedPlanIdx === i ? nx.gold : nx.panelBorder}`,
                          borderRadius: 2,
                          p: 1.5,
                        }}
                      >
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.68rem" }}>{plan.label}</Typography>
                        <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.9rem" }}>{plan.down_percent}% Down</Typography>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem" }}>{plan.duration_label} · {plan.discount_percent}% discount</Typography>
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 3, height: "100%" }}>
                <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1rem", mb: 0.5 }}>Payment calculator</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", mb: 2 }}>
                  Enter a price and choose a plan. Estimate only — official terms must be confirmed before purchase.
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                  <TextField
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value) || 0)}
                    size="small"
                    fullWidth
                    sx={nxInputSx}
                  />
                  <TextField select value={selectedPlanIdx} onChange={(e) => setSelectedPlanIdx(Number(e.target.value))} size="small" sx={{ ...nxInputSx, minWidth: 170 }}>
                    {rows.map((plan, i) => (
                      <MenuItem key={i} value={i}>{plan.down_percent}% · {plan.duration_label}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
                {calc && (
                  <Grid2 container spacing={1.5}>
                    <Grid2 size={6}>
                      <MetricBox label="Price after discount" value={`${currency}${Math.round(calc.priceAfterDiscount).toLocaleString()}`} />
                    </Grid2>
                    <Grid2 size={6}>
                      <MetricBox label="Down payment" value={`${currency}${Math.round(calc.downPayment).toLocaleString()}`} />
                    </Grid2>
                    <Grid2 size={6}>
                      <MetricBox label="Quarterly installment" value={calc.quarters ? `${currency}${Math.round(calc.quarterlyInstallment).toLocaleString()}` : "—"} />
                    </Grid2>
                    <Grid2 size={6}>
                      <MetricBox label="Installments count" value={calc.quarters ? `${calc.quarters} quarterly` : "Cash payment"} />
                    </Grid2>
                  </Grid2>
                )}
              </Box>
            </Grid2>
          </Grid2>

          <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["PLAN", "DOWN PAYMENT", "INSTALLMENT DURATION", "DISCOUNT", "BEST FOR"].map((h) => (
                    <TableCell key={h} sx={{ color: nx.textOnDarkMuted, fontSize: "0.68rem", borderColor: nx.panelBorder }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((plan, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.82rem", borderColor: nx.panelBorder }}>{plan.label}</TableCell>
                    <TableCell sx={{ color: nx.gold, fontSize: "0.82rem", borderColor: nx.panelBorder }}>{plan.down_percent}%</TableCell>
                    <TableCell sx={{ color: nx.textOnDarkMuted, fontSize: "0.82rem", borderColor: nx.panelBorder }}>{plan.duration_label}</TableCell>
                    <TableCell sx={{ color: "#5ce6d0", fontSize: "0.82rem", borderColor: nx.panelBorder }}>{plan.discount_percent}%</TableCell>
                    <TableCell sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", borderColor: nx.panelBorder }}>{plan.best_for}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Container>
      </Box>
    </>
  );
};

const MetricBox = ({ label, value }) => (
  <Box sx={{ bgcolor: "rgba(245,241,230,0.04)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.2 }}>
    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.6rem" }}>{label}</Typography>
    <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.85rem" }}>{value}</Typography>
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

export default NxProjectOfferPayment;
