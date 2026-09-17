import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const defaultJourney = (project) => [
  { title: "Request Availability", description: `Receive the current price list, available units, views, and starting-price opportunities${project.starting_price ? ` from ${project.starting_price}` : ""}.` },
  { title: "Choose Your Preferred Unit", description: "Compare floor plans, view options, floor positions, and project progress visuals." },
  { title: "Compare Payment Plans", description: "Review the available down-payment and cash-payment plans to choose the best discount and schedule." },
  { title: "Secure the Offer", description: project.offer_discount_percent ? `Reserve before the limited-time ${project.offer_discount_percent}% discount ends or prices increase.` : "Reserve your preferred unit before prices increase." },
  { title: "Plan Delivery", description: `Prepare for the planned ${project.delivery_date || "future"} delivery and confirm all contract milestones.` },
  { title: "Live, Holiday, or Rent", description: "Plan your seaside lifestyle, short-term rental setup, furnishing, and long-term resale strategy." },
];

const NxProjectLocationJourney = ({ project }) => {
  const journey = project.buyer_journey_steps?.length ? project.buyer_journey_steps : defaultJourney(project);
  const advantagePoints = project.location_advantage
    ? project.location_advantage.split(/\n+/).filter(Boolean)
    : [
        `Located in ${project.district || project.location || "a fast-growing coastal area"}.`,
        "Coastal setting suitable for holiday rentals, short stays, and personal seaside use.",
        "Sea-view opportunities support stronger lifestyle appeal and future resale interest.",
        "Designed around modern coastal living, smart architecture, and resort convenience.",
      ];

  return (
    <>
      {project.map_embed_url && (
        <Box id="location" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
          <Container maxWidth="lg">
            <Grid2 container spacing={2.5}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden", height: 380, backgroundImage: `linear-gradient(180deg, rgba(6,8,12,0.1) 0%, rgba(6,8,12,0.85) 100%), url(${project.cover_image || ""})`, backgroundSize: "cover", backgroundPosition: "center", bgcolor: nx.ink }}>
                  <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                      <Box sx={{ width: 24, height: 2, bgcolor: "#5ce6d0" }} />
                      <Typography sx={{ color: "#5ce6d0", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>PRIME LOCATION</Typography>
                    </Stack>
                    <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.25, mb: 2 }}>
                      {project.district || project.location}, a fast-growing coastal investment area
                    </Typography>
                    <Stack spacing={0.5} sx={{ mt: "auto" }}>
                      {(project.travel_distances?.length
                        ? project.travel_distances.filter((d) => d?.destination)
                        : [
                            ["Project", project.name || project.title],
                            ["Area", project.district || project.location],
                            ["Coastline", "Red Sea"],
                          ].map(([label, value]) => ({ destination: label, time: value }))
                      ).map((row, i) => (
                        <Stack key={i} direction="row" justifyContent="space-between" sx={{ borderTop: "1px solid rgba(245,241,230,0.15)", pt: 0.6 }}>
                          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem" }}>{row.destination}</Typography>
                          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem" }}>{row.time}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Box>
                <Box sx={{ mt: 1.5, borderRadius: 3, overflow: "hidden", height: 220 }}>
                  {/\/maps\/embed/.test(project.map_embed_url || "") ? (
                    <Box component="iframe" src={project.map_embed_url} title="Project location" loading="lazy" sx={{ width: "100%", height: "100%", border: 0 }} />
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
                        fontSize: "0.85rem",
                      }}
                    >
                      View on Google Maps
                    </Box>
                  )}
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%" }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box sx={{ width: 24, height: 2, bgcolor: "#0f9d78" }} />
                    <Typography sx={{ color: "#0f9d78", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>AREA LIFESTYLE</Typography>
                  </Stack>
                  <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.6rem", lineHeight: 1.25, mb: 3 }}>
                    A strategic Red Sea address for holidays, living, and investment
                  </Typography>
                  <Stack spacing={1.5}>
                    {advantagePoints.map((point, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start" sx={{ bgcolor: "rgba(15,157,120,0.06)", borderRadius: 2, p: 1.5 }}>
                        <CheckRoundedIcon sx={{ color: "#0f9d78", fontSize: 18, mt: 0.2 }} />
                        <Typography sx={{ color: nx.textOnCream, fontSize: "0.85rem", lineHeight: 1.6 }}>{point}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid2>
            </Grid2>
          </Container>
        </Box>
      )}

      <Box id="journey" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 }, borderTop: project.map_embed_url ? "1px solid rgba(25,21,16,0.06)" : "none" }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ maxWidth: 560 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: "#5ce6d0" }} />
                <Typography sx={{ color: "#5ce6d0", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>BUYER JOURNEY</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
                Secure your {project.name || project.title} opportunity with clarity
              </Typography>
            </Box>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", maxWidth: 340 }}>
              The team can help you verify availability, payment schedules, view options, delivery details, contract steps, and future rental strategy before reservation.
            </Typography>
          </Stack>

          <Grid2 container spacing={2.5}>
            {journey.map((step, i) => (
              <Grid2 key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                  <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "rgba(201,162,75,0.15)", color: "#a9822f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", mb: 1.5 }}>
                    {i + 1}
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.95rem", mb: 0.8 }}>{step.title}</Typography>
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", lineHeight: 1.65 }}>{step.description}</Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxProjectLocationJourney;
