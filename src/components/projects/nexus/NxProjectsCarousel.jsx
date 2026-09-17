import { useEffect, useRef, useState } from "react";
import { Box, Container, Stack, Typography, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { fetchProjects } from "../../../api/projects";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

// One large "spotlight" project on top that auto-rotates through all
// projects, with the rest shown as a row of smaller thumbnails below —
// clicking a thumbnail jumps the spotlight to that project.
const NxProjectsCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        setProjects([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (projects.length <= 1 || isPaused) return undefined;
    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % projects.length);
    }, 5000);
    return () => clearInterval(autoplayRef.current);
  }, [projects.length, isPaused]);

  if (!projects.length) return null;

  const active = projects[index];

  return (
    <Box
      sx={{ bgcolor: nx.ink, py: { xs: 7, md: 10 } }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>
            FEATURED PROJECTS
          </Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.6rem", md: "2rem" }, mb: 3 }}>
          A closer look at our developments
        </Typography>

        {/* Spotlight card — the current project, large */}
        <Box
          component={Link}
          to={`/projects/${active.id}`}
          sx={{
            display: "block",
            position: "relative",
            textDecoration: "none",
            borderRadius: 4,
            overflow: "hidden",
            height: { xs: 320, md: 460 },
            backgroundImage: `url(${active.cover_image || active.main_image || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            bgcolor: "#1b2436",
            transition: "background-image 0.5s ease",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(6,8,12,0.1) 0%, rgba(6,8,12,0.9) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: { xs: 3, md: 5 },
            }}
          >
            {active.starting_price && (
              <Chip
                label={`From ${currencySymbol(active.currency)}${Number(active.starting_price).toLocaleString()}`}
                size="small"
                sx={{ alignSelf: "flex-start", mb: 2, bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.72rem" }}
              />
            )}
            <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.6rem", md: "2.4rem" }, mb: 1 }}>
              {active.name || active.title}
            </Typography>
            {active.location && (
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.95rem" }}>{active.location}</Typography>
            )}
          </Box>
        </Box>

        {/* Thumbnails row — every other project, click to jump the spotlight */}
        {projects.length > 1 && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 2, overflowX: "auto", pb: 1 }}>
            {projects.map((p, i) => (
              <Box
                key={p.id}
                onClick={() => setIndex(i)}
                sx={{
                  flexShrink: 0,
                  width: 140,
                  height: 90,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  backgroundImage: `url(${p.cover_image || p.main_image || ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  bgcolor: "#1b2436",
                  border: i === index ? `2px solid ${nx.gold}` : "2px solid transparent",
                  opacity: i === index ? 1 : 0.55,
                  transition: "opacity 0.25s ease, border-color 0.25s ease",
                }}
              />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default NxProjectsCarousel;
