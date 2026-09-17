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
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchBuyContent, updateBuyContent } from "../../api/buyContent";
import buyContentDefaults from "../../utils/buyContentDefaults";

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

const BuyContentSettingsView = () => {
  const [content, setContent] = useState(buyContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [consultationFile, setConsultationFile] = useState(null);
  const [consultationPreview, setConsultationPreview] = useState(null);

  const handleHeroFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const handleConsultationFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setConsultationFile(file);
    setConsultationPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBuyContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load buy content:", err);
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
      const updated = await updateBuyContent(content, heroFile, consultationFile);
      setContent((prev) => ({ ...prev, ...updated }));
      setHeroFile(null);
      setHeroPreview(null);
      setConsultationFile(null);
      setConsultationPreview(null);
      setSnackbar({ open: true, severity: "success", message: "Buy page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save buy content:", err);
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
          <SellRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Buy Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              The hero, buyer brief form, feature strip, and listing labels on the public Buy page. Properties themselves come from your Properties list.
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
              {!heroPreview && !content.hero.background_image && <SellRoundedIcon />}
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
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Badge text" {...bind("hero.badge")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title — highlighted word" {...bind("hero.title_highlight")} /></Grid2>
            <Grid2 size={12}><Field label="Title — prefix" {...bind("hero.title_prefix")} /></Grid2>
            <Grid2 size={12}><Field label="Subtitle" multiline minRows={2} {...bind("hero.subtitle")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Primary button label" {...bind("hero.primary_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Secondary button label" {...bind("hero.secondary_cta")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Quick filter chips" items={content.hero.quick_filters || []} onChange={bind("hero.quick_filters").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Stats"
                items={content.hero.stats || []}
                fields={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]}
                onChange={bind("hero.stats").onChange}
                template={{ value: "", label: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Buyer Brief Form" subtitle="The comparison request panel on the right of the hero">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("brief_panel.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel title" {...bind("brief_panel.title")} /></Grid2>
            <Grid2 size={12}><Field label="Panel subtitle" {...bind("brief_panel.subtitle")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Criteria title" {...bind("brief_panel.criteria_title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Criteria description" {...bind("brief_panel.criteria_description")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Criteria toggle options (e.g. Price / Size / View)" items={content.brief_panel.criteria_options || []} onChange={bind("brief_panel.criteria_options").onChange} />
            </Grid2>
            <Grid2 size={12}><Field label="Helper note" multiline minRows={2} {...bind("brief_panel.helper_note")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="WhatsApp submit button label" {...bind("brief_panel.submit_whatsapp_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Email submit button label" {...bind("brief_panel.submit_email_label")} /></Grid2>
            <Grid2 size={12}><Field label="Form disclaimer" {...bind("brief_panel.form_disclaimer")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Area options" items={content.brief_panel.area_options || []} onChange={bind("brief_panel.area_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Home type options" items={content.brief_panel.home_type_options || []} onChange={bind("brief_panel.home_type_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Budget options" items={content.brief_panel.budget_options || []} onChange={bind("brief_panel.budget_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Purpose options" items={content.brief_panel.purpose_options || []} onChange={bind("brief_panel.purpose_options").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Feature Strip" subtitle="The 4 short feature blurbs below the hero">
          <ObjectListEditor
            items={content.feature_strip || []}
            fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
            onChange={bind("feature_strip").onChange}
            template={{ title: "", description: "" }}
          />
        </SectionAccordion>

        <SectionAccordion title="Listing Section" subtitle="Search bar, quick filters, and property card labels">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("listing_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("listing_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("listing_section.description")} /></Grid2>
            <Grid2 size={12}><Field label="Search placeholder" {...bind("listing_section.search_placeholder")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="'All locations' label" {...bind("listing_section.location_all_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="'All types' label" {...bind("listing_section.type_all_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="'Any budget' label" {...bind("listing_section.budget_all_label")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Sort options" items={content.listing_section.sort_options || []} onChange={bind("listing_section.sort_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Quick filter chips" items={content.listing_section.quick_filters || []} onChange={bind("listing_section.quick_filters").onChange} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Reset filters button label" {...bind("listing_section.reset_filters_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Results text (use {shown} and {total})" {...bind("listing_section.results_template")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="'View listing' button label" {...bind("listing_section.view_listing_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="WhatsApp button label" {...bind("listing_section.whatsapp_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="Compare checkbox label" {...bind("listing_section.compare_label")} /></Grid2>
            <Grid2 size={12}><Field label="Empty state message" {...bind("listing_section.empty_state")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Buyer Journey & Calculator" subtitle="The 4-step journey, payment calculator, and reservation checklist">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("journey_section.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 3 }}><Field label="Title — prefix" {...bind("journey_section.title_prefix")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 3 }}><Field label="Title — highlighted word" {...bind("journey_section.title_highlight")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("journey_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Journey steps"
                items={content.journey_section.steps || []}
                fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                onChange={bind("journey_section.steps").onChange}
                template={{ title: "", description: "" }}
              />
            </Grid2>
            <Grid2 size={12}><Divider sx={{ my: 1 }} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Calculator title" {...bind("journey_section.calculator_title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Calculator description" {...bind("journey_section.calculator_description")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Price options (e.g. 'Estimated price: €75,000')" items={content.journey_section.price_options || []} onChange={bind("journey_section.price_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Down payment options (e.g. '10% down payment')" items={content.journey_section.down_payment_options || []} onChange={bind("journey_section.down_payment_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Duration options (e.g. 'Instalments over 2 years')" items={content.journey_section.duration_options || []} onChange={bind("journey_section.duration_options").onChange} />
            </Grid2>
            <Grid2 size={12}><Field label="Calculator disclaimer" {...bind("journey_section.calculator_disclaimer")} /></Grid2>
            <Grid2 size={12}><Divider sx={{ my: 1 }} /></Grid2>
            <Grid2 size={12}><Field label="Checklist title" {...bind("journey_section.checklist_title")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Checklist items"
                items={content.journey_section.checklist_items || []}
                fields={[{ key: "label", label: "Label" }, { key: "tag", label: "Tag (e.g. 'Required', 'Verify')" }]}
                onChange={bind("journey_section.checklist_items").onChange}
                template={{ label: "", tag: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Consultation Section" subtitle="Background image, bullets, and the WhatsApp buying-advice form">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={consultationPreview || content.consultation_section.background_image || undefined}
              variant="rounded"
              sx={{ width: 120, height: 80, bgcolor: "action.hover" }}
            >
              {!consultationPreview && !content.consultation_section.background_image && <SellRoundedIcon />}
            </Avatar>
            <Stack direction="row" spacing={1.5}>
              <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />}>
                Upload background image
                <input type="file" hidden accept="image/*" onChange={handleConsultationFile} />
              </Button>
              {(consultationPreview || content.consultation_section.background_image) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => {
                    setConsultationFile(null);
                    setConsultationPreview(null);
                    setContent((prev) => ({ ...prev, consultation_section: { ...prev.consultation_section, background_image: null } }));
                  }}
                >
                  Remove
                </Button>
              )}
            </Stack>
          </Stack>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("consultation_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" multiline minRows={2} {...bind("consultation_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("consultation_section.description")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Bullet points" items={content.consultation_section.bullets || []} onChange={bind("consultation_section.bullets").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider sx={{ my: 1 }} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Form title" {...bind("consultation_section.form_title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Form description" {...bind("consultation_section.form_description")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Buying timeline options" items={content.consultation_section.timeline_options || []} onChange={bind("consultation_section.timeline_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Budget options" items={content.consultation_section.budget_options || []} onChange={bind("consultation_section.budget_options").onChange} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Submit button label" {...bind("consultation_section.submit_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Form disclaimer" {...bind("consultation_section.form_disclaimer")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Bottom CTA Banners" subtitle="Blog banner and 'Ready to own property' banner">
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Blog banner — title" {...bind("cta_section.blog_title")} /></Grid2>
            <Grid2 size={12}><Field label="Blog banner — description" multiline minRows={2} {...bind("cta_section.blog_description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Blog banner — button label" {...bind("cta_section.blog_cta_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Blog banner — link URL" {...bind("cta_section.blog_url")} /></Grid2>
            <Grid2 size={12}><Divider sx={{ my: 1 }} /></Grid2>
            <Grid2 size={12}><Field label="Consultation banner — title" {...bind("cta_section.consult_title")} /></Grid2>
            <Grid2 size={12}><Field label="Consultation banner — description" multiline minRows={2} {...bind("cta_section.consult_description")} /></Grid2>
            <Grid2 size={12}><Field label="Consultation banner — button label" {...bind("cta_section.consult_cta_label")} /></Grid2>
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

export default BuyContentSettingsView;
