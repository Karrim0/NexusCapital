import { useState, useEffect } from "react";
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
  alpha,
  Divider,
  Switch,
  FormControlLabel,
  Checkbox,
  Chip,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import FlightIcon from "@mui/icons-material/Flight";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SpaIcon from "@mui/icons-material/Spa";
import PoolIcon from "@mui/icons-material/Pool";
import SecurityIcon from "@mui/icons-material/Security";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ElevatorIcon from "@mui/icons-material/Elevator";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GavelIcon from "@mui/icons-material/Gavel";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { fetchProjectById, updateProject } from "../../../api/projects";
import { DISTRICT_GROUPS, DISTRICTS } from "../../../constants/hurghadaDistricts";
import { StringListEditor, ObjectListEditor } from "../../../components/dashboard/ContentListEditors";

// ─── All available amenities with icons ──────────────────────────────────────
const ALL_AMENITIES = [
  { key: "gym", label: "Gym", icon: FitnessCenterIcon },
  { key: "spa", label: "Spa & Wellness", icon: SpaIcon },
  { key: "restaurant", label: "Restaurant & Café", icon: RestaurantIcon },
  { key: "security", label: "24/7 Security", icon: SecurityIcon },
  { key: "swimming_pool", label: "Swimming Pool", icon: PoolIcon },
  { key: "heated_pool", label: "Heated Pool", icon: PoolIcon },
  { key: "beach_access", label: "Beach Access", icon: BeachAccessIcon },
  { key: "parking", label: "Underground Parking", icon: LocalParkingIcon },
  { key: "kids_area", label: "Kids Area", icon: ChildCareIcon },
  { key: "pharmacy", label: "Pharmacy", icon: LocalPharmacyIcon },
  { key: "supermarket", label: "Supermarket", icon: LocalGroceryStoreIcon },
  { key: "elevator", label: "Elevators", icon: ElevatorIcon },
  { key: "property_management", label: "Property Management", icon: ManageAccountsIcon },
  { key: "green_contract", label: "Green Contract", icon: GavelIcon },
  { key: "housekeeping", label: "Housekeeping & Laundry", icon: CleaningServicesIcon },
];

