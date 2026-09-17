import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxProjectMasterPlan = ({ project, whatsappNumber }) => {
  const plan = project.master_plan;
  const hasGround = plan?.ground_floor_image;
  const hasTypical = plan?.typical_floors_image;
  const [view, setView] = useState(hasGround ? "ground" : "typical");

  if (!hasGround && !hasTypical) return null;

  const image = view === "ground" ? plan.ground_floor_image : plan.typical_floors_image;

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    const text = encodeURIComponent(`Hello! Could you send the detailed floor plans for "${project.name || project.title}"?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <Box id="plans" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 2, md: 3 }} alignItems="flex-start" sx={{ mb: 3 }}>
          <Grid2 size={{ xs: 12, md: 7 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>LAYOUTS & MASTER PLAN</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.6rem", md: "2rem" }, lineHeight: 1.2 }}>
              {project.name || project.title} master plan
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.88rem" }}>
              {plan?.legend_note || "Representative layouts from the project kit. Actual dimensions, layouts, and finishes may vary by unit."}
            </Typography>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2.5}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2, boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
              <Box
                component="img"
                src={image}
                alt="Master plan"
                sx={{ width: "100%", borderRadius: 2, display: "block" }}
              />
            </Box>
            {hasGround && hasTypical && (
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={(e, val) => val && setView(val)}
                size="small"
                sx={{ mt: 2, "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 700, borderRadius: 999, px: 2.5, "&.Mui-selected": { bgcolor: nx.ink, color: nx.textOnDark, "&:hover": { bgcolor: "#1a1f2b" } } } }}
              >
                <ToggleButton value="ground">Ground Floor</ToggleButton>
                <ToggleButton value="typical">Typical Floors 1-3</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 3, height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.15rem", mb: 1 }}>
                Unit layout guide
              </Typography>
              <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 3 }}>
                {plan?.legend_note || "Ask the advisor for a full breakdown of unit types, sizes, and their exact position on the master plan."}
              </Typography>
              <Button
                onClick={handleWhatsApp}
                fullWidth
                sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, py: 1.2, borderRadius: 999, fontSize: "0.78rem", "&:hover": { bgcolor: "#1a1f2b" } }}
              >
                Request Detailed Floor Plans
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxProjectMasterPlan;
