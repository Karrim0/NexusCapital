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
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchContactContent, updateContactContent } from "../../api/contactContent";
import contactContentDefaults from "../../utils/contactContentDefaults";

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

const ContactContentSettingsView = () => {
  const [content, setContent] = useState(contactContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchContactContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load Contact content:", err);
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
      const updated = await updateContactContent(content);
      setContent((prev) => ({ ...prev, ...updated }));
      setSnackbar({ open: true, severity: "success", message: "Contact page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save Contact content:", err);
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
          <ContactMailRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Contact Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              Everything shown on the public Contact page — edit here and it updates the live site instantly.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        <SectionAccordion title="Hero Section" subtitle="Title, buttons, chips, and the 'Get in Touch' panel" defaultExpanded>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("hero.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title — prefix" {...bind("hero.title_prefix")} /></Grid2>
            <Grid2 size={12}><Field label="Title — highlighted phrase" {...bind("hero.title_highlight")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("hero.description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="WhatsApp button label" {...bind("hero.whatsapp_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="Call button label" {...bind("hero.call_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}><Field label="Email button label" {...bind("hero.email_cta")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Chips" items={content.hero.chips || []} onChange={bind("hero.chips").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel title" {...bind("hero.panel.title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Panel subtitle" {...bind("hero.panel.subtitle")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Phone note" {...bind("hero.panel.phone_note")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Email note" {...bind("hero.panel.email_note")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Address label" {...bind("hero.panel.address_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Address note" {...bind("hero.panel.address_note")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Send message form' button label" {...bind("hero.panel.form_cta_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Open Google Map' button label" {...bind("hero.panel.map_cta_label")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor label="Quick info boxes" items={content.hero.quick_info || []} fields={[{ key: "title", label: "Value (leave blank to auto-fill phone)" }, { key: "subtitle", label: "Label" }]} onChange={bind("hero.quick_info").onChange} template={{ title: "", subtitle: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Trust Strip" subtitle="The 4 cards under the hero">
          <ObjectListEditor items={content.trust_items || []} fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("trust_items").onChange} template={{ title: "", description: "" }} />
        </SectionAccordion>

        <SectionAccordion title="How The Team Can Help" subtitle="Local team support card + fastest reply route">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("help_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("help_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("help_section.description")} /></Grid2>
            <Grid2 size={12}><Field label="Card title" {...bind("help_section.card_title")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Paragraphs" items={content.help_section.paragraphs || []} onChange={bind("help_section.paragraphs").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Bullet points" items={content.help_section.bullets || []} onChange={bind("help_section.bullets").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Side panel title" {...bind("help_section.side_title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Side panel button label" {...bind("help_section.side_cta_label")} /></Grid2>
            <Grid2 size={12}><Field label="Side panel description" multiline minRows={2} {...bind("help_section.side_description")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Contact Details Cards" subtitle="Phone / WhatsApp / Email / Office address cards">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("details_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("details_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("details_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.details_section.items || []}
                fields={[{ key: "title", label: "Card title" }, { key: "description", label: "Description", multiline: true }, { key: "link_label", label: "Link label" }]}
                onChange={bind("details_section.items").onChange}
                template={{ title: "", description: "", link_label: "" }}
              />
            </Grid2>
            <Grid2 size={12}>
              <Typography variant="caption" color="text.secondary">
                Order matters: card 1 = phone, card 2 = WhatsApp, card 3 = email, card 4 = address. Values come from Home Page Content (Contact Details).
              </Typography>
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Contact Form" subtitle="Labels and dropdown options for the message form">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("form_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("form_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("form_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor label="Badge cards" items={content.form_section.badges || []} fields={[{ key: "number", label: "Number" }, { key: "title", label: "Title" }]} onChange={bind("form_section.badges").onChange} template={{ number: "", title: "" }} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Form title" {...bind("form_section.form_title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Form note" {...bind("form_section.form_note")} /></Grid2>
            <Grid2 size={12}><Field label="Contact method note" {...bind("form_section.method_note")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Preferred contact method options" items={content.form_section.contact_method_options || []} onChange={bind("form_section.contact_method_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Enquiry type options" items={content.form_section.enquiry_options || []} onChange={bind("form_section.enquiry_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Area options" items={content.form_section.area_options || []} onChange={bind("form_section.area_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Budget options" items={content.form_section.budget_options || []} onChange={bind("form_section.budget_options").onChange} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Timeline options" items={content.form_section.timeline_options || []} onChange={bind("form_section.timeline_options").onChange} />
            </Grid2>
            <Grid2 size={12}><Field label="Consent checkbox text" multiline minRows={2} {...bind("form_section.consent_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Send Message' button label" {...bind("form_section.submit_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Continue on WhatsApp' button label" {...bind("form_section.whatsapp_label")} /></Grid2>
            <Grid2 size={12}><Field label="Disclaimer" multiline minRows={2} {...bind("form_section.disclaimer")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Location" subtitle="Map section and office information">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("location_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("location_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("location_section.description")} /></Grid2>
            <Grid2 size={12}><Field label="Map placeholder title" {...bind("location_section.map_placeholder_title")} /></Grid2>
            <Grid2 size={12}><Field label="Map placeholder description" multiline minRows={2} {...bind("location_section.map_placeholder_description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Load Google Map' button label" {...bind("location_section.load_map_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Google Maps embed URL" placeholder="https://www.google.com/maps/embed?pb=..." {...bind("location_section.map_embed_url")} /></Grid2>
            <Grid2 size={12}><Field label="Office info title" {...bind("location_section.info_title")} /></Grid2>
            <Grid2 size={12}><Field label="Office info note" multiline minRows={2} {...bind("location_section.info_note")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Open Directions' button label" {...bind("location_section.directions_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'Call Office' button label" {...bind("location_section.call_label")} /></Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="What To Ask Us" subtitle="The 4 enquiry-path cards">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("ask_section.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("ask_section.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("ask_section.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.ask_section.items || []} fields={[{ key: "number", label: "Number" }, { key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("ask_section.items").onChange} template={{ number: "", title: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="FAQ" subtitle="Contact page questions">
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

export default ContactContentSettingsView;
