import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Stack,
  TextField,
  Button,
  IconButton,
  alpha,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../../context/CustomizerContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from "react-router-dom";
import { deleteProperty, fetchProperties } from "../../../api/properties";

const PropertiesListView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Dashboard scope: admin sees كل العقارات، agent يشوف عقاراته بس
        const data = await fetchProperties(undefined, { scope: "dashboard" });
        setProperties(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            type: p.property_type,
            dealType: p.deal_type,
            price: p.price,
            location: p.location,
            status: p.is_active ? "Active" : "Inactive",
            isSold: !!p.is_sold,
            isRented: !!p.is_rented,
            views: p.views !== undefined && p.views !== null ? Number(p.views) : 0,
            date: new Date(p.created_at).toISOString().slice(0, 10),
          }))
        );
      } catch {
        setError(
          t(
            "dashboard.propertiesList.loadError",
            "Failed to load properties. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [t]);

  // Filter properties based on search query
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) {
      return properties;
    }

    const query = searchQuery.toLowerCase().trim();
    return properties.filter((property) => {
      const title = (property.title || "").toLowerCase();
      const type = (property.type || "").toLowerCase();
      const dealType = (property.dealType || "").toLowerCase();
      const location = (property.location || "").toLowerCase();
      const price = String(property.price || "").toLowerCase();
      const status = (property.status || "").toLowerCase();

      return (
        title.includes(query) ||
        type.includes(query) ||
        dealType.includes(query) ||
        location.includes(query) ||
        price.includes(query) ||
        status.includes(query)
      );
    });
  }, [properties, searchQuery]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredProperties.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleMenuClick = (event, property) => {
    // مهم: فضّي الـ focus من زرار الثلاث نقاط قبل ما نفتح الـ Menu
    // عشان لما MUI يضيف aria-hidden على #root ما يكونش فيه عنصر داخل root عليه focus
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }

    setAnchorEl(event.currentTarget);
    setSelectedProperty(property);
  };

  const handleMenuClose = () => {
    // Blur active element to prevent aria-hidden warning
    if (document.activeElement) {
      document.activeElement.blur();
    }
    setAnchorEl(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Pending":
        return "warning";
      case "Inactive":
        return "default";
      default:
        return "default";
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
                {t("dashboard.menu.propertiesList") || "Properties List"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.propertiesList.subtitle") ||
                  "Manage and view all your properties"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                px: 3,
                boxShadow: (theme) =>
                  `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
              onClick={() => navigate("/dashboard/properties/add")}
            >
              {t("dashboard.propertiesList.addProperty")}
            </Button>
          </Box>

          {/* Filters */}
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
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{
                  flexDirection: {
                    xs: "column",
                    md: isRTL ? "row-reverse" : "row",
                  },
                }}
              >
                <TextField
                  fullWidth
                  placeholder={t("dashboard.propertiesList.searchPlaceholder")}
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    flex: 1,
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  sx={{
                    textTransform: "none",
                    px: 3,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("dashboard.propertiesList.filters")}
                </Button>
              </Stack>
            </CardContent>
          </MotionCard>

          {/* Properties Table */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 20px rgba(0,0,0,0.3)"
                  : "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < filteredProperties.length &&
                          selected.length < properties.length
                        }
                        checked={
                          filteredProperties.length > 0 &&
                          selected.length === filteredProperties.length &&
                          filteredProperties.every((p) =>
                            selected.includes(p.id)
                          )
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.property")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.type")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.dealType")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.price")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.location")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.status")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.views")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.propertiesList.actions")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2">
                          {t(
                            "dashboard.propertiesList.loading",
                            "Loading properties..."
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    !error &&
                    filteredProperties.length === 0 &&
                    searchQuery && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Typography variant="body2" color="text.secondary">
                            {t(
                              "dashboard.propertiesList.noResults",
                              "No properties found matching your search."
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  {!loading &&
                    !error &&
                    filteredProperties.length === 0 &&
                    !searchQuery && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Typography variant="body2" color="text.secondary">
                            {t(
                              "dashboard.propertiesList.noProperties",
                              "No properties available."
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  {!loading &&
                    !error &&
                    filteredProperties.length > 0 &&
                    filteredProperties.map((property) => {
                      const isSelected = selected.indexOf(property.id) !== -1;
                      return (
                        <TableRow
                          key={property.id}
                          hover
                          selected={isSelected}
                          sx={{
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelect(property.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "primary.main",
                                  width: 48,
                                  height: 48,
                                }}
                              >
                                <HomeWorkIcon />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {property.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {property.date}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.type}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              <Chip
                                label={
                                  property.dealType === "For Sale"
                                    ? t("properties.forSale")
                                    : t("properties.forRent")
                                }
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              {property.isSold && (
                                <Chip
                                  label="SOLD"
                                  size="small"
                                  sx={{ bgcolor: "#0a0c10", color: "#f4e2b0", fontWeight: 700 }}
                                />
                              )}
                              {property.isRented && (
                                <Chip
                                  label="RENTED"
                                  size="small"
                                  sx={{ bgcolor: "#0a0c10", color: "#f4e2b0", fontWeight: 700 }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <AttachMoneyIcon
                                sx={{ fontSize: 16, color: "primary.main" }}
                              />
                              <Typography variant="body2" fontWeight={600}>
                                {property.price}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
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
                                variant="body2"
                                color="text.secondary"
                              >
                                {property.location}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                property.status === "Active"
                                  ? t("dashboard.status.active")
                                  : property.status === "Pending"
                                  ? t("dashboard.status.pending")
                                  : t("dashboard.status.inactive", "Inactive")
                              }
                              size="small"
                              color={getStatusColor(property.status)}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                "&:hover": {
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.08),
                                  "& .MuiTypography-root": {
                                    color: "primary.main",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    color: "primary.main",
                                  },
                                },
                              }}
                              onClick={() => {
                                navigate(`/properties/${property.id}`);
                              }}
                            >
                              <VisibilityIcon
                                sx={{
                                  fontSize: 18,
                                  color: "text.secondary",
                                  transition: "color 0.2s ease",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight={600}
                                sx={{
                                  transition: "color 0.2s ease",
                                  minWidth: "40px",
                                  textAlign: isRTL ? "right" : "left",
                                }}
                              >
                                {(() => {
                                  const viewsCount =
                                    typeof property.views === "number"
                                      ? property.views
                                      : typeof property.views === "string"
                                      ? parseInt(property.views, 10) || 0
                                      : 0;
                                  return viewsCount.toLocaleString();
                                })()}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, property)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionCard>

          {/* Actions Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            disableAutoFocusItem
            anchorOrigin={{
              vertical: "bottom",
              horizontal: isRTL ? "left" : "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: isRTL ? "left" : "right",
            }}
            PaperProps={{
              sx: {
                minWidth: 180,
                boxShadow: (theme) =>
                  `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                if (selectedProperty) {
                  navigate(`/dashboard/properties/${selectedProperty.id}/edit`);
                }
              }}
            >
              <EditIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.propertiesList.edit")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                if (selectedProperty) {
                  navigate(`/properties/${selectedProperty.id}`);
                }
              }}
            >
              <VisibilityIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.propertiesList.view")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                // Blur any focused element داخل الجدول قبل فتح الـ Dialog
                if (document && document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
                setDeleteDialogOpen(true);
                handleMenuClose();
              }}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.propertiesList.delete")}
            </MenuItem>
          </Menu>

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => {
              if (deleting) return;
              // تأكد إن ما فيش عنصر عليه focus جوّه عنصر هيبقى aria-hidden
              if (document && document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              setDeleteDialogOpen(false);
            }}
          >
            <DialogTitle>
              {t(
                "dashboard.propertiesList.confirmDeleteTitle",
                "Delete property?"
              )}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t(
                  "dashboard.propertiesList.confirmDeleteMessage",
                  "This will remove the property from your active list and move it to Deleted properties. You can restore it later or delete it permanently."
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                color="error"
                onClick={async () => {
                  if (!selectedProperty) return;
                  try {
                    setDeleting(true);
                    await deleteProperty(selectedProperty.id);
                    setProperties((prev) =>
                      prev.filter((p) => p.id !== selectedProperty.id)
                    );
                    setSelected((prev) =>
                      prev.filter((id) => id !== selectedProperty.id)
                    );
                  } catch (err) {
                    const status = err?.response?.status;
                    if (status === 403) {
                      // ممنوع حذف عقار مش مملوك للـ agent الحالي
                      window.alert(
                        t(
                          "dashboard.propertiesList.deleteForbidden",
                          "You are not allowed to delete this property because it does not belong to you."
                        )
                      );
                    } else {
                      window.alert(
                        t(
                          "dashboard.propertiesList.deleteError",
                          "Unable to delete this property right now. Please try again later."
                        )
                      );
                    }
                  } finally {
                    setDeleting(false);
                    setDeleteDialogOpen(false);
                  }
                }}
                disabled={deleting}
              >
                {t("dashboard.propertiesList.delete", "Delete")}
              </Button>
            </DialogActions>
          </Dialog>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default PropertiesListView;
