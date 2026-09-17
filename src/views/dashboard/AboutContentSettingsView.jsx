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
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchAboutContent, updateAboutContent } from "../../api/aboutContent";
import aboutContentDefaults from "../../utils/aboutContentDefaults";
import { ImageUploadField } from "../../components/dashboard/ContentListEditors";

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
                f.type === "image" ? (
                  <ImageUploadField key={f.key} label={f.label} value={item[f.key]} onChange={(v) => updateItem(i, f.key, v)} folder={f.folder} />
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

const AboutContentSettingsView = () => {
  const [content, setContent] = useState(aboutContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [chairmanFile, setChairmanFile] = useState(null);
  const [chairmanPreview, setChairmanPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAboutContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load About content:", err);
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

  const handleHeroFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const handleChairmanFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setChairmanFile(file);
    setChairmanPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateAboutContent(content, heroFile, chairmanFile);
      setContent((prev) => ({ ...prev, ...updated }));
      setHeroFile(null);
      setHeroPreview(null);
      setChairmanFile(null);
      setChairmanPreview(null);
      setSnackbar({ open: true, severity: "success", message: "About page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save About content:", err);
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
          <InfoRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>About Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              Everything shown on the public About Us page, including the hero background and chairman photo — edit here and it updates the live site instantly.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        <SectionAccordion title="Hero Section" subtitle="Top banner, background image, snapshot panel, and feature cards" defaultExpanded>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <Avatar src={heroPreview || content.hero.background_image || undefined} variant="rounded" sx={{ width: 120, height: 80, bgcolor: "action.hover" }} />
            <Stack direction="row" spacing={1.5}>
              <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
                Upload hero background image
                <input type="file" hidden accept="image/*" onChange={handleHeroFile} />
              </Button>
              {(heroPreview || content.hero.background_image) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => {
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
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("hero.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title — prefix" {...bind("hero.title_prefix")} /></Grid2>
            <Grid2 size={12}><Field label="Title — highlighted phrase" {...bind("hero.title_highlight")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("hero.description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Primary button label" {...bind("hero.primary_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Secondary button label" {...bind("hero.secondary_cta")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Chips" items={content.hero.chips || []} onChange={bind("hero.chips").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Snapshot panel title" {...bind("hero.snapshot.title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Snapshot panel subtitle" {...bind("hero.snapshot.subtitle")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor label="Snapshot stats" items={content.hero.snapshot.stats || []} fields={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]} onChange={bind("hero.snapshot.stats").onChange} template={{ value: "", label: "" }} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Snapshot bullets" items={content.hero.snapshot.bullets || []} onChange={bind("hero.snapshot.bullets").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor label="Feature cards (below hero)" items={content.hero.feature_cards || []} fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("hero.feature_cards").onChange} template={{ title: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Our Company Section" subtitle="Company overview card + 'What we help with'">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("company.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("company.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("company.description")} /></Grid2>
            <Grid2 size={12}><Field label="Card title" {...bind("company.card_title")} /></Grid2>
            <Grid2 size={12}><Field label="Card description (use a blank line for a new paragraph)" multiline minRows={4} {...bind("company.card_description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="'What we help with' title" {...bind("company.help_title")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Button label (leads to chairman message)" {...bind("company.cta_label")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.company.help_items || []} fields={[{ key: "label", label: "Label (e.g. 'Buy')" }, { key: "description", label: "Description" }]} onChange={bind("company.help_items").onChange} template={{ label: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Chairman / Founder" subtitle="Photo, name, quote, and full message">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <Avatar src={chairmanPreview || content.chairman.photo || undefined} variant="rounded" sx={{ width: 84, height: 84, bgcolor: "action.hover" }} />
            <Stack direction="row" spacing={1.5}>
              <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
                Upload chairman photo
                <input type="file" hidden accept="image/*" onChange={handleChairmanFile} />
              </Button>
              {(chairmanPreview || content.chairman.photo) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => {
                    setChairmanPreview(null);
                    setContent((prev) => ({ ...prev, chairman: { ...prev.chairman, photo: null } }));
                  }}
                >
                  Remove
                </Button>
              )}
            </Stack>
          </Stack>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Name" {...bind("chairman.name")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title" {...bind("chairman.title")} /></Grid2>
            <Grid2 size={12}><Field label="Short quote" multiline minRows={2} {...bind("chairman.quote")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("chairman.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Message title" {...bind("chairman.message_title")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Message paragraphs" items={content.chairman.paragraphs || []} onChange={bind("chairman.paragraphs").onChange} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Primary button label" {...bind("chairman.primary_cta")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Secondary button label" {...bind("chairman.secondary_cta")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Side panel title" {...bind("chairman.side_title")} /></Grid2>
            <Grid2 size={12}><Field label="Side panel description" multiline minRows={2} {...bind("chairman.side_description")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Side panel bullets" items={content.chairman.side_bullets || []} onChange={bind("chairman.side_bullets").onChange} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Certifications & Trust" subtitle="Licenses, memberships, awards, or anything showing credibility — shown right below the Chairman section">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("certifications.eyebrow")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Title" {...bind("certifications.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description (optional)" multiline minRows={2} {...bind("certifications.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Certificates / Awards"
                items={content.certifications?.items || []}
                fields={[
                  { key: "image", label: "Certificate image", type: "image", folder: "certifications" },
                  { key: "title", label: "Title (e.g. 'Licensed Real Estate Broker')" },
                  { key: "description", label: "Description", multiline: true },
                ]}
                onChange={bind("certifications.items").onChange}
                template={{ image: "", title: "", description: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Why Choose Us" subtitle="The 6 reason cards">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("why_choose.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("why_choose.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("why_choose.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.why_choose.items || []} fields={[{ key: "number", label: "Number" }, { key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("why_choose.items").onChange} template={{ number: "", title: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Destinations" subtitle="Where We Work — location cards">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("destinations.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("destinations.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("destinations.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.destinations.items || []}
                fields={[
                  { key: "name", label: "Destination name" },
                  { key: "description", label: "Description", multiline: true },
                  { key: "link_label", label: "Link label" },
                  { key: "image", label: "Destination image", type: "image", folder: "about-destinations" },
                ]}
                onChange={bind("destinations.items").onChange}
                template={{ name: "", description: "", link_label: "", image: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Our Method" subtitle="The 4-step process">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("method.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("method.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("method.description")} /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor items={content.method.steps || []} fields={[{ key: "number", label: "Step number" }, { key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]} onChange={bind("method.steps").onChange} template={{ number: "", title: "", description: "" }} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        <SectionAccordion title="Get In Touch" subtitle="Contact info cards and the message form">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Eyebrow" {...bind("contact.eyebrow")} /></Grid2>
            <Grid2 size={12}><Field label="Title" {...bind("contact.title")} /></Grid2>
            <Grid2 size={12}><Field label="Description" multiline minRows={2} {...bind("contact.description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Phone card label" {...bind("contact.phone_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Email card label" {...bind("contact.email_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Address card label" {...bind("contact.address_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Business hours card label" {...bind("contact.hours_label")} /></Grid2>
            <Grid2 size={12}><Field label="Business hours value" {...bind("contact.business_hours")} /></Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}><Field label="Form title" {...bind("contact.form_title")} /></Grid2>
            <Grid2 size={12}><Field label="Form description" {...bind("contact.form_description")} /></Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Enquiry type options" items={content.contact.enquiry_options || []} onChange={bind("contact.enquiry_options").onChange} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Submit button label" {...bind("contact.submit_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Form disclaimer" {...bind("contact.form_disclaimer")} /></Grid2>
          </Grid2>
          <Typography variant="caption" color="text.secondary">
            Phone, email, and address values come from Home Page Content (Contact Details) so they stay consistent site-wide.
          </Typography>
        </SectionAccordion>

        <SectionAccordion title="Bottom CTA Banners" subtitle="Blog banner + 'Ready to own property' banner">
          <Grid2 container spacing={2}>
            <Grid2 size={12}><Field label="Blog banner title" {...bind("cta_section.blog_title")} /></Grid2>
            <Grid2 size={12}><Field label="Blog banner description" multiline minRows={2} {...bind("cta_section.blog_description")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Blog button label" {...bind("cta_section.blog_cta_label")} /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}><Field label="Blog link URL" {...bind("cta_section.blog_url")} /></Grid2>
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

export default AboutContentSettingsView;
