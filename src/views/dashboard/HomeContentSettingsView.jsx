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
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { fetchHomeContent, updateHomeContent } from "../../api/homeContent";
import homeContentDefaults from "../../utils/homeContentDefaults";
import { ImageUploadField, DistrictSelectField, DistrictMultiSelectField, NavMenuEditor } from "../../components/dashboard/ContentListEditors";

// ─────────────────────────────────────────────────────────────────────────
// Small reusable building blocks
// ─────────────────────────────────────────────────────────────────────────

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

// Simple array-of-strings editor (chips like "features", "quick filters"...)
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

// Generic array-of-objects editor (destinations, steps, services, reviews, faqs, links...)
const ObjectListEditor = ({ label, items = [], fields, onChange, template }) => {
  const updateItem = (i, key, val) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { ...template }]);

  return (
    <Box>
      {label && (
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1.5 }}>{label}</Typography>
      )}
      <Stack spacing={2}>
        {items.map((item, i) => (
          <Box key={i} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, position: "relative" }}>
            <IconButton size="small" color="error" onClick={() => remove(i)} sx={{ position: "absolute", top: 6, right: 6 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
            <Stack spacing={1.5} sx={{ pr: 4 }}>
              {fields.map((f) =>
                f.type === "image" ? (
                  <ImageUploadField
                    key={f.key}
                    label={f.label}
                    value={item[f.key]}
                    onChange={(v) => updateItem(i, f.key, v)}
                    folder={f.folder}
                  />
                ) : f.type === "district" ? (
                  <DistrictSelectField
                    key={f.key}
                    label={f.label}
                    value={item[f.key]}
                    onChange={(v) => updateItem(i, f.key, v)}
                  />
                ) : (
                  <Field
                    key={f.key}
                    label={f.label}
                    value={item[f.key]}
                    multiline={f.multiline}
                    minRows={f.minRows}
                    onChange={(v) => updateItem(i, f.key, v)}
                  />
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
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={2.5}>{children}</Stack>
    </AccordionDetails>
  </Accordion>
);

// ─────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────

const HomeContentSettingsView = () => {
  const [content, setContent] = useState(homeContentDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHomeContent();
        setContent((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load home content:", err);
        setSnackbar({ open: true, severity: "error", message: "Could not load saved content — showing defaults." });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Bind a field at `path` (e.g. "hero.title_prefix") to the local content state.
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

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleHeroFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateHomeContent(content, logoFile, heroFile);
      setContent((prev) => ({ ...prev, ...updated }));
      setLogoFile(null);
      setLogoPreview(null);
      setHeroFile(null);
      setHeroPreview(null);
      setSnackbar({ open: true, severity: "success", message: "Home page content saved. Changes are live now." });
    } catch (err) {
      console.error("Failed to save home content:", err);
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
          <HomeRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Home Page Content</Typography>
            <Typography variant="body2" color="text.secondary">
              Everything shown on the public homepage — edit here and it updates the live site instantly.
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Stack spacing={2}>
        {/* Brand & Logo */}
        <SectionAccordion title="Brand & Logo" subtitle="Company name, tagline, and the logo shown across the site" defaultExpanded>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <Avatar
              src={logoPreview || content.logo_url || undefined}
              variant="rounded"
              sx={{ width: 84, height: 84, bgcolor: "action.hover" }}
            >
              {!logoPreview && !content.logo_url && <HomeRoundedIcon />}
            </Avatar>
            <Stack direction="row" spacing={1.5}>
              <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
                Upload logo
                <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
              </Button>
              {(logoPreview || content.logo_url) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview(null);
                    setContent((prev) => ({ ...prev, logo_url: null }));
                  }}
                >
                  Remove
                </Button>
              )}
            </Stack>
          </Stack>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Brand name" {...bind("brand_name")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Tagline" {...bind("brand_tagline")} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Navigation Menu */}
        <SectionAccordion title="Navigation Menu" subtitle="Choose which pages appear in the header menu, and their order">
          <NavMenuEditor
            items={content.nav_menu || []}
            onChange={bind("nav_menu").onChange}
          />
        </SectionAccordion>

        {/* Contact / Topbar */}
        <SectionAccordion title="Contact Details" subtitle="Phone, email and WhatsApp number used across the homepage">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Phone" {...bind("topbar.phone")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Email" {...bind("topbar.email")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="WhatsApp number (with country code, e.g. +20111...)" {...bind("topbar.whatsapp_number")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Top strip text" {...bind("topbar.strip_text")} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Hero */}
        <SectionAccordion title="Hero Section" subtitle="The big banner at the top of the homepage">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <Avatar
              src={heroPreview || content.hero.background_image || undefined}
              variant="rounded"
              sx={{ width: 120, height: 80, bgcolor: "action.hover" }}
            >
              {!heroPreview && !content.hero.background_image && <HomeRoundedIcon />}
            </Avatar>
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
            <Grid2 size={12}>
              <Field label="Eyebrow (destinations line)" {...bind("hero.eyebrow")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Title — prefix" {...bind("hero.title_prefix")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Title — highlighted word" {...bind("hero.title_highlight")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Title — suffix" {...bind("hero.title_suffix")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Subtitle" multiline minRows={2} {...bind("hero.subtitle")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Primary button label" {...bind("hero.primary_cta")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Secondary button label" {...bind("hero.secondary_cta")} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Feature chips" items={content.hero.features || []} onChange={bind("hero.features").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <Field label="Shortlist form title" {...bind("hero.form_title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Shortlist form subtitle" {...bind("hero.form_subtitle")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Helper note" multiline minRows={2} {...bind("hero.form_helper")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="WhatsApp submit button label" {...bind("hero.submit_whatsapp_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Email submit button label" {...bind("hero.submit_email_label")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Form disclaimer" {...bind("hero.form_disclaimer")} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Stats */}
        <SectionAccordion title="Stats Strip" subtitle="The three number highlights (properties, projects, reviews)">
          <ObjectListEditor
            items={content.stats || []}
            fields={[{ key: "value", label: "Value (e.g. 94+)" }, { key: "label", label: "Label" }]}
            onChange={bind("stats").onChange}
            template={{ value: "", label: "" }}
          />
        </SectionAccordion>

        {/* Search section */}
        <SectionAccordion title="Lifestyle Search Section" subtitle="'Start with your lifestyle' block with the buyer clarity panel">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("search_section.eyebrow")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("search_section.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Description" multiline minRows={2} {...bind("search_section.description")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Search card title" {...bind("search_section.card_title")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Search card description" {...bind("search_section.card_description")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="'Open listings' button label" {...bind("search_section.open_listings_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="'Ask for matches' button label" {...bind("search_section.ask_matches_label")} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Quick filter chips" items={content.search_section.quick_filters || []} onChange={bind("search_section.quick_filters").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Clarity panel title" {...bind("search_section.clarity_panel_title")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Clarity panel description" {...bind("search_section.clarity_panel_description")} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Clarity steps"
                items={content.search_section.clarity_steps || []}
                fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                onChange={bind("search_section.clarity_steps").onChange}
                template={{ title: "", description: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Destinations */}
        <SectionAccordion title="Destinations (Where to Buy)" subtitle="The location cards — Hurghada, Sahl Hasheesh, etc.">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("destinations_section.eyebrow")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("destinations_section.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Description" multiline minRows={2} {...bind("destinations_section.description")} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.destinations_section.items || []}
                fields={[
                  { key: "name", label: "Destination name" },
                  { key: "description", label: "Description", multiline: true },
                  { key: "link_label", label: "Link label (e.g. 'Explore properties')" },
                  { key: "district", label: "Linked district (filters Buy page results)", type: "district" },
                  { key: "image", label: "Destination image", type: "image", folder: "home-destinations" },
                ]}
                onChange={bind("destinations_section.items").onChange}
                template={{ name: "", description: "", link_label: "", district: "", image: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Featured properties labels */}
        <SectionAccordion title="Featured Properties Section" subtitle="Labels around the property cards (the properties themselves come from your Properties list)">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("featured_section.eyebrow")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("featured_section.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Description" multiline minRows={2} {...bind("featured_section.description")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="'See all listings' button label" {...bind("featured_section.cta_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Helper note (below carousel)" {...bind("featured_section.helper_note")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="'View details' button label" {...bind("featured_section.details_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="WhatsApp button label" {...bind("featured_section.whatsapp_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Compare checkbox label" {...bind("featured_section.compare_label")} />
            </Grid2>
            <Grid2 size={12}>
              <DistrictMultiSelectField
                label="Areas shown as quick-filter chips (click one to browse matching units)"
                value={content.featured_section.district_filters || []}
                onChange={bind("featured_section.district_filters").onChange}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Buyer journey */}
        <SectionAccordion title="Buyer Journey" subtitle="The 4-step journey, payment calculator and access guide">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("journey_section.eyebrow")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("journey_section.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Description" multiline minRows={2} {...bind("journey_section.description")} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Journey steps"
                items={content.journey_section.steps || []}
                fields={[
                  { key: "number", label: "Step number" },
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", multiline: true },
                ]}
                onChange={bind("journey_section.steps").onChange}
                template={{ number: "", title: "", description: "" }}
              />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <Field label="Payment snapshot title" {...bind("journey_section.payment_snapshot.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Payment snapshot description" multiline minRows={2} {...bind("journey_section.payment_snapshot.description")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Default price (€)" {...bind("journey_section.payment_snapshot.default_price")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Default down payment %" {...bind("journey_section.payment_snapshot.default_down_percent")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Default installment years" {...bind("journey_section.payment_snapshot.default_years")} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Access guide title" {...bind("journey_section.access_guide.title")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Access guide description" {...bind("journey_section.access_guide.description")} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.journey_section.access_guide.items || []}
                fields={[{ key: "label", label: "Label (e.g. 'Airport to central Hurghada')" }, { key: "value", label: "Value (e.g. 'Fast access')" }]}
                onChange={bind("journey_section.access_guide.items").onChange}
                template={{ label: "", value: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Services */}
        <SectionAccordion title="Services" subtitle="The 6 service cards">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("services_section.eyebrow")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("services_section.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Description" multiline minRows={2} {...bind("services_section.description")} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.services_section.items || []}
                fields={[
                  { key: "number", label: "Number (e.g. 01)" },
                  { key: "title", label: "Title" },
                  { key: "description", label: "Description", multiline: true },
                ]}
                onChange={bind("services_section.items").onChange}
                template={{ number: "", title: "", description: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Shortlist / consultation form */}
        <SectionAccordion title="Consultation Request Section" subtitle="'Tell us your budget' block with the consultation form">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("shortlist_section.eyebrow")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("shortlist_section.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Description" multiline minRows={2} {...bind("shortlist_section.description")} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Bullet points" items={content.shortlist_section.bullets || []} onChange={bind("shortlist_section.bullets").onChange} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <Field label="Form title" {...bind("shortlist_section.form_title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Form description" {...bind("shortlist_section.form_description")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Submit button label" {...bind("shortlist_section.submit_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Form disclaimer" {...bind("shortlist_section.form_disclaimer")} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Testimonials */}
        <SectionAccordion title="Testimonials / Google Reviews" subtitle="Social proof block">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("testimonials_section.eyebrow")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Badge (e.g. Google Reviews)" {...bind("testimonials_section.badge")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("testimonials_section.title")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Field label="Reviews count (e.g. 21)" {...bind("testimonials_section.reviews_count")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 8 }}>
              <Field label="Reviews note" {...bind("testimonials_section.reviews_note")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="'Read reviews' button label" {...bind("testimonials_section.read_reviews_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="'Message advisor' button label" {...bind("testimonials_section.message_advisor_label")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Google reviews URL" {...bind("testimonials_section.google_reviews_url")} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Reviews"
                items={content.testimonials_section.reviews || []}
                fields={[
                  { key: "quote", label: "Quote", multiline: true },
                  { key: "name", label: "Reviewer name" },
                  { key: "source", label: "Source (e.g. 'Posted on Google')" },
                ]}
                onChange={bind("testimonials_section.reviews").onChange}
                template={{ quote: "", name: "", source: "Posted on Google" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* FAQ */}
        <SectionAccordion title="FAQ" subtitle="Buyer questions section">
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Eyebrow" {...bind("faq_section.eyebrow")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Title" {...bind("faq_section.title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Description" multiline minRows={2} {...bind("faq_section.description")} />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                items={content.faq_section.items || []}
                fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", multiline: true }]}
                onChange={bind("faq_section.items").onChange}
                template={{ question: "", answer: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* CTA banners */}
        <SectionAccordion title="Bottom CTA Banners" subtitle="Blog banner + 'Ready to own property' banner">
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <Field label="Blog banner title" {...bind("cta_section.blog_title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Blog banner description" multiline minRows={2} {...bind("cta_section.blog_description")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Blog button label" {...bind("cta_section.blog_cta_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Blog link URL" {...bind("cta_section.blog_url")} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <Field label="Consultation banner title" {...bind("cta_section.consult_title")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Consultation banner description" multiline minRows={2} {...bind("cta_section.consult_description")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Consultation button label" {...bind("cta_section.consult_cta_label")} />
            </Grid2>
          </Grid2>
        </SectionAccordion>

        {/* Footer */}
        <SectionAccordion title="Footer" subtitle="About text, quick links, popular areas, contact and social">
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
              <Field label="About text" multiline minRows={2} {...bind("footer.about")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Phone" {...bind("footer.contact.phone")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Email" {...bind("footer.contact.email")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="Address" {...bind("footer.contact.address")} />
            </Grid2>
            <Grid2 size={12}>
              <Field label="WhatsApp label" {...bind("footer.contact.whatsapp_label")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Tax registration number" {...bind("footer.tax_registration")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Privacy note (e.g. 'Privacy-first enquiry forms')" {...bind("footer.privacy_note")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Field label="Copyright note" {...bind("footer.copyright_note")} />
            </Grid2>
            <Grid2 size={12}><Divider /></Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Quick links"
                items={content.footer.quick_links || []}
                fields={[{ key: "label", label: "Label" }, { key: "url", label: "URL" }]}
                onChange={bind("footer.quick_links").onChange}
                template={{ label: "", url: "" }}
              />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Popular areas"
                items={content.footer.popular_areas || []}
                fields={[{ key: "label", label: "Label" }, { key: "url", label: "URL" }]}
                onChange={bind("footer.popular_areas").onChange}
                template={{ label: "", url: "" }}
              />
            </Grid2>
            <Grid2 size={12}>
              <ObjectListEditor
                label="Social links"
                items={content.footer.social || []}
                fields={[{ key: "platform", label: "Platform (facebook, instagram, x, youtube, linkedin, tiktok)" }, { key: "url", label: "URL" }]}
                onChange={bind("footer.social").onChange}
                template={{ platform: "", url: "" }}
              />
            </Grid2>
          </Grid2>
        </SectionAccordion>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomeContentSettingsView;
