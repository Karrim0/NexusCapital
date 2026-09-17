import { Box, Container, Grid2, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxStatsStrip = ({ stats = [] }) => {
  if (!stats.length) return null;
  return (
    <Box sx={{ bgcolor: nx.ink, pb: { xs: 6, md: 8 }, pt: { xs: 1, md: 1 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2}>
          {stats.map((s, i) => (
            <Grid2 key={i} size={{ xs: 4 }}>
              <Box
                sx={{
                  bgcolor: nx.panel,
                  border: `1px solid ${nx.panelBorder}`,
                  borderRadius: 3,
                  py: { xs: 2, md: 3 },
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: { xs: "1.6rem", md: "2.2rem" } }}>
                  {s.value}
                </Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: { xs: "0.68rem", md: "0.82rem" }, mt: 0.5 }}>
                  {s.label}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxStatsStrip;
