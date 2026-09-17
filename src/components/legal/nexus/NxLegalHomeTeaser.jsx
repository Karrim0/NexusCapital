import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

/**
 * Compact homepage teaser for the Legal Services & Property Documentation
 * page. Keeps the homepage itself light while pointing interested buyers to
 * the full /legal-services page for the lawyer profile, services, process,
 * and FAQ.
 */
const NxLegalHomeTeaser = ({ content }) => {
  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={4} alignItems="center">
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <GavelRoundedIcon sx={{ color: nx.gold, fontSize: 20 }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                {content.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.2, mb: 2 }}>
              {content.title}
            </Typography>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.92rem", lineHeight: 1.8, maxWidth: 620 }}>
              {content.description}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button
              component={RouterLink}
              to="/legal-services"
              sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3.5, py: 1.3, fontSize: "0.8rem", whiteSpace: "nowrap", "&:hover": { bgcolor: nx.goldLight } }}
            >
              View Legal Services
            </Button>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxLegalHomeTeaser;
