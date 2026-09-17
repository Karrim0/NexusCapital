import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  alpha,
  Grid2,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import PropertyCard from "../cards/PropertyCard";
import SectionHeader from "../common/SectionHeader";
import { fetchProperties } from "../../api/properties";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProperties();
        const featured = data.filter((p) => p.is_featured);
        setProperties(featured.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured properties:", err);
        setError(
          t(
            "properties.loadError",
            "Failed to load properties. Please try again later."
          )
        );
      }
    };

    load();
  }, [t]);

  return (
    <Box
      id="properties"
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "transparent"
            : alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <Container>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <SectionHeader
            eyebrow={t("home.featuredProperties")}
            title={t("home.premiumResidences")}
            description={t("home.premiumDescription")}
            align="left"
          />

          <Grid2
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              justifyContent: "center",
            }}
          >
            {properties.map((property) => (
              <Grid2
                key={property.id}
                size={{ xs: 12, sm: 6, md: 4 }}
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
                    dealLabel={property.deal_type}
                    listingType={property.listing_type}
                    isSold={property.is_sold}
                    hasOffer={property.has_offer}
                    isRented={property.is_rented}
                  />
                </Box>
              </Grid2>
            ))}
            {error && properties.length === 0 && (
              <Grid2 size={{ xs: 12 }}>
                <Typography color="error" align="center">
                  {error}
                </Typography>
              </Grid2>
            )}
          </Grid2>

          <Paper
            elevation={0}
            sx={{
              mt: { xs: 4, md: 6 },
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.primary.main, 0.05),
              border: (theme) =>
                `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "transparent"
                  : `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.05
                    )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={3}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                >
                  {t("home.lookingForSpecific")}
                </Typography>
                <Typography
                  color="#6b6558"
                  sx={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    maxWidth: { xs: "100%", sm: 500 },
                  }}
                >
                  {t("home.lookingForDescription")}
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/properties"
                variant="contained"
                size="large"
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.25, md: 1.5 },
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: (theme) =>
                    `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {t("home.viewAllProperties")}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default FeaturedProperties;
