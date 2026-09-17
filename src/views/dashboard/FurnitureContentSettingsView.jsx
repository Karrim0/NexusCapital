import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid2,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ChairRoundedIcon from "@mui/icons-material/ChairRounded";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchFurnitureContent, updateFurnitureContent } from "../../api/furnitureContent";
import furnitureContentDefaults from "../../utils/furnitureContentDefaults";

const Field = ({ label, value, onChange, multiline = false, minRows = 1 }) => (
  <TextField
    label={label}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    size="small"
    multiline={multiline}
    minRows={multiline ? minRows : undefined}
  />
);

const StringListEditor = ({ label, items = [], onChange }) => {
  const update = (i, val) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <Box>
      {label && <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", mb: 1 }}>{label}</Typography>}
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <TextField value={item} onChange={(e) => update(i, e.target.value)} fullWidth size="small" />
            <IconButton size="small" color="error" onClick={() => remove(i)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Button startIcon={<AddIcon />} onClick={add} size="small" sx={{ alignSelf: "flex-start" }}>
          Add
        </Button>
      </Stack>
    </Box>
  );
};

const ObjectListEditor = ({ label, items = [], fields, onChange, template }) => {
  const updateItem = (i, key, val) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { ...template }]);

  return (
    <Box>
      {label && <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1.5 }}>{label}</Typography>}
      <Stack spacing={2}>
        {items.map((item, i) => (
          <Box key={i} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, position: "relative" }}>
            <IconButton size="small" color="error" onClick={() => remove(i)} sx={{ position: "absolute", top: 6, right: 6 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
            <Stack spacing={1.5} sx={{ pr: 4 }}>
              {fields.map((f) => (
                <Field key={f.key} label={f.label} value={item[f.key]} multiline={f.multiline} minRows={f.minRows} onChange={(v) => updateItem(i, f.key, v)} />
              ))}
            </Stack>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={add} size="small" sx={{ alignSelf: "flex-start" }}>
          Add {label ? label.toLowerCase() : "item"}
        </Button>
      </Stack>
    </Box>
  );
};

const SectionAccordion = ({ title, subtitle, defaultExpanded = false, children }) => (
  <Accordion defaultExpanded={defaultExpanded} sx={{ "&:before": { display: "none" } }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={2.5}>{children}</Stack>
    </AccordionDetails>
  </Accordion>
);

const FurnitureContentSettingsView = () => {
  const [content, setContent] = useState(furnitureContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
  const [packagePhotos, setPackagePhotos] = useState([null, null, null]);
  const [packagePreviews, setPackagePreviews] = useState([null, null, null]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFurnitureContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load furniture content:", err);
        setSnackbar({ open: true, severity: "error", message: "Could not load saved content — showing defaults." });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bind = (path) => ({
    value: get(content, path),
    onChange: (value) => {
      setContent((prev) => {
        const next = cloneDeep(prev);
        set(next, path, value);
        return next;
      });
    },
  });

  const handlePackagePhoto = (i) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPackagePhotos((prev) => {
      const next = [...prev];
      next[i] = file;
      return next;
    });
    setPackagePreviews((prev) => {
      const next = [...prev];
      next[i] = URL.createObjectURL(file);
      return next;
    });
  };

  const updatePackageField = (i, key, val) => {
    setContent((prev) => {
      const next = cloneDeep(prev);
      next.packages[i][key] = val;
      return next;
    });
  };

  const updatePackageIncluded = (i, items) => updatePackageField(i, "included", items);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateFurnitureContent(content, packagePhotos);
      setContent((prev) => ({ ...prev, ...updated }));
      setPackagePhotos([null, null, null]);
      setPackagePreviews([null, null, null]);
      setSnackbar({ open: true, severity: "success", message: "Furniture & furnishing page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save furniture content:", err);
      setSnackbar({ open: true, severity: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <ChairRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Furniture & Furnishing Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              Everything shown on the public Furniture & Furnishing page — edit here and it updates the live site instantly.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        <SectionAccordion title="Hero Section" subtitle="Top banner shown on the page" defaultExpanded>
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Eyebrow label" {...bind("hero.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("hero.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("hero.description")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Service Types" subtitle="The list of furnishing service categories offered" defaultExpanded>
          <ObjectListEditor
            items={content.service_types || []}
            fields={[{ key: "title", label: "Service type" }]}
            onChange={bind("service_types").onChange}
            template={{ title: "", description: "" }}
          />
        </SectionAccordion>

        <SectionAccordion title="Packages (Basic / Premium / Luxury)" subtitle="Each package's image, description, included items, and price" defaultExpanded>
          <Stack spacing={3}>
            {(content.packages || []).map((pkg, i) => (
              <Box key={i} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>{pkg.name || `Package ${i + 1}`}</Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={packagePreviews[i] || (pkg.image && !pkg.image.startsWith("[") ? pkg.image : undefined)}
                      variant="rounded"
                      sx={{ width: 120, height: 80, bgcolor: "action.hover" }}
                    />
                    <Button component="label" variant="outlined" size="small" startIcon={<UploadFileIcon />}>
                      Upload image
                      <input type="file" hidden accept="image/*" onChange={handlePackagePhoto(i)} />
                    </Button>
                  </Stack>
                  <Field label="Package name" value={pkg.name} onChange={(v) => updatePackageField(i, "name", v)} />
                  <Field label="Description" multiline minRows={2} value={pkg.description} onChange={(v) => updatePackageField(i, "description", v)} />
                  <StringListEditor label="Included services" items={pkg.included || []} onChange={(v) => updatePackageIncluded(i, v)} />
                  <Field label="Price (or 'Request a Quote')" value={pkg.price} onChange={(v) => updatePackageField(i, "price", v)} />
                </Stack>
              </Box>
            ))}
          </Stack>
        </SectionAccordion>

        <SectionAccordion title="Final CTA" subtitle="'Furnish Your Property With Us' banner">
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Title" {...bind("cta.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("cta.description")} /></Grid2>
            <Grid2 size={12}><Field label="Button label" {...bind("cta.cta_label")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Disclaimer" subtitle="Small print shown at the bottom of the page">
          <Field label="Disclaimer text" multiline minRows={3} {...bind("disclaimer")} />
        </SectionAccordion>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FurnitureContentSettingsView;