const EditProjectView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isRTL = settings.direction === "rtl";
  const isAdmin = user?.role === "admin";

  const [loadingProject, setLoadingProject] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    district: "",
    delivery_date: "",
    size_from: "",
    size_to: "",
    starting_price: "",
    currency: "EUR",
    total_units: "",
    status: "under_construction",
    // Structured sections
    project_details: "",
    location_advantage: "",
    architectural_vision: "",
    lifestyle_amenities: "",
    investment_potential: "",
    // Location distances
    mins_from_airport: "",
    mins_from_hospitals: "",
    mins_from_downtown: "",
    mins_from_beach: "",
    location_description: "",
    map_embed_url: "",
    video_url: "",
    is_active: true,
    is_featured: false,
    offer_discount_percent: "",
    offer_deadline_label: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [badges, setBadges] = useState([]);
  const [residenceHighlights, setResidenceHighlights] = useState([]);
  const [investmentCards, setInvestmentCards] = useState([]);
  const [lifestyleCards, setLifestyleCards] = useState([]);
  const [paymentPlanRows, setPaymentPlanRows] = useState([]);
  const [buyerJourneySteps, setBuyerJourneySteps] = useState([]);
  const [projectFaqs, setProjectFaqs] = useState([]);
  const [travelDistances, setTravelDistances] = useState([]);
  const [developerTrackRecord, setDeveloperTrackRecord] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [constructionProgress, setConstructionProgress] = useState({ concrete: "", brickwork: "", finishing: "" });
  const [masterPlanNote, setMasterPlanNote] = useState("");
  const [groundFloorFile, setGroundFloorFile] = useState(null);
  const [groundFloorPreview, setGroundFloorPreview] = useState(null);
  const [removeGroundFloor, setRemoveGroundFloor] = useState(false);
  const [typicalFloorsFile, setTypicalFloorsFile] = useState(null);
  const [typicalFloorsPreview, setTypicalFloorsPreview] = useState(null);
  const [removeTypicalFloors, setRemoveTypicalFloors] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [removeMainImage, setRemoveMainImage] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryCaptions, setGalleryCaptions] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Load existing project data
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingProject(true);
        const project = await fetchProjectById(id);
        if (!project) return;
        setFormData({
          name: project.name || project.title || "",
          description: project.overview || project.description || "",
          location: project.location || "",
          district: project.district || "",
          delivery_date: project.delivery_date || "",
          size_from: project.starting_area || project.size_from || "",
          size_to: project.max_area || project.size_to || "",
          starting_price: project.starting_price || "",
          currency: project.currency || "EUR",
          total_units: project.total_units || "",
          status: project.status || "under_construction",
          project_details: project.project_details || "",
          location_advantage: project.location_advantage || "",
          architectural_vision: project.architectural_vision || "",
          lifestyle_amenities: project.lifestyle_amenities || "",
          investment_potential: project.investment_potential || "",
          mins_from_airport: project.mins_from_airport || "",
          mins_from_hospitals: project.mins_from_hospitals || "",
          mins_from_downtown: project.mins_from_downtown || "",
          mins_from_beach: project.mins_from_beach || "",
          location_description: project.location_description || "",
          map_embed_url: project.map_embed_url || "",
          video_url: project.video_url || "",
          is_active: project.is_active !== false,
          is_featured: !!project.is_featured,
          offer_discount_percent: project.offer_discount_percent ?? "",
          offer_deadline_label: project.offer_deadline_label || "",
        });
        // Parse amenities
        try {
          const am = project.amenities;
          if (am) setSelectedAmenities(Array.isArray(am) ? am : JSON.parse(am));
        } catch { setSelectedAmenities([]); }
        setBadges(Array.isArray(project.badges) ? project.badges : []);
        setResidenceHighlights(Array.isArray(project.residence_highlights) ? project.residence_highlights : []);
        setInvestmentCards(Array.isArray(project.investment_cards) ? project.investment_cards : []);
        setLifestyleCards(Array.isArray(project.lifestyle_cards) ? project.lifestyle_cards : []);
        setPaymentPlanRows(Array.isArray(project.payment_plan_rows) ? project.payment_plan_rows : []);
        setBuyerJourneySteps(Array.isArray(project.buyer_journey_steps) ? project.buyer_journey_steps : []);
        setProjectFaqs(Array.isArray(project.project_faqs) ? project.project_faqs : []);
        setTravelDistances(Array.isArray(project.travel_distances) ? project.travel_distances : []);
        setDeveloperTrackRecord(Array.isArray(project.developer_track_record) ? project.developer_track_record : []);
        setUnitTypes(Array.isArray(project.unit_types) ? project.unit_types : []);
        setConstructionProgress(
          project.construction_progress && typeof project.construction_progress === "object"
            ? {
                concrete: project.construction_progress.concrete ?? "",
                brickwork: project.construction_progress.brickwork ?? "",
                finishing: project.construction_progress.finishing ?? "",
              }
            : { concrete: "", brickwork: "", finishing: "" }
        );
        setMasterPlanNote(project.master_plan?.legend_note || "");
        setGroundFloorPreview(project.master_plan?.ground_floor_image || null);
        setTypicalFloorsPreview(project.master_plan?.typical_floors_image || null);
        setMainImagePreview(project.cover_image || project.main_image || null);
        setExistingImages(
          (project.images || project.gallery_images || []).map((item) =>
            typeof item === "string" ? { url: item, caption: "" } : { url: item.url, caption: item.caption || "" }
          )
        );
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoadingProject(false);
      }
    };
    if (id) load();
  }, [id]);

  const currencies = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  ];

  const statusOptions = [
    { value: "under_construction", label: "Under Construction" },
    { value: "completed", label: "Completed" },
    { value: "upcoming", label: "Upcoming" },
  ];

  if (!isAdmin) {
    return (
      <MotionBox initial="initial" animate="animate" variants={fadeInUp}
        sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container maxWidth="sm">
          <MotionCard sx={{ bgcolor: "background.paper", p: 4, textAlign: "center" }}>
            <ApartmentRoundedIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>Access Denied</Typography>
            <Typography color="text.secondary">Only admins can manage projects.</Typography>
          </MotionCard>
        </Container>
      </MotionBox>
    );
  }

  if (loadingProject) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">Loading project...</Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleAmenity = (key) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setGalleryCaptions((prev) => [...prev, ...files.map(() => "")]);
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setGalleryCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExistingCaption = (index, caption) => {
    setExistingImages((prev) => prev.map((img, i) => (i === index ? { ...img, caption } : img)));
  };

  const updateGalleryCaption = (index, caption) => {
    setGalleryCaptions((prev) => prev.map((c, i) => (i === index ? caption : c)));
  };

  const handleGroundFloorImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGroundFloorFile(file);
    setGroundFloorPreview(URL.createObjectURL(file));
  };

  const handleTypicalFloorsImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTypicalFloorsFile(file);
    setTypicalFloorsPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      if (formData.description) payload.append("description", formData.description);
      payload.append("location", formData.location);
      if (formData.district) payload.append("district", formData.district);
      if (formData.delivery_date) payload.append("delivery_date", formData.delivery_date);
      if (formData.size_from) payload.append("size_from", formData.size_from);
      if (formData.size_to) payload.append("size_to", formData.size_to);
      if (formData.starting_price) payload.append("starting_price", formData.starting_price);
      payload.append("currency", formData.currency);
      if (formData.total_units) payload.append("total_units", formData.total_units);
      payload.append("status", formData.status);
      // Structured sections
      if (formData.project_details) payload.append("project_details", formData.project_details);
      if (formData.location_advantage) payload.append("location_advantage", formData.location_advantage);
      if (formData.architectural_vision) payload.append("architectural_vision", formData.architectural_vision);
      if (formData.lifestyle_amenities) payload.append("lifestyle_amenities", formData.lifestyle_amenities);
      if (formData.investment_potential) payload.append("investment_potential", formData.investment_potential);
      // Location distances
      if (formData.mins_from_airport) payload.append("mins_from_airport", formData.mins_from_airport);
      if (formData.mins_from_hospitals) payload.append("mins_from_hospitals", formData.mins_from_hospitals);
      if (formData.mins_from_downtown) payload.append("mins_from_downtown", formData.mins_from_downtown);
      if (formData.mins_from_beach) payload.append("mins_from_beach", formData.mins_from_beach);
      if (formData.location_description) payload.append("location_description", formData.location_description);
      if (formData.map_embed_url) payload.append("map_embed_url", formData.map_embed_url);
      if (formData.video_url) payload.append("video_url", formData.video_url);
      // Amenities as JSON
      payload.append("amenities", JSON.stringify(selectedAmenities));
      payload.append("is_active", formData.is_active ? "1" : "0");
      payload.append("is_featured", formData.is_featured ? "1" : "0");

      // Redesigned project details page content
      if (formData.offer_discount_percent) payload.append("offer_discount_percent", formData.offer_discount_percent);
      if (formData.offer_deadline_label) payload.append("offer_deadline_label", formData.offer_deadline_label);
      payload.append("badges", JSON.stringify(badges.filter(Boolean)));
      payload.append("residence_highlights", JSON.stringify(residenceHighlights));
      payload.append("investment_cards", JSON.stringify(investmentCards));
      payload.append("lifestyle_cards", JSON.stringify(lifestyleCards));
      payload.append("payment_plan_rows", JSON.stringify(paymentPlanRows));
      payload.append("buyer_journey_steps", JSON.stringify(buyerJourneySteps));
      payload.append("project_faqs", JSON.stringify(projectFaqs));
      payload.append("travel_distances", JSON.stringify(travelDistances));
      payload.append("developer_track_record", JSON.stringify(developerTrackRecord));
      payload.append("unit_types", JSON.stringify(unitTypes));
      if (constructionProgress.concrete || constructionProgress.brickwork || constructionProgress.finishing) {
        payload.append("construction_progress", JSON.stringify(constructionProgress));
      }
      if (masterPlanNote) payload.append("master_plan", JSON.stringify({ legend_note: masterPlanNote }));

      if (mainImageFile) {
        payload.append("main_image", mainImageFile);
      } else if (removeMainImage) {
        payload.append("remove_main_image", "1");
      }
      galleryFiles.forEach((file) => payload.append("images[]", file));
      payload.append("image_captions", JSON.stringify(galleryCaptions));
      payload.append("existing_gallery", JSON.stringify(existingImages));
      if (groundFloorFile) {
        payload.append("ground_floor_image", groundFloorFile);
      } else if (removeGroundFloor) {
        payload.append("remove_ground_floor_image", "1");
      }
      if (typicalFloorsFile) {
        payload.append("typical_floors_image", typicalFloorsFile);
      } else if (removeTypicalFloors) {
        payload.append("remove_typical_floors_image", "1");
      }

      await updateProject(id, payload);
      alert("Project updated successfully!");
      navigate("/dashboard/projects/list");
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardSx = {
    bgcolor: "background.paper",
    border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: (t) => t.palette.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.05)",
  };

  const sectionField = (label, name, rows = 4, placeholder = "") => (
    <TextField fullWidth multiline minRows={rows} label={label} name={name}
      value={formData[name]} onChange={handleChange} placeholder={placeholder} />
  );

  return (
    <MotionBox initial="initial" animate="animate" variants={fadeInUp}
      sx={{ minHeight: "100vh", py: { xs: 3, md: 4 }, bgcolor: "background.default", direction: settings.direction }}>
      <Container maxWidth="xl">
        <MotionStack initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} spacing={3}>

          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Edit Project</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                {formData.name}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" startIcon={<CancelIcon />}
                onClick={() => navigate("/dashboard/projects/list")} sx={{ borderRadius: 99 }}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />}
                onClick={handleSubmit} disabled={submitting} sx={{ borderRadius: 99 }}>
                {submitting ? "Saving..." : "Save Project"}
              </Button>
            </Stack>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>

              {/* ── Left Column ── */}
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>

                  {/* Basic Info */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Project Information</Typography>
                      <Grid2 container spacing={2.5}>
                        <Grid2 size={{ xs: 12 }}>
                          <TextField fullWidth label="Project Name" name="name" value={formData.name}
                            onChange={handleChange} error={!!errors.name} helperText={errors.name} required />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <TextField fullWidth multiline minRows={4} label="Overview / Description" name="description"
                            value={formData.description} onChange={handleChange}
                            placeholder="Describe the project, its vision, and key highlights..." />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Location" name="location" value={formData.location}
                            onChange={handleChange} error={!!errors.location} helperText={errors.location}
                            required placeholder="Magawish, Hurghada" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth>
                            <InputLabel>{t("dashboard.addProperty.district", "District")}</InputLabel>
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
                                ...DISTRICTS.filter((d) => d.group === group.key).map((district) => (
                                  <MenuItem key={district.key} value={district.key} sx={{ pl: 3 }}>
                                    {t(district.translationKey)}
                                  </MenuItem>
                                )),
                              ])}
                            </Select>
                            <FormHelperText>
                              {t("dashboard.addProperty.projectDistrictHelp", "Used to match this project to the area filters on the Projects page")}
                            </FormHelperText>
                          </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Delivery Date" name="delivery_date"
                            value={formData.delivery_date} onChange={handleChange} placeholder="December 2027" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth type="number" label="Total Units" name="total_units"
                            value={formData.total_units} onChange={handleChange} inputProps={{ min: 0 }} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                              {statusOptions.map((s) => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </MotionCard>

                  {/* Pricing */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Pricing & Size</Typography>
                      <Grid2 container spacing={2.5}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <FormControl fullWidth>
                            <InputLabel>Currency</InputLabel>
                            <Select name="currency" value={formData.currency} onChange={handleChange} label="Currency">
                              {currencies.map((c) => (
                                <MenuItem key={c.code} value={c.code}>{c.symbol} {c.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 8 }}>
                          <TextField fullWidth type="number" label="Starting Price" name="starting_price"
                            value={formData.starting_price} onChange={handleChange} inputProps={{ min: 0 }} placeholder="35000" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth type="number" label="Size From (m²)" name="size_from"
                            value={formData.size_from} onChange={handleChange} inputProps={{ min: 0 }} placeholder="37" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth type="number" label="Size To (m²)" name="size_to"
                            value={formData.size_to} onChange={handleChange} inputProps={{ min: 0 }} placeholder="217" />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </MotionCard>

                  {/* Structured Content Sections */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Project Content Sections</Typography>
                      <Stack spacing={3}>

                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                            📋 Project Details
                          </Typography>
                          {sectionField("Project Details", "project_details", 4,
                            "Aurora Palace – Magawish is more than a residential development...")}
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                            📍 Location Advantage
                          </Typography>
                          {sectionField("Location Advantage – Why this area?", "location_advantage", 4,
                            "Magawish is recognized as one of Hurghada's most established neighborhoods...")}
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                            🏛️ Architectural Vision & Design
                          </Typography>
                          {sectionField("Architectural Vision & Design", "architectural_vision", 4,
                            "Aurora Palace is developed on approximately 6,000 m², including 133 residential units...")}
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                            🌟 Lifestyle & Premium Amenities
                          </Typography>
                          {sectionField("Lifestyle & Premium Amenities", "lifestyle_amenities", 4,
                            "Aurora Palace offers a fully integrated residential experience...")}
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                            💰 Investment Potential
                          </Typography>
                          {sectionField("Investment Potential", "investment_potential", 4,
                            "Magawish holds a premium position in Hurghada's real estate market...")}
                        </Box>

                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Amenities Selector */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                        Amenities & Facilities
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                        Select all amenities available in this project
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                        {ALL_AMENITIES.map(({ key, label, icon: Icon }) => {
                          const selected = selectedAmenities.includes(key);
                          return (
                            <Chip
                              key={key}
                              icon={<Icon sx={{ fontSize: "18px !important", color: selected ? "white !important" : "text.secondary" }} />}
                              label={label}
                              onClick={() => toggleAmenity(key)}
                              variant={selected ? "filled" : "outlined"}
                              sx={{
                                cursor: "pointer",
                                fontWeight: selected ? 700 : 400,
                                bgcolor: selected ? "primary.main" : "transparent",
                                color: selected ? "white" : "text.primary",
                                borderColor: selected ? "primary.main" : "divider",
                                "& .MuiChip-icon": { color: selected ? "white" : "text.secondary" },
                                "&:hover": {
                                  bgcolor: selected ? "primary.dark" : (theme) => alpha(theme.palette.primary.main, 0.08),
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    </CardContent>
                  </MotionCard>

                  {/* Location Details */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                        📍 Location & Distances
                      </Typography>
                      <Grid2 container spacing={2.5}>
                        <Grid2 size={{ xs: 12 }}>
                          <TextField fullWidth multiline minRows={2} label="Location Description"
                            name="location_description" value={formData.location_description} onChange={handleChange}
                            placeholder="Magawish is one of Hurghada's most prestigious residential areas..." />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth type="number" label="Minutes From Airport" name="mins_from_airport"
                            value={formData.mins_from_airport} onChange={handleChange}
                            InputProps={{ startAdornment: <FlightIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} /> }}
                            placeholder="17" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth type="number" label="Minutes From Hospitals" name="mins_from_hospitals"
                            value={formData.mins_from_hospitals} onChange={handleChange}
                            InputProps={{ startAdornment: <LocalHospitalIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} /> }}
                            placeholder="15" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth type="number" label="Minutes From Downtown" name="mins_from_downtown"
                            value={formData.mins_from_downtown} onChange={handleChange}
                            InputProps={{ startAdornment: <LocationCityIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} /> }}
                            placeholder="20" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth type="number" label="Minutes From Beach" name="mins_from_beach"
                            value={formData.mins_from_beach} onChange={handleChange}
                            InputProps={{ startAdornment: <BeachAccessIcon sx={{ mr: 1, color: "text.secondary", fontSize: 18 }} /> }}
                            placeholder="5" />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <TextField fullWidth label="Google Maps Embed URL (optional)" name="map_embed_url"
                            value={formData.map_embed_url} onChange={handleChange}
                            placeholder="https://www.google.com/maps/embed?pb=..." />
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                          <TextField fullWidth label="Video URL (optional)" name="video_url"
                            value={formData.video_url} onChange={handleChange}
                            placeholder="https://www.youtube.com/watch?v=..."
                            helperText="YouTube, Vimeo, or a direct video file link." />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </MotionCard>

                  {/* Redesigned project details page content */}
                  <MotionCard variants={fadeInUp} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        🏝️ Project Details Page Content
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Optional — powers the redesigned project details page: hero badges, a limited-time offer, residence/investment/lifestyle cards, the payment plan table, the buyer journey, and the project FAQ.
                      </Typography>
                      <Stack spacing={3}>
                        <StringListEditor label="Hero badges (e.g. 'Exclusive Investment Opportunity')" items={badges} onChange={setBadges} />

                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth type="number" label="Limited-time offer discount %" name="offer_discount_percent"
                              value={formData.offer_discount_percent} onChange={handleChange} placeholder="e.g. 2" />
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Offer deadline label" name="offer_deadline_label"
                              value={formData.offer_deadline_label} onChange={handleChange} placeholder="e.g. Until the end of this month" />
                          </Grid2>
                        </Grid2>

                        <ObjectListEditor
                          label="Residence highlight cards"
                          items={residenceHighlights}
                          fields={[
                            { key: "badge", label: "Badge (e.g. 'Smart Look')" },
                            { key: "title", label: "Title" },
                            { key: "description", label: "Description", multiline: true },
                            { key: "cta_label", label: "Button label (e.g. 'Ask for Availability')" },
                          ]}
                          onChange={setResidenceHighlights}
                          template={{ badge: "", title: "", description: "", cta_label: "" }}
                        />

                        <ObjectListEditor
                          label="Investment highlight cards"
                          items={investmentCards}
                          fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                          onChange={setInvestmentCards}
                          template={{ title: "", description: "" }}
                        />

                        <ObjectListEditor
                          label="Lifestyle cards"
                          items={lifestyleCards}
                          fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                          onChange={setLifestyleCards}
                          template={{ title: "", description: "" }}
                        />

                        <ObjectListEditor
                          label="Payment plan rows"
                          items={paymentPlanRows}
                          fields={[
                            { key: "label", label: "Plan label (e.g. 'Flexible Plan')" },
                            { key: "down_percent", label: "Down payment %" },
                            { key: "duration_label", label: "Duration (e.g. '4 years')" },
                            { key: "discount_percent", label: "Discount %" },
                            { key: "best_for", label: "Best for" },
                          ]}
                          onChange={setPaymentPlanRows}
                          template={{ label: "", down_percent: "", duration_label: "", discount_percent: "", best_for: "" }}
                        />

                        <ObjectListEditor
                          label="Buyer journey steps"
                          items={buyerJourneySteps}
                          fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                          onChange={setBuyerJourneySteps}
                          template={{ title: "", description: "" }}
                        />

                        <ObjectListEditor
                          label="Project FAQ"
                          items={projectFaqs}
                          fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", multiline: true }]}
                          onChange={setProjectFaqs}
                          template={{ question: "", answer: "" }}
                        />

                        <Divider sx={{ my: 1 }} />
                        <ObjectListEditor
                          label="Unit types & pricing (drives the unit comparison table)"
                          items={unitTypes}
                          fields={[
                            { key: "type", label: "Unit type (e.g. 'Studio')" },
                            { key: "size_range", label: "Size range (e.g. '30-51 sqm')" },
                            { key: "price_from", label: "Starting price" },
                            { key: "cash_price", label: "Cash price after discount" },
                            { key: "monthly", label: "Monthly installment (x30)" },
                          ]}
                          onChange={setUnitTypes}
                          template={{ type: "", size_range: "", price_from: "", cash_price: "", monthly: "" }}
                        />

                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Construction Progress (optional)</Typography>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, sm: 4 }}>
                            <TextField fullWidth type="number" label="Concrete structure %" value={constructionProgress.concrete}
                              onChange={(e) => setConstructionProgress((prev) => ({ ...prev, concrete: e.target.value }))}
                              inputProps={{ min: 0, max: 100 }} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 4 }}>
                            <TextField fullWidth type="number" label="Brickwork %" value={constructionProgress.brickwork}
                              onChange={(e) => setConstructionProgress((prev) => ({ ...prev, brickwork: e.target.value }))}
                              inputProps={{ min: 0, max: 100 }} />
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 4 }}>
                            <TextField fullWidth type="number" label="Finishing works %" value={constructionProgress.finishing}
                              onChange={(e) => setConstructionProgress((prev) => ({ ...prev, finishing: e.target.value }))}
                              inputProps={{ min: 0, max: 100 }} />
                          </Grid2>
                        </Grid2>

                        <Divider sx={{ my: 1 }} />
                        <ObjectListEditor
                          label="Travel distances (e.g. 'El Gouna' — '5-10 min by car')"
                          items={travelDistances}
                          fields={[{ key: "destination", label: "Destination" }, { key: "time", label: "Travel time" }]}
                          onChange={setTravelDistances}
                          template={{ destination: "", time: "" }}
                        />

                        <Divider sx={{ my: 1 }} />
                        <ObjectListEditor
                          label="Developer track record (other delivered projects)"
                          items={developerTrackRecord}
                          fields={[{ key: "name", label: "Project name" }, { key: "delivered_label", label: "Delivered label (e.g. 'Delivered Dec 2023')" }]}
                          onChange={setDeveloperTrackRecord}
                          template={{ name: "", delivered_label: "" }}
                        />
                      </Stack>
                    </CardContent>
                  </MotionCard>

                </Stack>
              </Grid2>

              {/* ── Right Column ── */}
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Stack spacing={3}>

                  {/* Main Image */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Main Image</Typography>
                      <Stack spacing={2}>
                        {mainImagePreview ? (
                          <Box component="img" src={mainImagePreview} alt="preview"
                            sx={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 2,
                              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}` }} />
                        ) : (
                          <Box sx={{ width: "100%", height: 200, borderRadius: 2,
                            border: (theme) => `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03), gap: 1 }}>
                            <PhotoCameraIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                            <Typography variant="caption" color="text.secondary">No image selected</Typography>
                          </Box>
                        )}
                        <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} fullWidth sx={{ borderRadius: 99 }}>
                          Upload Main Image
                          <input type="file" accept="image/*" hidden onChange={handleMainImage} />
                        </Button>
                        {mainImagePreview && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            sx={{ borderRadius: 99 }}
                            onClick={() => {
                              setMainImageFile(null);
                              setMainImagePreview(null);
                              setRemoveMainImage(true);
                            }}
                          >
                            Remove Main Image
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Gallery */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Gallery Images</Typography>
                      <Stack spacing={2}>
                        {/* Existing gallery */}
                        {existingImages.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                              Existing Images ({existingImages.length})
                            </Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, mb: 1.5 }}>
                              {existingImages.map((img, i) => (
                                <Box key={i}>
                                  <Box sx={{ position: "relative", aspectRatio: "1", borderRadius: 1.5, overflow: "hidden" }}>
                                    <Box component="img" src={img.url} alt={`existing-${i}`}
                                      sx={{ width: "100%", height: "100%", objectFit: "cover",
                                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}` }} />
                                    <Box onClick={() => removeExistingImage(i)}
                                      sx={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%",
                                        bgcolor: "rgba(0,0,0,0.6)", color: "white", display: "flex", alignItems: "center",
                                        justifyContent: "center", cursor: "pointer", fontSize: 12, fontWeight: 700,
                                        "&:hover": { bgcolor: "error.main" } }}>
                                      ×
                                    </Box>
                                  </Box>
                                  <TextField
                                    placeholder="Caption (optional)"
                                    value={img.caption}
                                    onChange={(e) => updateExistingCaption(i, e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{ mt: 0.5, "& .MuiInputBase-input": { fontSize: "0.7rem", py: 0.6 } }}
                                  />
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                        {/* New gallery */}
                        {galleryPreviews.length > 0 && (
                          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
                            {galleryPreviews.map((src, i) => (
                              <Box key={i}>
                                <Box sx={{ position: "relative", aspectRatio: "1", borderRadius: 1.5, overflow: "hidden" }}>
                                  <Box component="img" src={src} alt={`gallery-${i}`}
                                    sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  <Box onClick={() => removeGalleryImage(i)}
                                    sx={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%",
                                      bgcolor: "rgba(0,0,0,0.6)", color: "white", display: "flex", alignItems: "center",
                                      justifyContent: "center", cursor: "pointer", fontSize: 12, fontWeight: 700,
                                      "&:hover": { bgcolor: "error.main" } }}>
                                    ×
                                  </Box>
                                </Box>
                                <TextField
                                  placeholder="Caption (optional)"
                                  value={galleryCaptions[i] || ""}
                                  onChange={(e) => updateGalleryCaption(i, e.target.value)}
                                  size="small"
                                  fullWidth
                                  sx={{ mt: 0.5, "& .MuiInputBase-input": { fontSize: "0.7rem", py: 0.6 } }}
                                />
                              </Box>
                            ))}
                          </Box>
                        )}
                        <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} fullWidth sx={{ borderRadius: 99 }}>
                          Add Gallery Images
                          <input type="file" accept="image/*" multiple hidden onChange={handleGalleryImages} />
                        </Button>
                        <Typography variant="caption" color="text.secondary">JPG, PNG. Max 10MB each.</Typography>
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Master Plan */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.47 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Master Plan (optional)</Typography>
                      <Stack spacing={2}>
                        <Typography variant="caption" color="text.secondary">Ground floor plan</Typography>
                        {groundFloorPreview ? (
                          <Box component="img" src={groundFloorPreview} alt="ground floor preview"
                            sx={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 2,
                              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}` }} />
                        ) : null}
                        <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} fullWidth sx={{ borderRadius: 99 }}>
                          Upload Ground Floor Plan
                          <input type="file" accept="image/*" hidden onChange={handleGroundFloorImage} />
                        </Button>
                        {groundFloorPreview && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            sx={{ borderRadius: 99 }}
                            onClick={() => {
                              setGroundFloorFile(null);
                              setGroundFloorPreview(null);
                              setRemoveGroundFloor(true);
                            }}
                          >
                            Remove Ground Floor Plan
                          </Button>
                        )}

                        <Divider />

                        <Typography variant="caption" color="text.secondary">Typical floors (1-3) plan</Typography>
                        {typicalFloorsPreview ? (
                          <Box component="img" src={typicalFloorsPreview} alt="typical floors preview"
                            sx={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 2,
                              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}` }} />
                        ) : null}
                        <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} fullWidth sx={{ borderRadius: 99 }}>
                          Upload Typical Floors Plan
                          <input type="file" accept="image/*" hidden onChange={handleTypicalFloorsImage} />
                        </Button>
                        {typicalFloorsPreview && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            sx={{ borderRadius: 99 }}
                            onClick={() => {
                              setTypicalFloorsFile(null);
                              setTypicalFloorsPreview(null);
                              setRemoveTypicalFloors(true);
                            }}
                          >
                            Remove Typical Floors Plan
                          </Button>
                        )}

                        <TextField fullWidth multiline minRows={2} label="Layout guide note (optional)"
                          value={masterPlanNote} onChange={(e) => setMasterPlanNote(e.target.value)}
                          placeholder="Representative 3D layouts include Studio 35 sqm, One Bedroom 46 sqm..." />
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Settings */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Settings</Typography>
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={<Switch checked={formData.is_featured} onChange={handleChange} name="is_featured" />}
                          label="Featured Project"
                          sx={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", ml: 0, mr: 0 }} />
                        <Divider />
                        <FormControlLabel
                          control={<Switch checked={formData.is_active} onChange={handleChange} name="is_active" />}
                          label="Active"
                          sx={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", ml: 0, mr: 0 }} />
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  <Button variant="contained" size="large" fullWidth startIcon={<SaveIcon />}
                    onClick={handleSubmit} disabled={submitting}
                    sx={{ py: 1.75, borderRadius: 99, fontWeight: 700 }}>
                    {submitting ? "Saving..." : "Save Project"}
                  </Button>

                </Stack>
              </Grid2>
            </Grid2>
          </form>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default EditProjectView;
