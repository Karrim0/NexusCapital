import { Box, Container, Grid2, Stack, Typography, List, ListItem } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { useTranslation } from "react-i18next";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

/**
 * Renders property.description as a clean bulleted list when the admin
 * entered it as multiple lines (one feature per line), or as a plain
 * paragraph when it's a single block of text — so older single-paragraph
 * descriptions keep working exactly as before.
 */
const DescriptionBlock = ({ text, fallback }) => {
  const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  if (lines.length === 0) {
    return (
      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", lineHeight: 1.75 }}>
        {fallback}
      </Typography>
    );
  }

  if (lines.length === 1) {
    return (
      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", lineHeight: 1.75 }}>
        {lines[0]}
      </Typography>
    );
  }

  return (
    <List dense disablePadding>
      {lines.map((line, i) => (
        <ListItem key={i} disableGutters sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.5 }}>
          <FiberManualRecordIcon sx={{ fontSize: 7, color: nx.gold, mt: "8px", flexShrink: 0 }} />
          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.92rem", lineHeight: 1.7 }}>{line}</Typography>
        </ListItem>
      ))}
    </List>
  );
};

const buildHighlights = (property, t) => {
  const highlights = [];

  if (property.area) {
    highlights.push({
      title: Number(property.area) <= 60 ? t("nxPropertyAbout.compactArea", { area: property.area }) : t("nxPropertyAbout.spaciousArea", { area: property.area }),
      description: Number(property.area) <= 60
        ? t("nxPropertyAbout.compactDescription")
        : t("nxPropertyAbout.spaciousDescription"),
    });
  }

  if (property.floor || property.view_category) {
    highlights.push({
      title: [property.floor, property.view_category].filter(Boolean).join(" · ") || t("nxPropertyAbout.confirmedPosition"),
      description: t("nxPropertyAbout.confirmedResidenceDescription", {
        floor: (property.floor || "").toLowerCase() || t("nxPropertyAbout.floor"),
        viewSuffix: property.view_category ? t("nxPropertyAbout.viewCategorySuffix", { view: property.view_category.toLowerCase() }) : "",
      }),
    });
  }

  if (property.cash_discount_percent) {
    highlights.push({
      title: t("nxPropertyAbout.cashDiscountTitle", { percent: property.cash_discount_percent }),
      description: t("nxPropertyAbout.cashDiscountDescription"),
    });
  } else if (property.down_payment_percent) {
    highlights.push({
      title: t("nxPropertyAbout.downPaymentTitle", { percent: property.down_payment_percent }),
      description: t("nxPropertyAbout.downPaymentDescription"),
    });
  } else {
    highlights.push({
      title: t("nxPropertyAbout.flexiblePaymentTitle"),
      description: t("nxPropertyAbout.flexiblePaymentDescription"),
    });
  }

  return highlights.slice(0, 3);
};

const NxPropertyAbout = ({ property }) => {
  const { t } = useTranslation();
  const highlights = buildHighlights(property, t);

  const details = [
    { label: t("nxPropertyAbout.propertyType"), value: property.property_type || "—" },
    { label: t("nxPropertyAbout.area"), value: property.area ? `${property.area} sqm` : "—" },
    { label: t("nxPropertyAbout.bedrooms"), value: property.bedrooms ?? property.property_type ?? "—" },
    { label: t("nxPropertyAbout.viewCategory"), value: property.view_category || "—" },
    { label: t("nxPropertyAbout.floorLabel"), value: property.floor || "—" },
    { label: t("nxPropertyAbout.propertyPrice"), value: property.price ? `${currencySymbol(property.currency)}${Number(property.price).toLocaleString()}` : t("nxPropertyAbout.onRequest") },
    { label: t("nxPropertyAbout.contract"), value: property.contract_type || "—" },
    { label: t("nxPropertyAbout.deliveryDate"), value: property.delivery_date || "—" },
  ];

  return (
    <>
      <Box id="property" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyAbout.aboutThisProperty")}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.3rem" }, lineHeight: 1.15 }}>
                {t("nxPropertyAbout.propertyOverview")}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <DescriptionBlock
                text={property.description}
                fallback={t("nxPropertyAbout.keyFactsTemplate", { type: property.property_type ? property.property_type.toLowerCase() : t("nxPropertyAbout.property") })}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 3, md: 4 }, boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.2rem", mb: 1 }}>
                  {property.title}
                </Typography>
                {property.location && (
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", mb: 2 }}>{property.location}</Typography>
                )}
                <Grid2 container spacing={1.5}>
                  {details.map((d) => (
                    <Grid2 key={d.label} size={6}>
                      <Box sx={{ bgcolor: "rgba(25,21,16,0.04)", borderRadius: 2, p: 1.5 }}>
                        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.label}</Typography>
                        <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.85rem" }}>{d.value}</Typography>
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>

                <Box sx={{ mt: 2.5, bgcolor: "rgba(92,230,208,0.1)", border: "1px solid rgba(92,230,208,0.3)", borderRadius: 2, p: 1.5 }}>
                  <Typography sx={{ color: nx.textOnCream, fontSize: "0.75rem", lineHeight: 1.6 }}>
                    {t("nxPropertyAbout.pricingDisclaimer")}
                  </Typography>
                </Box>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  height: "100%",
                  minHeight: 320,
                  backgroundImage: property.images?.[1] || property.image ? `linear-gradient(180deg, rgba(6,8,12,0.1) 0%, rgba(6,8,12,0.85) 100%), url(${property.images?.[1] || property.image})` : "linear-gradient(160deg, #1b2436 0%, #0c1017 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  {property.project_name && (
                    <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.08em", mb: 0.5 }}>
                      {property.project_name.toUpperCase()}
                    </Typography>
                  )}
                  <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: "1.2rem" }}>
                    {t("nxPropertyAbout.redSeaCoastalSetting")}
                  </Typography>
                </Box>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* Why this residence */}
      <Box id="highlights" sx={{ bgcolor: nx.creamPaper, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyAbout.whyThisResidence")}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.6rem", md: "2rem" } }}>
                {t("nxPropertyAbout.reasonsToShortlist")}
              </Typography>
            </Box>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", maxWidth: 340 }}>
              {t("nxPropertyAbout.propertySpecificAdvantages")}
            </Typography>
          </Stack>

          <Grid2 container spacing={2.5}>
            {highlights.map((h, i) => (
              <Grid2 key={i} size={{ xs: 12, sm: 4 }}>
                <Box sx={{ bgcolor: nx.cream, borderRadius: 3, p: 3, height: "100%" }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: nx.ink, color: nx.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", mb: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1rem", mb: 1 }}>{h.title}</Typography>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7 }}>{h.description}</Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxPropertyAbout;
