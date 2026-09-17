import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxLegalProcess = ({ steps }) => {
  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>How It Works</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, mb: 6, maxWidth: 620 }}>
          Three steps, reviewed with you at every point
        </Typography>

        <Grid2 container spacing={{ xs: 4, md: 2 }}>
          {(steps || []).map((step, i) => (
            <Grid2 key={step.number} size={{ xs: 12, md: 4 }}>
              <Stack sx={{ position: "relative" }}>
                {i < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      top: 28,
                      left: "calc(50% + 60px)",
                      right: "-60px",
                      height: 1,
                      bgcolor: nx.divider,
                    }}
                  />
                )}
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "2.5rem", textAlign: "center", mb: 1 }}>
                  {step.number}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1.05rem", textAlign: "center", mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, textAlign: "center", maxWidth: 260, mx: "auto" }}>
                  {step.description}
                </Typography>
              </Stack>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxLegalProcess;
