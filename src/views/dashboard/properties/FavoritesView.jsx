import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Grid2,
  Stack,
  TextField,
  IconButton,
  alpha,
  Chip,
  InputAdornment,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../../context/CustomizerContext";
import { fetchFavorites } from "../../../api/properties";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
} from "../../../components/common/motionVariants";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const FavoritesView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFavorites();
        setFavorites(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            type: p.property_type,
            dealType: p.deal_type,
            price: p.price,
            location: p.location,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            area: p.area ? `${p.area} m²` : "",
            image: p.main_image_url,
            addedDate: new Date(p.created_at).toISOString().slice(0, 10),
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [t]);

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: "background.default",
        direction: settings.direction,
      }}
    >
      <Container maxWidth="xl">
        <MotionStack spacing={4}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: {
                xs: "column",
                md: isRTL ? "row-reverse" : "row",
              },
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: isRTL ? "right" : "left" }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  mb: 0.5,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("dashboard.menu.favorites") || "Favorites"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.favorites.subtitle") || "Your saved properties"}
              </Typography>
            </Box>
            <TextField
              placeholder={t("dashboard.favorites.searchPlaceholder")}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: 20, color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", md: 300 },
              }}
            />
          </Box>

          {/* Favorites Grid */}
          {loading ? (
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                bgcolor: "background.paper",
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 2px 8px rgba(0,0,0,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.05)",
                textAlign: "center",
                py: 8,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {t("dashboard.favorites.loading", "Loading your favorites...")}
              </Typography>
            </MotionCard>
          ) : favorites.length === 0 ? (
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                bgcolor: "background.paper",
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 2px 8px rgba(0,0,0,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.05)",
                textAlign: "center",
                py: 8,
              }}
            >
              <FavoriteIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  opacity: 0.3,
                  mb: 2,
                }}
              />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {t("dashboard.favorites.noFavorites")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.favorites.noFavoritesMessage")}
              </Typography>
            </MotionCard>
          ) : (
            <MotionBox
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <Grid2 container spacing={3}>
                {favorites.map((property, index) => (
                  <Grid2 key={property.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <MotionCard
                      variants={staggerItem}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      sx={{
                        height: "100%",
                        bgcolor: "background.paper",
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0 2px 8px rgba(0,0,0,0.2)"
                            : "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: (theme) =>
                            `0 8px 24px ${alpha(
                              theme.palette.primary.main,
                              0.2
                            )}`,
                        },
                      }}
                    >
                      {/* Image Placeholder */}
                      <Box
                        sx={{
                          height: 200,
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <HomeWorkIcon
                          sx={{
                            fontSize: 64,
                            color: "primary.main",
                            opacity: 0.3,
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 8,
                            [isRTL ? "left" : "right"]: 8,
                            bgcolor: "background.paper",
                            "&:hover": {
                              bgcolor: "error.main",
                              color: "white",
                            },
                          }}
                          onClick={() => handleRemoveFavorite(property.id)}
                        >
                          <FavoriteIcon sx={{ color: "error.main" }} />
                        </IconButton>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Stack spacing={2}>
                          {/* Header */}
                          <Box>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              sx={{
                                mb: 1,
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <Chip
                                label={property.type}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={
                                  property.dealType === "For Sale"
                                    ? t("properties.forSale")
                                    : t("properties.forRent")
                                }
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              />
                            </Stack>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                mb: 0.5,
                                textAlign: isRTL ? "right" : "left",
                                fontSize: "1.1rem",
                              }}
                            >
                              {property.title}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <LocationOnIcon
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {property.location}
                              </Typography>
                            </Stack>
                          </Box>

                          <Box
                            sx={{
                              p: 2,
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.05),
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{
                                mb: 1.5,
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <AttachMoneyIcon
                                sx={{ fontSize: 20, color: "primary.main" }}
                              />
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                color="primary.main"
                              >
                                {property.price}
                              </Typography>
                            </Stack>
                            <Grid2 container spacing={1.5}>
                              <Grid2 size={4}>
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                  sx={{
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <BedIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {property.bedrooms}
                                  </Typography>
                                </Stack>
                              </Grid2>
                              <Grid2 size={4}>
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                  sx={{
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <BathtubIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {property.bathrooms}
                                  </Typography>
                                </Stack>
                              </Grid2>
                              <Grid2 size={4}>
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                  sx={{
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <SquareFootIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {property.area}
                                  </Typography>
                                </Stack>
                              </Grid2>
                            </Grid2>
                          </Box>

                          {/* Actions */}
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                            }}
                          >
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<VisibilityIcon />}
                              sx={{
                                textTransform: "none",
                                flex: 1,
                              }}
                            >
                              {t("dashboard.favorites.viewDetails")}
                            </Button>
                            <IconButton
                              sx={{
                                bgcolor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.2),
                                },
                              }}
                            >
                              <ShareIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleRemoveFavorite(property.id)}
                              sx={{
                                bgcolor: (theme) =>
                                  alpha(theme.palette.error.main, 0.1),
                                "&:hover": {
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.error.main, 0.2),
                                },
                              }}
                            >
                              <DeleteIcon sx={{ color: "error.main" }} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </MotionCard>
                  </Grid2>
                ))}
              </Grid2>
            </MotionBox>
          )}
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default FavoritesView;
