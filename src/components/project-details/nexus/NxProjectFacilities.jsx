import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SpaIcon from "@mui/icons-material/Spa";
import PoolIcon from "@mui/icons-material/Pool";
import SecurityIcon from "@mui/icons-material/Security";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ElevatorIcon from "@mui/icons-material/Elevator";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GavelIcon from "@mui/icons-material/Gavel";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

// Same key→label→icon mapping as the dashboard's amenities selector,
// kept in sync manually since it's a small, stable list. Order here
// also drives display order on the public page.
const AMENITIES = [
  { key: "gym", label: "Gym", icon: FitnessCenterIcon, description: "Dedicated fitness facilities for residents and owners." },
  { key: "spa", label: "Spa & Wellness", icon: SpaIcon, description: "An on-site wellness space for relaxation and recovery." },
  { key: "restaurant", label: "Restaurant & Café", icon: RestaurantIcon, description: "On-site dining within the project." },
  { key: "security", label: "24/7 Security", icon: SecurityIcon, description: "Security services supporting the project and its residents." },
  { key: "swimming_pool", label: "Swimming Pool", icon: PoolIcon, description: "A shared swimming pool for residents and guests to enjoy." },
  { key: "heated_pool", label: "Heated Pool", icon: PoolIcon, description: "A heated pool for year-round comfort." },
  { key: "beach_access", label: "Beach Access", icon: BeachAccessIcon, description: "Direct or nearby access to the beach." },
  { key: "parking", label: "Underground Parking", icon: LocalParkingIcon, description: "Secure underground parking for residents." },
  { key: "kids_area", label: "Kids Area", icon: ChildCareIcon, description: "A dedicated play area for children." },
  { key: "pharmacy", label: "Pharmacy", icon: LocalPharmacyIcon, description: "A convenient on-site pharmacy for everyday needs." },
  { key: "supermarket", label: "Supermarket", icon: LocalGroceryStoreIcon, description: "An on-site supermarket for daily essentials." },
  { key: "elevator", label: "Elevators", icon: ElevatorIcon, description: "Elevators serving all residential floors." },
  { key: "property_management", label: "Property Management", icon: ManageAccountsIcon, description: "On-site property management support." },
  { key: "green_contract", label: "Green Contract", icon: GavelIcon, description: "A green contract structure for this project." },
  { key: "housekeeping", label: "Housekeeping & Laundry", icon: CleaningServicesIcon, description: "Housekeeping and laundry services available on request." },
];
const AMENITIES_BY_KEY = Object.fromEntries(AMENITIES.map((a) => [a.key, a]));

const NxProjectFacilities = ({ project }) => {
  let amenityKeys = [];
  try {
    const raw = project.amenities;
    amenityKeys = Array.isArray(raw) ? raw : typeof raw === "string" && raw ? JSON.parse(raw) : [];
  } catch {
    amenityKeys = [];
  }
  // Keep the site's fixed display order, filtered to what this project actually has.
  const items = AMENITIES.filter((a) => amenityKeys.includes(a.key));

  if (!items.length) return null;

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ maxWidth: 560 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>FACILITIES</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
              Everything this project offers
            </Typography>
          </Box>
          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.9rem", maxWidth: 340 }}>
            {items.length} core facilities support daily convenience and resort-style living at {project.name || project.title}.
          </Typography>
        </Stack>

        <Grid2 container spacing={2.5}>
          {items.map((item) => (
            <Grid2 key={item.key} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#fff",
                  border: `1px solid ${nx.panelBorder}`,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "rgba(201,162,75,0.12)",
                    color: nx.gold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <item.icon sx={{ fontSize: 20 }} />
                </Box>
                <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.05rem", mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {item.description}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxProjectFacilities;
