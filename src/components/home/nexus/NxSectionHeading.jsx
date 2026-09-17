import { Box, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

// Shared "eyebrow / big serif title / side note" heading block used across
// every Nexus Capital home page section (light or dark background).
const NxSectionHeading = ({
  eyebrow,
  title,
  description,
  dark = false,
  note,
  align = "left",
  maxWidth = 720,
}) => {
  const textColor = dark ? nx.textOnDark : nx.textOnCream;
  const mutedColor = dark ? nx.textOnDarkMuted : nx.textOnCreamMuted;

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "flex-end" }}
      spacing={3}
      sx={{ mb: { xs: 4, md: 6 }, textAlign: align }}
    >
      <Box sx={{ maxWidth }}>
        {eyebrow && (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
            <Typography
              sx={{
                color: nx.gold,
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
              }}
            >
              {eyebrow}
            </Typography>
          </Stack>
        )}
        {title && (
          <Typography
            sx={{
              fontFamily: fontHeading,
              fontWeight: 600,
              color: textColor,
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "2.9rem" },
              lineHeight: 1.15,
            }}
          >
            {title}
          </Typography>
        )}
      </Box>
      {(description || note) && (
        <Typography
          sx={{
            color: mutedColor,
            fontSize: "0.98rem",
            lineHeight: 1.75,
            maxWidth: 340,
          }}
        >
          {description || note}
        </Typography>
      )}
    </Stack>
  );
};

export default NxSectionHeading;
