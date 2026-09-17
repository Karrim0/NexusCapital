import { Container, Stack, Typography, alpha, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { partners } from "../../utils/data";
import { MotionBox, MotionStack } from "../common/MotionComponents";
import { staggerContainer, staggerItem } from "../common/motionVariants";

const PartnersBar = () => {
  const { t } = useTranslation();

  return (
    <MotionBox
      sx={{
        py: { xs: 6, md: 8 },
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.5)
            : alpha(theme.palette.primary.main, 0.03),
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <MotionStack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={{ xs: 3, md: 4 }}
          justifyContent="space-between"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Typography
            variant="h6"
            color="#6b6558"
            fontWeight={600}
            sx={{
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {t("partners.trustedBy")}
          </Typography>
          <MotionBox
            component={Stack}
            direction="row"
            spacing={{ xs: 2, md: 3 }}
            flexWrap="wrap"
            useFlexGap
            justifyContent="center"
            sx={{ gap: { xs: 1.5, md: 2 } }}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {partners.map((partner, index) => (
              <MotionBox
                key={partner}
                variants={staggerItem}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Chip
                  label={partner}
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 0.5, md: 0.75 },
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.6)
                        : "background.paper",
                    border: (theme) =>
                      `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                      borderColor: "primary.main",
                    },
                    transition: "all 0.3s ease",
                  }}
                />
              </MotionBox>
            ))}
          </MotionBox>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default PartnersBar;
