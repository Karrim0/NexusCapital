import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Stack,
  TextField,
  Button,
  alpha,
  Chip,
  Avatar,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { fetchContactRequests } from "../../../api/contactRequests";
import { useAuth } from "../../../context/AuthContext";

const ContactRequestsView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchContactRequests();
        // Filter only property contact requests (with property_id)
        // Exclude general messages (without property_id)
        const propertyRequests = data.filter((req) => req.property_id);
        setRequests(propertyRequests);
      } catch (err) {
        console.error("Failed to load contact requests:", err);
        setError(
          t(
            "dashboard.contactRequests.loadError",
            "Failed to load contact requests. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin || isAgent) {
      load();
    }
  }, [isAdmin, isAgent, t]);

  if (!user) {
    return null;
  }

  if (!isAdmin && !isAgent) {
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
                  "dashboard.contactRequests.forbiddenTitle",
                  "You are not allowed to access this page."
                )}
              </Typography>
              <Typography color="text.secondary">
                {t(
                  "dashboard.contactRequests.forbiddenMessage",
                  "Only admins and agents can view customer contact requests."
                )}
              </Typography>
            </CardContent>
          </MotionCard>
        </Container>
      </MotionBox>
    );
  }

  const filteredRequests = requests.filter((req) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const propertyTitle = req.property?.title?.toLowerCase() || "";
    const customerName = req.name?.toLowerCase() || "";
    const email = req.email?.toLowerCase() || "";
    return (
      propertyTitle.includes(term) ||
      customerName.includes(term) ||
      email.includes(term)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "primary";
      case "contacted":
        return "success";
      case "closed":
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
                {t(
                  "dashboard.contactRequests.title",
                  "Customer contact requests"
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t(
                  "dashboard.contactRequests.subtitle",
                  "View inquiries sent from the property contact forms."
                )}
              </Typography>
            </Box>
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
                  placeholder={t(
                    "dashboard.contactRequests.searchPlaceholder",
                    "Search by property, name or email"
                  )}
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
              </Stack>
            </CardContent>
          </MotionCard>

          {/* Requests Table */}
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
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t(
                          "dashboard.contactRequests.property",
                          "Property"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t(
                          "dashboard.contactRequests.customer",
                          "Customer"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.contactRequests.contact", "Contact")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.contactRequests.message", "Message")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.contactRequests.date", "Date")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.contactRequests.status", "Status")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2">
                          {t(
                            "dashboard.contactRequests.loading",
                            "Loading contact requests..."
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    !error &&
                    filteredRequests.map((req) => {
                      const property = req.property || {};
                      return (
                        <TableRow
                          key={req.id}
                          hover
                          sx={{
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.04),
                            },
                          }}
                        >
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
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                <HomeWorkIcon sx={{ fontSize: 20 }} />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {property.title || t("common.unknown")}
                                </Typography>
                                {property.location && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {property.location}
                                  </Typography>
                                )}
                              </Box>
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
                                  bgcolor: "secondary.main",
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                <PersonIcon sx={{ fontSize: 18 }} />
                              </Avatar>
                              <Typography variant="body2">
                                {req.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              {req.phone && (
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                  sx={{
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <PhoneIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {req.phone}
                                  </Typography>
                                </Stack>
                              )}
                              {req.email && (
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                  sx={{
                                    flexDirection: isRTL
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <EmailIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {req.email}
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="flex-start"
                              sx={{
                                flexDirection: isRTL ? "row-reverse" : "row",
                              }}
                            >
                              <MailOutlineIcon
                                sx={{
                                  fontSize: 18,
                                  color: "text.secondary",
                                  mt: 0.25,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ maxWidth: 320 }}
                              >
                                {req.message ||
                                  t(
                                    "dashboard.contactRequests.noMessage",
                                    "No additional message provided."
                                  )}
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
                                sx={{
                                  fontSize: 16,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(req.created_at).toISOString().slice(
                                  0,
                                  10
                                )}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                req.status === "new"
                                  ? t(
                                      "dashboard.contactRequests.statusNew",
                                      "New"
                                    )
                                  : req.status === "contacted"
                                  ? t(
                                      "dashboard.contactRequests.statusContacted",
                                      "Contacted"
                                    )
                                  : t(
                                      "dashboard.contactRequests.statusClosed",
                                      "Closed"
                                    )
                              }
                              size="small"
                              color={getStatusColor(req.status)}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {!loading &&
                    !error &&
                    filteredRequests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary">
                            {t(
                              "dashboard.contactRequests.empty",
                              "No contact requests found."
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionCard>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default ContactRequestsView;

