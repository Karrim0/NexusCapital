import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { nx, fontHeading, goldGradient } from "../../../theme/nexusHomeTheme";

const NxFurnitureCta = ({ cta, targetId }) => {
  const scrollToForm = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: "#0a0806", py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={3}>
          <Box sx={{ maxWidth: 640 }}>
            <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.7rem", md: "2.1rem" }, mb: 1.5 }}>
              {cta.title}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.92rem", lineHeight: 1.75 }}>{cta.description}</Typography>
          </Box>
          <Button
            onClick={scrollToForm}
            sx={{ background: goldGradient, color: "#171208", fontWeight: 700, fontSize: "0.82rem", whiteSpace: "nowrap", borderRadius: 999, px: 3.5, py: 1.4, "&:hover": { filter: "brightness(1.05)" } }}
          >
            {cta.cta_label}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default NxFurnitureCta;
