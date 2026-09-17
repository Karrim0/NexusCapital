import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxAboutWhyChoose = ({ content }) => {
  const s = content.why_choose;

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
        </Stack>
        <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{s.description}</Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          {(s.items || []).map((item) => (
            <Grid2 key={item.number} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 2, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.85rem", mb: 2 }}>
                  {item.number}
                </Box>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.1rem", mb: 1 }}>{item.title}</Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7 }}>{item.description}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxAboutWhyChoose;
