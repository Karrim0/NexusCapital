import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxProjectsStrategy = ({ content }) => {
  const strategy = content.destination_strategy;
  const path = content.buying_path;

  return (
    <Box sx={{ bgcolor: nx.ink }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{strategy.eyebrow}</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.3rem" }, lineHeight: 1.2, mb: 4 }}>
          {strategy.title}
        </Typography>

        <Grid2 container spacing={2.5} sx={{ mb: { xs: 6, md: 8 } }}>
          {(strategy.areas || []).map((area, i) => (
            <Grid2 key={i} size={{ xs: 12, sm: 4 }}>
              <Box sx={{ bgcolor: nx.cream, borderRadius: 3, p: 3, height: "100%" }}>
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1.05rem", mb: 1 }}>{area.name}</Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 2 }}>{area.description}</Typography>
                <Stack spacing={0.8}>
                  {(area.points || []).map((point, j) => (
                    <Stack key={j} direction="row" spacing={1} alignItems="flex-start">
                      <CheckRoundedIcon sx={{ color: "#0f9d78", fontSize: 16, mt: 0.2 }} />
                      <Typography sx={{ color: nx.textOnCream, fontSize: "0.8rem" }}>{point}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid2>
          ))}
        </Grid2>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{path.eyebrow}</Typography>
        </Stack>
        <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.3rem" }, lineHeight: 1.2 }}>
              {path.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{path.description}</Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          {(path.steps || []).map((step) => (
            <Grid2 key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 3, height: "100%" }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: nx.gold, color: "#171208", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", mb: 2 }}>
                  {step.number}
                </Box>
                <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.95rem", mb: 1 }}>{step.title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.82rem", lineHeight: 1.6 }}>{step.description}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxProjectsStrategy;
