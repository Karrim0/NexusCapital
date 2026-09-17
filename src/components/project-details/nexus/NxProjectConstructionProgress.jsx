import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const ProgressBar = ({ label, value }) => (
  <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontFamily: fontHeading, fontWeight: 700, color: nx.textOnCream, fontSize: "1.6rem", mb: 1 }}>
      {value}%
    </Typography>
    <Box sx={{ height: 6, borderRadius: 999, bgcolor: "rgba(25,21,16,0.08)", overflow: "hidden" }}>
      <Box sx={{ height: "100%", width: `${Math.min(100, Math.max(0, Number(value) || 0))}%`, borderRadius: 999, background: `linear-gradient(90deg, ${nx.gold} 0%, ${nx.goldLight} 100%)` }} />
    </Box>
  </Box>
);

const NxProjectConstructionProgress = ({ project, whatsappNumber }) => {
  const progress = project.construction_progress;
  if (!progress || (progress.concrete == null && progress.brickwork == null && progress.finishing == null)) {
    return null;
  }

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(`Hello! Could you share the latest construction photos for "${project.name || project.title}"?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box id="progress" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>CONSTRUCTION PROGRESS</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.2, mb: 4 }}>
          Moving ahead toward {project.delivery_date || "handover"}
        </Typography>

        <Grid2 container spacing={2.5} sx={{ mb: 3 }}>
          {progress.concrete != null && progress.concrete !== "" && (
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <ProgressBar label="Concrete structure" value={progress.concrete} />
            </Grid2>
          )}
          {progress.brickwork != null && progress.brickwork !== "" && (
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <ProgressBar label="Brickwork" value={progress.brickwork} />
            </Grid2>
          )}
          {progress.finishing != null && progress.finishing !== "" && (
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <ProgressBar label="Finishing works" value={progress.finishing} />
            </Grid2>
          )}
        </Grid2>

        <Button
          onClick={handleWhatsApp}
          sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.78rem", borderRadius: 999, px: 3.5, py: 1.2, "&:hover": { bgcolor: "#1a1f2b" } }}
        >
          Request Latest Construction Photos
        </Button>
      </Container>
    </Box>
  );
};

export default NxProjectConstructionProgress;
