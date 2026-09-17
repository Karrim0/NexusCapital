import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WavesRoundedIcon from "@mui/icons-material/WavesRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import ArchitectureRoundedIcon from "@mui/icons-material/ArchitectureRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const investmentIcons = [PlaceRoundedIcon, TrendingUpRoundedIcon, ShowChartRoundedIcon, PersonRoundedIcon, WavesRoundedIcon, TuneRoundedIcon];
const lifestyleIcons = [WbSunnyRoundedIcon, ApartmentRoundedIcon, AirRoundedIcon, ArchitectureRoundedIcon, GroupsRoundedIcon, AutoAwesomeRoundedIcon];

const defaultInvestment = (project) => [
  { title: `Prime ${project.district || project.location || "Red Sea"} Location`, description: `Positioned in one of ${project.location || "the region"}'s fastest-growing coastal areas with rising buyer and visitor attention.` },
  { title: "Holiday Rental Demand", description: "The Red Sea lifestyle supports demand for holiday stays and short-term rentals." },
  { title: "Capital Appreciation", description: "Early ownership can support long-term value growth as the area and project develop." },
  { title: "Personal Use + Investment", description: "Use it as your seaside escape, a holiday base, or a rental-focused property asset." },
  { title: "Sea-View Opportunity", description: "Selected sea-view units create stronger emotional appeal, guest interest, and future resale positioning." },
  { title: "Flexible Ownership", description: "Choose from multiple down payment and installment plans, with discounts for shorter schedules or cash." },
];

const defaultLifestyle = (project) => [
  { title: "Breathtaking Sea Views", description: "Start the morning with open Red Sea scenery and a calm coastal atmosphere." },
  { title: "Modern Amenities", description: "Designed for easy holiday use, relaxed living, and resort-style convenience." },
  { title: "Fresh Sea Breeze", description: `Enjoy open sky, coastal air, and the peaceful rhythm of ${project.district || project.location || "the Red Sea"}.` },
  { title: "Smart Look Concept", description: "Sophisticated architecture and contemporary finishing create a modern coastal identity." },
  { title: "Vibrant Community", description: "A Red Sea setting designed for owners, holiday guests, and lifestyle-focused buyers." },
  { title: "A Better Way of Living", description: `At ${project.name || project.title}, you are not simply buying a property. You are investing in a new lifestyle.` },
];

const NxProjectInvestmentLifestyle = ({ project }) => {
  const investment = project.investment_cards?.length ? project.investment_cards : defaultInvestment(project);
  const lifestyle = project.lifestyle_cards?.length ? project.lifestyle_cards : defaultLifestyle(project);

  return (
    <>
      <Box id="investment" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ maxWidth: 560 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: "#0f9d78" }} />
                <Typography sx={{ color: "#0f9d78", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>STRONG INVESTMENT OPPORTUNITY</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
                A Red Sea property opportunity at today's prices
              </Typography>
            </Box>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", maxWidth: 340 }}>
              {project.name || project.title} combines a prime {project.district || project.location || "Red Sea"} location, holiday-rental appeal, flexible payment plans, and excellent potential for long-term capital appreciation.
            </Typography>
          </Stack>

          <Grid2 container spacing={2.5}>
            {investment.map((item, i) => {
              const Icon = investmentIcons[i % investmentIcons.length];
              return (
                <Grid2 key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, height: "100%", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: "rgba(15,157,120,0.12)", color: "#0f9d78", display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
                      <Icon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "0.95rem", mb: 0.8 }}>{item.title}</Typography>
                    <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", lineHeight: 1.65 }}>{item.description}</Typography>
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>
        </Container>
      </Box>

      <Box id="lifestyle" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ maxWidth: 560 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: "#5ce6d0" }} />
                <Typography sx={{ color: "#5ce6d0", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>LIFESTYLE</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
                Wake up to breathtaking sea views and a vacation feeling every day
              </Typography>
            </Box>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", maxWidth: 340 }}>
              Enjoy a peaceful atmosphere, fresh sea breeze, modern amenities, and a coastal lifestyle where your home feels like a daily escape.
            </Typography>
          </Stack>

          <Grid2 container spacing={2.5}>
            {lifestyle.map((item, i) => {
              const Icon = lifestyleIcons[i % lifestyleIcons.length];
              return (
                <Grid2 key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 2.5, height: "100%" }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        bgcolor: "rgba(201,162,75,0.15)",
                        color: nx.gold,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        mb: 1.5,
                      }}
                    >
                      <Icon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.95rem", mb: 0.8 }}>{item.title}</Typography>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", lineHeight: 1.65 }}>{item.description}</Typography>
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxProjectInvestmentLifestyle;
