import { Box, Container, Grid2, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import { nx } from "../../../theme/nexusHomeTheme";

const icons = [SearchRoundedIcon, ApartmentRoundedIcon, ExploreRoundedIcon, VerifiedUserRoundedIcon];

const NxRentFeatureStrip = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <Box sx={{ bgcolor: nx.ink, borderTop: `1px solid ${nx.panelBorder}`, py: { xs: 4, md: 5 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2.5}>
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: "rgba(201,162,75,0.12)",
                      color: nx.gold,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.88rem", mb: 0.3 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.78rem", lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid2>
            );
          })}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxRentFeatureStrip;
