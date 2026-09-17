import { Box, Container, Grid2, Stack, Typography, Chip } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { useTranslation } from "react-i18next";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const buildTiers = (baseDown, maxYears) => {
  // Only build real installment tiers when the admin has actually entered
  // both a down payment and a schedule length — never invent numbers.
  if (!baseDown || baseDown <= 0 || !maxYears || maxYears < 2) {
    return [];
  }
  const tiers = [];
  for (let y = 2; y <= maxYears; y++) {
    tiers.push({ years: y, downPercent: Math.min(baseDown + (y - 2) * 10, 90) });
  }
  return tiers;
};

const NxPropertyPayment = ({ property }) => {
  const { t } = useTranslation();
  const ORDINAL = t("nxPropertyPayment.ordinals", { returnObjects: true });
  const tiers = buildTiers(property.down_payment_percent, property.installment_years_max);
  const cashDiscount = property.cash_discount_percent;
  const price = property.price;
  const currency = currencySymbol(property.currency);

  // No real payment data has been entered for this unit at all — don't show
  // a fabricated payment plan section.
  if (tiers.length === 0 && !cashDiscount) {
    return null;
  }

  return (
    <Box id="payment" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyPayment.paymentPlan")}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" } }}>
              {t("nxPropertyPayment.chooseTheRoute")}
            </Typography>
          </Box>
          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", maxWidth: 360 }}>
            {tiers.length > 0 ? (
              <>
                {t("nxPropertyPayment.routesAvailable", {
                  count: tiers.length,
                  plural: tiers.length > 1 ? t("nxPropertyPayment.routesAreS") : t("nxPropertyPayment.routeIsS"),
                  cashSuffix: cashDiscount ? t("nxPropertyPayment.cashDiscountSuffix", { percent: cashDiscount }) : "",
                })}
                {price ? t("nxPropertyPayment.priceDisplaySuffix", { currency, price: Number(price).toLocaleString() }) : ""}
              </>
            ) : (
              t("nxPropertyPayment.statedCashDiscount")
            )}
          </Typography>
        </Stack>

        <Grid2 container spacing={2.5}>
          {cashDiscount ? (
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  p: 3,
                  background: "linear-gradient(160deg, rgba(201,162,75,0.18) 0%, rgba(20,25,38,0.6) 100%)",
                  border: `1px solid ${nx.panelBorder}`,
                }}
              >
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem", letterSpacing: "0.08em", mb: 1 }}>{t("nxPropertyPayment.cashPurchase")}</Typography>
                <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 700, fontSize: "3rem", lineHeight: 1 }}>
                  {cashDiscount}%
                </Typography>
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.9rem", mt: 1 }}>{t("nxPropertyPayment.statedCashDiscount")}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", mt: 1, lineHeight: 1.6 }}>
                  {t("nxPropertyPayment.requestCashQuotation")}
                </Typography>
              </Box>
            </Grid2>
          ) : null}

          <Grid2 size={{ xs: 12, md: cashDiscount ? 8 : 12 }}>
            <Stack spacing={2}>
              {tiers.map((tier) => (
                <Stack
                  key={tier.years}
                  direction="row"
                  spacing={2.5}
                  alignItems="center"
                  sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 2.5 }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      bgcolor: "rgba(201,162,75,0.15)",
                      color: nx.gold,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                    }}
                  >
                    {tier.downPercent}%
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.98rem" }}>
                      {t("nxPropertyPayment.yearPlan", { ordinal: ORDINAL[tier.years - 2] || tier.years })}
                    </Typography>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem" }}>
                      {t("nxPropertyPayment.downPaymentSchedule", { percent: tier.downPercent, years: tier.years })}
                    </Typography>
                  </Box>
                  <Chip label={t("nxPropertyPayment.years", { count: tier.years })} size="small" sx={{ bgcolor: "rgba(245,241,230,0.06)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}` }} />
                </Stack>
              ))}
            </Stack>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={1.5} sx={{ mt: 2.5 }}>
          {[
            { label: t("nxPropertyPayment.propertyPrice"), value: price ? `${currency}${Number(price).toLocaleString()}` : t("nxPropertyPayment.onRequest") },
            { label: t("nxPropertyPayment.minimumDown"), value: tiers[0] ? `${tiers[0].downPercent}%` : t("nxPropertyPayment.onRequest") },
            { label: t("nxPropertyPayment.longestSchedule"), value: tiers.length ? t("nxPropertyPayment.years", { count: tiers[tiers.length - 1].years }) : t("nxPropertyPayment.onRequest") },
            { label: t("nxPropertyPayment.deliveryDate"), value: property.delivery_date || "—" },
          ].map((item, i) => (
            <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
              <Box sx={{ bgcolor: "rgba(245,241,230,0.04)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5 }}>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</Typography>
                <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.85rem" }}>{item.value}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>

        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", mt: 2.5, lineHeight: 1.6 }}>
          {t("nxPropertyPayment.indicativeRoutesDisclaimer")}
        </Typography>
      </Container>
    </Box>
  );
};

export default NxPropertyPayment;
