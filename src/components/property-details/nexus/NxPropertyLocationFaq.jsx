import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, Collapse } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { useTranslation } from "react-i18next";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const buildFaqs = (property, t) => {
  const price = property.price ? `${currencySymbol(property.currency)}${Number(property.price).toLocaleString()}` : null;
  return [
    {
      q: t("nxPropertyLocationFaq.faqs.price.q"),
      a: price
        ? t("nxPropertyLocationFaq.faqs.price.aWithPrice", { price })
        : t("nxPropertyLocationFaq.faqs.price.aNoPrice"),
    },
    {
      q: t("nxPropertyLocationFaq.faqs.sizeTypeFloor.q"),
      a: t("nxPropertyLocationFaq.faqs.sizeTypeFloor.a", {
        area: property.area ? `${property.area} sqm ` : "",
        type: property.property_type || t("nxPropertyLocationFaq.propertyFallback"),
        floor: property.floor ? t("nxPropertyLocationFaq.onFloor", { floor: property.floor.toLowerCase() }) : "",
        view: property.view_category ? t("nxPropertyLocationFaq.withViewCategory", { view: property.view_category.toLowerCase() }) : "",
      }),
    },
    {
      q: t("nxPropertyLocationFaq.faqs.paymentPlans.q"),
      a: property.down_payment_percent
        ? t("nxPropertyLocationFaq.faqs.paymentPlans.aWithDown", { percent: property.down_payment_percent })
        : t("nxPropertyLocationFaq.faqs.paymentPlans.aNoDown"),
    },
    {
      q: t("nxPropertyLocationFaq.faqs.cashDiscount.q"),
      a: property.cash_discount_percent
        ? t("nxPropertyLocationFaq.faqs.cashDiscount.aWithDiscount", { percent: property.cash_discount_percent })
        : t("nxPropertyLocationFaq.faqs.cashDiscount.aNoDiscount"),
    },
    {
      q: t("nxPropertyLocationFaq.faqs.facilities.q"),
      a: t("nxPropertyLocationFaq.faqs.facilities.a"),
    },
    {
      q: t("nxPropertyLocationFaq.faqs.location.q"),
      a: property.location
        ? t("nxPropertyLocationFaq.faqs.location.aWithLocation", { location: property.location, project: property.project_name ? t("nxPropertyLocationFaq.partOf", { project: property.project_name }) : "" })
        : t("nxPropertyLocationFaq.faqs.location.aNoLocation"),
    },
    {
      q: t("nxPropertyLocationFaq.faqs.delivery.q"),
      a: property.delivery_date
        ? t("nxPropertyLocationFaq.faqs.delivery.aWithDate", { date: property.delivery_date })
        : t("nxPropertyLocationFaq.faqs.delivery.aNoDate"),
    },
    {
      q: t("nxPropertyLocationFaq.faqs.contractType.q"),
      a: property.contract_type
        ? t("nxPropertyLocationFaq.faqs.contractType.aWithType", { type: property.contract_type })
        : t("nxPropertyLocationFaq.faqs.contractType.aNoType"),
    },
  ];
};

const NxPropertyLocationFaq = ({ property }) => {
  const { t } = useTranslation();
  const faqs = buildFaqs(property, t);
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      {property.map_embed_url && (
        <Box id="location" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyLocationFaq.location")}</Typography>
            </Stack>
            <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 3 }}>
              <Grid2 size={{ xs: 12, md: 7 }}>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.2 }}>
                  {property.location || t("nxPropertyLocationFaq.primeRedSeaLocation")}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem" }}>
                  {property.project_name ? t("nxPropertyLocationFaq.positionedInEstablishedArea", { name: property.project_name }) : t("nxPropertyLocationFaq.thisPropertyPositioned")}
                </Typography>
              </Grid2>
            </Grid2>

            <Grid2 container spacing={2.5}>
              <Grid2 size={{ xs: 12, md: 7 }}>
                <Box sx={{ borderRadius: 3, overflow: "hidden", height: 340 }}>
                  <Box component="iframe" src={property.map_embed_url} title={t("nxPropertyLocationFaq.propertyLocationTitle")} loading="lazy" sx={{ width: "100%", height: "100%", border: 0 }} />
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%" }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box sx={{ width: 24, height: 2, bgcolor: nx.gold }} />
                    <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>{t("nxPropertyLocationFaq.projectAddress")}</Typography>
                  </Stack>
                  <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.2rem", mb: 2 }}>
                    {property.location || t("nxPropertyLocationFaq.hurghadaEgypt")}
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 2.5 }}>
                    {[
                      property.project_name ? t("nxPropertyLocationFaq.partOfProject", { project: property.project_name }) : t("nxPropertyLocationFaq.establishedCoastalSetting"),
                      t("nxPropertyLocationFaq.accessFromRoadNetwork"),
                      t("nxPropertyLocationFaq.resortFacilitiesNearby"),
                    ].map((line, i) => (
                      <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                        <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 18, mt: 0.2 }} />
                        <Typography sx={{ color: nx.textOnCream, fontSize: "0.85rem" }}>{line}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    href={property.map_embed_url}
                    target="_blank"
                    rel="noopener"
                    endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.78rem", "&:hover": { bgcolor: "#1a1f2b" } }}
                  >
                    {t("nxPropertyLocationFaq.viewAreaOnGoogleMaps")}
                  </Button>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.7rem", mt: 1.5 }}>
                    {t("nxPropertyLocationFaq.mapDisclaimer")}
                  </Typography>
                </Box>
              </Grid2>
            </Grid2>
          </Container>
        </Box>
      )}

      <Box id="faq" sx={{ bgcolor: nx.creamPaper, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 4, md: 6 }}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyLocationFaq.propertyFaq")}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2, mb: 2 }}>
                {t("nxPropertyLocationFaq.clearAnswers")}
              </Typography>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>
                {t("nxPropertyLocationFaq.propertySpecificDetails")}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Stack spacing={1.5}>
                {faqs.map((item, i) => {
                  const open = openIndex === i;
                  return (
                    <Box key={i} onClick={() => setOpenIndex(open ? -1 : i)} sx={{ bgcolor: nx.cream, borderRadius: 3, p: 2.5, cursor: "pointer" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.92rem" }}>{item.q}</Typography>
                        <ExpandMoreRoundedIcon sx={{ color: nx.gold, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </Stack>
                      <Collapse in={open}>
                        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mt: 1.5 }}>{item.a}</Typography>
                      </Collapse>
                    </Box>
                  );
                })}
              </Stack>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxPropertyLocationFaq;
