import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button } from "@mui/material";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BookTourDialog from "../../common/BookTourDialog";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

// A dedicated "{Project} Location" card matching the reference layout:
// centered title + description, a stack of distance stats with a
// Schedule Tour button on one side, an embedded map on the other.
const NxProjectLocationCard = ({ project, whatsappNumber }) => {
  const name = project.name || project.title || "This project";
  const [tourOpen, setTourOpen] = useState(false);
  const stats = [
    { icon: FlightRoundedIcon, label: "From Airport", value: project.mins_from_airport },
    { icon: LocalHospitalRoundedIcon, label: "From Hospitals", value: project.mins_from_hospitals },
    { icon: ApartmentRoundedIcon, label: "From Downtown", value: project.mins_from_downtown },
    { icon: BeachAccessRoundedIcon, label: "From Beaches", value: project.mins_from_beach },
  ].filter((s) => s.value);

  if (!project.location_description && !stats.length && !project.map_embed_url) return null;

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 5,
            bgcolor: nx.ink,
            p: { xs: 3, md: 5 },
            backgroundImage: "linear-gradient(160deg, #14181f 0%, #0a0c10 100%)",
            border: `1px solid ${nx.panelBorder}`,
          }}
        >
          <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.4rem", md: "1.8rem" }, textAlign: "center", mb: 2 }}>
            {name} Location
          </Typography>
          {project.location_description && (
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem", lineHeight: 1.8, textAlign: "center", maxWidth: 760, mx: "auto", mb: 4 }}>
              {project.location_description}
            </Typography>
          )}

          <Grid2 container spacing={3} alignItems="stretch">
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Stack spacing={2} justifyContent="center" sx={{ height: "100%" }}>
                {stats.map((s, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "rgba(201,162,75,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <s.icon sx={{ color: nx.gold, fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.95rem" }}>
                      {s.value} min {s.label}
                    </Typography>
                  </Stack>
                ))}
                <Button
                  onClick={() => setTourOpen(true)}
                  variant="contained"
                  sx={{
                    alignSelf: "flex-start",
                    mt: 1,
                    bgcolor: nx.gold,
                    color: "#171208",
                    fontWeight: 700,
                    borderRadius: 999,
                    px: 3,
                    "&:hover": { bgcolor: nx.gold, opacity: 0.9 },
                  }}
                >
                  Book Tour
                </Button>
              </Stack>
            </Grid2>

            {project.map_embed_url && (
              <Grid2 size={{ xs: 12, md: 7 }}>
                <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden", height: { xs: 260, md: 300 }, border: `1px solid ${nx.panelBorder}` }}>
                  {/(\/maps\/embed|output=embed)/.test(project.map_embed_url) ? (
                    <Box
                      component="iframe"
                      src={project.map_embed_url}
                      title={`${name} location map`}
                      loading="lazy"
                      sx={{ width: "100%", height: "100%", border: 0 }}
                    />
                  ) : (
                    <Box
                      component="a"
                      href={project.map_embed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        bgcolor: nx.panel,
                        color: nx.gold,
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      View on Google Maps
                    </Box>
                  )}
                  <Button
                    component="a"
                    href={project.map_embed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    startIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "#fff",
                      color: "#1a1a1a",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      px: 1.5,
                      "&:hover": { bgcolor: "#fff" },
                    }}
                  >
                    Open in Maps
                  </Button>
                </Box>
              </Grid2>
            )}
          </Grid2>
        </Box>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            onClick={() => setTourOpen(true)}
            variant="contained"
            sx={{
              bgcolor: nx.ink,
              color: nx.textOnDark,
              fontWeight: 700,
              borderRadius: 999,
              px: 4,
              py: 1.3,
              "&:hover": { bgcolor: nx.ink, opacity: 0.85 },
            }}
          >
            Book Tour
          </Button>
        </Box>
      </Container>

      <BookTourDialog open={tourOpen} onClose={() => setTourOpen(false)} itemName={name} />
    </Box>
  );
};

export default NxProjectLocationCard;
