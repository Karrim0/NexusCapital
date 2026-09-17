import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Grid2,
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
import { useCustomizer } from "../../context/CustomizerContext";
import { useAuth } from "../../context/AuthContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../components/common/MotionComponents";
import { fadeInUp } from "../../components/common/motionVariants";
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
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const PaymentsView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isRTL = settings.direction === "rtl";
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [_selectedPayment, setSelectedPayment] = useState(null);

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
                  "dashboard.forbidden.paymentsTitle",
                  "You are not allowed to view payments."
                )}
              </Typography>
              <Typography color="text.secondary">
                {t(
                  "dashboard.forbidden.paymentsMessage",
                  "Only admins can access the payments section."
                )}
              </Typography>
            </CardContent>
          </MotionCard>
        </Container>
      </MotionBox>
    );
  }

  const payments = [
    {
      id: 1,
      transactionId: "TXN-2024-001",
      clientName: "Ahmed Ali",
      amount: "$450,000",
      paymentMethod: "Bank Transfer",
      status: "Completed",
      date: "2024-01-15",
      property: "Luxury Villa in Dubai Marina",
    },
    {
      id: 2,
      transactionId: "TXN-2024-002",
      clientName: "Sarah Johnson",
      amount: "$250,000",
      paymentMethod: "Credit Card",
      status: "Pending",
      date: "2024-01-20",
      property: "Modern Apartment in Downtown",
    },
    {
      id: 3,
      transactionId: "TXN-2024-003",
      clientName: "Mohamed Hassan",
      amount: "$320,000",
      paymentMethod: "Bank Transfer",
      status: "Completed",
      date: "2024-02-01",
      property: "Penthouse with Sea View",
    },
    {
      id: 4,
      transactionId: "TXN-2024-004",
      clientName: "Emily Brown",
      amount: "$180,000",
      paymentMethod: "Credit Card",
      status: "Failed",
      date: "2024-02-10",
      property: "Townhouse in New Cairo",
    },
    {
      id: 5,
      transactionId: "TXN-2024-005",
      clientName: "Omar Khalil",
      amount: "$520,000",
      paymentMethod: "Bank Transfer",
      status: "Completed",
      date: "2024-02-15",
      property: "Luxury Villa in Dubai Marina",
    },
  ];

  const statsCards = [
    {
      title: t("dashboard.payments.totalRevenue") || "Total Revenue",
      value: "$1,720,000",
      icon: <AttachMoneyIcon />,
      color: "primary",
    },
    {
      title: t("dashboard.payments.completed") || "Completed",
      value: "3",
      icon: <ReceiptIcon />,
      color: "success",
    },
    {
      title: t("dashboard.payments.pending") || "Pending",
      value: "1",
      icon: <CreditCardIcon />,
      color: "warning",
    },
    {
      title: t("dashboard.payments.failed") || "Failed",
      value: "1",
      icon: <AccountBalanceIcon />,
      color: "error",
    },
  ];

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(payments.map((p) => p.id));
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

  const handleMenuClick = (event, payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentMethodIcon = (method) => {
    if (method === "Credit Card") {
      return <CreditCardIcon sx={{ fontSize: 16 }} />;
    }
    return <AccountBalanceIcon sx={{ fontSize: 16 }} />;
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
                {t("dashboard.menu.payments") || "Payments"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.payments.subtitle") ||
                  "Manage and track all payment transactions"}
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
                {t("dashboard.payments.export") || "Export"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                {t("dashboard.payments.print") || "Print"}
              </Button>
            </Stack>
          </Box>

          {/* Stats Cards */}
          <Grid2 container spacing={3}>
            {statsCards.map((stat, index) => (
              <Grid2 key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{
                    bgcolor: "background.paper",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 2px 8px rgba(0,0,0,0.2)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: (theme) =>
                            alpha(theme.palette[stat.color].main, 0.1),
                          color: `${stat.color}.main`,
                          width: "fit-content",
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          sx={{ mb: 0.5 }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: isRTL ? "right" : "left" }}
                        >
                          {stat.title}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid2>
            ))}
          </Grid2>

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
                  placeholder={t("dashboard.payments.searchPlaceholder")}
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
                  {t("dashboard.payments.filters")}
                </Button>
              </Stack>
            </CardContent>
          </MotionCard>

          {/* Payments Table */}
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
                          selected.length > 0 && selected.length < payments.length
                        }
                        checked={
                          payments.length > 0 && selected.length === payments.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.transactionId")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.client")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.property")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.amount")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.paymentMethod")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.date")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.status")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.payments.actions")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => {
                    const isSelected = selected.indexOf(payment.id) !== -1;
                    return (
                      <TableRow
                        key={payment.id}
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
                            onChange={() => handleSelect(payment.id)}
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
                              {payment.transactionId}
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
                            <Typography variant="body2">{payment.clientName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {payment.property}
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
                            <AttachMoneyIcon
                              sx={{ fontSize: 16, color: "primary.main" }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {payment.amount}
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
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <Typography variant="body2" color="text.secondary">
                              {payment.paymentMethod}
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
                            <CalendarTodayIcon
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {payment.date}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              payment.status === "Completed"
                                ? t("dashboard.payments.completed")
                                : payment.status === "Pending"
                                ? t("dashboard.payments.pending")
                                : t("dashboard.payments.failed")
                            }
                            size="small"
                            color={getStatusColor(payment.status)}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, payment)}
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
              {t("dashboard.payments.view")}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <DownloadIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.payments.download")}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ReceiptIcon
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0, fontSize: 20 }}
              />
              {t("dashboard.payments.receipt")}
            </MenuItem>
          </Menu>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default PaymentsView;

