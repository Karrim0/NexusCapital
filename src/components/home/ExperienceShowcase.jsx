import {
  CardContent,
  Container,
  Grid2,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import AutoModeRoundedIcon from "@mui/icons-material/AutoModeRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import { MotionBox, MotionStack, MotionCard } from "../common/MotionComponents";
import { staggerContainer, staggerItem } from "../common/motionVariants";
import SectionHeader from "../common/SectionHeader";

const ExperienceShowcase = () => {
  const { t } = useTranslation();

  const highlights = [
    {
      id: "h1",
      title: t("experience.advisoryFirst"),
      description: t("experience.advisoryFirstText"),
      icon: <InsightsRoundedIcon />,
    },
    {
      id: "h2",
      title: t("experience.concierge"),
      description: t("experience.conciergeText"),
      icon: <HubRoundedIcon />,
    },
    {
      id: "h3",
      title: t("experience.alwaysOnReports"),
      description: t("experience.alwaysOnReportsText"),
      icon: <AutoModeRoundedIcon />,
    },
  ];

  return (
    <MotionBox
      id="experiences"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "transparent"
            : alpha(theme.palette.primary.main, 0.02),
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <SectionHeader
            eyebrow={t("experience.ourExperience")}
            title={t("experience.exceptionalService")}
            description={t("experience.exceptionalServiceText")}
            align="center"
          />
          <MotionBox
            component={Grid2}
            container
            spacing={{ xs: 3, md: 4 }}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {highlights.map((item, index) => (
              <Grid2 key={item.id} size={{ xs: 12, md: 4 }}>
                <MotionCard
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0,0,0,0.3)"
                        : "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                  variants={staggerItem}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <MotionStack
                      spacing={2.5}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                      <MotionBox
                        sx={{
                          width: { xs: 56, md: 64 },
                          height: { xs: 56, md: 64 },
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          display: "grid",
                          placeItems: "center",
                          fontSize: { xs: 24, md: 28 },
                          boxShadow: (theme) =>
                            `0 8px 24px ${alpha(
                              theme.palette.primary.main,
                              0.3
                            )}`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.icon}
                      </MotionBox>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        color="#6b6558"
                        sx={{
                          fontSize: { xs: "0.95rem", md: "1rem" },
                          lineHeight: 1.7,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </MotionStack>
                  </CardContent>
                </MotionCard>
              </Grid2>
            ))}
          </MotionBox>
        </Stack>
      </Container>
    </MotionBox>
  );
};

export default ExperienceShowcase;
