import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

// Certifications / trust badges — logos or icons with a title and short
// description each, managed from the About Page Content dashboard.
const NxAboutCertifications = ({ content }) => {
  const cert = content.certifications || {};
  const items = cert.items || [];

  if (!items.length) return null;

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>
            {cert.eyebrow || "CERTIFICATIONS & TRUST"}
          </Typography>
        </Stack>
        {cert.title && (
          <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.6rem", md: "2rem" }, mb: 1.5 }}>
            {cert.title}
          </Typography>
        )}
        {cert.description && (
          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", maxWidth: 640, mb: 4 }}>
            {cert.description}
          </Typography>
        )}

        <Grid2 container spacing={2.5} sx={{ mt: cert.title || cert.description ? 0 : 3 }}>
          {items.map((item, i) => (
            <Grid2 key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#fff",
                  border: `1px solid ${nx.panelBorder}`,
                  textAlign: "center",
                }}
              >
                {item.image ? (
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{ width: 56, height: 56, objectFit: "contain", mx: "auto", mb: 2 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "rgba(201,162,75,0.12)",
                      color: nx.gold,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <VerifiedRoundedIcon sx={{ fontSize: 28 }} />
                  </Box>
                )}
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1rem", mb: 0.5 }}>
                  {item.title}
                </Typography>
                {item.description && (
                  <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.82rem", lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                )}
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxAboutCertifications;
