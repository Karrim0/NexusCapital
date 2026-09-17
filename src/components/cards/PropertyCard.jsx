import {
  Box,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import YardIcon from "@mui/icons-material/Yard";
import SecurityIcon from "@mui/icons-material/Security";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MotionBox, MotionCard } from "../common/MotionComponents";
import { scaleIn } from "../common/motionVariants";
import apiClient from "../../utils/apiClient";
import { useAuth } from "../../context/AuthContext";

const PropertyCard = ({
  id,
  image,
  title,
  location,
  price,
  specs,
  badge,
  dealLabel,
  listingType,
  bedrooms,
  bathrooms,
  area,
  currency,
  features,
  isSold,
  isRented,
  hasOffer,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  // Get currency symbol
  const getCurrencySymbol = (curr) => {
    if (!curr) return "$";
    const currencyMap = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      EGP: "E£",
    };
    return currencyMap[curr] || "$";
  };

  // Format price with currency
  const formatPriceWithCurrency = (priceValue, currencyCode) => {
    if (!priceValue) return "";
    const symbol = getCurrencySymbol(currencyCode || "USD");

    // Extract numeric value from price (handles both formatted strings and numbers)
    let numericValue;
    if (typeof priceValue === "string") {
      // Remove all non-numeric characters except decimal point
      const cleaned = priceValue.replace(/[^\d.]/g, "");
      numericValue = parseFloat(cleaned);
    } else {
      numericValue =
        typeof priceValue === "number" ? priceValue : parseFloat(priceValue);
    }

    // Format the number with locale string
    if (!isNaN(numericValue)) {
      try {
        return `${symbol}${numericValue.toLocaleString()}`;
      } catch {
        return `${symbol}${numericValue}`;
      }
    }

    // Fallback: return symbol + original value
    return `${symbol}${priceValue}`;
  };

  // Build specs chips either from provided specs array or from bedrooms/bathrooms/area
  const computedSpecs = (() => {
    if (Array.isArray(specs) && specs.length > 0) return specs;
    const autoSpecs = [];
    if (bedrooms != null && bedrooms !== "") {
      autoSpecs.push(
        `${bedrooms} ${t("propertyDetails.bedrooms", "Bedrooms")}`
      );
    }
    if (bathrooms != null && bathrooms !== "") {
      autoSpecs.push(
        `${bathrooms} ${t("propertyDetails.bathrooms", "Bathrooms")}`
      );
    }
    if (area != null && area !== "") {
      autoSpecs.push(`${area} m²`);
    }
    return autoSpecs;
  })();

  const getBadgeLabel = (badge) => {
    if (!badge) return "";
    const badgeMap = {
      Featured: t("properties.badges.featured"),
      "New Launch": t("properties.badges.newLaunch"),
      "Sea View": t("properties.badges.seaView"),
      مميز: t("properties.badges.featured"),
      "إطلاق جديد": t("properties.badges.newLaunch"),
      "إطلالة بحرية": t("properties.badges.seaView"),
    };
    return badgeMap[badge] || badge;
  };

  const getDealLabel = (label) => {
    if (!label) return "";
    if (label === "For Sale" || label === "للبيع") {
      return t("properties.forSale");
    }
    if (label === "For Rent" || label === "للإيجار") {
      return t("properties.forRent");
    }
    return label;
  };

  const getListingTypeLabel = (type) => {
    if (!type) return "";
    if (type === "primary") {
      return t("properties.listingTypes.primary", "Primary");
    }
    if (type === "resale") {
      return t("properties.listingTypes.resale", "Resale");
    }
    return type;
  };

  // Feature mapping with icons
  const featureIcons = {
    landscaped_garden: YardIcon,
    "24_7_security": SecurityIcon,
    cctv_system: VideocamIcon,
    fire_system: LocalFireDepartmentIcon,
    swimming_pool: PoolIcon,
    fitness_center: FitnessCenterIcon,
  };

  const featureTranslationKeys = {
    landscaped_garden: "dashboard.addProperty.featureOptions.landscapedGarden",
    "24_7_security": "dashboard.addProperty.featureOptions.24_7_security",
    cctv_system: "dashboard.addProperty.featureOptions.cctvSystem",
    fire_system: "dashboard.addProperty.featureOptions.fireSystem",
    swimming_pool: "dashboard.addProperty.featureOptions.swimmingPool",
    fitness_center: "dashboard.addProperty.featureOptions.fitnessCenter",
  };

  // Process features - handle both array of strings and array of objects
  const processedFeatures = Array.isArray(features)
    ? features
        .filter((feature) => feature) // Remove null/undefined
        .map((feature) => {
          // If feature is a string, check if it matches our keys
          if (typeof feature === "string") {
            // Try different normalization approaches
            const normalizedKey = feature
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/-/g, "_");

            // Check if we have an icon for this feature
            const iconKey = Object.keys(featureIcons).find(
              (key) => key === normalizedKey || key === feature.toLowerCase()
            );

            return {
              key: iconKey || normalizedKey,
              label: iconKey
                ? t(featureTranslationKeys[iconKey] || feature, feature)
                : feature,
              icon: iconKey ? featureIcons[iconKey] : CheckCircleRoundedIcon,
            };
          }
          // If feature is already an object, use it
          return {
            key: feature.key || feature.label || feature,
            label: feature.label || feature.key || feature,
            icon: feature.icon || CheckCircleRoundedIcon,
          };
        })
    : [];

  return (
    <MotionCard
      sx={{
        bgcolor: "background.paper",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.08)",
      }}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      variants={scaleIn}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -12, scale: 1.02 }}
    >
      <CardActionArea
        onClick={() => {
          if (id) {
            navigate(`/properties/${id}`);
          }
        }}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            height: { xs: 240, sm: 260, md: 280, lg: 300 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.7) 100%)`,
              zIndex: 1,
              transition: "opacity 0.4s ease",
            },
          }}
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            onError={(e) => {
              e.target.src =
                "https://nexuscapitalredsea.com/placeholder.php?w=1200&h=800&text=Property+Image&bg=3498db&color=ffffff";
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: imageHover ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "block",
            }}
          />

          {(isSold || isRented) && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(10,12,16,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Chip
                label={isSold ? "SOLD" : "RENTED"}
                sx={{
                  bgcolor: "#0a0c10",
                  color: "#f4e2b0",
                  border: "2px solid #c9a24b",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  px: 1.5,
                  py: 2,
                  borderRadius: 999,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                }}
              />
            </Box>
          )}

          {hasOffer && (
            <Chip
              label="Offer"
              size="small"
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                zIndex: 2,
                background: "linear-gradient(90deg,#f0a94e,#e8935a)",
                color: "#2a1608",
                fontWeight: 800,
                fontSize: "0.7rem",
              }}
            />
          )}

          {/* Badges Stack - All badges in one row */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {/* Deal Label (For Sale/For Rent) */}
            {dealLabel && (
              <Chip
                label={getDealLabel(dealLabel)}
                size="small"
                sx={{
                  bgcolor:
                    getDealLabel(dealLabel) === t("properties.forSale")
                      ? "#2ecc71"
                      : "#e74c3c",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  px: 1.5,
                  py: 0.5,
                  height: "28px",
                  boxShadow: `0 4px 12px ${alpha(
                    getDealLabel(dealLabel) === t("properties.forSale")
                      ? "#2ecc71"
                      : "#e74c3c",
                    0.5
                  )}`,
                  letterSpacing: "0.5px",
                }}
              />
            )}

            {/* Listing Type Label (Primary/Resale) - Only show if deal is "For Sale" */}
            {listingType &&
              getDealLabel(dealLabel) === t("properties.forSale") && (
                <MotionBox
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Chip
                    icon={
                      listingType === "primary" ? (
                        <NewReleasesIcon
                          sx={{ fontSize: 14, color: "white !important" }}
                        />
                      ) : (
                        <AutorenewIcon
                          sx={{ fontSize: 14, color: "white !important" }}
                        />
                      )
                    }
                    label={getListingTypeLabel(listingType)}
                    size="small"
                    sx={{
                      background:
                        listingType === "primary"
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      px: 1.5,
                      py: 0.5,
                      height: "28px",
                      border: "1.5px solid rgba(255, 255, 255, 0.3)",
                      boxShadow:
                        listingType === "primary"
                          ? `0 4px 12px ${alpha("#667eea", 0.5)}`
                          : `0 4px 12px ${alpha("#f5576c", 0.5)}`,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow:
                          listingType === "primary"
                            ? `0 6px 16px ${alpha("#667eea", 0.6)}`
                            : `0 6px 16px ${alpha("#f5576c", 0.6)}`,
                      },
                      "& .MuiChip-icon": {
                        marginRight: "4px",
                        marginLeft: 0,
                      },
                    }}
                  />
                </MotionBox>
              )}

            {/* Badge (Featured/New Launch/Sea View) */}
            {badge && (
              <Chip
                label={getBadgeLabel(badge)}
                size="small"
                sx={{
                  bgcolor: (theme) => {
                    const badgeLabel = getBadgeLabel(badge);
                    if (badgeLabel === t("properties.badges.featured")) {
                      return theme.palette.secondary.main;
                    }
                    if (badgeLabel === t("properties.badges.newLaunch")) {
                      return theme.palette.primary.main;
                    }
                    return "#FF6B6B";
                  },
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  px: 1.5,
                  py: 0.5,
                  height: "28px",
                  boxShadow: (theme) => {
                    const badgeLabel = getBadgeLabel(badge);
                    if (badgeLabel === t("properties.badges.featured")) {
                      return `0 4px 12px ${alpha(
                        theme.palette.secondary.main,
                        0.4
                      )}`;
                    }
                    if (badgeLabel === t("properties.badges.newLaunch")) {
                      return `0 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )}`;
                    }
                    return `0 4px 12px ${alpha("#FF6B6B", 0.4)}`;
                  },
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              />
            )}
          </Stack>

          {/* Favorite Button */}
          <Box
            onClick={async (e) => {
              e.stopPropagation();
              if (!id) return;

              if (!isAuthenticated) {
                alert(
                  t(
                    "auth.loginRequired",
                    "Please log in to add properties to your favorites."
                  )
                );
                return;
              }

              // Optimistic update
              setIsFavorite((prev) => !prev);
              try {
                await apiClient.post(`/properties/${id}/favorite`);
              } catch {
                // Revert on error
                setIsFavorite((prev) => !prev);
              }
            }}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(30, 30, 30, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.05)",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(40, 40, 40, 1)"
                    : "rgba(255, 255, 255, 1)",
                transform: "scale(1.1)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0, 0, 0, 0.5)"
                    : "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: "#FF6B6B", fontSize: 20 }} />
            ) : (
              <FavoriteBorderIcon
                sx={{
                  fontSize: 20,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "white" : "inherit",
                }}
              />
            )}
          </Box>

          {/* View Icon Overlay on Hover */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha("#000", 0.4),
              opacity: imageHover ? 1 : 0,
              transition: "opacity 0.3s ease",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "50%",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: imageHover ? "scale(1)" : "scale(0.8)",
                transition: "transform 0.3s ease",
              }}
            >
              <VisibilityIcon sx={{ color: "primary.main", fontSize: 28 }} />
            </Box>
          </Box>
        </Box>

        <CardContent
          sx={{
            p: 3,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
            <Stack spacing={1}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                color="#6b6558"
              >
                <PlaceRoundedIcon
                  sx={{ fontSize: 18, color: "primary.main" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {location}
                </Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.08),
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography
                variant="h5"
                color="primary"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                {formatPriceWithCurrency(price, currency)}
              </Typography>
            </Box>

            {computedSpecs.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1 }}
              >
                {computedSpecs.map((spec) => (
                  <Chip
                    key={spec}
                    label={spec}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      color: "#191510",
                      borderColor: (theme) => alpha(theme.palette.divider, 0.3),
                      bgcolor: "transparent",
                      "& .MuiChip-label": { color: "#191510" },
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                      },
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Features Section - Professional Design */}
            {processedFeatures.length > 0 && (
              <Box
                sx={{
                  mt: 2.5,
                  pt: 2.5,
                  borderTop: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#6b6558",
                    mb: 1.5,
                    display: "block",
                  }}
                >
                  {t("propertyDetails.features", "Features")}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ gap: 1 }}
                >
                  {processedFeatures.map((feature, index) => {
                    const IconComponent =
                      feature.icon || CheckCircleRoundedIcon;
                    return (
                      <Box
                        key={feature.key || `feature-${index}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          px: { xs: 1, sm: 1.25 },
                          py: { xs: 0.5, sm: 0.625 },
                          borderRadius: 1.5,
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.primary.main, 0.08)
                              : alpha(theme.palette.primary.main, 0.04),
                          border: (theme) =>
                            `1px solid ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.primary.main, 0.12)
                                : alpha(theme.palette.primary.main, 0.08),
                            borderColor: (theme) =>
                              alpha(theme.palette.primary.main, 0.3),
                            transform: "translateY(-2px)",
                            boxShadow: (theme) =>
                              `0 4px 12px ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                          },
                        }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: { xs: 14, sm: 15 },
                            color: "primary.main",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: { xs: "0.65rem", sm: "0.7rem" },
                            fontWeight: 600,
                            color: "#191510",
                            whiteSpace: "nowrap",
                            lineHeight: 1.2,
                          }}
                        >
                          {feature.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </MotionCard>
  );
};

export default PropertyCard;
