import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Stack,
  TextField,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../context/CustomizerContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../components/common/MotionComponents";
import { fadeInUp } from "../../components/common/motionVariants";
import SearchIcon from "@mui/icons-material/Search";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SubjectIcon from "@mui/icons-material/Subject";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchContactRequests } from "../../api/contactRequests";
import { useAuth } from "../../context/AuthContext";

const GeneralMessagesView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchContactRequests();
        // Filter only general messages (without property_id)
        const generalMessages = data.filter((req) => !req.property_id);
        setRequests(generalMessages);
      } catch {
        setError(
          t(
            "dashboard.generalMessages.loadError",
            "Failed to load messages. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      load();
      // Refresh every 30 seconds to check for new messages
      const interval = setInterval(load, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, t]);

  if (!user) {
    return null;
  }

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
                  "dashboard.generalMessages.forbiddenTitle",
                  "You are not allowed to access this page."
                )}
              </Typography>
              <Typography color="text.secondary">
                {t(
                  "dashboard.generalMessages.forbiddenMessage",
                  "Only admins can view general messages."
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
    const customerName = req.name?.toLowerCase() || "";
    const email = req.email?.toLowerCase() || "";
    const phone = req.phone?.toLowerCase() || "";
    const message = req.message?.toLowerCase() || "";
    return (
      customerName.includes(term) ||
      email.includes(term) ||
      phone.includes(term) ||
      message.includes(term)
    );
  });

  const newMessagesCount = requests.filter(
    (req) => req.status === "new"
  ).length;

  const handleViewMessage = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
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
                {t("dashboard.generalMessages.title", "General Messages")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="body1" color="text.secondary">
                  {t(
                    "dashboard.generalMessages.subtitle",
                    "View messages sent from the contact page."
                  )}
                </Typography>
                {newMessagesCount > 0 && (
                  <Chip
                    label={`${newMessagesCount} ${t(
                      "dashboard.generalMessages.new",
                      "new"
                    )}`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
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
                    "dashboard.generalMessages.searchPlaceholder",
                    "Search by name, email, phone or message"
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

          {/* Messages Table */}
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
                        {t("dashboard.generalMessages.name", "Name")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.generalMessages.contact", "Contact")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.generalMessages.subject", "Subject")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.generalMessages.message", "Message")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.generalMessages.date", "Date")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.generalMessages.status", "Status")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {t("dashboard.generalMessages.actions", "Actions")}
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
                            "dashboard.generalMessages.loading",
                            "Loading messages..."
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
                    filteredRequests.map((req) => {
                      // Extract subject from message (first line)
                      const messageLines = req.message?.split("\n\n") || [];
                      const subject = messageLines[0] || "";
                      const message =
                        messageLines.slice(1).join("\n\n") ||
                        messageLines[0] ||
                        "";

                      return (
                        <TableRow
                          key={req.id}
                          hover
                          sx={{
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.04),
                            },
                            ...(req.status === "new" && {
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.05),
                            }),
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
                                <PersonIcon sx={{ fontSize: 20 }} />
                              </Avatar>
                              <Typography variant="subtitle2" fontWeight={600}>
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
                            {subject ? (
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                                sx={{
                                  flexDirection: isRTL ? "row-reverse" : "row",
                                }}
                              >
                                <SubjectIcon
                                  sx={{
                                    fontSize: 16,
                                    color: "text.secondary",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ maxWidth: 200 }}
                                  noWrap
                                >
                                  {subject}
                                </Typography>
                              </Stack>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontStyle="italic"
                              >
                                {t(
                                  "dashboard.generalMessages.noSubject",
                                  "No subject"
                                )}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {message ||
                                req.message ||
                                t(
                                  "dashboard.generalMessages.noMessage",
                                  "No message"
                                )}
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
                                sx={{
                                  fontSize: 16,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(req.created_at).toLocaleDateString()}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                req.status === "new"
                                  ? t(
                                      "dashboard.generalMessages.statusNew",
                                      "New"
                                    )
                                  : req.status === "contacted"
                                  ? t(
                                      "dashboard.generalMessages.statusContacted",
                                      "Contacted"
                                    )
                                  : t(
                                      "dashboard.generalMessages.statusClosed",
                                      "Closed"
                                    )
                              }
                              size="small"
                              color={
                                req.status === "new"
                                  ? "primary"
                                  : req.status === "contacted"
                                  ? "success"
                                  : "default"
                              }
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewMessage(req)}
                            >
                              {t("dashboard.generalMessages.view", "View")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {!loading && !error && filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          {t(
                            "dashboard.generalMessages.empty",
                            "No messages found."
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

      {/* Message Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <MailOutlineIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {t("dashboard.generalMessages.messageDetails", "Message Details")}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("dashboard.generalMessages.name", "Name")}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedRequest.name}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("dashboard.generalMessages.contact", "Contact")}
                </Typography>
                <Stack spacing={1}>
                  {selectedRequest.phone && (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <PhoneIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {selectedRequest.phone}
                      </Typography>
                    </Stack>
                  )}
                  {selectedRequest.email && (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <EmailIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {selectedRequest.email}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("dashboard.generalMessages.message", "Message")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  {selectedRequest.message ||
                    t("dashboard.generalMessages.noMessage", "No message")}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("dashboard.generalMessages.date", "Date")}
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t("common.close", "Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
};

export default GeneralMessagesView;
