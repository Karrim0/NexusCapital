import {
  Avatar,
  Box,
  CardContent,
  Container,
  Grid2,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import SectionHeader from "../common/SectionHeader";
import { testimonials } from "../../utils/data";
import { MotionBox, MotionStack, MotionCard } from "../common/MotionComponents";
import { staggerContainer, staggerItem } from "../common/motionVariants";

const Testimonials = () => {
  const { t } = useTranslation();

  return (
    <MotionBox
      id="stories"
      sx={{
        py: { xs: 10, md: 14 },
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
        <MotionStack
          spacing={{ xs: 4, md: 6 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionHeader
            eyebrow={t("testimonials.eyebrow")}
            title={t("testimonials.title")}
            description={t("testimonials.description")}
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
            {testimonials.map((item, index) => (
              <Grid2 key={item.id} size={{ xs: 12, md: 6 }}>
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
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                      "&::before": {
                        opacity: 1,
                      },
                    },
                  }}
                  variants={staggerItem}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <MotionStack spacing={3}>
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <FormatQuoteRoundedIcon
                          color="primary"
                          sx={{
                            fontSize: { xs: 36, md: 40 },
                            opacity: 0.2,
                            position: "absolute",
                            top: -10,
                            left: -10,
                            zIndex: 0,
                          }}
                        />
                        <FormatQuoteRoundedIcon
                          color="primary"
                          sx={{
                            fontSize: { xs: 32, md: 36 },
                            position: "relative",
                            zIndex: 1,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: "1.1rem", md: "1.25rem" },
                          lineHeight: 1.7,
                          fontStyle: "italic",
                          color: "#191510",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        "{t(`testimonials.${item.id}.quote`)}"
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{
                          pt: 2,
                          borderTop: (theme) =>
                            `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: { xs: 48, md: 56 },
                            height: { xs: 48, md: 56 },
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 700,
                            fontSize: { xs: "1.25rem", md: "1.5rem" },
                          }}
                        >
                          {t(`testimonials.${item.id}.author`).charAt(0)}
                        </Avatar>
                        <Stack spacing={0.5}>
                          <Typography
                            fontWeight={700}
                            sx={{
                              fontSize: { xs: "1rem", md: "1.1rem" },
                            }}
                          >
                            {t(`testimonials.${item.id}.author`)}
                          </Typography>
                          <Typography
                            color="#6b6558"
                            sx={{
                              fontSize: { xs: "0.85rem", md: "0.95rem" },
                            }}
                          >
                            {t(`testimonials.${item.id}.title`)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </MotionStack>
                  </CardContent>
                </MotionCard>
              </Grid2>
            ))}
          </MotionBox>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default Testimonials;
