import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useNavigate } from "react-router-dom";
import { heroSlides } from "../utils/data";
import { useCustomizer } from "../context/CustomizerContext";
import apiClient from "../utils/apiClient";
import { useAuth } from "../context/AuthContext";

const LoginView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const { data } = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (data?.user) {
        setUser(data.user);
      }

      window.alert(
        t("auth.loginSuccess", "You have logged in successfully ✅.")
      );
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      const apiMessage = err?.response?.data?.message;

      if (status === 422) {
        const msg = t(
          "auth.userNotFound",
          "No account found with these credentials. Please create a new account."
        );
        setError(msg);
        window.alert(msg);
      } else if (status === 403 && err?.response?.data?.pending_approval) {
        const msg = t(
          "auth.accountPendingApproval",
          "Your account is pending admin approval. Please try again later."
        );
        setError(msg);
        window.alert(msg);
      } else {
        const message =
          apiMessage ||
          t(
            "auth.loginError",
            "Unable to login, please check your credentials."
          );
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const backgroundMedia = heroSlides[0]?.media;
  const { settings } = useCustomizer();
  const isDarkMode = settings.mode === "dark";

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "calc(100vh - 88px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92), rgba(15,23,42,0.7)), url(${backgroundMedia})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.9)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: { xs: 140, md: 190 },
          background: isDarkMode
            ? "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.3), transparent)"
            : "linear-gradient(to bottom, rgba(3,7,18,0.95), rgba(3,7,18,0.75), transparent)",
          pointerEvents: "none",
          zIndex: 0.5,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            mt: 10,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "rgba(148,163,184,0.45)",
            backdropFilter: "blur(18px)",
          }}
        >
          <Stack spacing={4}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {t("auth.login")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("auth.loginSubtitle")}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}

                <TextField
                  fullWidth
                  type="email"
                  label={t("auth.email")}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />

                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label={t("auth.password")}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    sx={{ textDecoration: "none" }}
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                  disabled={submitting}
                >
                  {t("auth.signIn")}
                </Button>
              </Stack>
            </Box>

            <Divider>
              <Typography variant="body2" color="text.secondary">
                {t("auth.orContinueWith")}
              </Typography>
            </Divider>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "divider",
                }}
              >
                {t("auth.google")}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FacebookIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "divider",
                }}
              >
                {t("auth.facebook")}
              </Button>
            </Stack>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {t("auth.noAccount")}{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {t("auth.signup")}
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginView;

