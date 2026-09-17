import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxProjectTrackRecord = ({ project }) => {
  const items = Array.isArray(project.developer_track_record) ? project.developer_track_record.filter((i) => i?.name) : [];
  if (!items.length) return null;

  return (
    <Box id="track-record" sx={{ bgcolor: nx.ink, backgroundImage: `radial-gradient(circle at 85% 20%, rgba(201,162,75,0.1), transparent 45%)`, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>DEVELOPER TRACK RECORD</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.2 }}>
              {items.length + 1} projects. One standard. {items.length} delivered.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.88rem" }}>
              {project.name || project.title} is presented following {items.length} completed residential and tourism developments.
            </Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          {items.map((item, i) => (
            <Grid2 key={i} size={{ xs: 12, sm: 6, md: 12 / Math.min(items.length, 5) }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%" }}>
                <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: nx.gold, color: "#171208", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", mb: 1.5 }}>
                  {String(i + 1).padStart(2, "0")}
                </Box>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.05rem", mb: 1 }}>
                  {item.name}
                </Typography>
                {item.delivered_label && (
                  <Typography sx={{ color: "#c25b3a", fontWeight: 700, fontSize: "0.72rem" }}>{item.delivered_label}</Typography>
                )}
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxProjectTrackRecord;
