import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { Link } from "react-router-dom";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxDestinationsSection = ({ content }) => {
  const s = content.destinations_section;
  const items = s.items || [];

  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={2} alignItems="flex-start" sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.9rem", sm: "2.3rem", md: "2.7rem" }, lineHeight: 1.15 }}>
              {s.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.98rem", lineHeight: 1.75 }}>
              {s.description}
            </Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <DestinationCard item={items[0]} large />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Grid2 container spacing={2.5}>
              {items.slice(1).map((item, i) => (
                <Grid2 key={i} size={{ xs: 12, sm: 6 }}>
                  <DestinationCard item={item} />
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

const DestinationCard = ({ item, large = false }) => {
  if (!item) return null;
  return (
    <Box
      component={Link}
      to={`/buy?area=${encodeURIComponent(item.name)}`}
      sx={{
        display: "block",
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        height: large ? { xs: 320, md: 520 } : { xs: 220, md: 250 },
        textDecoration: "none",
        backgroundImage: item.image
          ? `linear-gradient(180deg, rgba(6,8,12,0.15) 0%, rgba(6,8,12,0.9) 100%), url(${item.image})`
          : `linear-gradient(160deg, #1b2436 0%, #0c1017 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&:hover .nx-dest-link": { color: nx.goldLight },
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: large ? "1.9rem" : "1.3rem", mb: 1 }}>
          {item.name}
        </Typography>
        {large && (
          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", mb: 2, maxWidth: 320 }}>
            {item.description}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={0.5} className="nx-dest-link" sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.78rem" }}>
          <span>{item.link_label}</span>
          <ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />
        </Stack>
      </Box>
    </Box>
  );
};

export default NxDestinationsSection;
