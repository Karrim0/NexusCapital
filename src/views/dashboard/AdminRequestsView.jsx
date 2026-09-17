import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  alpha,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../context/CustomizerContext";
import { useAuth } from "../../context/AuthContext";
import { MotionBox } from "../../components/common/MotionComponents";
import { fadeInUp } from "../../components/common/motionVariants";
import {
  fetchPendingAgents,
  approveAgent,
  rejectAgent,
} from "../../api/agents";

const AdminRequestsView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isRTL = settings.direction === "rtl";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agentRequests, setAgentRequests] = useState([]);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const agents = await fetchPendingAgents();
        setAgentRequests(agents);
      } catch (err) {
        console.error("Failed to load admin requests:", err);
        setError(
          t(
            "dashboard.requests.loadError",
            "Unable to load requests. Please try again later."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAdmin, t]);

  const handleApproveAgent = async (id) => {
    try {
      await approveAgent(id);
      setAgentRequests((prev) => prev.filter((a) => a.id !== id));
      window.alert(
        t(
          "dashboard.requests.agentApproved",
          "Agent has been approved and can now log in."
        )
      );
    } catch (err) {
      console.error("Failed to approve agent:", err);
      window.alert(
        t(
          "dashboard.requests.agentApproveError",
          "Unable to approve this agent right now. Please try again."
        )
      );
    }
  };

  const handleRejectAgent = async (id) => {
    if (
      !window.confirm(
        t(
          "dashboard.requests.confirmReject",
          "Are you sure you want to reject this agent request? This action cannot be undone."
        )
      )
    ) {
      return;
    }

    try {
      await rejectAgent(id);

      // Remove the agent from the list immediately
      setAgentRequests((prev) => prev.filter((a) => a.id !== id));

      // Show success message
      window.alert(
        t(
          "dashboard.requests.agentRejected",
          "Agent request has been rejected successfully."
        )
      );
    } catch (err) {
      console.error("Failed to reject agent:", err);

      // Extract error message from response if available
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t(
          "dashboard.requests.agentRejectError",
          "Unable to reject this agent right now. Please try again."
        );

      window.alert(errorMessage);
    }
  };

  if (!isAdmin) {
    return (
      <MotionBox
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          direction: settings.direction,
        }}
      >
        <Paper
          sx={{
            maxWidth: 640,
            width: "100%",
            p: { xs: 3, sm: 4 },
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {t(
              "dashboard.forbidden.requestsTitle",
              "You are not allowed to access this section."
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              "dashboard.forbidden.requestsMessage",
              "Only admins can view and manage customer and agent requests."
            )}
          </Typography>
        </Paper>
      </MotionBox>
    );
  }

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
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            {t("dashboard.requests.agentsTab", "Agent requests")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("dashboard.requests.subtitle", "Manage agent signup requests.")}
          </Typography>
        </Box>

        <Paper
          sx={{
            borderRadius: 2,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: "hidden",
          }}
        >
          {error && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Box>
          )}

          {loading && !error && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("common.loading", "Loading...")}
              </Typography>
            </Box>
          )}

          <Box sx={{ p: 2 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("auth.fullName", "Full Name")}</TableCell>
                    <TableCell>{t("auth.email", "Email")}</TableCell>
                    <TableCell>
                      {t("dashboard.requests.phone", "Phone")}
                    </TableCell>
                    <TableCell>
                      {t("dashboard.requests.location", "Location")}
                    </TableCell>
                    <TableCell>
                      {t("dashboard.requests.requestDate", "Requested at")}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agentRequests.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>{agent.phone || "-"}</TableCell>
                      <TableCell>{agent.location || "-"}</TableCell>
                      <TableCell>
                        {new Date(agent.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleApproveAgent(agent.id)}
                          >
                            {t(
                              "dashboard.requests.approveAgent",
                              "Approve agent"
                            )}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleRejectAgent(agent.id)}
                          >
                            {t("dashboard.requests.rejectAgent", "Reject")}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {agentRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                        >
                          {t(
                            "dashboard.requests.noAgentRequests",
                            "No pending agent requests."
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Container>
    </MotionBox>
  );
};

export default AdminRequestsView;
