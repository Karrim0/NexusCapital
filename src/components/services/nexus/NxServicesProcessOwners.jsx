import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxServicesProcessOwners = ({ content }) => {
  const process = content.process;
  const owners = content.owners;

  return (
    <>
      <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: 4 }}>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{process.eyebrow}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
                {process.title}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", lineHeight: 1.75 }}>{process.description}</Typography>
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2.5}>
            {(process.steps || []).map((step) => (
              <Grid2 key={step.number} size={{ xs: 12, sm: 6, md: 12 / 5 }}>
                <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(201,162,75,0.15)", color: "#a9822f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", mb: 1.5 }}>
                    {step.number}
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.92rem", mb: 0.8 }}>{step.title}</Typography>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem", lineHeight: 1.6 }}>{step.description}</Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      <Box sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{owners.eyebrow}</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2, mb: 2 }}>
                {owners.title}
              </Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.92rem", lineHeight: 1.8, mb: 3 }}>{owners.description}</Typography>
              <Button href="#request-support" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}>
                {owners.cta_label}
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Grid2 container spacing={2}>
                {(owners.cards || []).map((card, i) => (
                  <Grid2 key={i} size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 2.5, height: "100%" }}>
                      <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.9rem", mb: 1 }}>{card.tag}</Typography>
                      <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", lineHeight: 1.65 }}>{card.description}</Typography>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxServicesProcessOwners;
