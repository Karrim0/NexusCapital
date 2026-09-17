import { Box, Container, Grid2, Stack, Typography, Button, Chip } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxServiceSpotlight = ({ content }) => {
  const s = content.spotlight;

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: 4 }}>
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
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
              <Chip label={s.tag} size="small" sx={{ bgcolor: "rgba(201,162,75,0.12)", color: "#a9822f", fontWeight: 700, fontSize: "0.68rem", mb: 2 }} />
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.5rem", lineHeight: 1.3, mb: 2 }}>
                {s.spotlight_title}
              </Typography>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.8, mb: 3 }}>{s.spotlight_description}</Typography>

              <Grid2 container spacing={2.5} sx={{ mb: 3 }}>
                {(s.columns || []).map((col, i) => (
                  <Grid2 key={i} size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.88rem", mb: 0.8 }}>{col.title}</Typography>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", lineHeight: 1.65 }}>{col.description}</Typography>
                  </Grid2>
                ))}
              </Grid2>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button href="#request-support" sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, borderRadius: 999, px: 3, py: 1.1, fontSize: "0.76rem", "&:hover": { bgcolor: "#1a1f2b" } }}>
                  {s.primary_cta}
                </Button>
                <Button href="#request-support" variant="outlined" sx={{ color: nx.textOnCream, borderColor: "rgba(25,21,16,0.2)", fontWeight: 700, borderRadius: 999, px: 3, py: 1.1, fontSize: "0.76rem" }}>
                  {s.secondary_cta}
                </Button>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 5 }}>
            <Box sx={{ bgcolor: nx.ink, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "1.1rem", mb: 2 }}>{s.side_tag}</Typography>
              <Typography sx={{ color: nx.textOnDark, fontSize: "0.95rem", lineHeight: 1.7, mb: 3 }}>{s.side_title}</Typography>
              <Stack spacing={1.3}>
                {(s.side_bullets || []).map((b, i) => (
                  <Stack key={i} direction="row" spacing={1.2} alignItems="flex-start">
                    <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 18, mt: 0.2 }} />
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem" }}>{b}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxServiceSpotlight;
