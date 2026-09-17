import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxServicesSection = ({ content }) => {
  const s = content.services_section;
  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.7rem" }, lineHeight: 1.15 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.98rem", lineHeight: 1.75 }}>
              {s.description}
            </Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          {(s.items || []).map((item) => (
            <Grid2 key={item.number} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  bgcolor: nx.creamPaper,
                  borderRadius: 3,
                  p: 3.5,
                  height: "100%",
                  boxShadow: "0 14px 34px rgba(25,21,16,0.06)",
                  transition: "transform 0.25s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: nx.gold,
                    color: "#171208",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    mb: 2.5,
                  }}
                >
                  {item.number}
                </Box>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.2rem", mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.88rem", lineHeight: 1.7 }}>
                  {item.description}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxServicesSection;
