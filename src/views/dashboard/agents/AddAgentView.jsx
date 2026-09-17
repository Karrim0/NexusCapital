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
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import { createUser } from "../../../api/users";
import { validatePassword } from "../../../utils/passwordValidation";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const AddAgentView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = settings.direction === "rtl";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
                  "dashboard.forbidden.addAgentTitle",
                  "You are not allowed to add agents."
                )}
              </Typography>
              <Typography color="text.secondary">
                {t(
                  "dashboard.forbidden.addAgentMessage",
                  "Only admins can create or manage agents."
                )}
              </Typography>
            </CardContent>
          </MotionCard>
        </Container>
      </MotionBox>
    );
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.fullName) {
      newErrors.fullName = t("dashboard.addAgent.fullNameRequired");
    }
    if (!formData.email) {
      newErrors.email = t("dashboard.addAgent.emailRequired");
    }
    if (!formData.phone) {
      newErrors.phone = t("dashboard.addAgent.phoneRequired");
    }
    if (!formData.location) {
      newErrors.location = t(
        "dashboard.addAgent.locationRequired",
        "Location is required"
      );
    }
    if (!formData.password) {
      newErrors.password = t(
        "dashboard.addAgent.passwordRequired",
        "Password is required"
      );
    } else {
      // Validate password strength
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        const errorMessages = passwordValidation.errors.map((err) =>
          t(`auth.passwordRules.${err}`, err)
        );
        newErrors.password = errorMessages.join(", ");
      }
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "dashboard.addAgent.passwordMismatch",
        "Passwords do not match"
      );
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await createUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: "agent",
        phone: formData.phone || null,
        location: formData.location || null,
      });
      window.alert(
        t(
          "dashboard.addAgent.success",
          "Agent has been created and can now log in."
        )
      );
      // بعد إنشاء الوكيل بنجاح → التحويل إلى صفحة جميع الوكلاء
      navigate("/dashboard/agents/all");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        t(
          "dashboard.addAgent.error",
          "Unable to create agent. Please check the data and try again."
        );
      window.alert(message);
    } finally {
      setSubmitting(false);
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
        <form onSubmit={handleSubmit}>
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
                  {t("dashboard.menu.addAgent") || "Add Agent"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t("dashboard.addAgent.subtitle") ||
                    "Add a new agent to the system"}
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
                  variant="contained"
                  startIcon={<SaveIcon />}
                  type="submit"
                  disabled={submitting}
                  sx={{
                    textTransform: "none",
                    px: 3,
                    boxShadow: (theme) =>
                      `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {t("dashboard.addAgent.saveAgent")}
                </Button>
              </Stack>
            </Box>

            <Grid2 container spacing={3}>
              {/* Basic Information */}
              <Grid2 size={{ xs: 12, md: 8 }}>
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
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ mb: 3, textAlign: isRTL ? "right" : "left" }}
                    >
                      {t("dashboard.addAgent.basicInformation") ||
                        "Basic Information"}
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label={t("dashboard.addAgent.fullName") || "Full Name"}
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        required
                      />

                      <TextField
                        fullWidth
                        label={t("dashboard.addAgent.email") || "Email"}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                      />

                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label={t("dashboard.addAgent.phone") || "Phone"}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            required
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label={
                              t("dashboard.addAgent.location") || "Location"
                            }
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            error={!!errors.location}
                            helperText={errors.location}
                            required
                          />
                        </Grid2>
                      </Grid2>
                    </Stack>
                  </CardContent>
                </MotionCard>

                {/* Security */}
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{
                    mt: 3,
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
                      {t("dashboard.addAgent.security") || "Security"}
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label={t("dashboard.addAgent.password") || "Password"}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.value) {
                            const validation = validatePassword(e.target.value);
                            if (!validation.isValid) {
                              const errorMessages = validation.errors.map((err) =>
                                t(`auth.passwordRules.${err}`, err)
                              );
                              setErrors((prev) => ({
                                ...prev,
                                password: errorMessages.join(", "),
                              }));
                            } else {
                              setErrors((prev) => ({ ...prev, password: "" }));
                            }
                          }
                        }}
                        error={!!errors.password}
                        helperText={
                          errors.password ||
                          t(
                            "auth.passwordRules.help",
                            "At least 8 characters with uppercase, lowercase, number, and special character"
                          )
                        }
                        required
                      />

                      <TextField
                        fullWidth
                        label={
                          t("dashboard.addAgent.confirmPassword") ||
                          "Confirm Password"
                        }
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        required
                      />
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid2>

              {/* Sidebar */}
              <Grid2 size={{ xs: 12, md: 4 }}>
                {/* Sidebar reserved for future agent settings if needed */}
              </Grid2>
            </Grid2>
          </MotionStack>
        </form>
      </Container>
    </MotionBox>
  );
};

export default AddAgentView;
