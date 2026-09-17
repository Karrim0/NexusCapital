import { Container, Divider, Typography, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import { stats } from "../../utils/data";
import { MotionBox, MotionStack } from "../common/MotionComponents";
import { staggerContainer, staggerItem } from "../common/motionVariants";

const StatsStrip = () => {
  const { t } = useTranslation();

  return (
    <MotionBox
      sx={{
        width: "100%",
        mt: 10,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <MotionStack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 0 }}
          component="div"
          sx={{
            position: "relative",
            borderRadius: 24,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.92)
                : "#ffffff",
            color: "#191510",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 26px 80px rgba(15,23,42,0.65)"
                : "0 20px 60px rgba(15,23,42,0.16)",
            overflow: "hidden",
            pointerEvents: "auto",
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.12
                )}, transparent 40%, ${alpha(
                  theme.palette.secondary.main,
                  0.12
                )})`,
              opacity: 0.9,
              pointerEvents: "none",
            },
          }}
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((item, index) => (
            <MotionStack
              key={item.id}
              flex={1}
              alignItems="center"
              justifyContent="center"
              py={{ xs: 2.75, md: 3.5 }}
              spacing={0.5}
              sx={{
                position: "relative",
                zIndex: 1,
              }}
              variants={staggerItem}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {item.value}
              </Typography>
              <Typography
                color="#6b6558"
                sx={{
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                }}
              >
                {t(`stats.${item.id}`)}
              </Typography>
              {index !== stats.length - 1 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    display: { xs: "none", md: "block" },
                    opacity: 0.2,
                    borderColor: "divider",
                  }}
                />
              )}
            </MotionStack>
          ))}
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default StatsStrip;
