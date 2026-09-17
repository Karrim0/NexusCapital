import {
  Box,
  Container,
  Typography,
  Button,
  alpha,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MotionBox, MotionStack } from "../components/common/MotionComponents";
import { fadeInUp } from "../components/common/motionVariants";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";

const NotFoundView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <MotionStack spacing={4}>
          <MotionBox
            sx={{
              position: "relative",
              width: 220,
              height: 220,
              mx: "auto",
            }}
          >
            {[0, 1, 2].map((ring) => (
              <Box
                key={ring}
                sx={{
                  position: "absolute",
                  inset: ring * 14,
                  borderRadius: "50%",
                  border: (theme) =>
                    `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.15 * (3 - ring)
                    )}`,
                  animation: ring === 0 ? "spin 18s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            ))}
            <Box
              sx={{
                position: "absolute",
                inset: 55,
                borderRadius: "50%",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: (theme) =>
                  `0 25px 60px ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <HomeWorkRoundedIcon
                sx={{ fontSize: 70, color: "primary.main" }}
              />
            </Box>
          </MotionBox>

          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "3rem", md: "4.5rem" },
              letterSpacing: "0.1em",
            }}
          >
            404
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {t("notFound.title", "Destination Not Found")}
          </Typography>
          <Typography
            variant="body1"
            color="#6b6558"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {t(
              "notFound.subtitle",
              "The space you're looking for may have been leased, moved, or never existed. Let's guide you back to the right neighborhood."
            )}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate("/")}
              sx={{ px: 4, textTransform: "none", fontWeight: 600 }}
            >
              {t("notFound.backHome", "Back to Home")}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<SupportAgentRoundedIcon />}
              onClick={() => navigate("/contact")}
              sx={{ px: 4, textTransform: "none", fontWeight: 600 }}
            >
              {t("notFound.contactUs", "Contact Support")}
            </Button>
          </Stack>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default NotFoundView;
