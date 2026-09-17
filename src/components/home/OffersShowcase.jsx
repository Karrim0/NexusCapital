import {
  Box,
  CardContent,
  Chip,
  Container,
  Grid2,
  Stack,
  Typography,
  alpha,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { Link } from "react-router-dom";
import { MotionBox, MotionStack, MotionCard } from "../common/MotionComponents";
import { staggerContainer, staggerItem } from "../common/motionVariants";
import SectionHeader from "../common/SectionHeader";

const OffersShowcase = () => {
  const { t } = useTranslation();

  const offers = [
    {
      id: "o1",
      icon: <LocalOfferRoundedIcon />,
      badge: t("offers.cards.o1.badge"),
      title: t("offers.cards.o1.title"),
      description: t("offers.cards.o1.description"),
      meta: t("offers.cards.o1.meta"),
    },
    {
      id: "o2",
      icon: <PercentRoundedIcon />,
      badge: t("offers.cards.o2.badge"),
      title: t("offers.cards.o2.title"),
      description: t("offers.cards.o2.description"),
      meta: t("offers.cards.o2.meta"),
    },
    {
      id: "o3",
      icon: <RocketLaunchRoundedIcon />,
      badge: t("offers.cards.o3.badge"),
      title: t("offers.cards.o3.title"),
      description: t("offers.cards.o3.description"),
      meta: t("offers.cards.o3.meta"),
    },
  ];

  return (
    <MotionBox
      id="offers"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "transparent"
            : alpha(theme.palette.secondary.main, 0.02),
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <Stack spacing={{ xs: 4, md: 6 }}>
          <SectionHeader
            eyebrow={t("offers.eyebrow")}
            title={t("offers.title")}
            description={t("offers.description")}
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
            {offers.map((offer, index) => (
              <Grid2 key={offer.id} size={{ xs: 12, md: 4 }}>
                <MotionCard
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: "background.paper",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 6px 24px rgba(0,0,0,0.35)"
                        : "0 6px 24px rgba(15,23,42,0.08)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: (theme) =>
                        `radial-gradient(circle at 0 0, ${alpha(
                          theme.palette.secondary.main,
                          0.14
                        )}, transparent 55%)`,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      pointerEvents: "none",
                    },
                    "&:hover::before": {
                      opacity: 1,
                    },
                  }}
                  variants={staggerItem}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <MotionStack
                      spacing={2.5}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.15 }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <MotionBox
                          sx={{
                            width: { xs: 56, md: 64 },
                            height: { xs: 56, md: 64 },
                            borderRadius: "50%",
                            bgcolor: "secondary.main",
                            color: "secondary.contrastText",
                            display: "grid",
                            placeItems: "center",
                            fontSize: { xs: 24, md: 28 },
                            boxShadow: (theme) =>
                              `0 10px 30px ${alpha(
                                theme.palette.secondary.main,
                                0.45
                              )}`,
                          }}
                          whileHover={{ scale: 1.08, rotate: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          {offer.icon}
                        </MotionBox>
                        <Chip
                          label={offer.badge}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            borderRadius: 999,
                            px: 1.5,
                            bgcolor: (theme) =>
                              alpha(theme.palette.secondary.main, 0.12),
                            color: "secondary.main",
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.secondary.main,
                                0.3
                              )}`,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                          }}
                        />
                      </Stack>

                      <Box>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{
                            fontSize: { xs: "1.25rem", md: "1.5rem" },
                            mb: 1,
                          }}
                        >
                          {offer.title}
                        </Typography>
                        <Typography
                          color="#6b6558"
                          sx={{
                            fontSize: { xs: "0.95rem", md: "1rem" },
                            lineHeight: 1.7,
                          }}
                        >
                          {offer.description}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          pt: 1.5,
                          borderTop: (theme) =>
                            `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "success.main",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: "0.85rem", md: "0.9rem" },
                            color: "#6b6558",
                          }}
                        >
                          {offer.meta}
                        </Typography>
                      </Stack>
                    </MotionStack>
                  </CardContent>
                </MotionCard>
              </Grid2>
            ))}
          </MotionBox>

          <MotionBox
            sx={{
              mt: { xs: 2, md: 4 },
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              border: (theme) =>
                `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.6)
                  : `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.06
                    )}, ${alpha(theme.palette.secondary.main, 0.04)})`,
            }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2.5}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, mb: 0.5 }}
                >
                  {t("offers.ctaTitle")}
                </Typography>
                <Typography
                  color="#6b6558"
                  sx={{
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    maxWidth: 520,
                    lineHeight: 1.7,
                  }}
                >
                  {t("offers.ctaDescription")}
                </Typography>
              </Box>
              <Stack spacing={1.5} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                <Button
                  component={Link}
                  to="/properties"
                  variant="contained"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.1, md: 1.3 },
                    borderRadius: 999,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: (theme) =>
                      `0 10px 26px ${alpha(theme.palette.primary.main, 0.35)}`,
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 14px 34px ${alpha(
                          theme.palette.primary.main,
                          0.45
                        )}`,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.28s ease",
                  }}
                >
                  {t("offers.viewAll")}
                </Button>
                <Typography
                  variant="caption"
                  color="#6b6558"
                  sx={{ maxWidth: 260, lineHeight: 1.6 }}
                >
                  {t("offers.disclaimer")}
                </Typography>
              </Stack>
            </Stack>
          </MotionBox>
        </Stack>
      </Container>
    </MotionBox>
  );
};

export default OffersShowcase;


