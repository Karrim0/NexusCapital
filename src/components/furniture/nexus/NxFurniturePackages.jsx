import { Box, Container, Grid2, Stack, Typography, Button, Chip } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxFurniturePackages = ({ packages, onRequestQuote }) => {
  return (
    <Box sx={{ bgcolor: nx.ink, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>Furnishing Packages</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnDark, fontSize: { xs: "1.8rem", md: "2.2rem" }, mb: 5, maxWidth: 620 }}>
          Choose the package that fits your property
        </Typography>

        <Grid2 container spacing={3}>
          {(packages || []).map((pkg, i) => {
            const hasImage = pkg.image && !pkg.image.startsWith("[");
            const isMiddle = i === 1;
            return (
              <Grid2 key={pkg.name} size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    bgcolor: nx.panel,
                    border: `1px solid ${isMiddle ? nx.gold : nx.panelBorder}`,
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transform: { md: isMiddle ? "translateY(-12px)" : "none" },
                  }}
                >
                  <Box
                    sx={{
                      height: 220,
                      position: "relative",
                      overflow: "hidden",
                      bgcolor: "#1b2436",
                    }}
                  >
                    {hasImage ? (
                      <Box
                        component="img"
                        src={pkg.image}
                        alt={pkg.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          display: "block",
                        }}
                      />
                    ) : (
                      <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", px: 3, textAlign: "center" }}>
                          {pkg.image}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "1.3rem" }}>{pkg.name}</Typography>
                      {isMiddle && <Chip label="Most Popular" size="small" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.65rem" }} />}
                    </Stack>
                    <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 2 }}>{pkg.description}</Typography>
                    <Stack spacing={1} sx={{ mb: 3, flex: 1 }}>
                      {(pkg.included || []).map((item) => (
                        <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                          <CheckRoundedIcon sx={{ color: nx.gold, fontSize: 16, mt: 0.3 }} />
                          <Typography sx={{ color: nx.textOnDark, fontSize: "0.82rem" }}>{item}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "1rem", mb: 2 }}>{pkg.price}</Typography>
                    <Button
                      onClick={onRequestQuote}
                      fullWidth
                      sx={{
                        bgcolor: isMiddle ? nx.gold : "transparent",
                        color: isMiddle ? "#171208" : nx.gold,
                        border: `1px solid ${nx.gold}`,
                        fontWeight: 700,
                        borderRadius: 999,
                        py: 1.1,
                        fontSize: "0.78rem",
                        "&:hover": { bgcolor: nx.gold, color: "#171208" },
                      }}
                    >
                      Contact Us
                    </Button>
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

export default NxFurniturePackages;
