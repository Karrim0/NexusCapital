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
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { heroSlides } from "../utils/data";
import { useCustomizer } from "../context/CustomizerContext";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "user",
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

      if (isLogin) {
        const { data } = await apiClient.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (data?.user) {
          setUser(data.user);
        }

        // بعد تسجيل الدخول بنجاح → تنبيه ثم تحويل للصفحة الرئيسية
        window.alert(
          t("auth.loginSuccess", "You have logged in successfully ✅.")
        );
        navigate("/");
      } else {
        // Registration flow with role selection
        if (formData.role === "agent") {
          // Agent → goes through approval workflow and appears in Admin "Agent requests"
          await apiClient.post("/auth/agent-request", {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
          });

          window.alert(
            t(
              "auth.agentRequestSuccess",
              "Your agent request has been sent and is pending admin approval. You can log in after approval."
            )
          );
        } else {
          // user or admin go through /auth/register
          const selectedRole = formData.role === "admin" ? "admin" : "user";

          await apiClient.post("/auth/register", {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            role: selectedRole,
          });

          if (selectedRole === "admin") {
            window.alert(
              t(
                "auth.adminRegisterSuccess",
                "Your admin account request has been created and is pending approval in the system. You can log in after approval."
              )
            );
          } else {
            window.alert(
              t(
                "auth.registerSuccess",
                "Account created successfully ✅. Please log in."
              )
            );
          }
        }

        // بعد إنشاء الحساب أو طلب الوكيل → رجوع لفورم تسجيل الدخول
        setIsLogin(true);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      }

      // TODO: optionally fetch /auth/me and store user in global auth state
    } catch (err) {
      const status = err?.response?.status;
      const apiMessage = err?.response?.data?.message;

      if (isLogin && status === 422) {
        const msg = t(
          "auth.userNotFound",
          "No account found with these credentials. Please create a new account."
        );
        // Credentials invalid → تنبيه ثم تحويل إلى إنشاء حساب
        setError(msg);
        window.alert(msg);
        setIsLogin(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else if (
        isLogin &&
        status === 403 &&
        err?.response?.data?.pending_approval
      ) {
        const msg = t(
          "auth.accountPendingApproval",
          "Your account is pending admin approval. Please try again later."
        );
        setError(msg);
        window.alert(msg);
      } else {
        const message =
          apiMessage ||
          (isLogin
            ? "Unable to login, please check your credentials."
            : "Unable to register, please check your data.");
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
      {/* Background image with gradient overlay */}
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

      {/* Top mist under header (same style as HeroSlider) */}
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
                {isLogin
                  ? t("auth.login")
                  : formData.role === "agent"
                  ? t("auth.agentSignup", "Agent registration request")
                  : formData.role === "admin"
                  ? t("auth.adminSignup", "Admin registration request")
                  : t("auth.signup")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLogin
                  ? t("auth.loginSubtitle")
                  : formData.role === "agent"
                  ? t(
                      "auth.agentSignupSubtitle",
                      "Request an agent account. Admin approval is required before you can log in."
                    )
                  : formData.role === "admin"
                  ? t(
                      "auth.adminSignupSubtitle",
                      "Request an admin account. Final approval must be done in the system before you can log in."
                    )
                  : t("auth.signupSubtitle")}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}

                {!isLogin && (
                  <>
                    <TextField
                      fullWidth
                      label={t("auth.fullName")}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />

                    <TextField
                      fullWidth
                      select
                      label={t("auth.role", "Account type")}
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      helperText={t(
                        "auth.roleHelp",
                        "Choose whether you are a customer, agent, or admin."
                      )}
                    >
                      <MenuItem value="user">
                        {t("auth.role.user", "User")}
                      </MenuItem>
                      <MenuItem value="agent">
                        {t(
                          "auth.role.agent",
                          "Agent (requires admin approval)"
                        )}
                      </MenuItem>
                      <MenuItem value="admin">
                        {t(
                          "auth.role.admin",
                          "Admin (requires approval in the system)"
                        )}
                      </MenuItem>
                    </TextField>
                  </>
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
                  autoComplete={isLogin ? "current-password" : "new-password"}
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

                {!isLogin && (
                  <>
                    <TextField
                      fullWidth
                      type={showConfirmPassword ? "text" : "password"}
                      label={t("auth.confirmPassword")}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}

                {isLogin && (
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
                )}

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
                  {isLogin ? t("auth.signIn") : t("auth.createAccount")}
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
                {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData((prev) => ({
                      ...prev,
                      role: "user",
                    }));
                  }}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {isLogin ? t("auth.signup") : t("auth.login")}
                </Link>
              </Typography>
              {/* Extra toggle for agent request removed in favor of role selection */}
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthView;
