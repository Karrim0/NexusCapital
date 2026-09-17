import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Chip,
  Grid2,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PropertyCard from "../components/cards/PropertyCard";
import { fetchProperties } from "../api/properties";
import FilterBar from "../components/home/FilterBar";
import { MotionBox, MotionStack } from "../components/common/MotionComponents";
import {
  fadeInUp,
  smoothTransition,
} from "../components/common/motionVariants";
import SEOHead from "../components/seo/SEOHead";
import { generateItemListSchema } from "../utils/seoHelpersAdvanced";
import { nx, fontHeading } from "../theme/nexusHomeTheme";

const AllPropertiesView = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get filter values from URL params
  const propertyType = searchParams.get("propertyType") || "all";
  const dealType = searchParams.get("dealType") || "all";
  const district = searchParams.get("district") || "";
  const bedrooms = searchParams.get("bedrooms") || "";
  const area = searchParams.get("area") || "";
  const priceFrom = searchParams.get("priceFrom") || "";
  const priceTo = searchParams.get("priceTo") || "";
  const currency = searchParams.get("currency") || ""; // Empty means show all currencies
  const featuresParam = searchParams.get("features") || "";
  const selectedFeatures = useMemo(
    () => (featuresParam ? featuresParam.split(",") : []),
    [featuresParam]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Fetch all properties (both for sale and for rent)
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        console.error("Failed to load properties:", err);
        setError(
          t(
            "properties.loadError",
            "Failed to load properties. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [t]);

  // Use useMemo to recalculate filtered properties when dependencies change
  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((property) => {
      // Deal type filter
      const matchesDealType =
        dealType === "all" ||
        (dealType === "sale" &&
          (property.deal_type === "For Sale" ||
            property.deal_type === "للبيع")) ||
        (dealType === "rent" &&
          (property.deal_type === "For Rent" ||
            property.deal_type === "للإيجار"));

      // Property type filter
      const matchesPropertyType =
        propertyType === "all" ||
        propertyType === "allTypes" ||
        property.property_type?.toLowerCase() === propertyType.toLowerCase();

      // District filter
      const matchesDistrict =
        !district ||
        property.district?.toLowerCase() === district.toLowerCase();

      // Bedrooms filter - exact match
      const matchesBedrooms =
        !bedrooms ||
        (property.bedrooms != null &&
          property.bedrooms.toString() === bedrooms.toString());

      // Area filter
      const matchesArea =
        !area ||
        (property.area && parseFloat(property.area) >= parseFloat(area));

      // Price filter
      const propertyPrice = parseFloat(property.price) || 0;
      const propertyCurrency = property.currency || "USD";
      const matchesPrice =
        (!priceFrom || propertyPrice >= parseFloat(priceFrom)) &&
        (!priceTo || propertyPrice <= parseFloat(priceTo)) &&
        (!currency || propertyCurrency === currency); // Only filter by currency if explicitly selected

      // Features filter
      const propertyFeatures = property.features || [];
      const matchesFeatures =
        selectedFeatures.length === 0 ||
        selectedFeatures.every((feature) => propertyFeatures.includes(feature));

      return (
        matchesDealType &&
        matchesPropertyType &&
        matchesDistrict &&
        matchesBedrooms &&
        matchesArea &&
        matchesPrice &&
        matchesFeatures
      );
    });

    return filtered;
  }, [
    properties,
    propertyType,
    dealType,
    district,
    bedrooms,
    area,
    priceFrom,
    priceTo,
    currency,
    selectedFeatures,
  ]);

  return (
    <>
      <SEOHead
        title="All Properties | Nexus Capital | Browse Luxury Homes in Hurghada & El Gouna"
        description="Browse our complete collection of luxury properties for sale and rent in Hurghada, El Gouna, Sahl Hasheesh, and Makadi Bay. Find your perfect home with Nexus Capital - apartments, villas, penthouses, and townhouses in the Red Sea region."
        keywords="properties for sale Hurghada, apartments for rent El Gouna, luxury villas Red Sea, property listings Egypt, real estate Hurghada, buy property Egypt, rent apartment Hurghada"
        url="/properties"
        structuredData={generateItemListSchema(
          filteredProperties.slice(0, 20),
          "All Properties - Nexus Capital"
        )}
      />
      <AnimatePresence mode="wait">
        <MotionBox
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeInUp}
          transition={smoothTransition}
        >
          {/* Hero Section */}
          <MotionBox
            sx={{
              position: "relative",
              bgcolor: nx.ink,
              backgroundImage: `radial-gradient(circle at 15% 15%, rgba(201,162,75,0.13), transparent 45%), linear-gradient(180deg, #0a0c10 0%, #0d1119 100%)`,
              py: { xs: 7, md: 9 },
              overflow: "hidden",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
              <MotionStack
                spacing={2}
                alignItems="center"
                textAlign="center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                  <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.14em" }}>
                    {t("properties.browseCollection", "Browse Our Collection")}
                  </Typography>
                  <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                </Stack>
                <Typography
                  sx={{
                    fontFamily: fontHeading,
                    color: nx.textOnDark,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.1rem" },
                  }}
                >
                  {t("properties.allProperties", "All Properties")}
                </Typography>
                <Typography
                  sx={{
                    color: nx.textOnDarkMuted,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    maxWidth: 560,
                  }}
                >
                  {t("properties.discoverCollection", "Discover our complete collection of properties available for sale and rent")}
                </Typography>
              </MotionStack>
            </Container>
          </MotionBox>

          {/* Filters Section */}
          <Box
            data-filters-section
            sx={{
              py: 4,
              bgcolor: nx.cream,
            }}
          >
            <Container>
              <FilterBar />
            </Container>
          </Box>

          {/* Properties Grid */}
          <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: nx.cream }}>
            <Container maxWidth="xl">
              <Stack spacing={4}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                >
                  <Box>
                    <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.5rem", md: "1.8rem" }, mb: 0.5 }}>
                      {t("properties.availableProperties")}
                    </Typography>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem" }}>
                      {loading
                        ? t("properties.loading", "Loading...")
                        : `${filteredProperties.length} ${t(
                            "properties.propertiesFound"
                          )}`}
                    </Typography>
                  </Box>
                </Stack>

                <Grid2
                  container
                  spacing={{ xs: 2, sm: 3, md: 3, lg: 4 }}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {!loading &&
                    !error &&
                    filteredProperties.map((property) => (
                      <Grid2
                        key={property.id}
                        size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
                        sx={{
                          maxWidth: { xs: "100%", sm: "none" },
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                          }}
                        >
                          <PropertyCard
                            {...property}
                            price={property.price}
                            dealLabel={property.deal_type}
                            listingType={property.listing_type}
                            isSold={property.is_sold}
                            isRented={property.is_rented}
                          />
                        </Box>
                      </Grid2>
                    ))}
                  {!loading && error && (
                    <Grid2 size={{ xs: 12 }}>
                      <Typography color="error" align="center">
                        {error}
                      </Typography>
                    </Grid2>
                  )}
                  {loading && (
                    <Grid2 size={{ xs: 12 }}>
                      <Typography align="center">
                        {t("properties.loading", "Loading properties...")}
                      </Typography>
                    </Grid2>
                  )}
                </Grid2>
              </Stack>
            </Container>
          </Box>
        </MotionBox>
      </AnimatePresence>
    </>
  );
};

export default AllPropertiesView;
