import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Grid2,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
  alpha,
  IconButton,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PendingIcon from "@mui/icons-material/Pending";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../components/common/MotionComponents";
import {
  staggerContainer,
  staggerItem,
  fadeInUp,
} from "../components/common/motionVariants";
import { useCustomizer } from "../context/CustomizerContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  fetchDeletedProperties,
  fetchFavorites,
  fetchProperties,
} from "../api/properties";
import { fetchContactRequests } from "../api/contactRequests";
import { fetchUsers } from "../api/users";

// Simple Progress Ring Component
const ProgressRing = ({
  value,
  size = 80,
  strokeWidth = 8,
  color = "primary",
}) => {
  const theme = useTheme();
  const colorValue = theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={strokeWidth / (size / 2)}
        sx={{
          color: colorValue,
          position: "absolute",
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            fontSize: size * 0.2,
            fontWeight: 700,
            color: colorValue,
          }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data, height = 120, color = "primary" }) => {
  const theme = useTheme();
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const colorValue = theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <Box sx={{ width: "100%", height }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          height: "100%",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <Tooltip key={index} title={`${item.label}: ${item.value}`}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: `${barHeight}%`,
                    bgcolor: colorValue,
                    borderRadius: "4px 4px 0 0",
                    minHeight: barHeight > 0 ? "4px" : 0,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      opacity: 0.8,
                      transform: "scaleY(1.05)",
                    },
                  }}
                />
                {item.label && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      fontSize: "0.65rem",
                      color: "text.secondary",
                      textAlign: "center",
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

const DashboardView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isRTL = settings.direction === "rtl";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [allProperties, setAllProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [agents, setAgents] = useState([]);

  const role = user?.role;
  const isAdmin = role === "admin";
  const isAgent = role === "agent";

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        setLoading(true);
        setStatsError("");

        const requests = [
          fetchProperties(undefined, { scope: "dashboard" }),
          fetchDeletedProperties(),
          fetchFavorites(),
        ];

        // contact requests فقط للـ admin / agent
        if (isAdmin || isAgent) {
          requests.push(fetchContactRequests());
        }

        // fetch agents فقط للـ admin
        if (isAdmin) {
          requests.push(fetchUsers({ role: "agent" }));
        }

        const results = await Promise.allSettled(requests);

        const [propsRes, , favRes, contactRes, agentsRes] = results;

        if (propsRes.status === "fulfilled") {
          setAllProperties(propsRes.value);
        }
        // deleted properties are currently not used in top-level stats
        if (favRes.status === "fulfilled") {
          setFavorites(favRes.value);
        }
        if ((isAdmin || isAgent) && contactRes?.status === "fulfilled") {
          setContactRequests(contactRes.value);
        }
        if (isAdmin && agentsRes?.status === "fulfilled") {
          setAgents(agentsRes.value || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setStatsError(
          t(
            "dashboard.statsError",
            "Unable to load live dashboard stats. Some numbers may be missing."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, isAdmin, isAgent, t]);

  const salesSummary = useMemo(() => {
    const totalActive = allProperties.filter((p) => p.is_active).length;
    const totalInactive = allProperties.filter((p) => !p.is_active).length;
    const totalFavorites = favorites.length;
    const totalContactRequests = contactRequests.length;
    const totalValue = allProperties.reduce(
      (sum, p) => sum + (parseFloat(p.price) || 0),
      0
    );
    const activePercentage =
      allProperties.length > 0
        ? Math.round((totalActive / allProperties.length) * 100)
        : 0;

    // Calculate growth (comparing this month vs last month)
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthProperties = allProperties.filter((p) => {
      const created = new Date(p.created_at);
      return created >= thisMonth;
    }).length;

    const lastMonthProperties = allProperties.filter((p) => {
      const created = new Date(p.created_at);
      return created >= lastMonth && created < thisMonth;
    }).length;

    const growth =
      lastMonthProperties > 0
        ? Math.round(
            ((thisMonthProperties - lastMonthProperties) /
              lastMonthProperties) *
              100
          )
        : thisMonthProperties > 0
        ? 100
        : 0;

    return [
      {
        id: "total",
        label: t("dashboard.sales.totalSales") || "Total Properties",
        value: `${totalActive}`,
        subValue: `${totalInactive} ${t("dashboard.inactive", "Inactive")}`,
        change: growth > 0 ? `+${growth}%` : growth < 0 ? `${growth}%` : "0%",
        trend: growth >= 0 ? "up" : "down",
        color: "primary",
        icon: <HomeWorkIcon />,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        progress: activePercentage,
      },
      {
        id: "properties",
        label: t("dashboard.myProperties") || "My Properties",
        value: `${allProperties.length}`,
        subValue:
          totalValue > 0
            ? `${
                totalValue >= 1000000
                  ? `$${(totalValue / 1000000).toFixed(1)}M`
                  : totalValue >= 1000
                  ? `$${(totalValue / 1000).toFixed(0)}K`
                  : `$${totalValue.toFixed(0)}`
              } ${t("dashboard.totalValue", "Total Value")}`
            : "",
        change: "",
        trend: "up",
        color: "success",
        icon: <BusinessIcon />,
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        progress: 100,
      },
      {
        id: "favorites",
        label: t("dashboard.favorites.subtitle") || "Favorites",
        value: `${totalFavorites}`,
        subValue:
          allProperties.length > 0
            ? `${Math.round(
                (totalFavorites / allProperties.length) * 100
              )}% ${t("dashboard.engagement", "Engagement")}`
            : "",
        change: "",
        trend: "up",
        color: "warning",
        icon: <FavoriteIcon />,
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        progress:
          allProperties.length > 0
            ? Math.min((totalFavorites / allProperties.length) * 100, 100)
            : 0,
      },
      {
        id: "contacts",
        label:
          t("dashboard.contactRequests.title") || "Customer contact requests",
        value: `${totalContactRequests}`,
        subValue:
          totalContactRequests > 0
            ? `${contactRequests.filter((r) => r.status === "new").length} ${t(
                "dashboard.new",
                "New"
              )}`
            : "",
        change: "",
        trend: "up",
        color: "info",
        icon: <PeopleIcon />,
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        progress:
          totalContactRequests > 0
            ? Math.min(
                (contactRequests.filter((r) => r.status === "contacted")
                  .length /
                  totalContactRequests) *
                  100,
                100
              )
            : 0,
      },
    ];
  }, [allProperties, favorites, contactRequests, t]);

  const featuredProperties = useMemo(() => {
    return allProperties
      .sort(
        (a, b) =>
          new Date(b.created_at || b.updated_at) -
          new Date(a.created_at || a.updated_at)
      )
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        name: p.title,
        location: p.location || p.address || "-",
        price: p.price
          ? `${
              p.currency === "EGP"
                ? "E£"
                : p.currency === "EUR"
                ? "€"
                : p.currency === "GBP"
                ? "£"
                : "$"
            }${Number(p.price).toLocaleString()}`
          : "-",
        status: p.is_active ? "active" : "inactive",
        progress: p.is_active ? 100 : 40,
        createdAt: p.created_at,
      }));
  }, [allProperties]);

  // Project Timeline - آخر العقارات المضافة
  const projectTimeline = useMemo(() => {
    const recentProperties = allProperties
      .sort(
        (a, b) =>
          new Date(b.created_at || b.updated_at) -
          new Date(a.created_at || a.updated_at)
      )
      .slice(0, 4);

    return recentProperties.map((property, index) => {
      const date = new Date(property.created_at || property.updated_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: `timeline-${property.id}`,
        title:
          property.title ||
          t("dashboard.timeline.propertyAdded", "Property Added"),
        date: formattedDate,
        status: index === 0 ? "in-progress" : "completed",
        propertyId: property.id,
      };
    });
  }, [allProperties, t]);

  // Last Month Stats - البيانات الحقيقية
  const lastMonthStats = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthProperties = allProperties.filter((p) => {
      const created = new Date(p.created_at);
      return created >= lastMonth && created < thisMonth;
    });

    const thisMonthProperties = allProperties.filter((p) => {
      const created = new Date(p.created_at);
      return created >= thisMonth;
    });

    const lastMonthSales = lastMonthProperties.reduce((sum, p) => {
      return sum + (parseFloat(p.price) || 0);
    }, 0);

    const thisMonthSales = thisMonthProperties.reduce((sum, p) => {
      return sum + (parseFloat(p.price) || 0);
    }, 0);

    const lastMonthRequests = contactRequests.filter((r) => {
      const created = new Date(r.created_at);
      return created >= lastMonth && created < thisMonth;
    });

    const thisMonthRequests = contactRequests.filter((r) => {
      const created = new Date(r.created_at);
      return created >= thisMonth;
    });

    const salesGrowth =
      lastMonthSales > 0
        ? Math.round(((thisMonthSales - lastMonthSales) / lastMonthSales) * 100)
        : thisMonthSales > 0
        ? 100
        : 0;

    const propertiesGrowth =
      lastMonthProperties.length > 0
        ? Math.round(
            ((thisMonthProperties.length - lastMonthProperties.length) /
              lastMonthProperties.length) *
              100
          )
        : thisMonthProperties.length > 0
        ? 100
        : 0;

    const requestsGrowth =
      lastMonthRequests.length > 0
        ? Math.round(
            ((thisMonthRequests.length - lastMonthRequests.length) /
              lastMonthRequests.length) *
              100
          )
        : thisMonthRequests.length > 0
        ? 100
        : 0;

    return [
      {
        label: t("dashboard.lastMonth.sales") || "Sales",
        value:
          lastMonthSales > 0 ? `$${Math.round(lastMonthSales / 1000)}K` : "$0",
        subValue:
          thisMonthSales > 0
            ? `$${Math.round(thisMonthSales / 1000)}K ${t(
                "dashboard.thisMonth",
                "this month"
              )}`
            : "",
        growth: salesGrowth,
        icon: <AttachMoneyIcon />,
        color: "primary",
      },
      {
        label: t("dashboard.lastMonth.properties") || "Properties",
        value: `${lastMonthProperties.length}`,
        subValue: `${thisMonthProperties.length} ${t(
          "dashboard.thisMonth",
          "this month"
        )}`,
        growth: propertiesGrowth,
        icon: <HomeWorkIcon />,
        color: "success",
      },
      {
        label: t("dashboard.lastMonth.requests") || "Contact Requests",
        value: `${lastMonthRequests.length}`,
        subValue: `${thisMonthRequests.length} ${t(
          "dashboard.thisMonth",
          "this month"
        )}`,
        growth: requestsGrowth,
        icon: <PeopleIcon />,
        color: "info",
      },
    ];
  }, [allProperties, contactRequests, t]);

  // Property Types Distribution
  const propertyTypesData = useMemo(() => {
    const types = {};
    allProperties.forEach((p) => {
      const type = p.property_type || "Other";
      types[type] = (types[type] || 0) + 1;
    });

    const sorted = Object.entries(types)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return sorted.map(([label, value]) => ({
      label: label.substring(0, 3),
      value,
    }));
  }, [allProperties]);

  // Agents from API
  const assignees = useMemo(() => {
    const colors = [
      "primary",
      "success",
      "warning",
      "info",
      "error",
      "secondary",
    ];
    return agents.slice(0, 6).map((agent, index) => {
      const nameParts = (agent.name || agent.email || "Agent").split(" ");
      const initials =
        nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : nameParts[0][0].toUpperCase();

      return {
        id: agent.id,
        name: agent.name || agent.email || "Agent",
        roleKey: "agent",
        avatar: initials,
        color: colors[index % colors.length],
        email: agent.email,
      };
    });
  }, [agents]);

  // Recent Contact Requests as Reports
  const reports = useMemo(() => {
    return contactRequests
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((request) => {
        const date = new Date(request.created_at);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        return {
          id: `report-${request.id}`,
          title: request.property_title
            ? `${t("dashboard.reports.propertyRequest", "Property Request")}: ${
                request.property_title
              }`
            : t("dashboard.reports.contactRequest", "Contact Request"),
          date: formattedDate,
          type: "contact",
          requestId: request.id,
        };
      });
  }, [contactRequests, t]);

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
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <MotionStack spacing={{ xs: 3, sm: 3.5, md: 4 }}>
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                gap: 2,
              }}
            >
              <CircularProgress size={48} thickness={4} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {t("common.loading", "Loading dashboard data...")}
              </Typography>
            </Box>
          )}
          {!!statsError && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {statsError}
            </Typography>
          )}
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
              mb: 1,
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
                {t("dashboard.title") || "Dashboard"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.subtitle") || "Welcome To The Admin Dashboard"}
              </Typography>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                flexDirection: isRTL
                  ? { xs: "column-reverse", sm: "row-reverse" }
                  : { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<HomeWorkIcon />}
                fullWidth={isSmallScreen}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: { xs: 2, sm: 2 },
                  py: { xs: 1.25, sm: 1 },
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                  },
                }}
                onClick={() => navigate("/dashboard/properties/list")}
              >
                {t("dashboard.menu.propertiesList") || "Properties List"}
              </Button>
              {isAdmin && (
                <Button
                  variant="outlined"
                  startIcon={<PeopleIcon />}
                  fullWidth={isSmallScreen}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: { xs: 2, sm: 2 },
                    py: { xs: 1.25, sm: 1 },
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.3),
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  onClick={() => navigate("/dashboard/agents/all")}
                >
                  {t("dashboard.menu.agents") || "Agents"}
                </Button>
              )}
              <Button
                variant="contained"
                fullWidth={isSmallScreen}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: { xs: 2, sm: 2 },
                  py: { xs: 1.25, sm: 1 },
                  boxShadow: (theme) =>
                    `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
                onClick={() =>
                  navigate(
                    isAdmin || isAgent
                      ? "/dashboard/properties/requests"
                      : "/dashboard/users/profile"
                  )
                }
              >
                {isAdmin || isAgent
                  ? t("dashboard.contactRequests.title") ||
                    "Customer contact requests"
                  : t("dashboard.menu.profile") || "Profile"}
              </Button>
            </Stack>
          </Box>

          {/* Sales Summary */}
          <MotionBox
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mb: 3,
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "1.15rem", md: "1.3rem" },
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("dashboard.salesSummary") || "Sales Summary"}
              </Typography>
              <Button
                variant="text"
                size="small"
                endIcon={isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {t("dashboard.sales.viewAll", "View all")}
              </Button>
            </Stack>
            <Grid2 container spacing={{ xs: 2, sm: 2, md: 2 }}>
              {salesSummary.map((item, index) => (
                <Grid2 key={item.id} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                  <MotionCard
                    variants={staggerItem}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      boxShadow: { duration: 0 }, // Disable boxShadow animation
                    }}
                    sx={{
                      height: "100%",
                      bgcolor: "background.paper",
                      border: (theme) =>
                        `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 1,
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "0 4px 20px rgba(0,0,0,0.3)"
                          : "0 4px 20px rgba(0,0,0,0.08)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: item.gradient,
                        opacity: 0.8,
                      },
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow: (theme) =>
                          `0 20px 60px ${alpha(
                            theme.palette.primary.main,
                            0.25
                          )}`,
                        "&::before": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2.5, sm: 3, md: 3.5 },
                        pt: { xs: 3.5, sm: 4, md: 4.5 },
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Stack spacing={{ xs: 2, sm: 2.5 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.8rem",
                                mb: 0.75,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="h3"
                              fontWeight={800}
                              sx={{
                                fontSize: {
                                  xs: "1.75rem",
                                  sm: "2rem",
                                  md: "2.5rem",
                                  lg: "2.75rem",
                                },
                                mb: 0.5,
                                background: (theme) =>
                                  `linear-gradient(135deg, ${
                                    theme.palette.text.primary
                                  }, ${theme.palette[item.color].main})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                lineHeight: 1.2,
                              }}
                            >
                              {item.value}
                            </Typography>
                            {item.subValue && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: "0.75rem",
                                  fontWeight: 500,
                                  opacity: 0.8,
                                }}
                              >
                                {item.subValue}
                              </Typography>
                            )}
                          </Box>
                          <Box
                            sx={{
                              p: { xs: 1.25, sm: 1.5 },
                              borderRadius: 2.5,
                              background: item.gradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              boxShadow: `0 8px 24px ${alpha("#000", 0.25)}`,
                              minWidth: { xs: 48, sm: 56 },
                              minHeight: { xs: 48, sm: 56 },
                            }}
                          >
                            {item.icon}
                          </Box>
                        </Stack>

                        {/* Progress Ring */}
                        {item.progress !== undefined && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              py: 1,
                              transform: {
                                xs: "scale(0.72)",
                                sm: "scale(0.85)",
                                md: "scale(0.95)",
                                lg: "scale(1)",
                              },
                              transformOrigin: "center",
                            }}
                          >
                            <ProgressRing
                              value={item.progress}
                              size={80}
                              strokeWidth={8}
                              color={item.color}
                            />
                          </Box>
                        )}

                        <Divider sx={{ my: 0.5, opacity: 0.5 }} />

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                            }}
                          >
                            {item.trend === "up" ? (
                              <TrendingUpIcon
                                sx={{
                                  fontSize: 18,
                                  color: "success.main",
                                  p: 0.5,
                                  borderRadius: 1,
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.success.main, 0.15),
                                }}
                              />
                            ) : (
                              <TrendingDownIcon
                                sx={{
                                  fontSize: 18,
                                  color: "error.main",
                                  p: 0.5,
                                  borderRadius: 1,
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.error.main, 0.15),
                                }}
                              />
                            )}
                            {item.change && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color:
                                    item.trend === "up"
                                      ? "success.main"
                                      : "error.main",
                                  fontWeight: 700,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {item.change}
                              </Typography>
                            )}
                          </Stack>
                          {item.change && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.7rem",
                                opacity: 0.7,
                              }}
                            >
                              {t(
                                "dashboard.comparison.vsLastMonth",
                                "vs last month"
                              )}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </MotionCard>
                </Grid2>
              ))}
            </Grid2>
          </MotionBox>

          {/* Properties & Last Month */}
          <Grid2 container spacing={{ xs: 2, sm: 2, md: 2 }}>
            {/* Properties */}
            <Grid2 size={{ xs: 12, md: 8, lg: 8 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 2.5,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                    transform: "translateY(-6px)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: { xs: 2.5, sm: 3, md: 3.5 },
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
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
                          p: 1,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.15),
                          color: "primary.main",
                        }}
                      >
                        <HomeWorkIcon />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            textAlign: isRTL ? "right" : "left",
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.15rem",
                            },
                          }}
                        >
                          {t("dashboard.properties") || "Properties"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.7rem" }}
                        >
                          {t(
                            "dashboard.featuredProperties",
                            "Featured properties"
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => navigate("/dashboard/properties/list")}
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      {isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    </IconButton>
                  </Stack>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {featuredProperties.length > 0 ? (
                      featuredProperties.map((property) => (
                        <Box
                          key={property.id}
                          onClick={() =>
                            navigate(
                              `/dashboard/properties/${property.id}/edit`
                            )
                          }
                          sx={{
                            p: { xs: 2.5, sm: 3, md: 3.5 },
                            borderRadius: 2.5,
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.05),
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              [isRTL ? "right" : "left"]: 0,
                              width: 4,
                              height: "100%",
                              bgcolor: "primary.main",
                              transform: "scaleY(0)",
                              transition: "transform 0.3s ease",
                            },
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.12),
                              borderColor: (theme) =>
                                alpha(theme.palette.primary.main, 0.4),
                              transform: "translateX(6px)",
                              boxShadow: (theme) =>
                                `0 8px 24px ${alpha(
                                  theme.palette.primary.main,
                                  0.2
                                )}`,
                              "&::before": {
                                transform: "scaleY(1)",
                              },
                            },
                          }}
                        >
                          <Stack spacing={2}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <Box
                                sx={{
                                  textAlign: isRTL ? "right" : "left",
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1.25}
                                  alignItems="center"
                                  sx={{
                                    mb: 1,
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 0.75,
                                      borderRadius: 1.5,
                                      bgcolor: (theme) =>
                                        alpha(theme.palette.primary.main, 0.15),
                                      color: "primary.main",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <HomeWorkIcon sx={{ fontSize: 18 }} />
                                  </Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    sx={{
                                      fontSize: { xs: "0.95rem", sm: "1rem" },
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {property.name}
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction="row"
                                  spacing={0.75}
                                  alignItems="center"
                                  sx={{
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                    mb: 1,
                                  }}
                                >
                                  <LocationOnIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.secondary",
                                      opacity: 0.8,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.8rem",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {property.location}
                                  </Typography>
                                </Stack>
                              </Box>
                              <Box
                                sx={{
                                  textAlign: isRTL ? "left" : "right",
                                  ml: isRTL ? 0 : 2,
                                  mr: isRTL ? 2 : 0,
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  fontWeight={800}
                                  color="primary.main"
                                  sx={{
                                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                                    mb: 0.25,
                                  }}
                                >
                                  {property.price}
                                </Typography>
                                <Chip
                                  label={
                                    property.status === "sold"
                                      ? t("dashboard.status.sold") || "Sold"
                                      : property.status === "pending"
                                      ? t("dashboard.status.pending") ||
                                        "Pending"
                                      : t("dashboard.status.active") || "Active"
                                  }
                                  size="small"
                                  color={
                                    property.status === "sold"
                                      ? "success"
                                      : property.status === "pending"
                                      ? "warning"
                                      : "primary"
                                  }
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "0.7rem",
                                    height: 22,
                                  }}
                                />
                              </Box>
                            </Stack>
                            <Box>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                  mb: 0.5,
                                  flexDirection: isRTL ? "row-reverse" : "row",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                                >
                                  {t("dashboard.progress", "Progress")}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="primary.main"
                                  sx={{ fontSize: "0.7rem", fontWeight: 700 }}
                                >
                                  {property.progress}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={property.progress}
                                sx={{
                                  height: 10,
                                  borderRadius: 2,
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.1),
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 2,
                                    background: (theme) =>
                                      `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                  },
                                }}
                              />
                            </Box>
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        {t("dashboard.noProperties", "No properties available")}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>

            {/* Last Month */}
            <Grid2 size={{ xs: 12, md: 4, lg: 4 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: { xs: 2, sm: 2.5, md: 3 },
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        textAlign: isRTL ? "right" : "left",
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
                      }}
                    >
                      {t("dashboard.lastMonth.title") || "Last Month"}
                    </Typography>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack spacing={{ xs: 2, sm: 2.25, md: 2.5 }}>
                    {lastMonthStats.map((stat, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: { xs: 2, sm: 2.25, md: 2.5 },
                          borderRadius: 2.5,
                          bgcolor: (theme) =>
                            alpha(theme.palette[stat.color].main, 0.08),
                          border: (theme) =>
                            `1px solid ${alpha(
                              theme.palette[stat.color].main,
                              0.2
                            )}`,
                          textAlign: isRTL ? "right" : "left",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            [isRTL ? "right" : "left"]: 0,
                            width: 4,
                            height: "100%",
                            bgcolor: `${stat.color}.main`,
                          },
                          "&:hover": {
                            bgcolor: (theme) =>
                              alpha(theme.palette[stat.color].main, 0.15),
                            transform: "translateX(4px)",
                            boxShadow: (theme) =>
                              `0 4px 12px ${alpha(
                                theme.palette[stat.color].main,
                                0.2
                              )}`,
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="flex-start"
                          sx={{
                            mb: 1.5,
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
                          <Box
                            sx={{
                              p: 1.25,
                              borderRadius: 2,
                              bgcolor: (theme) =>
                                alpha(theme.palette[stat.color].main, 0.2),
                              color: `${stat.color}.main`,
                              display: "flex",
                              alignItems: "center",
                              boxShadow: (theme) =>
                                `0 4px 8px ${alpha(
                                  theme.palette[stat.color].main,
                                  0.15
                                )}`,
                            }}
                          >
                            {stat.icon}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.75rem",
                                mb: 0.5,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {stat.label}
                            </Typography>
                            <Typography
                              variant="h5"
                              fontWeight={800}
                              color={`${stat.color}.main`}
                              sx={{
                                fontSize: {
                                  xs: "1.5rem",
                                  sm: "1.75rem",
                                  md: "2rem",
                                },
                                mb: 0.25,
                              }}
                            >
                              {stat.value}
                            </Typography>
                            {stat.subValue && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: "0.7rem",
                                  opacity: 0.8,
                                }}
                              >
                                {stat.subValue}
                              </Typography>
                            )}
                          </Box>
                          {stat.growth !== undefined && (
                            <Chip
                              icon={
                                stat.growth >= 0 ? (
                                  <TrendingUpIcon sx={{ fontSize: 14 }} />
                                ) : (
                                  <TrendingDownIcon sx={{ fontSize: 14 }} />
                                )
                              }
                              label={`${stat.growth >= 0 ? "+" : ""}${
                                stat.growth
                              }%`}
                              size="small"
                              color={stat.growth >= 0 ? "success" : "error"}
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                height: 24,
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>
          </Grid2>

          {/* Statistics & Charts */}
          {isAdmin && propertyTypesData.length > 0 && (
            <Grid2 container spacing={{ xs: 2, sm: 2, md: 2 }}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 2.5,
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0,0,0,0.3)"
                        : "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 12px 40px ${alpha(
                          theme.palette.primary.main,
                          0.15
                        )}`,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        mb: 3,
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
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
                            p: 1,
                            borderRadius: 2,
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.15),
                            color: "primary.main",
                          }}
                        >
                          <BarChartIcon />
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              fontSize: {
                                xs: "1rem",
                                sm: "1.1rem",
                                md: "1.15rem",
                              },
                              textAlign: isRTL ? "right" : "left",
                            }}
                          >
                            {t(
                              "dashboard.propertyTypes",
                              "Property Types Distribution"
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {t("dashboard.byType", "Distribution by type")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                    <SimpleBarChart
                      data={propertyTypesData}
                      height={180}
                      color="primary"
                    />
                  </CardContent>
                </MotionCard>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1,
                    boxShadow: { duration: 0 }, // Disable boxShadow animation
                  }}
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 2.5,
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0,0,0,0.3)"
                        : "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 12px 40px ${alpha(
                          theme.palette.secondary.main,
                          0.15
                        )}`,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        mb: 3,
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
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
                            p: 1,
                            borderRadius: 2,
                            bgcolor: (theme) =>
                              alpha(theme.palette.secondary.main, 0.15),
                            color: "secondary.main",
                          }}
                        >
                          <PieChartIcon />
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              fontSize: {
                                xs: "1rem",
                                sm: "1.1rem",
                                md: "1.15rem",
                              },
                              textAlign: isRTL ? "right" : "left",
                            }}
                          >
                            {t("dashboard.performance", "Performance Overview")}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {t(
                              "dashboard.keyMetrics",
                              "Key metrics at a glance"
                            )}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                    <Stack spacing={2.5}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.success.main, 0.08),
                          border: (theme) =>
                            `1px solid ${alpha(
                              theme.palette.success.main,
                              0.2
                            )}`,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem", mb: 0.5 }}
                            >
                              {t(
                                "dashboard.activeProperties",
                                "Active Properties"
                              )}
                            </Typography>
                            <Typography
                              variant="h5"
                              fontWeight={700}
                              color="success.main"
                            >
                              {allProperties.filter((p) => p.is_active).length}
                            </Typography>
                          </Box>
                          <ProgressRing
                            value={
                              allProperties.length > 0
                                ? Math.round(
                                    (allProperties.filter((p) => p.is_active)
                                      .length /
                                      allProperties.length) *
                                      100
                                  )
                                : 0
                            }
                            size={60}
                            strokeWidth={6}
                            color="success"
                          />
                        </Stack>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.warning.main, 0.08),
                          border: (theme) =>
                            `1px solid ${alpha(
                              theme.palette.warning.main,
                              0.2
                            )}`,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem", mb: 0.5 }}
                            >
                              {t("dashboard.engagementRate", "Engagement Rate")}
                            </Typography>
                            <Typography
                              variant="h5"
                              fontWeight={700}
                              color="warning.main"
                            >
                              {allProperties.length > 0
                                ? Math.round(
                                    (favorites.length / allProperties.length) *
                                      100
                                  )
                                : 0}
                              %
                            </Typography>
                          </Box>
                          <ProgressRing
                            value={
                              allProperties.length > 0
                                ? Math.min(
                                    Math.round(
                                      (favorites.length /
                                        allProperties.length) *
                                        100
                                    ),
                                    100
                                  )
                                : 0
                            }
                            size={60}
                            strokeWidth={6}
                            color="warning"
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid2>
            </Grid2>
          )}

          {/* Project Timeline & Agents */}
          <Grid2 container spacing={{ xs: 2, sm: 2, md: 2 }}>
            {/* Project Timeline */}
            <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 2.5,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 12px 40px ${alpha(theme.palette.success.main, 0.2)}`,
                    transform: "translateY(-6px)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: { xs: 2.5, sm: 3, md: 3.5 },
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
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
                          p: 1,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.success.main, 0.15),
                          color: "success.main",
                        }}
                      >
                        <ScheduleIcon />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            textAlign: isRTL ? "right" : "left",
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.15rem",
                            },
                          }}
                        >
                          {t("dashboard.projectTimeline") || "Project Timeline"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.7rem" }}
                        >
                          {t("dashboard.recentActivity", "Recent activity")}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {projectTimeline.length > 0 ? (
                      projectTimeline.map((item) => (
                        <Box
                          key={item.id}
                          onClick={() => {
                            if (item.propertyId) {
                              navigate(
                                `/dashboard/properties/${item.propertyId}/edit`
                              );
                            }
                          }}
                          sx={{
                            position: "relative",
                            [isRTL ? "pr" : "pl"]: { xs: 3, sm: 3.5 },
                            pb: { xs: 2.5, sm: 3 },
                            cursor: item.propertyId ? "pointer" : "default",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateX(4px)",
                            },
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              [isRTL ? "right" : "left"]: 9,
                              top: 0,
                              bottom: 0,
                              width: 3,
                              bgcolor: (theme) =>
                                item.status === "completed"
                                  ? theme.palette.success.main
                                  : item.status === "in-progress"
                                  ? theme.palette.primary.main
                                  : alpha(theme.palette.divider, 0.3),
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                            },
                            "&:hover::before": {
                              width: 4,
                              bgcolor: (theme) =>
                                item.status === "completed"
                                  ? theme.palette.success.main
                                  : item.status === "in-progress"
                                  ? theme.palette.primary.main
                                  : alpha(theme.palette.divider, 0.5),
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              [isRTL ? "right" : "left"]: 0,
                              top: 2,
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              bgcolor: (theme) =>
                                item.status === "completed"
                                  ? theme.palette.success.main
                                  : item.status === "in-progress"
                                  ? theme.palette.primary.main
                                  : alpha(theme.palette.divider, 0.3),
                              border: (theme) =>
                                `4px solid ${theme.palette.background.paper}`,
                              zIndex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: (theme) =>
                                item.status === "completed" ||
                                item.status === "in-progress"
                                  ? `0 4px 16px ${alpha(
                                      item.status === "completed"
                                        ? theme.palette.success.main
                                        : theme.palette.primary.main,
                                      0.5
                                    )}`
                                  : "none",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {item.status === "completed" && (
                              <CheckCircleIcon
                                sx={{ fontSize: 12, color: "white" }}
                              />
                            )}
                            {item.status === "in-progress" && (
                              <ScheduleIcon
                                sx={{ fontSize: 12, color: "white" }}
                              />
                            )}
                            {item.status === "pending" && (
                              <PendingIcon
                                sx={{ fontSize: 12, color: "text.secondary" }}
                              />
                            )}
                          </Box>
                          <Box
                            sx={{
                              ml: isRTL ? 0 : 3.5,
                              mr: isRTL ? 3.5 : 0,
                              p: 2,
                              borderRadius: 2,
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.05),
                              border: (theme) =>
                                `1px solid ${alpha(
                                  theme.palette.divider,
                                  0.1
                                )}`,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                bgcolor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                                borderColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.3),
                              },
                            }}
                          >
                            <Stack spacing={1}>
                              <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{
                                  fontSize: "0.95rem",
                                  textAlign: isRTL ? "right" : "left",
                                  color: "text.primary",
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.75}
                                alignItems="center"
                                sx={{
                                  flexDirection: isRTL ? "row-reverse" : "row",
                                }}
                              >
                                <ScheduleIcon
                                  sx={{
                                    fontSize: 14,
                                    color: "text.secondary",
                                    opacity: 0.8,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {item.date}
                                </Typography>
                                {item.status === "in-progress" && (
                                  <Chip
                                    label={t(
                                      "dashboard.inProgress",
                                      "In Progress"
                                    )}
                                    size="small"
                                    color="primary"
                                    sx={{
                                      height: 20,
                                      fontSize: "0.65rem",
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                              </Stack>
                            </Stack>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        {t(
                          "dashboard.timeline.noProperties",
                          "No recent properties"
                        )}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>

            {/* Agents */}
            <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 2.5,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 12px 40px ${alpha(theme.palette.info.main, 0.2)}`,
                    transform: "translateY(-6px)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: { xs: 2.5, sm: 3, md: 3.5 },
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
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
                          p: 1,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.info.main, 0.15),
                          color: "info.main",
                        }}
                      >
                        <PeopleIcon />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            textAlign: isRTL ? "right" : "left",
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.15rem",
                            },
                          }}
                        >
                          {t("dashboard.menu.agents", "Agents")}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.7rem" }}
                        >
                          {t("dashboard.registeredAgents", "Registered agents")}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {assignees.length > 0 ? (
                      assignees.map((assignee) => (
                        <Stack
                          key={assignee.id}
                          direction="row"
                          spacing={{ xs: 1.5, sm: 2 }}
                          alignItems="center"
                          onClick={() => {
                            if (isAdmin) {
                              navigate(`/dashboard/agents/all`);
                            }
                          }}
                          sx={{
                            p: { xs: 2, sm: 2.25, md: 2.5 },
                            borderRadius: 2.5,
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.06),
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              [isRTL ? "right" : "left"]: 0,
                              top: 0,
                              bottom: 0,
                              width: 3,
                              bgcolor: `${assignee.color}.main`,
                              transform: "scaleY(0)",
                              transition: "transform 0.3s ease",
                            },
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.12),
                              borderColor: (theme) =>
                                alpha(theme.palette.primary.main, 0.4),
                              transform: "translateX(6px)",
                              boxShadow: (theme) =>
                                `0 6px 20px ${alpha(
                                  theme.palette.primary.main,
                                  0.15
                                )}`,
                              "&::before": {
                                transform: "scaleY(1)",
                              },
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            flexDirection: isRTL ? "row-reverse" : "row",
                            cursor: isAdmin ? "pointer" : "default",
                            width: "100%",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: `${assignee.color}.main`,
                              fontWeight: 700,
                              width: { xs: 48, sm: 52, md: 56 },
                              height: { xs: 48, sm: 52, md: 56 },
                              fontSize: {
                                xs: "1rem",
                                sm: "1.1rem",
                                md: "1.2rem",
                              },
                              boxShadow: (theme) =>
                                `0 4px 12px ${alpha(
                                  theme.palette[assignee.color].main,
                                  0.3
                                )}`,
                            }}
                          >
                            {assignee.avatar}
                          </Avatar>
                          <Box
                            sx={{
                              flex: 1,
                              textAlign: isRTL ? "right" : "left",
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              sx={{
                                fontSize: { xs: "0.9rem", sm: "0.95rem" },
                                mb: 0.25,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {assignee.name}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <PeopleIcon
                                sx={{
                                  fontSize: 14,
                                  color: "text.secondary",
                                  opacity: 0.7,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: "0.75rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {t(
                                  `dashboard.roles.${assignee.roleKey}`,
                                  "Agent"
                                )}
                              </Typography>
                            </Stack>
                            {assignee.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: "0.7rem",
                                  opacity: 0.8,
                                  display: "block",
                                  mt: 0.25,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {assignee.email}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        {t(
                          "dashboard.assignees.noAgents",
                          "No agents registered yet"
                        )}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>
          </Grid2>

          {/* My Properties & Management Reports */}
          <Grid2 container spacing={{ xs: 2, sm: 2, md: 2 }}>
            {/* My Properties */}
            <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 2.5,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 12px 40px ${alpha(theme.palette.secondary.main, 0.2)}`,
                    transform: "translateY(-6px)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: { xs: 2.5, sm: 3, md: 3.5 },
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
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
                          p: 1,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.secondary.main, 0.15),
                          color: "secondary.main",
                        }}
                      >
                        <HomeWorkIcon />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            textAlign: isRTL ? "right" : "left",
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.15rem",
                            },
                          }}
                        >
                          {t("dashboard.myProperties") || "My Properties"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.7rem" }}
                        >
                          {t("dashboard.recentProperties", "Recent properties")}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => navigate("/dashboard/properties/list")}
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      {isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                    </IconButton>
                  </Stack>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {featuredProperties.slice(0, 2).length > 0 ? (
                      featuredProperties.slice(0, 2).map((property) => (
                        <Box
                          key={property.id}
                          onClick={() =>
                            navigate(
                              `/dashboard/properties/${property.id}/edit`
                            )
                          }
                          sx={{
                            p: { xs: 2.5, sm: 3, md: 3.5 },
                            borderRadius: 2.5,
                            bgcolor: (theme) =>
                              alpha(theme.palette.secondary.main, 0.05),
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.secondary.main,
                                0.15
                              )}`,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              [isRTL ? "right" : "left"]: 0,
                              width: 3,
                              height: "100%",
                              bgcolor: "secondary.main",
                              transform: "scaleY(0)",
                              transition: "transform 0.3s ease",
                            },
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.secondary.main, 0.12),
                              borderColor: (theme) =>
                                alpha(theme.palette.secondary.main, 0.4),
                              transform: "translateX(6px)",
                              boxShadow: (theme) =>
                                `0 6px 20px ${alpha(
                                  theme.palette.secondary.main,
                                  0.15
                                )}`,
                              "&::before": {
                                transform: "scaleY(1)",
                              },
                            },
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <Box
                                sx={{
                                  flex: 1,
                                  textAlign: isRTL ? "right" : "left",
                                  minWidth: 0,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1.25}
                                  alignItems="center"
                                  sx={{
                                    mb: 1,
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 0.75,
                                      borderRadius: 1.5,
                                      bgcolor: (theme) =>
                                        alpha(
                                          theme.palette.secondary.main,
                                          0.15
                                        ),
                                      color: "secondary.main",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <HomeWorkIcon sx={{ fontSize: 18 }} />
                                  </Box>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    sx={{
                                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {property.name}
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction="row"
                                  spacing={0.75}
                                  alignItems="center"
                                  sx={{
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <LocationOnIcon
                                    sx={{
                                      fontSize: 14,
                                      color: "text.secondary",
                                      opacity: 0.8,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      fontSize: "0.8rem",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {property.location}
                                  </Typography>
                                </Stack>
                              </Box>
                              <Box
                                sx={{
                                  textAlign: isRTL ? "left" : "right",
                                  ml: isRTL ? 0 : 2,
                                  mr: isRTL ? 2 : 0,
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  fontWeight={800}
                                  color="secondary.main"
                                  sx={{
                                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                                    mb: 0.25,
                                  }}
                                >
                                  {property.price}
                                </Typography>
                                <Chip
                                  label={
                                    property.status === "active"
                                      ? t("dashboard.status.active") || "Active"
                                      : t("dashboard.status.inactive") ||
                                        "Inactive"
                                  }
                                  size="small"
                                  color={
                                    property.status === "active"
                                      ? "success"
                                      : "default"
                                  }
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "0.7rem",
                                    height: 22,
                                  }}
                                />
                              </Box>
                            </Stack>
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        {t("dashboard.noProperties", "No properties available")}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>

            {/* Management Reports */}
            <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: 2.5,
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 4px 20px rgba(0,0,0,0.3)"
                      : "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                    transform: "translateY(-6px)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: { xs: 2.5, sm: 3, md: 3.5 },
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
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
                          p: 1,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.15),
                          color: "primary.main",
                        }}
                      >
                        <AssessmentIcon />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            textAlign: isRTL ? "right" : "left",
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.15rem",
                            },
                          }}
                        >
                          {t("dashboard.managementReports") ||
                            "Management Reports"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.7rem" }}
                        >
                          {t(
                            "dashboard.contactReports",
                            "Contact requests reports"
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => navigate("/dashboard/properties/requests")}
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <Box
                          key={report.id}
                          onClick={() => {
                            if (report.requestId) {
                              navigate("/dashboard/properties/requests");
                            }
                          }}
                          sx={{
                            p: { xs: 2.5, sm: 3, md: 3.5 },
                            borderRadius: 2.5,
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.05),
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              [isRTL ? "right" : "left"]: 0,
                              width: 3,
                              height: "100%",
                              bgcolor: "primary.main",
                              transform: "scaleY(0)",
                              transition: "transform 0.3s ease",
                            },
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.12),
                              borderColor: (theme) =>
                                alpha(theme.palette.primary.main, 0.4),
                              transform: "translateX(6px)",
                              boxShadow: (theme) =>
                                `0 6px 20px ${alpha(
                                  theme.palette.primary.main,
                                  0.15
                                )}`,
                              "&::before": {
                                transform: "scaleY(1)",
                              },
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: report.requestId ? "pointer" : "default",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={2}
                            sx={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                            }}
                          >
                            <Box
                              sx={{
                                flex: 1,
                                textAlign: isRTL ? "right" : "left",
                                minWidth: 0,
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                  mb: 1,
                                  flexDirection: isRTL ? "row-reverse" : "row",
                                }}
                              >
                                <Box
                                  sx={{
                                    p: 0.5,
                                    borderRadius: 1,
                                    bgcolor: (theme) =>
                                      alpha(theme.palette.primary.main, 0.15),
                                    color: "primary.main",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <EmailIcon sx={{ fontSize: 16 }} />
                                </Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={700}
                                  sx={{
                                    fontSize: "0.95rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                  }}
                                >
                                  {report.title}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={0.75}
                                alignItems="center"
                                sx={{
                                  flexDirection: isRTL ? "row-reverse" : "row",
                                }}
                              >
                                <ScheduleIcon
                                  sx={{
                                    fontSize: 14,
                                    color: "text.secondary",
                                    opacity: 0.7,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                                >
                                  {report.date}
                                </Typography>
                              </Stack>
                            </Box>
                            <Chip
                              icon={<AssessmentIcon sx={{ fontSize: 14 }} />}
                              label={t(
                                `dashboard.reports.type.${report.type}`,
                                report.type
                              )}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                height: 28,
                                borderWidth: 2,
                                "&:hover": {
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            />
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 3 }}
                      >
                        {t("dashboard.reports.noReports", "No recent reports")}
                      </Typography>
                    )}
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

export default DashboardView;
