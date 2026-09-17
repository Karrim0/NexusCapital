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
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchProjectsContent, updateProjectsContent } from "../../api/projectsContent";
import projectsContentDefaults from "../../utils/projectsContentDefaults";

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
                f.key === "points" ? (
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

const ProjectsContentSettingsView = () => {
  const [content, setContent] = useState(projectsContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  const handleHeroFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjectsContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load projects content:", err);
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
      const updated = await updateProjectsContent(content, heroFile);
      setContent((prev) => ({ ...prev, ...updated }));
      setHeroFile(null);
      setHeroPreview(null);
      setSnackbar({ open: true, severity: "success", message: "Projects page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save projects content:", err);
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
          <ApartmentRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Projects Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              The hero, project finder form, area strategy, and FAQ on the public Projects page. Projects themselves come from your Projects list.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        <SectionAccordion title="Hero Section" subtitle="Top banner with title, quick filters, and the 3 stats" defaultExpanded>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={heroPreview || content.hero.background_image || undefined}
              variant="rounded"
              sx={{ width: 120, height: 80, bgcolor: "action.hover" }}
            >
              {!heroPreview && !content.hero.background_image && <ApartmentRoundedIcon />}
            </Avatar>
            <Stack direction="row" spacing={1.5}>
              <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />}>
                Upload hero background image
                <input type="file" hidden accept="image/*" onChange={handleHeroFile} />
              </Button>
              {(heroPreview || content.hero.background_image) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => {
                    setHeroFile(null);
                    setHeroPreview(null);
                    setContent((prev) => ({ ...prev, hero: { ...prev.hero, background_image: null } }));
                  }}
                >
                  Remove
                </Button>
              )}
            </Stack>
          </Stack>
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Eyebrow" {...bind("hero.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="Title — prefix" {...bind("hero.title_prefix")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="Title — highlighted word" {...bind("hero.title_highlight")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="Title — suffix" {...bind("hero.title_suffix")} /></Grid2>
            <Grid2 size={12}><Field label="Subtitle" multiline minRows={2} {...bind("hero.subtitle")} /></Grid2>
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

        <SectionAccordion title="Project Finder Form" subtitle="The WhatsApp request panel on the right of the hero">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel title" {...bind("finder_panel.title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Submit button label" {...bind("finder_panel.submit_label")} /></Grid2>
            <Grid2 size={12}><Field label="Panel subtitle" {...bind("finder_panel.subtitle")} /></Grid2>
            <Grid2 size={12}><Field label="Helper note" multiline minRows={2} {...bind("finder_panel.helper_note")} /></Grid2>
            <Grid2 size={12}><Field label="Form disclaimer" {...bind("finder_panel.form_disclaimer")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Area options" items={content.finder_panel.area_options || []} onChange={bind("finder_panel.area_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Budget options" items={content.finder_panel.budget_options || []} onChange={bind("finder_panel.budget_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Priority options" items={content.finder_panel.priority_options || []} onChange={bind("finder_panel.priority_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Unit type options" items={content.finder_panel.unit_type_options || []} onChange={bind("finder_panel.unit_type_options").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Projects Browser" subtitle="Search bar, quick filters, and project card labels">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("browser_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("browser_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("browser_section.description")} /></Grid2>
            <Grid2 size={12}><Field label="Search placeholder" {...bind("browser_section.search_placeholder")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Sort options" items={content.browser_section.sort_options || []} onChange={bind("browser_section.sort_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Quick filter chips" items={content.browser_section.quick_filters || []} onChange={bind("browser_section.quick_filters").onChange} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Ask advisor' button label" {...bind("browser_section.ask_advisor_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Compare button label" {...bind("browser_section.compare_button_label")} /></Grid2>
            <Grid2 size={12}><Field label="Results text (use {shown} and {total})" {...bind("browser_section.results_template")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="'Request Price List' label" {...bind("browser_section.request_price_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="'View details' button label" {...bind("browser_section.view_details_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="WhatsApp button label" {...bind("browser_section.whatsapp_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Compare checkbox label" {...bind("browser_section.compare_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Load more' button label" {...bind("browser_section.load_more_label")} /></Grid2>
            <Grid2 size={12}><Field label="Footnote" multiline minRows={2} {...bind("browser_section.footnote")} /></Grid2>
            <Grid2 size={12}><Field label="Empty state message" {...bind("browser_section.empty_state")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Destination Strategy" subtitle="The 3 area comparison cards">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("destination_strategy.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title" {...bind("destination_strategy.title")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.destination_strategy.areas || []}
                fields={[{ key: "name", label: "Area name" }, { key: "description", label: "Description", multiline: true }, { key: "points", label: "Bullet points" }]}
                onChange={bind("destination_strategy.areas").onChange}
                template={{ name: "", description: "", points: [] }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Buying Path Steps" subtitle="The 4-step 'how to compare' process">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("buying_path.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title" {...bind("buying_path.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("buying_path.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.buying_path.steps || []}
                fields={[{ key: "number", label: "Step number" }, { key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                onChange={bind("buying_path.steps").onChange}
                template={{ number: "", title: "", description: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Project Package Request" subtitle="The WhatsApp brochure/floor-plan request section">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("package_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("package_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("package_section.description")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Bullet points" items={content.package_section.bullets || []} onChange={bind("package_section.bullets").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}><Field label="Form title" {...bind("package_section.form_title")} /></Grid2>
            <Grid2 size={12}><Field label="Form description" {...bind("package_section.form_description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Submit button label" {...bind("package_section.submit_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Form disclaimer" {...bind("package_section.form_disclaimer")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Buying timeline options" items={content.package_section.timeline_options || []} onChange={bind("package_section.timeline_options").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="FAQ" subtitle="Project buyer questions section">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("faq_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("faq_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("faq_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.faq_section.items || []} fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", multiline: true }]} onChange={bind("faq_section.items").onChange} template={{ question: "", answer: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Bottom CTA Banners" subtitle="'Compare projects' + 'Ready to own property' banners">
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Compare banner title" {...bind("cta_section.compare_title")} /></Grid2>
            <Grid2 size={12}><Field label="Compare banner description" multiline minRows={2} {...bind("cta_section.compare_description")} /></Grid2>
            <Grid2 size={12}><Field label="Compare button label" {...bind("cta_section.compare_cta_label")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}><Field label="Consultation banner title" {...bind("cta_section.consult_title")} /></Grid2>
            <Grid2 size={12}><Field label="Consultation banner description" multiline minRows={2} {...bind("cta_section.consult_description")} /></Grid2>
            <Grid2 size={12}><Field label="Consultation button label" {...bind("cta_section.consult_cta_label")} /></Grid2>
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

export default ProjectsContentSettingsView;
