import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const ICONS = [
  FactCheckRoundedIcon,
  DescriptionRoundedIcon,
  VerifiedUserRoundedIcon,
  AssignmentTurnedInRoundedIcon,
  GavelRoundedIcon,
  FolderSharedRoundedIcon,
  ForumRoundedIcon,
  PublicRoundedIcon,
];

const NxLegalServicesGrid = ({ services }) => {
  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>Legal Services</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" }, mb: 5, maxWidth: 620 }}>
          Support across every stage of your property documentation
        </Typography>

        <Grid2 container spacing={2.5}>
          {(services || []).map((service, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Grid2 key={service.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box
                  sx={{
                    bgcolor: nx.panel,
                    border: `1px solid ${nx.panelBorder}`,
                    borderRadius: 3,
                    p: 3,
                    height: "100%",
                    transition: "border-color 0.2s, transform 0.2s",
                    "&:hover": { borderColor: nx.gold, transform: "translateY(-3px)" },
                  }}
                >
                  <Icon sx={{ color: nx.gold, fontSize: 26, mb: 2 }} />
                  <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.95rem", mb: 1 }}>{service.title}</Typography>
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.82rem", lineHeight: 1.7 }}>{service.description}</Typography>
                </Box>
              </Grid2>
            );
          })}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxLegalServicesGrid;
