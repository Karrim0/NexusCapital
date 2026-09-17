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
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import DesignServicesRoundedIcon from "@mui/icons-material/DesignServicesRounded";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchServicesContent, updateServicesContent } from "../../api/servicesContent";
import servicesContentDefaults from "../../utils/servicesContentDefaults";

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
              {fields.map((f) =>
                f.key === "bullets" ? (
                  <StringListEditor key={f.key} label={f.label} items={item[f.key] || []} onChange={(v) => updateItem(i, f.key, v)} />
                ) : (
                  <Field key={f.key} label={f.label} value={item[f.key]} multiline={f.multiline} minRows={f.minRows} onChange={(v) => updateItem(i, f.key, v)} />
                )
              )}
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

// Editor for the "situation -> recommendation" map used by the Service Finder.
const SituationMapEditor = ({ items = {}, onChange }) => {
  const entries = Object.entries(items);
  const updateEntry = (key, field, val) => {
    onChange({ ...items, [key]: { ...items[key], [field]: val } });
  };
  const renameKey = (oldKey, newKey) => {
    if (!newKey || newKey === oldKey) return;
    const next = { ...items };
    next[newKey] = next[oldKey];
    delete next[oldKey];
    onChange(next);
  };
  const remove = (key) => {
    const next = { ...items };
    delete next[key];
    onChange(next);
  };
  const add = () => {
    onChange({ ...items, [`New situation ${entries.length + 1}`]: { service: "", description: "" } });
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1.5 }}>Situations &amp; recommended services</Typography>
      <Stack spacing={2}>
        {entries.map(([key, val]) => (
          <Box key={key} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, position: "relative" }}>
            <IconButton size="small" color="error" onClick={() => remove(key)} sx={{ position: "absolute", top: 6, right: 6 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
            <Stack spacing={1.5} sx={{ pr: 4 }}>
              <TextField label="Situation (dropdown option)" defaultValue={key} onBlur={(e) => renameKey(key, e.target.value)} fullWidth size="small" />
              <TextField label="Recommended service" value={val.service || ""} onChange={(e) => updateEntry(key, "service", e.target.value)} fullWidth size="small" />
              <TextField label="Explanation" value={val.description || ""} onChange={(e) => updateEntry(key, "description", e.target.value)} fullWidth size="small" multiline minRows={2} />
            </Stack>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={add} size="small" sx={{ alignSelf: "flex-start" }}>
          Add situation
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

const ServicesContentSettingsView = () => {
  const [content, setContent] = useState(servicesContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchServicesContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load services content:", err);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateServicesContent(content);
      setContent((prev) => ({ ...prev, ...updated }));
      setSnackbar({ open: true, severity: "success", message: "Services page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save services content:", err);
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
          <DesignServicesRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Services Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              Everything shown on the public Services page — edit here and it updates the live site instantly.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        <SectionAccordion title="Hero Section" subtitle="Top banner with title, quick filters, and the 3 stats" defaultExpanded>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title — prefix" {...bind("hero.title_prefix")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title — highlighted phrase" {...bind("hero.title_highlight")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("hero.description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Primary button label" {...bind("hero.primary_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Secondary button label" {...bind("hero.secondary_cta")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Quick filter chips" items={content.hero.quick_filters || []} onChange={bind("hero.quick_filters").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor label="Stats" items={content.hero.stats || []} fields={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]} onChange={bind("hero.stats").onChange} template={{ value: "", label: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Request Service Support Form" subtitle="The form panel on the right of the hero">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel title" {...bind("request_panel.title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel subtitle" {...bind("request_panel.subtitle")} /></Grid2>
            <Grid2 size={12}><Field label="Helper note" multiline minRows={2} {...bind("request_panel.helper_note")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="WhatsApp submit button label" {...bind("request_panel.submit_whatsapp_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Email submit button label" {...bind("request_panel.submit_email_label")} /></Grid2>
            <Grid2 size={12}><Field label="Form disclaimer" {...bind("request_panel.form_disclaimer")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Service options" items={content.request_panel.service_options || []} onChange={bind("request_panel.service_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Area options" items={content.request_panel.area_options || []} onChange={bind("request_panel.area_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Timeline options" items={content.request_panel.timeline_options || []} onChange={bind("request_panel.timeline_options").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Trust Strip" subtitle="The 4 short trust items below the hero">
          <ObjectListEditor items={content.trust_items || []} fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("trust_items").onChange} template={{ title: "", description: "" }} />
        </SectionAccordion>

        <SectionAccordion title="Services Grid" subtitle="The 6 main service cards">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("services_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("services_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("services_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.services_section.items || []}
                fields={[
                  { key: "number", label: "Number (e.g. 01)" },
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", multiline: true },
                  { key: "bullets", label: "Bullet points" },
                  { key: "cta_label", label: "Link label" },
                ]}
                onChange={bind("services_section.items").onChange}
                template={{ number: "", title: "", description: "", bullets: [], cta_label: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Service Spotlight" subtitle="The featured service deep-dive section">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("spotlight.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("spotlight.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("spotlight.description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Tag" {...bind("spotlight.tag")} /></Grid2>
            <Grid2 size={12}><Field label="Spotlight title" {...bind("spotlight.spotlight_title")} /></Grid2>
            <Grid2 size={12}><Field label="Spotlight description" multiline minRows={3} {...bind("spotlight.spotlight_description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor label="Columns" items={content.spotlight.columns || []} fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("spotlight.columns").onChange} template={{ title: "", description: "" }} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Primary button label" {...bind("spotlight.primary_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Secondary button label" {...bind("spotlight.secondary_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Side panel tag" {...bind("spotlight.side_tag")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Side panel title" {...bind("spotlight.side_title")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Side panel bullets" items={content.spotlight.side_bullets || []} onChange={bind("spotlight.side_bullets").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Service Finder" subtitle="Interactive 'not sure which service' tool">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("finder.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("finder.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("finder.description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Result panel title" {...bind("finder.result_title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Contact button label" {...bind("finder.contact_cta_label")} /></Grid2>
            <Grid2 size={12}><Field label="Result note" multiline minRows={2} {...bind("finder.result_note")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Area options" items={content.finder.area_options || []} onChange={bind("finder.area_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Timeline options" items={content.finder.timeline_options || []} onChange={bind("finder.timeline_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <SituationMapEditor items={content.finder.situation_options || {}} onChange={bind("finder.situation_options").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="How It Works" subtitle="The 5-step process">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("process.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("process.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("process.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.process.steps || []} fields={[{ key: "number", label: "Step number" }, { key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("process.steps").onChange} template={{ number: "", title: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Owners & Landlords" subtitle="Post-purchase support section">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("owners.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Button label" {...bind("owners.cta_label")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("owners.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("owners.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.owners.cards || []} fields={[{ key: "tag", label: "Card title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("owners.cards").onChange} template={{ tag: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="FAQ" subtitle="Services FAQ section">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("faq_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("faq_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("faq_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.faq_section.items || []} fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", multiline: true }]} onChange={bind("faq_section.items").onChange} template={{ question: "", answer: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Bottom CTA Banner" subtitle="'Ready to own property' banner">
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Title" {...bind("cta_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("cta_section.description")} /></Grid2>
            <Grid2 size={12}><Field label="Button label" {...bind("cta_section.cta_label")} /></Grid2>
          </Grid2>
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

export default ServicesContentSettingsView;
