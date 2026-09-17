import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { Link } from "react-router-dom";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

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
        height: large ? { xs: 260, md: 420 } : { xs: 190, md: 200 },
        textDecoration: "none",
        backgroundImage: item.image
          ? `linear-gradient(180deg, rgba(6,8,12,0.15) 0%, rgba(6,8,12,0.9) 100%), url(${item.image})`
          : `linear-gradient(160deg, #1b2436 0%, #0c1017 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&:hover .nx-dest-link": { color: nx.goldLight },
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, p: 2.5, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: large ? "1.6rem" : "1.15rem", mb: 0.7 }}>
          {item.name}
        </Typography>
        {large && (
          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.82rem", mb: 1.5, maxWidth: 300 }}>{item.description}</Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={0.5} className="nx-dest-link" sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem" }}>
          <span>{item.link_label}</span>
          <ArrowOutwardRoundedIcon sx={{ fontSize: 14 }} />
        </Stack>
      </Box>
    </Box>
  );
};

const NxAboutDestinationsMethod = ({ content }) => {
  const d = content.destinations;
  const m = content.method;
  const items = d.items || [];

  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{d.eyebrow}</Typography>
        </Stack>
        <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
              {d.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{d.description}</Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5} sx={{ mb: { xs: 6, md: 8 } }}>
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

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{m.eyebrow}</Typography>
        </Stack>
        <Grid2 container spacing={2} alignItems="flex-end" sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", sm: "2.1rem", md: "2.4rem" }, lineHeight: 1.2 }}>
              {m.title}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", lineHeight: 1.75 }}>{m.description}</Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          {(m.steps || []).map((step) => (
            <Grid2 key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, borderRadius: 3, p: 3, height: "100%" }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: nx.gold, color: "#171208", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", mb: 2 }}>
                  {step.number}
                </Box>
                <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "0.95rem", mb: 1 }}>{step.title}</Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.82rem", lineHeight: 1.6 }}>{step.description}</Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxAboutDestinationsMethod;
