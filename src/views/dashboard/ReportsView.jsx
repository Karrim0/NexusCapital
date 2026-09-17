import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Grid2,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  Chip,
  LinearProgress,
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
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";

const ReportsView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isRTL = settings.direction === "rtl";
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("month");

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
                  "dashboard.forbidden.reportsTitle",
                  "You are not allowed to manage reports."
                )}
              </Typography>
              <Typography color="text.secondary">
                {t(
                  "dashboard.forbidden.reportsMessage",
                  "Only admins can access and configure global reports."
                )}
              </Typography>
            </CardContent>
          </MotionCard>
        </Container>
      </MotionBox>
    );
  }

  const reportTypes = [
    {
      value: "sales",
      label: t("dashboard.reports.salesReport") || "Sales Report",
    },
    {
      value: "properties",
      label: t("dashboard.reports.propertiesReport") || "Properties Report",
    },
    {
      value: "clients",
      label: t("dashboard.reports.clientsReport") || "Clients Report",
    },
    {
      value: "agents",
      label: t("dashboard.reports.agentsReport") || "Agents Report",
    },
  ];

  const dateRanges = [
    { value: "week", label: t("dashboard.reports.lastWeek") || "Last Week" },
    { value: "month", label: t("dashboard.reports.lastMonth") || "Last Month" },
    {
      value: "quarter",
      label: t("dashboard.reports.lastQuarter") || "Last Quarter",
    },
    { value: "year", label: t("dashboard.reports.lastYear") || "Last Year" },
  ];

  const statsCards = [
    {
      title: t("dashboard.reports.totalRevenue") || "Total Revenue",
      value: "$2,450,000",
      change: "+12.5%",
      trend: "up",
      icon: <AttachMoneyIcon />,
      color: "primary",
    },
    {
      title: t("dashboard.reports.propertiesSold") || "Properties Sold",
      value: "124",
      change: "+8.2%",
      trend: "up",
      icon: <HomeWorkIcon />,
      color: "success",
    },
    {
      title: t("dashboard.reports.newClients") || "New Clients",
      value: "58",
      change: "-3.1%",
      trend: "down",
      icon: <PeopleIcon />,
      color: "warning",
    },
    {
      title: t("dashboard.reports.activeAgents") || "Active Agents",
      value: "24",
      change: "+5.0%",
      trend: "up",
      icon: <PersonIcon />,
      color: "info",
    },
  ];

  const reportData = [
    {
      category: t("dashboard.reports.luxuryProperties") || "Luxury Properties",
      value: 45,
      amount: "$1,200,000",
      percentage: 48.9,
    },
    {
      category:
        t("dashboard.reports.commercialProperties") || "Commercial Properties",
      value: 32,
      amount: "$850,000",
      percentage: 34.7,
    },
    {
      category:
        t("dashboard.reports.residentialProperties") ||
        "Residential Properties",
      value: 47,
      amount: "$400,000",
      percentage: 16.4,
    },
  ];

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
                {t("dashboard.menu.reports") || "Reports"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.reports.subtitle") ||
                  "View and analyze your business reports"}
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
                {t("dashboard.reports.export") || "Export"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                sx={{
                  textTransform: "none",
                  px: 3,
                }}
              >
                {t("dashboard.reports.print") || "Print"}
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
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>
                    {t("dashboard.reports.reportType") || "Report Type"}
                  </InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label={t("dashboard.reports.reportType") || "Report Type"}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>
                    {t("dashboard.reports.dateRange") || "Date Range"}
                  </InputLabel>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    label={t("dashboard.reports.dateRange") || "Date Range"}
                  >
                    {dateRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    px: 3,
                    boxShadow: (theme) =>
                      `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {t("dashboard.reports.generate") || "Generate Report"}
                </Button>
              </Stack>
            </CardContent>
          </MotionCard>

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
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: (theme) =>
                              alpha(theme.palette[stat.color].main, 0.1),
                            color: `${stat.color}.main`,
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Chip
                          label={stat.change}
                          size="small"
                          color={stat.trend === "up" ? "success" : "error"}
                          icon={
                            stat.trend === "up" ? (
                              <TrendingUpIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <TrendingDownIcon sx={{ fontSize: 16 }} />
                            )
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
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

          {/* Report Details */}
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 8 }}>
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
                    {t("dashboard.reports.detailedBreakdown") ||
                      "Detailed Breakdown"}
                  </Typography>
                  <Stack spacing={3}>
                    {reportData.map((item, index) => (
                      <Box key={index}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            mb: 1,
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {item.category}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {item.value}{" "}
                              {t("dashboard.reports.properties") ||
                                "properties"}
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={700}
                              color="primary.main"
                            >
                              {item.amount}
                            </Typography>
                          </Stack>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.1),
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 1,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            display: "block",
                            textAlign: isRTL ? "right" : "left",
                          }}
                        >
                          {item.percentage}%
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 1,
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        textAlign: "center",
                      }}
                    >
                      <AssessmentIcon
                        sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                      />
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ mb: 0.5 }}
                      >
                        {t("dashboard.reports.totalSales") || "Total Sales"}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="primary.main"
                      >
                        $2,450,000
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {t("dashboard.reports.lastMonth") || "Last Month"}
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {t("dashboard.reports.propertiesSold") ||
                            "Properties Sold"}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          124
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {t("dashboard.reports.averagePrice") ||
                            "Average Price"}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          $19,758
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {t("dashboard.reports.commission") || "Commission"}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          $85,750
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>
          </Grid2>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default ReportsView;
