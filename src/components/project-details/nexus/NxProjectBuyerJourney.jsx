import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const STEPS = [
  { title: "Request Live Availability", description: "Receive the current unit types, sizes, floors, views, prices and reservation status." },
  { title: "Compare Residences", description: "Shortlist the suitable layout and request its exact floor plan and confirmed view." },
  { title: "Select a Payment Route", description: "Compare the available down-payment plans or request a cash quotation." },
  { title: "Review the Contract", description: "Check the contract, unit details, payment milestones, delivery wording and buyer obligations." },
  { title: "Visit or Review Remotely", description: "Arrange a project visit or a guided remote presentation with a property advisor." },
  { title: "Reserve in Writing", description: "Proceed once the selected residence and every commercial term are confirmed in writing." },
];

const NxProjectBuyerJourney = () => {
  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>BUYER JOURNEY</Typography>
        </Stack>

        <Grid2 container spacing={2.5}>
          {STEPS.map((step, i) => (
            <Grid2 key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#fff",
                  border: `1px solid ${nx.panelBorder}`,
                }}
              >
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.8rem", mb: 1.5 }}>
                  {String(i + 1).padStart(2, "0")}
                </Typography>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.15rem", mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.7 }}>
                  {step.description}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxProjectBuyerJourney;
