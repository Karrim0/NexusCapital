import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Grid2,
  Stack,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  alpha,
  Divider,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Paper,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCustomizer } from "../../../context/CustomizerContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { createProperty } from "../../../api/properties";
import { DISTRICT_GROUPS, DISTRICTS } from "../../../constants/hurghadaDistricts";

// Exchange rates (approximate - can be updated from API)
const exchangeRates = {
  USD: { EUR: 0.92, GBP: 0.79, EGP: 48.5 },
  EUR: { USD: 1.09, GBP: 0.86, EGP: 52.8 },
  GBP: { USD: 1.27, EUR: 1.16, EGP: 61.4 },
  EGP: { USD: 0.021, EUR: 0.019, GBP: 0.016 },
};

const AddPropertyView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    propertyType: "",
    dealType: "",
    listingType: "",
    currency: "USD",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    garage: "",
    district: "",
    location: "",
    address: "",
    features: [],
    images: [],
    isFeatured: false,
    isActive: true,
    floor: "",
    viewCategory: "",
    deliveryDate: "",
    contractType: "",
    projectName: "",
    downPaymentPercent: "",
    installmentYearsMax: "",
    cashDiscountPercent: "",
    videoUrl: "",
    mapEmbedUrl: "",
    bookingUrl: "",
    isRented: false,
    isSold: false,
    hasOffer: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState({
    USD: "",
    EUR: "",
    GBP: "",
    EGP: "",
  });

  const propertyTypes = [
    "Apartment",
    "Villa",
    "Penthouse",
    "Townhouse",
    "Studio",
    "Duplex",
    "Loft",
    "Compound",
    "Land",
    "Building",
    "Office",
    "Retail",
  ];

  const dealTypes = ["For Sale", "For Rent"];

  const listingTypes = [
    {
      value: "primary",
      label: t("properties.listingTypes.primary", "Primary"),
    },
    { value: "resale", label: t("properties.listingTypes.resale", "Resale") },
  ];

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  ];

  const districts = DISTRICTS;

  const availableFeatures = [
    {
      key: "landscaped_garden",
      translationKey: "dashboard.addProperty.featureOptions.landscapedGarden",
    },
    {
      key: "24_7_security",
      translationKey: "dashboard.addProperty.featureOptions.24_7_security",
    },
    {
      key: "cctv_system",
      translationKey: "dashboard.addProperty.featureOptions.cctvSystem",
    },
    {
      key: "fire_system",
      translationKey: "dashboard.addProperty.featureOptions.fireSystem",
    },
    {
      key: "swimming_pool",
      translationKey: "dashboard.addProperty.featureOptions.swimmingPool",
    },
    {
      key: "fitness_center",
      translationKey: "dashboard.addProperty.featureOptions.fitnessCenter",
    },
    {
      key: "sea_view",
      translationKey: "dashboard.addProperty.featureOptions.seaView",
    },
    {
      key: "pool_view",
      translationKey: "dashboard.addProperty.featureOptions.poolView",
    },
    {
      key: "ready_to_move",
      translationKey: "dashboard.addProperty.featureOptions.readyToMove",
    },
    {
      key: "developer_unit",
      translationKey: "dashboard.addProperty.featureOptions.developerUnit",
    },
    {
      key: "private_beach",
      translationKey: "dashboard.addProperty.featureOptions.privateBeach",
    },
  ];

  // Convert price to all currencies
  const convertPrice = useCallback((price, fromCurrency) => {
    if (!price || isNaN(price) || price <= 0) {
      setConvertedPrices({
        USD: "",
        EUR: "",
        GBP: "",
        EGP: "",
      });
      return;
    }

    const numPrice = parseFloat(price);
    const rates = exchangeRates[fromCurrency] || {};

    const converted = {
      USD: fromCurrency === "USD" ? numPrice : numPrice * (rates.USD || 0),
      EUR: fromCurrency === "EUR" ? numPrice : numPrice * (rates.EUR || 0),
      GBP: fromCurrency === "GBP" ? numPrice : numPrice * (rates.GBP || 0),
      EGP: fromCurrency === "EGP" ? numPrice : numPrice * (rates.EGP || 0),
    };

    setConvertedPrices({
      USD: converted.USD.toFixed(2),
      EUR: converted.EUR.toFixed(2),
      GBP: converted.GBP.toFixed(2),
      EGP: converted.EGP.toFixed(2),
    });
  }, []);

  // Update converted prices when price or currency changes
  useEffect(() => {
    if (formData.price && formData.currency) {
      convertPrice(formData.price, formData.currency);
    } else {
      setConvertedPrices({
        USD: "",
        EUR: "",
        GBP: "",
        EGP: "",
      });
    }
  }, [formData.price, formData.currency, convertPrice]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFeatureToggle = (featureKey) => {
    setFormData((prev) => {
      const currentFeatures = prev.features || [];
      const isSelected = currentFeatures.includes(featureKey);
      return {
        ...prev,
        features: isSelected
          ? currentFeatures.filter((f) => f !== featureKey)
          : [...currentFeatures, featureKey],
      };
    });
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setMainImageFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(
        t(
          "dashboard.addProperty.imageTooLarge",
          "Main image is larger than 10MB."
        )
      );
      return;
    }
    setMainImageFile(file);
  };

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = [];
    // 10MB per image
    const maxSize = 10 * 1024 * 1024;
    files.forEach((file) => {
      if (file.size <= maxSize) {
        validFiles.push(file);
      }
    });
    if (files.length !== validFiles.length) {
      alert(
        t(
          "dashboard.addProperty.galleryImageTooLarge",
          "Some gallery images were larger than 10MB and were skipped."
        )
      );
    }
    setGalleryFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    const newErrors = {};
    if (!formData.title)
      newErrors.title = t("dashboard.addProperty.titleRequired");
    if (!formData.propertyType)
      newErrors.propertyType = t("dashboard.addProperty.propertyTypeRequired");
    if (!formData.dealType)
      newErrors.dealType = t("dashboard.addProperty.dealTypeRequired");
    if (!formData.price)
      newErrors.price = t("dashboard.addProperty.priceRequired");
    if (!formData.location)
      newErrors.location = t("dashboard.addProperty.locationRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);

      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.title);
      if (formData.description) {
        formDataPayload.append("description", formData.description);
      }
      if (formData.shortDescription) {
        formDataPayload.append("short_description", formData.shortDescription);
      }
      if (formData.propertyType) {
        formDataPayload.append("property_type", formData.propertyType);
      }
      formDataPayload.append("deal_type", formData.dealType);
      if (formData.listingType && formData.dealType === "For Sale") {
        formDataPayload.append("listing_type", formData.listingType);
      }
      if (formData.price) {
        formDataPayload.append("price", String(formData.price));
      }
      // Always send currency (defaults to USD if no price)
      formDataPayload.append("currency", formData.currency || "USD");
      if (formData.area) {
        formDataPayload.append("area", String(formData.area));
      }
      if (formData.bedrooms) {
        formDataPayload.append("bedrooms", String(formData.bedrooms));
      }
      if (formData.bathrooms) {
        formDataPayload.append("bathrooms", String(formData.bathrooms));
      }
      if (formData.garage) {
        formDataPayload.append("garage", String(formData.garage));
      }
      if (formData.district) {
        formDataPayload.append("district", formData.district);
      }
      formDataPayload.append("location", formData.location);
      if (formData.address) {
        formDataPayload.append("address", formData.address);
      }

      if (formData.floor) formDataPayload.append("floor", formData.floor);
      if (formData.viewCategory) formDataPayload.append("view_category", formData.viewCategory);
      if (formData.deliveryDate) formDataPayload.append("delivery_date", formData.deliveryDate);
      if (formData.contractType) formDataPayload.append("contract_type", formData.contractType);
      if (formData.projectName) formDataPayload.append("project_name", formData.projectName);
      if (formData.downPaymentPercent) formDataPayload.append("down_payment_percent", String(formData.downPaymentPercent));
      if (formData.installmentYearsMax) formDataPayload.append("installment_years_max", String(formData.installmentYearsMax));
      if (formData.cashDiscountPercent) formDataPayload.append("cash_discount_percent", String(formData.cashDiscountPercent));
      if (formData.videoUrl) formDataPayload.append("video_url", formData.videoUrl);
      if (formData.mapEmbedUrl) formDataPayload.append("map_embed_url", formData.mapEmbedUrl);
      if (formData.dealType === "For Rent" && formData.bookingUrl) {
        formDataPayload.append("booking_url", formData.bookingUrl);
      }
      formDataPayload.append("is_rented", formData.isRented ? "1" : "0");
      formDataPayload.append("is_sold", formData.isSold ? "1" : "0");
      formDataPayload.append("has_offer", formData.hasOffer ? "1" : "0");

      formData.features.forEach((feature, index) => {
        formDataPayload.append(`features[${index}]`, feature);
      });

      formDataPayload.append("is_featured", formData.isFeatured ? "1" : "0");
      formDataPayload.append("is_active", formData.isActive ? "1" : "0");
      if (formData.isFeatured) {
        formDataPayload.append("badge", "Featured");
      }

      if (mainImageFile) {
        formDataPayload.append("main_image", mainImageFile);
      }
      galleryFiles.forEach((file) => {
        formDataPayload.append("gallery_images[]", file);
      });

      await createProperty(formDataPayload);

      alert(
        t(
          "dashboard.addProperty.success",
          "Property added successfully ✅ and is now live on the site."
        )
      );

      setFormData({
        title: "",
        description: "",
    shortDescription: "",
        propertyType: "",
        dealType: "",
        listingType: "",
        currency: "USD",
        price: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        garage: "",
        district: "",
        location: "",
        address: "",
        features: [],
        images: [],
        isFeatured: false,
        isActive: true,
      });
      setMainImageFile(null);
      setGalleryFiles([]);

      navigate("/dashboard/properties/list");
    } catch (err) {
      console.error("Error creating property:", err);
      console.error("Response data:", err?.response?.data);

      let errorMessage = t(
        "dashboard.addProperty.error",
        "Failed to add property. Please try again."
      );

      if (err?.response?.data?.errors) {
        // Laravel validation errors
        const errors = err.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, value = []]) => {
            const fieldName = field.replace(/_/g, " ");
            return `${fieldName}: ${
              Array.isArray(value) ? value.join(", ") : value
            }`;
          })
          .join("\n");
        errorMessage = `Validation errors:\n${errorMessages}`;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
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
                {t("dashboard.menu.addProperty") || "Add Property"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.addProperty.subtitle") ||
                  "Add a new property to your portfolio"}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                {t("dashboard.addProperty.cancel")}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                sx={{
                  textTransform: "none",
                  px: 3,
                  boxShadow: (theme) =>
                    `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
                disabled={submitting}
              >
                {submitting
                  ? t("dashboard.addProperty.saving", "Saving property...")
                  : t("dashboard.addProperty.saveProperty")}
              </Button>
            </Stack>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              {/* Basic Information */}
              <Grid2 size={{ xs: 12, md: 8 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    bgcolor: "background.paper",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 2px 8px rgba(0,0,0,0.2)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 3, textAlign: isRTL ? "right" : "left" }}
                    >
                      {t("dashboard.addProperty.basicInformation")}
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label={t("dashboard.addProperty.propertyTitle")}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        required
                      />

                      <TextField
                        fullWidth
                        label="Short description (shown under the title)"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        placeholder="e.g. A truly exceptional private luxury palace offering space, privacy, and elegance."
                        helperText="One short sentence — this replaces the long description at the top of the property page."
                        inputProps={{ maxLength: 500 }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label={t("dashboard.addProperty.description")}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        helperText="Tip: put one feature per line (press Enter after each) and it will show as a clean bulleted list instead of one paragraph. Example:
Plot Size: 1,000 sqm
Built-up Area: 300 sqm
3 Floors, 9 Bedrooms, 6 Bathrooms"
                      />

                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth error={!!errors.propertyType}>
                            <InputLabel>
                              {t("dashboard.addProperty.propertyType")}
                            </InputLabel>
                            <Select
                              name="propertyType"
                              value={formData.propertyType}
                              onChange={handleChange}
                              label={t("dashboard.addProperty.propertyType")}
                            >
                              {propertyTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.propertyType && (
                              <FormHelperText>
                                {errors.propertyType}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth error={!!errors.dealType}>
                            <InputLabel>
                              {t("dashboard.addProperty.dealType")}
                            </InputLabel>
                            <Select
                              name="dealType"
                              value={formData.dealType}
                              onChange={handleChange}
                              label={t("dashboard.addProperty.dealType")}
                            >
                              {dealTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.dealType && (
                              <FormHelperText>{errors.dealType}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid2>
                      </Grid2>

                      {/* Listing Type - Only show if deal type is "For Sale" */}
                      {formData.dealType === "For Sale" && (
                        <FormControl fullWidth>
                          <InputLabel>
                            {t(
                              "dashboard.addProperty.listingType",
                              "Listing Type"
                            )}
                          </InputLabel>
                          <Select
                            name="listingType"
                            value={formData.listingType}
                            onChange={handleChange}
                            label={t(
                              "dashboard.addProperty.listingType",
                              "Listing Type"
                            )}
                          >
                            <MenuItem value="">
                              <em>
                                {t("common.notSpecified", "Not Specified")}
                              </em>
                            </MenuItem>
                            {listingTypes.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {t(
                              "dashboard.addProperty.listingTypeHelp",
                              "Primary = New construction, Resale = Previously owned"
                            )}
                          </FormHelperText>
                        </FormControl>
                      )}

                      {/* Rent-only fields - Only show if deal type is "For Rent" */}
                      {formData.dealType === "For Rent" && (
                        <TextField
                          fullWidth
                          label={t("dashboard.addProperty.bookingUrl", "Booking link (optional)")}
                          name="bookingUrl"
                          value={formData.bookingUrl}
                          onChange={handleChange}
                          placeholder="https://www.booking.com/... or https://www.airbnb.com/..."
                          helperText={t(
                            "dashboard.addProperty.bookingUrlHelp",
                            "If this unit is listed on Booking.com, Airbnb, or elsewhere, paste the link here. Otherwise leave blank to let guests book/inquire through this site."
                          )}
                        />
                      )}

                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <FormControl fullWidth>
                            <InputLabel>
                              {t("dashboard.addProperty.currency", "Currency")}
                            </InputLabel>
                            <Select
                              name="currency"
                              value={formData.currency}
                              onChange={handleChange}
                              label={t(
                                "dashboard.addProperty.currency",
                                "Currency"
                              )}
                            >
                              {currencies.map((currency) => (
                                <MenuItem
                                  key={currency.code}
                                  value={currency.code}
                                >
                                  {currency.symbol} - {currency.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            label={t("dashboard.addProperty.price")}
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            error={!!errors.price}
                            helperText={errors.price}
                            required
                            InputProps={{
                              startAdornment: (
                                <Box
                                  sx={{
                                    mr: 1,
                                    color: "text.secondary",
                                    fontWeight: 600,
                                  }}
                                >
                                  {currencies.find(
                                    (c) => c.code === formData.currency
                                  )?.symbol || "$"}
                                </Box>
                              ),
                            }}
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <TextField
                            fullWidth
                            label={t("dashboard.addProperty.area")}
                            name="area"
                            type="number"
                            value={formData.area}
                            onChange={handleChange}
                          />
                        </Grid2>
                      </Grid2>

                      {/* Converted Prices Display */}
                      {formData.price && formData.currency && (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            mt: 2,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.primary.main, 0.08)
                                : alpha(theme.palette.primary.main, 0.04),
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{ mb: 2, textAlign: isRTL ? "right" : "left" }}
                          >
                            {t(
                              "dashboard.addProperty.convertedPrices",
                              "Converted Prices"
                            )}
                          </Typography>
                          <Grid2 container spacing={2}>
                            {currencies
                              .filter((curr) => curr.code !== formData.currency)
                              .map((currency) => (
                                <Grid2
                                  key={currency.code}
                                  size={{ xs: 6, sm: 3 }}
                                >
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 1.5,
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? alpha(
                                              theme.palette.background.paper,
                                              0.5
                                            )
                                          : "background.paper",
                                      border: (theme) =>
                                        `1px solid ${alpha(
                                          theme.palette.divider,
                                          0.1
                                        )}`,
                                    }}
                                  >
                                    <Stack spacing={0.5}>
                                      <Chip
                                        label={currency.code}
                                        size="small"
                                        sx={{
                                          width: "fit-content",
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          height: 24,
                                        }}
                                      />
                                      <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{
                                          fontSize: "1rem",
                                          color: "primary.main",
                                        }}
                                      >
                                        {currency.symbol}
                                        {convertedPrices[currency.code] ||
                                          "0.00"}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: "0.7rem" }}
                                      >
                                        {currency.name}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Grid2>
                              ))}
                          </Grid2>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              mt: 1.5,
                              display: "block",
                              fontSize: "0.7rem",
                              fontStyle: "italic",
                            }}
                          >
                            {t(
                              "dashboard.addProperty.exchangeRateNote",
                              "Exchange rates are approximate and may vary"
                            )}
                          </Typography>
                        </Paper>
                      )}

                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <FormControl fullWidth>
                            <InputLabel>
                              {t("dashboard.addProperty.bedrooms")}
                            </InputLabel>
                            <Select
                              name="bedrooms"
                              value={formData.bedrooms}
                              onChange={handleChange}
                              label={t("dashboard.addProperty.bedrooms")}
                            >
                              <MenuItem value="">
                                <em>
                                  {t("common.notSpecified", "Not Specified")}
                                </em>
                              </MenuItem>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (num) => (
                                  <MenuItem key={num} value={String(num)}>
                                    {num}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <FormControl fullWidth>
                            <InputLabel>
                              {t("dashboard.addProperty.bathrooms")}
                            </InputLabel>
                            <Select
                              name="bathrooms"
                              value={formData.bathrooms}
                              onChange={handleChange}
                              label={t("dashboard.addProperty.bathrooms")}
                            >
                              <MenuItem value="">
                                <em>
                                  {t("common.notSpecified", "Not Specified")}
                                </em>
                              </MenuItem>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (num) => (
                                  <MenuItem key={num} value={String(num)}>
                                    {num}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <FormControl fullWidth>
                            <InputLabel>
                              {t("dashboard.addProperty.garage")}
                            </InputLabel>
                            <Select
                              name="garage"
                              value={formData.garage}
                              onChange={handleChange}
                              label={t("dashboard.addProperty.garage")}
                            >
                              <MenuItem value="">
                                <em>
                                  {t("common.notSpecified", "Not Specified")}
                                </em>
                              </MenuItem>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (num) => (
                                  <MenuItem key={num} value={String(num)}>
                                    {num}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid2>
                      </Grid2>
                    </Stack>
                  </CardContent>
                </MotionCard>

                {/* Location Information */}
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{
                    mt: 3,
                    bgcolor: "background.paper",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 2px 8px rgba(0,0,0,0.2)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 3, textAlign: isRTL ? "right" : "left" }}
                    >
                      {t("dashboard.addProperty.locationInformation")}
                    </Typography>
                    <Stack spacing={3}>
                      <FormControl fullWidth>
                        <InputLabel>
                          {t("dashboard.addProperty.district", "District")}
                        </InputLabel>
                        <Select
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          label={t(
                            "dashboard.addProperty.district",
                            "District"
                          )}
                        >
                          <MenuItem value="">
                            <em>{t("common.notSpecified", "Not Specified")}</em>
                          </MenuItem>
                          {DISTRICT_GROUPS.map((group) => [
                            <MenuItem
                              key={`group-${group.key}`}
                              disabled
                              sx={{ fontWeight: 700, opacity: 0.7, mt: 1 }}
                            >
                              {t(group.translationKey)}
                            </MenuItem>,
                            ...districts
                              .filter((d) => d.group === group.key)
                              .map((district) => (
                                <MenuItem
                                  key={district.key}
                                  value={district.key}
                                  sx={{ pl: 3 }}
                                >
                                  {t(district.translationKey)}
                                </MenuItem>
                              )),
                          ])}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label={t("dashboard.addProperty.location")}
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={!!errors.location}
                        helperText={errors.location}
                        required
                      />

                      <TextField
                        fullWidth
                        label={t("dashboard.addProperty.address")}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        multiline
                        rows={2}
                      />
                    </Stack>
                  </CardContent>
                </MotionCard>

                {/* Additional listing details (used on the redesigned property details page) */}
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Additional Details (optional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Shown on the property details page: floor, view, delivery, contract type, indicative payment plan, video and map.
                    </Typography>
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField fullWidth label="Floor" name="floor" value={formData.floor} onChange={handleChange} placeholder="e.g. First Floor" />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField fullWidth label="View category" name="viewCategory" value={formData.viewCategory} onChange={handleChange} placeholder="e.g. Street View, Sea View" />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField fullWidth label="Delivery date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} placeholder="e.g. 2029" />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField fullWidth label="Contract type" name="contractType" value={formData.contractType} onChange={handleChange} placeholder="e.g. Green Contract" />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Project / resort name" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="e.g. Sea Breeze Resort" />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField fullWidth type="number" label="Min. down payment %" name="downPaymentPercent" value={formData.downPaymentPercent} onChange={handleChange} />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField fullWidth type="number" label="Longest installment (years)" name="installmentYearsMax" value={formData.installmentYearsMax} onChange={handleChange} />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField fullWidth type="number" label="Cash discount %" name="cashDiscountPercent" value={formData.cashDiscountPercent} onChange={handleChange} />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Video URL (optional)" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="YouTube / Vimeo / MP4 link" />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Google Maps embed URL (optional)" name="mapEmbedUrl" value={formData.mapEmbedUrl} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..." />
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </MotionCard>

                {/* Features */}
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  sx={{
                    mt: 3,
                    bgcolor: "background.paper",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 2px 8px rgba(0,0,0,0.2)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 3, textAlign: isRTL ? "right" : "left" }}
                    >
                      {t("dashboard.addProperty.features")}
                    </Typography>
                    <FormGroup>
                      <Stack spacing={1.5}>
                        {availableFeatures.map((feature) => (
                          <FormControlLabel
                            key={feature.key}
                            control={
                              <Checkbox
                                checked={formData.features.includes(
                                  feature.key
                                )}
                                onChange={() =>
                                  handleFeatureToggle(feature.key)
                                }
                                name={feature.key}
                              />
                            }
                            label={t(feature.translationKey)}
                            sx={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                              alignItems: "flex-start",
                              "& .MuiFormControlLabel-label": {
                                marginLeft: isRTL ? 0 : 1,
                                marginRight: isRTL ? 1 : 0,
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </FormGroup>
                  </CardContent>
                </MotionCard>
              </Grid2>

              {/* Sidebar */}
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Stack spacing={3}>
                  {/* Images Upload */}
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    sx={{
                      bgcolor: "background.paper",
                      border: (theme) =>
                        `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "0 2px 8px rgba(0,0,0,0.2)"
                          : "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2, textAlign: isRTL ? "right" : "left" }}
                      >
                        {t("dashboard.addProperty.propertyImages")}
                      </Typography>

                      {/* Main image */}
                      <Stack spacing={1.5} sx={{ mb: 3 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {t(
                            "dashboard.addProperty.mainImage",
                            "Main property image"
                          )}
                        </Typography>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<PhotoCameraIcon />}
                          sx={{
                            textTransform: "none",
                            borderStyle: "dashed",
                          }}
                        >
                          {t(
                            "dashboard.addProperty.selectMainImage",
                            "Select main image (JPG or PNG, up to 10MB)"
                          )}
                          <input
                            type="file"
                            accept="image/jpeg,image/png"
                            hidden
                            onChange={handleMainImageChange}
                          />
                        </Button>
                        {mainImageFile && (
                          <Typography variant="caption" color="text.secondary">
                            {mainImageFile.name}
                          </Typography>
                        )}
                      </Stack>

                      {/* Gallery images */}
                      <Stack spacing={1.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {t(
                            "dashboard.addProperty.galleryImages",
                            "Gallery images"
                          )}
                        </Typography>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<PhotoCameraIcon />}
                          sx={{
                            textTransform: "none",
                            borderStyle: "dashed",
                          }}
                        >
                          {t(
                            "dashboard.addProperty.selectGalleryImages",
                            "Select gallery images (JPG or PNG, up to 10MB each)"
                          )}
                          <input
                            type="file"
                            accept="image/jpeg,image/png"
                            multiple
                            hidden
                            onChange={handleGalleryChange}
                          />
                        </Button>
                        {galleryFiles.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {galleryFiles.map((file) => (
                              <Typography
                                key={file.name}
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {file.name}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {t(
                            "dashboard.addProperty.imageFormat",
                            "Supported formats: JPG, PNG. Max size: 10MB each."
                          )}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Settings */}
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    sx={{
                      bgcolor: "background.paper",
                      border: (theme) =>
                        `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "0 2px 8px rgba(0,0,0,0.2)"
                          : "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 3, textAlign: isRTL ? "right" : "left" }}
                      >
                        {t("dashboard.addProperty.settings")}
                      </Typography>
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.isFeatured}
                              onChange={handleChange}
                              name="isFeatured"
                            />
                          }
                          label={t("dashboard.addProperty.featuredProperty")}
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                            justifyContent: "space-between",
                            ml: 0,
                            mr: 0,
                          }}
                        />
                        <Divider />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.isActive}
                              onChange={handleChange}
                              name="isActive"
                            />
                          }
                          label={t("dashboard.addProperty.active")}
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                            justifyContent: "space-between",
                            ml: 0,
                            mr: 0,
                          }}
                        />
                        <Divider />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!formData.isSold}
                              onChange={(e) => setFormData((prev) => ({ ...prev, isSold: e.target.checked }))}
                            />
                          }
                          label="Sold"
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                            justifyContent: "space-between",
                            ml: 0,
                            mr: 0,
                          }}
                        />
                        <Divider />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!formData.isRented}
                              onChange={(e) => setFormData((prev) => ({ ...prev, isRented: e.target.checked }))}
                            />
                          }
                          label="Rented"
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                            justifyContent: "space-between",
                            ml: 0,
                            mr: 0,
                          }}
                        />
                        <Divider />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!formData.hasOffer}
                              onChange={(e) => setFormData((prev) => ({ ...prev, hasOffer: e.target.checked }))}
                            />
                          }
                          label="Has an Offer"
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                            justifyContent: "space-between",
                            ml: 0,
                            mr: 0,
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </MotionCard>
                </Stack>
              </Grid2>
            </Grid2>
          </form>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default AddPropertyView;
