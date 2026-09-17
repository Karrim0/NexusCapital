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
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchRentalServicesContent, updateRentalServicesContent } from "../../api/rentalServicesContent";
import rentalServicesContentDefaults from "../../utils/rentalServicesContentDefaults";

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
      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1 }}>{label}</Typography>
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

const RentalServicesContentSettingsView = () => {
  const [content, setContent] = useState(rentalServicesContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRentalServicesContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load rental services content:", err);
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

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateRentalServicesContent(content, photoFile);
      setContent((prev) => ({ ...prev, ...updated }));
      setPhotoFile(null);
      setPhotoPreview(null);
      setSnackbar({ open: true, severity: "success", message: "Rental services page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save rental services content:", err);
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
          <KeyRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Rental Services Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              Everything shown on the public Rental Services page — edit here and it updates the live site instantly.
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

        <SectionAccordion title="Rental Manager Profile" subtitle="Name, photo, bio, contact, and areas of expertise" defaultExpanded>
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={photoPreview || (content.manager?.photo && !content.manager.photo.startsWith("[") ? content.manager.photo : undefined)}
                  variant="rounded"
                  sx={{ width: 84, height: 84, bgcolor: "action.hover" }}
                />
                <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
                  Upload manager photo
                  <input type="file" hidden accept="image/*" onChange={handlePhotoFile} />
                </Button>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Full name" {...bind("manager.name")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title / role" {...bind("manager.title")} /></Grid2>
            <Grid2 size={12}><Field label="Bio" multiline minRows={3} {...bind("manager.bio")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Years of experience" {...bind("manager.years_of_experience")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Phone" {...bind("manager.phone")} /></Grid2>
            <Grid2 size={12}><Field label="Email" {...bind("manager.email")} /></Grid2>
            <Grid2 size={12}><Field label="Consultation button label" {...bind("manager.cta_label")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Areas of expertise" items={content.manager?.expertise || []} onChange={bind("manager.expertise").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Languages spoken" items={content.manager?.languages || []} onChange={bind("manager.languages").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Services Grid" subtitle="The list of rental services offered" defaultExpanded>
          <ObjectListEditor
            items={content.services || []}
            fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
            onChange={bind("services").onChange}
            template={{ title: "", description: "" }}
          />
        </SectionAccordion>

        <SectionAccordion title="How It Works" subtitle="The 3-step process">
          <ObjectListEditor
            items={content.process || []}
            fields={[{ key: "number", label: "Step number (e.g. 01)" }, { key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
            onChange={bind("process").onChange}
            template={{ number: "", title: "", description: "" }}
          />
        </SectionAccordion>

        <SectionAccordion title="Trust Banner" subtitle="'Rent With Confidence' message and button">
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Title" {...bind("trust.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("trust.description")} /></Grid2>
            <Grid2 size={12}><Field label="Button label" {...bind("trust.cta_label")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Overseas Owners Section" subtitle="Section aimed at owners living abroad">
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Title" {...bind("foreign_investors.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("foreign_investors.description")} /></Grid2>
            <Grid2 size={12}><Field label="Languages highlight" {...bind("foreign_investors.languages_highlight")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="FAQ" subtitle="Frequently asked questions about rental services">
          <ObjectListEditor
            items={content.faq || []}
            fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", multiline: true }]}
            onChange={bind("faq").onChange}
            template={{ question: "", answer: "" }}
          />
        </SectionAccordion>

        <SectionAccordion title="Disclaimer" subtitle="Small print shown at the bottom of the FAQ section">
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

export default RentalServicesContentSettingsView;
