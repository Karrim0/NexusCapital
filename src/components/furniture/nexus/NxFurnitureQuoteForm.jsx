import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, MenuItem, Button, Alert } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { submitFurnitureQuoteRequest } from "../../../api/furnitureContent";

const PROPERTY_TYPES = ["Apartment", "Studio", "Villa", "Duplex", "Penthouse", "Other"];

const NxFurnitureQuoteForm = ({ id, packages }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    propertyLocation: "",
    propertySize: "",
    bedrooms: "",
    preferredPackage: "",
    notes: "",
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // The default MUI label/input colors read as too light against the cream
  // section background (especially on mobile) — force darker, legible text.
  const fieldSx = {
    "& .MuiInputBase-input": { color: nx.textOnCream },
    "& .MuiInputLabel-root": { color: nx.textOnCreamMuted },
    "& .MuiInputLabel-root.Mui-focused": { color: nx.gold },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: nx.divider },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: nx.gold },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: nx.gold },
    "& .MuiSvgIcon-root": { color: nx.textOnCreamMuted },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || (!form.phone && !form.email)) {
      setStatus({ state: "error", message: "Please add your name and at least a phone number or email." });
      return;
    }
    setStatus({ state: "sending", message: "" });
    try {
      await submitFurnitureQuoteRequest(form);
      setStatus({ state: "success", message: "Thank you! Your quote request has been sent. Our team will contact you shortly." });
      setForm({ name: "", phone: "", email: "", propertyType: "", propertyLocation: "", propertySize: "", bedrooms: "", preferredPackage: "", notes: "" });
    } catch {
      setStatus({ state: "error", message: "Something went wrong sending your request. Please try again or contact us on WhatsApp." });
    }
  };

  return (
    <Box id={id} sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="sm">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em" }}>Request a Quote</Typography>
        </Stack>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.6rem", md: "1.9rem" }, mb: 3 }}>
          Tell us about your property
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField sx={fieldSx} label="Name" fullWidth required size="small" value={form.name} onChange={update("name")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField sx={fieldSx} label="WhatsApp / Phone" fullWidth size="small" value={form.phone} onChange={update("phone")} />
            </Grid2>
            <Grid2 size={12}>
              <TextField sx={fieldSx} label="Email" type="email" fullWidth size="small" value={form.email} onChange={update("email")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField sx={fieldSx} select label="Property Type" fullWidth size="small" value={form.propertyType} onChange={update("propertyType")}>
                {PROPERTY_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField sx={fieldSx} label="Property Location" fullWidth size="small" value={form.propertyLocation} onChange={update("propertyLocation")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField sx={fieldSx} label="Property Size (m²)" fullWidth size="small" value={form.propertySize} onChange={update("propertySize")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField sx={fieldSx} label="Number of Bedrooms" fullWidth size="small" value={form.bedrooms} onChange={update("bedrooms")} />
            </Grid2>
            <Grid2 size={12}>
              <TextField sx={fieldSx} select label="Preferred Package" fullWidth size="small" value={form.preferredPackage} onChange={update("preferredPackage")}>
                {(packages || []).map((pkg) => (
                  <MenuItem key={pkg.name} value={pkg.name}>{pkg.name}</MenuItem>
                ))}
                <MenuItem value="Not sure yet">Not sure yet</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={12}>
              <TextField sx={fieldSx} label="Additional Notes" fullWidth multiline minRows={3} size="small" value={form.notes} onChange={update("notes")} />
            </Grid2>
          </Grid2>

          {status.state === "error" && <Alert severity="error" sx={{ mt: 2 }}>{status.message}</Alert>}
          {status.state === "success" && <Alert severity="success" sx={{ mt: 2 }}>{status.message}</Alert>}

          <Button
            type="submit"
            disabled={status.state === "sending"}
            endIcon={<SendRoundedIcon />}
            fullWidth
            sx={{ mt: 3, bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, py: 1.4, fontSize: "0.85rem", "&:hover": { bgcolor: nx.goldLight } }}
          >
            {status.state === "sending" ? "Sending..." : "Send Request"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NxFurnitureQuoteForm;
