import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import { fetchInvoices } from "../../../api/invoices";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const InvoicesView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isRTL = settings.direction === "rtl";
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [_selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
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
        <Container maxWidth="md">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {t(
                  "dashboard.forbidden.invoicesTitle",
                  "You are not allowed to view invoices."
                )}
              </Typography>
              <Typography color="text.secondary">
                {t(
                  "dashboard.forbidden.invoicesMessage",
                  "Only admins can access the invoices section."
                )}
              </Typography>
            </CardContent>
          </MotionCard>
        </Container>
      </MotionBox>
    );
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (err) {
        console.error("Failed to load invoices:", err);
        setError(
          t(
            "dashboard.invoices.error",
            "Unable to load invoices. Please try again later."
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
      setSelected(invoices.map((i) => i.id));
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

  const handleMenuClick = (event, invoice) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "default";
      default:
        return "default";
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      String(inv.id).includes(term) ||
      inv.user?.name?.toLowerCase().includes(term) ||
      inv.property?.title?.toLowerCase().includes(term)
    );
  });

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
                {t("dashboard.menu.invoices") || "Invoices"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.invoices.subtitle") ||
                  "Manage and view all agent invoices"}
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
                startIcon={<DownloadIcon />}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                {t("dashboard.invoices.export") || "Export"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                {t("dashboard.invoices.print") || "Print"}
              </Button>
            </Stack>
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
                  placeholder={t("dashboard.invoices.searchPlaceholder")}
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
                  {t("dashboard.invoices.filters")}
                </Button>
              </Stack>
            </CardContent>
          </MotionCard>

          {/* Invoices Table */}
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
                          selected.length < invoices.length
                        }
                        checked={
                          invoices.length > 0 &&
                          selected.length === invoices.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.invoiceNumber")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.agent")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.amount")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.commission")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.date")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.dueDate")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.status")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.invoices.actions")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => {
                    const isSelected = selected.indexOf(invoice.id) !== -1;
                    return (
                      <TableRow
                        key={invoice.id}
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
                            onChange={() => handleSelect(invoice.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                            }}
                          >
                            <ReceiptIcon
                              sx={{ fontSize: 20, color: "primary.main" }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {invoice.invoiceNumber}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 32,
                                height: 32,
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Typography variant="body2">
                              {invoice.agentName}
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
                            <AttachMoneyIcon
                              sx={{ fontSize: 16, color: "primary.main" }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {invoice.amount}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {invoice.commission}
                          </Typography>
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
                            <CalendarTodayIcon
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {invoice.date}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {invoice.dueDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status}
                            size="small"
                            color={getStatusColor(invoice.status)}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, invoice)}
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
            <MenuItem onClick={handleMenuClose}>
              <VisibilityIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.invoices.view")}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <DownloadIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.invoices.download")}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <PrintIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.invoices.print")}
            </MenuItem>
          </Menu>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default InvoicesView;
