import { Box, Container, Grid2, Stack, Typography, Chip } from "@mui/material";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxLegalForeignInvestors = ({ content }) => {
  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={4} alignItems="center">
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <PublicRoundedIcon sx={{ color: nx.gold, fontSize: 20 }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                For International Buyers
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.6rem", md: "1.9rem" }, mb: 2 }}>
              {content.title}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 640 }}>
              {content.description}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 3, textAlign: { xs: "left", md: "center" } }}>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.7rem", letterSpacing: "0.08em", mb: 1 }}>
                CONSULTATIONS AVAILABLE IN
              </Typography>
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 600, fontSize: "1.1rem" }}>
                {content.languagesHighlight}
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxLegalForeignInvestors;
