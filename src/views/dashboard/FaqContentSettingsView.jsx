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
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchFaqContent, updateFaqContent } from "../../api/faqContent";
import faqContentDefaults from "../../utils/faqContentDefaults";

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

// Editor for the Q&A list — each item also picks a category from the current category list.
const QuestionListEditor = ({ items = [], categories = [], onChange }) => {
  const updateItem = (i, key, val) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { number: items.length + 1, category: categories[0] || "", question: "", answer: "" }]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1.5 }}>Questions ({items.length})</Typography>
      <Stack spacing={2}>
        {items.map((item, i) => (
          <Box key={i} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, position: "relative" }}>
            <IconButton size="small" color="error" onClick={() => remove(i)} sx={{ position: "absolute", top: 6, right: 6 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
            <Stack spacing={1.5} sx={{ pr: 4 }}>
              <Stack direction="row" spacing={1.5}>
                <TextField label="Number" type="number" value={item.number ?? ""} onChange={(e) => updateItem(i, "number", Number(e.target.value))} size="small" sx={{ width: 110 }} />
                <TextField select label="Category" value={item.category || ""} onChange={(e) => updateItem(i, "category", e.target.value)} size="small" fullWidth>
                  {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Stack>
              <Field label="Question" value={item.question} onChange={(v) => updateItem(i, "question", v)} />
              <Field label="Answer" value={item.answer} multiline minRows={2} onChange={(v) => updateItem(i, "answer", v)} />
            </Stack>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={add} size="small" sx={{ alignSelf: "flex-start" }}>
          Add question
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

const FaqContentSettingsView = () => {
  const [content, setContent] = useState(faqContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFaqContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load FAQ content:", err);
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
      const updated = await updateFaqContent(content);
      setContent((prev) => ({ ...prev, ...updated }));
      setSnackbar({ open: true, severity: "success", message: "FAQ page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save FAQ content:", err);
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
          <QuizRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>FAQ Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              Everything shown on the public FAQ page — edit here and it updates the live site instantly.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        <SectionAccordion title="Hero Section" subtitle="Top banner with title and the 3 stats" defaultExpanded>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("hero.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title — prefix" {...bind("hero.title_prefix")} /></Grid2>
            <Grid2 size={12}><Field label="Title — highlighted phrase" {...bind("hero.title_highlight")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("hero.description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Primary button label" {...bind("hero.primary_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Secondary button label" {...bind("hero.secondary_cta")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor label="Stats" items={content.hero.stats || []} fields={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]} onChange={bind("hero.stats").onChange} template={{ value: "", label: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Ask Your Question Form" subtitle="The form panel on the right of the hero">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel title" {...bind("request_panel.title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel subtitle" {...bind("request_panel.subtitle")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="WhatsApp submit button label" {...bind("request_panel.submit_whatsapp_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Email submit button label" {...bind("request_panel.submit_email_label")} /></Grid2>
            <Grid2 size={12}><Field label="Form disclaimer" multiline minRows={2} {...bind("request_panel.form_disclaimer")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Buyer status options" items={content.request_panel.status_options || []} onChange={bind("request_panel.status_options").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Trust Strip" subtitle="The 4 short trust items below the hero">
          <ObjectListEditor items={content.trust_items || []} fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("trust_items").onChange} template={{ title: "", description: "" }} />
        </SectionAccordion>

        <SectionAccordion title="Topic Overview Cards" subtitle="The 6 topic cards shown above the searchable FAQ">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("topics_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("topics_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("topics_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.topics_section.items || []} fields={[{ key: "number", label: "Number (e.g. 01)" }, { key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("topics_section.items").onChange} template={{ number: "", title: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Categories" subtitle="The filter list used in the searchable FAQ sidebar. Renaming a category here does not automatically update questions already using the old name.">
          <StringListEditor items={content.categories || []} onChange={bind("categories").onChange} />
        </SectionAccordion>

        <SectionAccordion title="Questions" subtitle={`All ${content.questions?.length || 0} buyer questions, grouped by category`}>
          <QuestionListEditor items={content.questions || []} categories={content.categories || []} onChange={bind("questions").onChange} />
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

export default FaqContentSettingsView;
