import { Box, Container, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

/**
 * `variant="page"` renders the full-height page hero (dark background).
 * `variant="section"` renders a shorter homepage teaser hero (cream background),
 * matching how other homepage teaser sections sit between light panels.
 */
const NxLegalHero = ({ content, variant = "page" }) => {
  const isPage = variant === "page";

  return (
    <Box
      sx={{
        bgcolor: isPage ? nx.ink : nx.cream,
        py: { xs: isPage ? 8 : 6, md: isPage ? 12 : 9 },
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>
            {content.eyebrow}
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontFamily: fontHeading,
            fontWeight: 600,
            color: isPage ? nx.textOnDark : nx.textOnCream,
            fontSize: { xs: "2rem", sm: "2.5rem", md: isPage ? "3.2rem" : "2.6rem" },
            lineHeight: 1.15,
            maxWidth: 760,
            mb: 2.5,
          }}
        >
          {content.title}
        </Typography>
        <Typography
          sx={{
            color: isPage ? nx.textOnDarkMuted : nx.textOnCreamMuted,
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            lineHeight: 1.8,
            maxWidth: 620,
          }}
        >
          {content.description}
        </Typography>
      </Container>
    </Box>
  );
};

export default NxLegalHero;
