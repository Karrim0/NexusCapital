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
  Avatar,
  alpha,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../../context/CustomizerContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const AgentProfileView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Ahmed Ali",
    email: "ahmed.ali@nexuscapital.com",
    phone: "+971 50 123 4567",
    location: "Dubai, UAE",
    company: "Nexus Capital",
    commission: "3.5%",
    bio: "Experienced real estate agent specializing in luxury properties and commercial real estate.",
    avatar: null,
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
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
                {t("dashboard.menu.agentProfile") || "Agent Profile"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t("dashboard.agentProfile.subtitle") ||
                  "Manage agent profile information"}
              </Typography>
            </Box>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{
                  textTransform: "none",
                  px: 3,
                  boxShadow: (theme) =>
                    `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {t("dashboard.agentProfile.edit") || "Edit Profile"}
              </Button>
            ) : (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  sx={{
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  {t("dashboard.agentProfile.cancel") || "Cancel"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    textTransform: "none",
                    px: 3,
                    boxShadow: (theme) =>
                      `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {t("dashboard.agentProfile.save") || "Save Changes"}
                </Button>
              </Stack>
            )}
          </Box>

          <Grid2 container spacing={3}>
            {/* Profile Picture & Basic Info */}
            <Grid2 size={{ xs: 12, md: 4 }}>
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
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "primary.main",
                        fontSize: "3rem",
                        mb: 2,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    {isEditing && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          [isRTL ? "left" : "right"]: 0,
                          bgcolor: "background.paper",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                          },
                        }}
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                    {profileData.fullName}
                  </Typography>
                  <Chip
                    label={t("dashboard.status.active")}
                    color="success"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Stack spacing={1.5} sx={{ mt: 3 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <EmailIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {profileData.email}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <PhoneIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {profileData.phone}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {profileData.location}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <BusinessIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {profileData.company}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <AttachMoneyIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Commission: {profileData.commission}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid2>

            {/* Profile Details */}
            <Grid2 size={{ xs: 12, md: 8 }}>
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
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 3, textAlign: isRTL ? "right" : "left" }}
                  >
                    {t("dashboard.agentProfile.personalInformation") ||
                      "Personal Information"}
                  </Typography>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label={
                        t("dashboard.agentProfile.fullName") || "Full Name"
                      }
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />

                    <TextField
                      fullWidth
                      label={t("dashboard.agentProfile.email") || "Email"}
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />

                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={t("dashboard.agentProfile.phone") || "Phone"}
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={
                            t("dashboard.agentProfile.location") || "Location"
                          }
                          name="location"
                          value={profileData.location}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </Grid2>
                    </Grid2>

                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={
                            t("dashboard.agentProfile.company") || "Company"
                          }
                          name="company"
                          value={profileData.company}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label={
                            t("dashboard.agentProfile.commission") ||
                            "Commission"
                          }
                          name="commission"
                          value={profileData.commission}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </Grid2>
                    </Grid2>

                    <Divider />

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label={t("dashboard.agentProfile.bio") || "Bio"}
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder={
                        t("dashboard.agentProfile.bioPlaceholder") ||
                        "Tell us about yourself..."
                      }
                    />
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

export default AgentProfileView;
