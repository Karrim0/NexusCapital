import { useEffect, useState } from "react";
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
  Chip,
  alpha,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchPropertyById, updateProperty } from "../../../api/properties";
import { DISTRICT_GROUPS, DISTRICTS } from "../../../constants/hurghadaDistricts";

const EditPropertyView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [currentMainImage, setCurrentMainImage] = useState("");
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [removeMainImage, setRemoveMainImage] = useState(false);

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
    { value: "primary", label: t("properties.listingTypes.primary", "Primary") },
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
    { key: "landscaped_garden", translationKey: "dashboard.addProperty.featureOptions.landscapedGarden" },
    { key: "24_7_security", translationKey: "dashboard.addProperty.featureOptions.24_7_security" },
    { key: "cctv_system", translationKey: "dashboard.addProperty.featureOptions.cctvSystem" },
    { key: "fire_system", translationKey: "dashboard.addProperty.featureOptions.fireSystem" },
    { key: "swimming_pool", translationKey: "dashboard.addProperty.featureOptions.swimmingPool" },
    { key: "fitness_center", translationKey: "dashboard.addProperty.featureOptions.fitnessCenter" },
    { key: "sea_view", translationKey: "dashboard.addProperty.featureOptions.seaView" },
    { key: "pool_view", translationKey: "dashboard.addProperty.featureOptions.poolView" },
    { key: "ready_to_move", translationKey: "dashboard.addProperty.featureOptions.readyToMove" },
    { key: "developer_unit", translationKey: "dashboard.addProperty.featureOptions.developerUnit" },
    { key: "private_beach", translationKey: "dashboard.addProperty.featureOptions.privateBeach" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const property = await fetchPropertyById(id);
        if (!property) {
          setLoadError(
            t(
              "dashboard.editProperty.notFound",
              "Property could not be found or has been removed."
            )
          );
          return;
        }
        setFormData({
          title: property.title || "",
          description: property.description || "",
          shortDescription: property.short_description || "",
          propertyType: property.property_type || "",
          dealType: property.deal_type || "",
          listingType: property.listing_type || "",
          currency: property.currency || "USD",
          price: property.price != null ? String(property.price) : "",
          area: property.area != null ? String(property.area) : "",
          bedrooms: property.bedrooms != null ? String(property.bedrooms) : "",
          bathrooms:
            property.bathrooms != null ? String(property.bathrooms) : "",
          garage: property.garage != null ? String(property.garage) : "",
          district: property.district || "",
          location: property.location || "",
          address: property.address || "",
          features: Array.isArray(property.features) ? property.features : [],
          images: Array.isArray(property.images) ? property.images : [],
          isFeatured: !!property.is_featured,
          isActive: !!property.is_active,
          floor: property.floor || "",
          viewCategory: property.view_category || "",
          deliveryDate: property.delivery_date || "",
          contractType: property.contract_type || "",
          projectName: property.project_name || "",
          downPaymentPercent: property.down_payment_percent != null ? String(property.down_payment_percent) : "",
          installmentYearsMax: property.installment_years_max != null ? String(property.installment_years_max) : "",
          cashDiscountPercent: property.cash_discount_percent != null ? String(property.cash_discount_percent) : "",
          videoUrl: property.video_url || "",
          mapEmbedUrl: property.map_embed_url || "",
          bookingUrl: property.booking_url || "",
          isRented: !!property.is_rented,
          isSold: !!property.is_sold,
          hasOffer: !!property.has_offer,
        });
        setCurrentMainImage(property.image || "");
        setExistingGalleryImages(
          Array.isArray(property.images) ? property.images : []
        );
        setRemoveMainImage(false);
        setMainImageFile(null);
        setGalleryFiles([]);
      } catch {
        setLoadError(
          t(
            "dashboard.editProperty.loadError",
            "Failed to load property. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id, t]);

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

  const handleRemoveExistingGalleryImage = (url) => {
    setExistingGalleryImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      formDataPayload.append("title", formData.title || "");
      formDataPayload.append("description", formData.description || "");
      formDataPayload.append("short_description", formData.shortDescription || "");
      formDataPayload.append("property_type", formData.propertyType || "");
      formDataPayload.append("deal_type", formData.dealType);
      if (formData.listingType && formData.dealType === "For Sale") {
        formDataPayload.append("listing_type", formData.listingType);
      }
      if (formData.price) {
        formDataPayload.append("price", String(formData.price));
      }
      // Always send currency (defaults to USD if no price)
      formDataPayload.append("currency", formData.currency || "USD");
      formDataPayload.append("area", formData.area ? String(formData.area) : "");
      formDataPayload.append("bedrooms", formData.bedrooms ? String(formData.bedrooms) : "");
      formDataPayload.append("bathrooms", formData.bathrooms ? String(formData.bathrooms) : "");
      formDataPayload.append("garage", formData.garage ? String(formData.garage) : "");
      if (formData.district) {
        formDataPayload.append("district", formData.district);
      }
      formDataPayload.append("location", formData.location || "");
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

      // Keep existing gallery images that the user did not remove
      existingGalleryImages.forEach((url, index) => {
        formDataPayload.append(`existing_images[${index}]`, url);
      });

      if (mainImageFile) {
        formDataPayload.append("main_image", mainImageFile);
      } else if (removeMainImage) {
        formDataPayload.append("remove_main_image", "1");
      }
      galleryFiles.forEach((file) => {
        formDataPayload.append("gallery_images[]", file);
      });

      await updateProperty(id, formDataPayload);

      alert(
        t("dashboard.editProperty.success", "Property updated successfully ✅.")
      );

      navigate("/dashboard/properties/list");
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (err?.response?.data?.errors &&
          Object.values(err.response.data.errors)[0]?.[0]);
      alert(
        apiMessage ||
          t(
            "dashboard.editProperty.error",
            "Failed to update property. Please try again."
          )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
          <Typography variant="h6">
            {t("dashboard.editProperty.loading", "Loading property details...")}
          </Typography>
        </Container>
      </MotionBox>
    );
  }

  if (loadError) {
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
          <Typography variant="h6" color="error">
            {loadError}
          </Typography>
        </Container>
      </MotionBox>
    );
  }

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
                {t("dashboard.editProperty.title", "Edit property")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t(
                  "dashboard.editProperty.subtitle",
                  "Update the details of your property"
                )}
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
                onClick={() => navigate("/dashboard/properties/list")}
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
                        helperText="Tip: put one feature per line (press Enter after each) and it will show as a clean bulleted list instead of one paragraph."
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
                            {t("dashboard.addProperty.listingType", "Listing Type")}
                          </InputLabel>
                          <Select
                            name="listingType"
                            value={formData.listingType}
                            onChange={handleChange}
                            label={t("dashboard.addProperty.listingType", "Listing Type")}
                          >
                            <MenuItem value="">
                              <em>{t("common.notSpecified", "Not Specified")}</em>
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
                              label={t("dashboard.addProperty.currency", "Currency")}
                            >
                              {currencies.map((currency) => (
                                <MenuItem key={currency.code} value={currency.code}>
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
                                <Box sx={{ mr: 1, color: "text.secondary", fontWeight: 600 }}>
                                  {currencies.find(c => c.code === formData.currency)?.symbol || "$"}
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
                                <em>{t("common.notSpecified", "Not Specified")}</em>
                              </MenuItem>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <MenuItem key={num} value={String(num)}>
                                  {num}
                                </MenuItem>
                              ))}
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
                                <em>{t("common.notSpecified", "Not Specified")}</em>
                              </MenuItem>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <MenuItem key={num} value={String(num)}>
                                  {num}
                                </MenuItem>
                              ))}
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
                                <em>{t("common.notSpecified", "Not Specified")}</em>
                              </MenuItem>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <MenuItem key={num} value={String(num)}>
                                  {num}
                                </MenuItem>
                              ))}
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
                          label={t("dashboard.addProperty.district", "District")}
                        >
                          <MenuItem value="">
                            <em>{t("common.notSpecified", "Not Specified")}</em>
                          </MenuItem>
                          {DISTRICT_GROUPS.map((group) => [
                            <MenuItem key={`group-${group.key}`} disabled sx={{ fontWeight: 700, opacity: 0.7, mt: 1 }}>
                              {t(group.translationKey)}
                            </MenuItem>,
                            ...districts.filter(d => d.group === group.key).map((district) => (
                              <MenuItem key={district.key} value={district.key} sx={{ pl: 3 }}>
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
                      {formData.dealType === "For Rent" && (
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Booking link (optional)"
                            name="bookingUrl"
                            value={formData.bookingUrl}
                            onChange={handleChange}
                            placeholder="https://www.booking.com/... or https://www.airbnb.com/..."
                            helperText="If listed on Booking.com, Airbnb, or elsewhere, paste the link here."
                          />
                        </Grid2>
                      )}
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
                                checked={formData.features.includes(feature.key)}
                                onChange={() => handleFeatureToggle(feature.key)}
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

                      {/* Current main image preview */}
                      {currentMainImage && (
                        <Box
                          sx={{
                            mb: 2,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: (theme) =>
                              `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                          }}
                        >
                          <Box
                            component="img"
                            src={currentMainImage}
                            alt={formData.title}
                            sx={{
                              width: "100%",
                              height: 180,
                              objectFit: "cover",
                            }}
                          />
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              px: 1.5,
                              py: 0.75,
                              bgcolor: (theme) =>
                                alpha(theme.palette.background.paper, 0.9),
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {t(
                                "dashboard.editProperty.currentMainImage",
                                "Current main image"
                              )}
                            </Typography>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon fontSize="small" />}
                              onClick={() => {
                                setCurrentMainImage("");
                                setRemoveMainImage(true);
                              }}
                            >
                              {t(
                                "dashboard.editProperty.removeMainImage",
                                "Remove"
                              )}
                            </Button>
                          </Stack>
                        </Box>
                      )}

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
                        {/* Existing gallery images preview */}
                        {existingGalleryImages.length > 0 && (
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {existingGalleryImages.map((url) => (
                              <Box
                                key={url}
                                sx={{
                                  position: "relative",
                                  width: "30%",
                                  minWidth: 80,
                                  aspectRatio: "4 / 3",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  border: (theme) =>
                                    `1px solid ${alpha(
                                      theme.palette.divider,
                                      0.4
                                    )}`,
                                }}
                              >
                                <Box
                                  component="img"
                                  src={url}
                                  alt={formData.title}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleRemoveExistingGalleryImage(url)
                                  }
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: (theme) =>
                                      alpha(
                                        theme.palette.background.paper,
                                        0.8
                                      ),
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        )}
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

export default EditPropertyView;
