import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxProjectOverview = ({ project }) => {
  const unitTypes = Array.isArray(project.unit_types) ? project.unit_types.filter((u) => u?.type) : [];
  const residenceTypes = unitTypes.map((u) => u.type).join(", ");
  const currentAreas =
    project.size_from && project.size_to
      ? `${project.size_from}-${project.size_to} sqm`
      : project.size_from
      ? `From ${project.size_from} sqm`
      : null;

  const facts = [
    { label: "Contract", value: project.contract_type || (project.amenities?.includes?.("green_contract") ? "Green Contract" : null) },
    { label: "Residence Types", value: residenceTypes || null },
    { label: "Current Areas", value: currentAreas },
    { label: "Delivery Date", value: project.delivery_date },
  ].filter((f) => f.value);

  if (!project.project_details && !facts.length) return null;

  return (
    <Box id="overview-details" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>PROJECT OVERVIEW</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2, mb: 4 }}>
          A {project.location || "Red Sea"} address shaped by the sea
        </Typography>

        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: project.cover_image || project.main_image ? 7 : 12 }}>
            <Box sx={{ bgcolor: "#fff", borderRadius: 4, p: { xs: 3, md: 4 }, height: "100%", border: `1px solid ${nx.panelBorder}` }}>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.2rem", mb: 2 }}>
                {project.name || project.title}
              </Typography>
              {project.project_details && (
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", lineHeight: 1.85, mb: 3 }}>
                  {project.project_details}
                </Typography>
              )}
              {facts.length > 0 && (
                <Grid2 container spacing={2}>
                  {facts.map((f, i) => (
                    <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 2, p: 2 }}>
                        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.3 }}>
                          {f.label}
                        </Typography>
                        <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.88rem" }}>{f.value}</Typography>
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>
              )}
            </Box>
          </Grid2>

          {(project.cover_image || project.main_image) && (
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden", height: "100%", minHeight: 280 }}>
                <Box
                  sx={{
                    height: "100%",
                    backgroundImage: `url(${project.cover_image || project.main_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {project.architectural_vision && (
                  <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, bgcolor: "rgba(6,8,12,0.72)", p: 2.5 }}>
                    <Typography sx={{ color: nx.gold, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.5 }}>
                      Design Character
                    </Typography>
                    <Typography sx={{ color: nx.textOnDark, fontWeight: 600, fontSize: "0.9rem", lineHeight: 1.5 }}>
                      {project.architectural_vision.split(/[.\n]/)[0]}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid2>
          )}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxProjectOverview;
