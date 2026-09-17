import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxServicesGrid = ({ content }) => {
  const s = content.services_section;

  return (
    <Box id="services-grid" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", lineHeight: 1.75 }}>{s.description}</Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          {(s.items || []).map((item) => (
            <Grid2 key={item.number} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%", display: "flex", flexDirection: "column", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 2, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.85rem", mb: 2 }}>
                  {item.number}
                </Box>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.1rem", mb: 1 }}>{item.title}</Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 2 }}>{item.description}</Typography>
                <Stack spacing={0.7} sx={{ mb: 2, flex: 1 }}>
                  {(item.bullets || []).map((b, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 16, mt: 0.2 }} />
                      <Typography sx={{ color: nx.textOnCream, fontSize: "0.8rem" }}>{b}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center" component="a" href="#request-support" sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", textDecoration: "none", mt: "auto" }}>
                  <span>{item.cta_label}</span>
                  <ArrowOutwardRoundedIcon sx={{ fontSize: 14 }} />
                </Stack>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxServicesGrid;
