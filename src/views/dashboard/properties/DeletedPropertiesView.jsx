import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Stack,
  Button,
  IconButton,
  alpha,
  Chip,
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
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  fetchDeletedProperties,
  restoreProperty,
  forceDeleteProperty,
} from "../../../api/properties";

const DeletedPropertiesView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState("restore"); // "restore" | "delete"
  const [targetProperty, setTargetProperty] = useState(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchDeletedProperties();
        setProperties(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            type: p.property_type,
            dealType: p.deal_type,
            price: p.price,
            location: p.location,
            deletedAt: p.deleted_at,
          }))
        );
      } catch {
        setError(
          t(
            "dashboard.deletedProperties.loadError",
            "Failed to load deleted properties. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(properties.map((p) => p.id));
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

  const openConfirm = (mode, property) => {
    setConfirmMode(mode);
    setTargetProperty(property);
    setConfirmDialogOpen(true);
  };

  const closeConfirm = () => {
    if (working) return;
    setConfirmDialogOpen(false);
    setTargetProperty(null);
  };

  const handleConfirm = async () => {
    if (!targetProperty) return;
    try {
      setWorking(true);
      if (confirmMode === "restore") {
        await restoreProperty(targetProperty.id);
        setProperties((prev) => prev.filter((p) => p.id !== targetProperty.id));
        setSelected((prev) => prev.filter((id) => id !== targetProperty.id));
      } else {
        await forceDeleteProperty(targetProperty.id);
        setProperties((prev) => prev.filter((p) => p.id !== targetProperty.id));
        setSelected((prev) => prev.filter((id) => id !== targetProperty.id));
      }
    } finally {
      setWorking(false);
      closeConfirm();
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
                {t("dashboard.menu.deletedProperties", "Deleted properties")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t(
                  "dashboard.deletedProperties.subtitle",
                  "View, restore or permanently remove deleted properties."
                )}
              </Typography>
            </Box>
          </Box>

          {/* Table */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
                          selected.length < properties.length
                        }
                        checked={
                          properties.length > 0 &&
                          selected.length === properties.length
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
                        {t("dashboard.propertiesList.location")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t(
                          "dashboard.deletedProperties.deletedAt",
                          "Deleted at"
                        )}
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
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2">
                          {t(
                            "dashboard.deletedProperties.loading",
                            "Loading deleted properties..."
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    !error &&
                    properties.map((property) => {
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
                              <Box
                                sx={{
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.15),
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <HomeWorkIcon
                                  sx={{ fontSize: 22, color: "primary.main" }}
                                />
                              </Box>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {property.title}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.type || "-"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
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
                            <Typography variant="body2" color="text.secondary">
                              {property.deletedAt
                                ? new Date(property.deletedAt).toLocaleString()
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openConfirm("restore", property)}
                              >
                                <RestoreIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openConfirm("delete", property)}
                              >
                                <DeleteForeverIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionCard>
        </MotionStack>
      </Container>

      {/* Confirm dialog */}
      <Dialog open={confirmDialogOpen} onClose={closeConfirm}>
        <DialogTitle>
          {confirmMode === "restore"
            ? t(
                "dashboard.deletedProperties.confirmRestoreTitle",
                "Restore property?"
              )
            : t(
                "dashboard.deletedProperties.confirmDeleteTitle",
                "Delete property permanently?"
              )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmMode === "restore"
              ? t(
                  "dashboard.deletedProperties.confirmRestoreMessage",
                  "This property will be restored and will appear again in your properties list."
                )
              : t(
                  "dashboard.deletedProperties.confirmDeleteMessage",
                  "This action will permanently delete the property from the database and cannot be undone."
                )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} disabled={working}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            color={confirmMode === "restore" ? "primary" : "error"}
            onClick={handleConfirm}
            disabled={working}
          >
            {confirmMode === "restore"
              ? t("dashboard.deletedProperties.restore", "Restore")
              : t("dashboard.deletedProperties.deleteForever", "Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
};

export default DeletedPropertiesView;
