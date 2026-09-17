import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
  Tooltip,
  alpha,
  CircularProgress,
  Alert,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Grid2,
  Collapse,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { DISTRICT_GROUPS, DISTRICTS } from "../../constants/hurghadaDistricts";

const propertyTypes = [
  { value: "allTypes", key: "allTypes" },
  { value: "Apartment", key: "apartment" },
  { value: "Villa", key: "villa" },
  { value: "Penthouse", key: "penthouse" },
  { value: "Townhouse", key: "townhouse" },
  { value: "Studio", key: "studio" },
  { value: "Duplex", key: "duplex" },
  { value: "Office", key: "office" },
  { value: "Retail", key: "retail" },
];

// Districts list - same as in dashboard
const districts = DISTRICTS;

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
];

const listingTypes = [
  { value: "all", label: "All" },
  { value: "primary", label: "Primary" },
  { value: "resale", label: "Resale" },
];

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
];

const FilterBar = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isBuyPage = location.pathname === "/buy";
  const isRentPage = location.pathname === "/rent";
  
  // Initialize state from URL params or defaults
  const [dealType, setDealType] = useState(
    searchParams.get("dealType") || (isBuyPage ? "sale" : isRentPage ? "rent" : "all")
  );
  const [propertyType, setPropertyType] = useState(
    searchParams.get("propertyType") || "allTypes"
  );
  const [district, setDistrict] = useState(
    searchParams.get("district") || ""
  );
  const [bedrooms, setBedrooms] = useState(
    searchParams.get("bedrooms") || ""
  );
  const [listingType, setListingType] = useState(
    searchParams.get("listingType") || "all"
  );
  const [area, setArea] = useState(
    searchParams.get("area") || ""
  );
  const [priceFrom, setPriceFrom] = useState(
    searchParams.get("priceFrom") || ""
  );
  const [priceTo, setPriceTo] = useState(
    searchParams.get("priceTo") || ""
  );
  const [currency, setCurrency] = useState(
    searchParams.get("currency") || "USD"
  );
  const [selectedFeatures, setSelectedFeatures] = useState(
    searchParams.get("features") ? searchParams.get("features").split(",") : []
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const navigate = useNavigate();

  // Update filters when URL params change (e.g., browser back/forward)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setDealType(
      params.get("dealType") || (isBuyPage ? "sale" : isRentPage ? "rent" : "all")
    );
    setPropertyType(params.get("propertyType") || "allTypes");
    setDistrict(params.get("district") || "");
    setBedrooms(params.get("bedrooms") || "");
    setListingType(params.get("listingType") || "all");
    setArea(params.get("area") || "");
    setPriceFrom(params.get("priceFrom") || "");
    setPriceTo(params.get("priceTo") || "");
    setCurrency(params.get("currency") || "USD");
    setSelectedFeatures(
      params.get("features") ? params.get("features").split(",") : []
    );
  }, [location.search, isBuyPage, isRentPage]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const dealTypeActive = isBuyPage
      ? false // Buy page always has sale, so don't count it
      : isRentPage
      ? false // Rent page always has rent, so don't count it
      : dealType !== "all";

    return (
      dealTypeActive ||
      propertyType !== "allTypes" ||
      district !== "" ||
      bedrooms !== "" ||
      listingType !== "all" ||
      area !== "" ||
      priceFrom !== "" ||
      priceTo !== "" ||
      selectedFeatures.length > 0
    );
  }, [
    dealType,
    isBuyPage,
    isRentPage,
    propertyType,
    district,
    bedrooms,
    listingType,
    area,
    priceFrom,
    priceTo,
    selectedFeatures.length,
  ]);

  // Validate price range
  const validatePriceRange = useCallback(() => {
    if (priceFrom && priceTo) {
      const from = parseFloat(priceFrom);
      const to = parseFloat(priceTo);
      if (from >= to) {
        setError(t("filters.invalidBudgetRange"));
        return false;
      }
    }
    setError("");
    return true;
  }, [priceFrom, priceTo, t]);

  const handleDealTypeChange = (_event, value) => {
    if (value !== null) {
      if (value === "project") {
        navigate("/projects");
        return;
      }
      setDealType(value);
      setError("");
    }
  };

  const handlePropertyTypeChange = (event) => {
    setPropertyType(event.target.value);
    setError("");
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
    setError("");
  };

  const handleBedroomsChange = (event) => {
    setBedrooms(event.target.value);
    setError("");
  };

  const handleListingTypeChange = (event) => {
    setListingType(event.target.value);
    setError("");
  };

  const handleAreaChange = (event) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      setArea(value);
      setError("");
    }
  };

  const handlePriceFromChange = (event) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      setPriceFrom(value);
      setError("");
    }
  };

  const handlePriceToChange = (event) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      setPriceTo(value);
      setError("");
    }
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleFeatureToggle = (featureKey) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureKey)
        ? prev.filter((f) => f !== featureKey)
        : [...prev, featureKey]
    );
  };

  const handleClearFilters = () => {
    setDealType(isBuyPage ? "sale" : isRentPage ? "rent" : "all");
    setPropertyType("allTypes");
    setDistrict("");
    setBedrooms("");
    setListingType("all");
    setArea("");
    setPriceFrom("");
    setPriceTo("");
    setCurrency("USD");
    setSelectedFeatures([]);
    setError("");
  };

  const handleSearch = async () => {
    // Validate price range
    if (!validatePriceRange()) {
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      // Build search parameters
      const searchParams = new URLSearchParams();

      // Only add dealType if not on Buy/Rent pages (it's fixed there)
      if (!isBuyPage && !isRentPage && dealType !== "all") {
        searchParams.append("dealType", dealType);
      }
      // For Buy/Rent pages, set dealType in URL but don't show filter
      if (isBuyPage) {
        searchParams.append("dealType", "sale");
      } else if (isRentPage) {
        searchParams.append("dealType", "rent");
      }
      if (propertyType !== "allTypes") {
        searchParams.append("propertyType", propertyType);
      }
      if (district) {
        searchParams.append("district", district);
      }
      if (bedrooms) {
        searchParams.append("bedrooms", bedrooms.toString());
      }
      if (listingType !== "all" && isBuyPage) {
        searchParams.append("listingType", listingType);
      }
      if (area) {
        searchParams.append("area", area);
      }
      if (priceFrom) {
        searchParams.append("priceFrom", priceFrom);
      }
      if (priceTo) {
        searchParams.append("priceTo", priceTo);
      }
      if (currency) {
        searchParams.append("currency", currency);
      }
      if (selectedFeatures.length > 0) {
        searchParams.append("features", selectedFeatures.join(","));
      }

      // Navigate to properties page with filters
      const queryString = searchParams.toString();
      const targetPath =
        dealType === "rent"
          ? "/rent"
          : dealType === "sale"
          ? "/buy"
          : "/properties";

      navigate(`${targetPath}${queryString ? `?${queryString}` : ""}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Paper
      elevation={12}
      sx={{
        p: { xs: 2.75, md: 3.5 },
        borderRadius: 3,
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        backdropFilter: "blur(18px)",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.85)
            : alpha(theme.palette.background.paper, 0.95),
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
            : "0 8px 32px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 12px 40px rgba(0, 0, 0, 0.5)"
              : "0 12px 40px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Stack spacing={3}>
        {/* Deal Type buttons */}
        {/* Deal Type Filter - Only show on All Properties and Home pages */}
        {!isBuyPage && !isRentPage && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                mb: 1.5,
                display: "block",
                letterSpacing: "0.12em",
                fontWeight: 600,
                color: "#6b6558",
              }}
            >
              {t("filters.dealType")}
            </Typography>
            <ToggleButtonGroup
              value={dealType}
              exclusive
              onChange={handleDealTypeChange}
              fullWidth
              sx={{
                borderRadius: 999,
                p: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.default, 0.5)
                    : alpha("#c9a24b", 0.05),
                "& .MuiToggleButton-root": {
                  flex: 1,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  fontSize: "0.9rem",
                  border: "none",
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    bgcolor: "#c9a24b",
                    color: "#171208",
                    boxShadow: (theme) =>
                      `0 4px 12px ${alpha("#c9a24b", 0.4)}`,
                    "&:hover": {
                      bgcolor: "#a9822f",
                      transform: "translateY(-1px)",
                    },
                  },
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? alpha("#c9a24b", 0.2)
                        : alpha("#c9a24b", 0.1),
                    transform: "translateY(-1px)",
                  },
                },
              }}
            >
              <ToggleButton value="all">{t("filters.all")}</ToggleButton>
              <ToggleButton value="rent">{t("filters.forRent")}</ToggleButton>
              <ToggleButton value="sale">{t("filters.forSale")}</ToggleButton>
              <ToggleButton value="project">{t("nav.projects", "Projects")}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Main Filters Grid */}
        <Grid2 container spacing={2}>
          {/* Property Type */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>{t("filters.propertyType")}</InputLabel>
              <Select
                label={t("filters.propertyType")}
                value={propertyType}
                onChange={handlePropertyTypeChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": { color: "#191510", fontWeight: 600 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    transition: "all 0.2s ease",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#c9a24b",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                  },
                }}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <HomeRoundedIcon
                        sx={{
                          fontSize: "1.1rem",
                          color: "#6b6558",
                        }}
                      />
                      {t(`filters.propertyTypes.${type.key}`)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          {/* District */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>
                {t("dashboard.addProperty.district", "District")}
              </InputLabel>
              <Select
                label={t("dashboard.addProperty.district", "District")}
                value={district}
                onChange={handleDistrictChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": { color: "#191510", fontWeight: 600 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    transition: "all 0.2s ease",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#c9a24b",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="">
                  <em>{t("common.notSpecified", "Not Specified")}</em>
                </MenuItem>
                {DISTRICT_GROUPS.map((group) => [
                  <MenuItem key={`group-${group.key}`} disabled sx={{ fontWeight: 700, opacity: 0.7, mt: 1 }}>
                    {t(group.translationKey)}
                  </MenuItem>,
                  ...districts
                    .filter((d) => d.group === group.key)
                    .map((district) => (
                      <MenuItem key={district.key} value={district.key} sx={{ pl: 3 }}>
                        {t(district.translationKey)}
                      </MenuItem>
                    )),
                ])}
              </Select>
            </FormControl>
          </Grid2>

          {/* Bedrooms */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>
                {t("propertyDetails.bedrooms", "Bedrooms")}
              </InputLabel>
              <Select
                label={t("propertyDetails.bedrooms", "Bedrooms")}
                value={bedrooms}
                onChange={handleBedroomsChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": { color: "#191510", fontWeight: 600 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    transition: "all 0.2s ease",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#c9a24b",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="">
                  <em>{t("common.notSpecified", "Not Specified")}</em>
                </MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <MenuItem key={num} value={num.toString()}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          {/* Currency */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>
                {t("dashboard.addProperty.currency", "Currency")}
              </InputLabel>
              <Select
                label={t("dashboard.addProperty.currency", "Currency")}
                value={currency}
                onChange={handleCurrencyChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiSelect-select": { color: "#191510", fontWeight: 600 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    transition: "all 0.2s ease",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#c9a24b",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderWidth: 2,
                  },
                }}
              >
                {currencies.map((curr) => (
                  <MenuItem key={curr.code} value={curr.code}>
                    {curr.symbol} - {curr.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          {/* Price From */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              type="number"
              fullWidth
              label={t("filters.from", "From")}
              value={priceFrom}
              onChange={handlePriceFromChange}
              onBlur={validatePriceRange}
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      mr: 1,
                      color: "#6b6558",
                      fontWeight: 600,
                    }}
                  >
                    {currencies.find((c) => c.code === currency)?.symbol || "$"}
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#c9a24b",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Grid2>

          {/* Price To */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              type="number"
              fullWidth
              label={t("filters.to", "To")}
              value={priceTo}
              onChange={handlePriceToChange}
              onBlur={validatePriceRange}
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      mr: 1,
                      color: "#6b6558",
                      fontWeight: 600,
                    }}
                  >
                    {currencies.find((c) => c.code === currency)?.symbol || "$"}
                  </Box>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#c9a24b",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </Grid2>

          {/* Listing Type - Only for Buy page */}
          {isBuyPage && (
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>
                  {t("dashboard.addProperty.listingType", "Listing Type")}
                </InputLabel>
                <Select
                  label={t("dashboard.addProperty.listingType", "Listing Type")}
                  value={listingType}
                  onChange={handleListingTypeChange}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      transition: "all 0.2s ease",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#c9a24b",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                    },
                  }}
                >
                  {listingTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {t(
                        `dashboard.addProperty.listingTypes.${type.value}`,
                        type.label
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          )}
        </Grid2>

        {/* Advanced Filters Toggle */}
        <Box>
          <Button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            endIcon={
              showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }
            sx={{
              textTransform: "none",
              color: "#6b6558",
              fontWeight: 600,
            }}
          >
            {t("filters.advancedFilters", "Advanced Filters")}
          </Button>
        </Box>

        {/* Advanced Filters */}
        <Collapse in={showAdvancedFilters}>
          <Stack spacing={2}>
            <Grid2 container spacing={2}>
              {/* Area */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("dashboard.addProperty.area", "Area (m²)")}
                  placeholder={t("dashboard.addProperty.area", "Area (m²)")}
                  type="number"
                  fullWidth
                  value={area}
                  onChange={handleAreaChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#c9a24b",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                />
              </Grid2>
            </Grid2>

            {/* Features */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: "#191510",
                }}
              >
                {t("dashboard.addProperty.features", "Features")}
              </Typography>
              <FormGroup>
                <Grid2 container spacing={1}>
                  {availableFeatures.map((feature) => (
                    <Grid2 key={feature.key} size={{ xs: 12, sm: 6, md: 4 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedFeatures.includes(feature.key)}
                            onChange={() => handleFeatureToggle(feature.key)}
                            name={feature.key}
                          />
                        }
                        label={t(feature.translationKey)}
                      />
                    </Grid2>
                  ))}
                </Grid2>
              </FormGroup>
            </Box>
          </Stack>
        </Collapse>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          {hasActiveFilters && (
            <Tooltip title={t("filters.clearFilters")}>
              <IconButton
                onClick={handleClearFilters}
                sx={{
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.error.main, 0.1)
                      : alpha(theme.palette.error.main, 0.05),
                  color: "error.main",
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.error.main, 0.2)
                        : alpha(theme.palette.error.main, 0.1),
                  },
                  transition: "all 0.2s ease",
                }}
                aria-label={t("filters.clearFilters")}
              >
                <ClearRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          <Button
            variant="contained"
            size="large"
            startIcon={
              isSearching ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SearchRoundedIcon />
              )
            }
            onClick={handleSearch}
            disabled={isSearching}
            sx={{
              flex: 1,
              px: { xs: 3, md: 4 },
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              bgcolor: "#c9a24b",
              color: "#171208",
              boxShadow: `0 4px 16px ${alpha("#c9a24b", 0.3)}`,
              "&:hover": {
                bgcolor: "#e3c583",
                boxShadow: `0 6px 20px ${alpha("#c9a24b", 0.4)}`,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
              minHeight: 48,
            }}
          >
            {isSearching ? t("filters.searching") : t("filters.explore")}
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              borderRadius: 2,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            {error}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default FilterBar;
