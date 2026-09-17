import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Grid2,
  Stack,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  alpha,
  Divider,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import { MotionBox, MotionStack, MotionCard } from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { createBlogPost } from "../../../api/blogPosts";
import { StringListEditor, ObjectListEditor } from "../../../components/dashboard/ContentListEditors";

const CONTENT_BLOCK_TYPES = ["heading", "paragraph", "quote", "callout", "table"];

const AddBlogPostView = () => {
  const navigate = useNavigate();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    reading_time_label: "",
    card_type_label: "",
    hero_eyebrow: "",
    title_highlight: "",
    primary_cta_label: "",
    primary_cta_url: "",
    secondary_cta_label: "",
    disclaimer: "",
    is_published: true,
    is_featured: false,
  });

  const [tags, setTags] = useState([]);
  const [quickFacts, setQuickFacts] = useState([]);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [benefitCards, setBenefitCards] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryCaptions, setGalleryCaptions] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isAdmin) {
    return (
      <MotionBox initial="initial" animate="animate" variants={fadeInUp}
        sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container maxWidth="sm">
          <MotionCard sx={{ bgcolor: "background.paper", p: 4, textAlign: "center" }}>
            <ArticleRoundedIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" fontWeight={700} gutterBottom>Access Denied</Typography>
            <Typography color="text.secondary">Only admins can manage blog posts.</Typography>
          </MotionCard>
        </Container>
      </MotionBox>
    );
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setGalleryCaptions((prev) => [...prev, ...files.map(() => "")]);
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setGalleryCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGalleryCaption = (index, value) => {
    setGalleryCaptions((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.slug) payload.append("slug", formData.slug);
      if (formData.excerpt) payload.append("excerpt", formData.excerpt);
      if (formData.category) payload.append("category", formData.category);
      if (formData.reading_time_label) payload.append("reading_time_label", formData.reading_time_label);
      if (formData.card_type_label) payload.append("card_type_label", formData.card_type_label);
      if (formData.hero_eyebrow) payload.append("hero_eyebrow", formData.hero_eyebrow);
      if (formData.title_highlight) payload.append("title_highlight", formData.title_highlight);
      if (formData.primary_cta_label) payload.append("primary_cta_label", formData.primary_cta_label);
      if (formData.primary_cta_url) payload.append("primary_cta_url", formData.primary_cta_url);
      if (formData.secondary_cta_label) payload.append("secondary_cta_label", formData.secondary_cta_label);
      if (formData.disclaimer) payload.append("disclaimer", formData.disclaimer);
      payload.append("is_published", formData.is_published ? "1" : "0");
      payload.append("is_featured", formData.is_featured ? "1" : "0");

      if (tags.length) payload.append("tags", JSON.stringify(tags.filter(Boolean)));
      if (quickFacts.length) payload.append("quick_facts", JSON.stringify(quickFacts));
      if (contentBlocks.length) payload.append("content_blocks", JSON.stringify(contentBlocks));
      if (checklistItems.length) payload.append("checklist_items", JSON.stringify(checklistItems.filter(Boolean)));
      if (benefitCards.length) payload.append("benefit_cards", JSON.stringify(benefitCards));
      if (faqs.length) payload.append("faqs", JSON.stringify(faqs));

      if (coverFile) payload.append("cover_image", coverFile);
      galleryFiles.forEach((file) => payload.append("gallery_images[]", file));
      if (galleryCaptions.length) payload.append("gallery_captions", JSON.stringify(galleryCaptions));

      await createBlogPost(payload);
      alert("Blog post created successfully!");
      navigate("/dashboard/blog/list");
    } catch (err) {
      console.error("Failed to create blog post:", err);
      alert("Failed to create blog post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardSx = {
    bgcolor: "background.paper",
    border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: (t) => t.palette.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.05)",
  };

  return (
    <MotionBox initial="initial" animate="animate" variants={fadeInUp}
      sx={{ minHeight: "100vh", py: { xs: 3, md: 4 }, bgcolor: "background.default", direction: settings.direction }}>
      <Container maxWidth="xl">
        <MotionStack initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} spacing={3}>

          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Add New Blog Post</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                Create a new article for the Blog page
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" startIcon={<CancelIcon />}
                onClick={() => navigate("/dashboard/blog/list")} sx={{ borderRadius: 99 }}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />}
                onClick={handleSubmit} disabled={submitting} sx={{ borderRadius: 99 }}>
                {submitting ? "Saving..." : "Save Post"}
              </Button>
            </Stack>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>

              {/* ── Left Column ── */}
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>

                  {/* Basic Info */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Post Information</Typography>
                      <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Title *" name="title" value={formData.title}
                            onChange={handleChange} error={!!errors.title} helperText={errors.title} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="URL slug (optional — auto-generated from title)" name="slug"
                            value={formData.slug} onChange={handleChange} placeholder="new-consular-office-hurghada" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Category (e.g. 'Buyer Guides')" name="category"
                            value={formData.category} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <TextField fullWidth multiline minRows={2} label="Excerpt (shown on the listing card)"
                            name="excerpt" value={formData.excerpt} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Reading time label (e.g. '10 min read')" name="reading_time_label"
                            value={formData.reading_time_label} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Card type label (e.g. 'Buyer Guide', 'Area Comparison')" name="card_type_label"
                            value={formData.card_type_label} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <StringListEditor label="Tags (shown as chips on the card and hero)" items={tags} onChange={setTags} />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </MotionCard>

                  {/* Hero */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Article Hero</Typography>
                      <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Hero eyebrow (e.g. 'HURGHADA NEWS · RED SEA SERVICES')" name="hero_eyebrow"
                            value={formData.hero_eyebrow} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Title highlight (word/phrase from the title shown in gold)" name="title_highlight"
                            value={formData.title_highlight} onChange={handleChange} placeholder="Authentication & Consular Services Office" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Primary button label" name="primary_cta_label"
                            value={formData.primary_cta_label} onChange={handleChange} placeholder="READ BUYER IMPACT" />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Primary button link (optional, e.g. '#buyer-impact')" name="primary_cta_url"
                            value={formData.primary_cta_url} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Secondary button label (opens WhatsApp)" name="secondary_cta_label"
                            value={formData.secondary_cta_label} onChange={handleChange} placeholder="ASK ABOUT DOCUMENTS" />
                        </Grid2>
                        <Grid2 size={12}>
                          <ObjectListEditor
                            label="Quick facts strip (e.g. 'What opened' — 'Authentication & consular services office')"
                            items={quickFacts}
                            fields={[{ key: "label", label: "Label" }, { key: "value", label: "Value" }]}
                            onChange={setQuickFacts}
                            template={{ label: "", value: "" }}
                          />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </MotionCard>

                  {/* Body Content */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.44 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Article Body</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                        Build the article top-to-bottom. Type must be exactly one of: {CONTENT_BLOCK_TYPES.join(", ")}.
                        "heading" = section title, "paragraph" = normal text, "quote" = highlighted intro box, "callout" = dark insight box,
                        "table" = comparison table — first line is the header row, each following line is a data row; separate columns with "|".
                        Example: "Factor|Hurghada|Budva{"\n"}Yield|7.29%|5.01%"
                      </Typography>
                      <ObjectListEditor
                        label="Content blocks"
                        items={contentBlocks}
                        fields={[
                          { key: "type", label: "Type (heading / paragraph / quote / callout / table)" },
                          { key: "text", label: "Text (for tables: header row, then rows, columns separated by |)", multiline: true, minRows: 3 },
                        ]}
                        onChange={setContentBlocks}
                        template={{ type: "paragraph", text: "" }}
                      />
                    </CardContent>
                  </MotionCard>

                  {/* Checklist + Disclaimer + Benefit Cards */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.46 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Checklist & Benefit Cards</Typography>
                      <Stack spacing={2}>
                        <StringListEditor label="Checklist items (bullet list)" items={checklistItems} onChange={setChecklistItems} />
                        <TextField fullWidth multiline minRows={2} label="Disclaimer / important note (optional)"
                          name="disclaimer" value={formData.disclaimer} onChange={handleChange} />
                        <Divider sx={{ my: 1 }} />
                        <ObjectListEditor
                          label="Numbered benefit cards (e.g. '01 Less travel pressure')"
                          items={benefitCards}
                          fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", multiline: true }]}
                          onChange={setBenefitCards}
                          template={{ title: "", description: "" }}
                        />
                        <Divider sx={{ my: 1 }} />
                        <ObjectListEditor
                          label="FAQ"
                          items={faqs}
                          fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", multiline: true }]}
                          onChange={setFaqs}
                          template={{ question: "", answer: "" }}
                        />
                      </Stack>
                    </CardContent>
                  </MotionCard>

                </Stack>
              </Grid2>

              {/* ── Right Column ── */}
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Stack spacing={3}>

                  {/* Cover Image */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Cover Image</Typography>
                      <Stack spacing={2}>
                        <Box sx={{
                          height: 160, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                          bgcolor: "action.hover", backgroundImage: coverPreview ? `url(${coverPreview})` : "none",
                          backgroundSize: "cover", backgroundPosition: "center",
                          border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
                        }}>
                          {!coverPreview && <PhotoCameraIcon sx={{ fontSize: 36, color: "text.disabled" }} />}
                        </Box>
                        <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} fullWidth sx={{ borderRadius: 99 }}>
                          Upload Cover Image
                          <input type="file" accept="image/*" hidden onChange={handleCoverImage} />
                        </Button>
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Photo Story Gallery */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Photo Story (optional)</Typography>
                      <Stack spacing={1.5}>
                        {galleryPreviews.map((src, i) => (
                          <Box key={i} sx={{ border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.15)}`, borderRadius: 2, p: 1 }}>
                            <Box sx={{ position: "relative" }}>
                              <Box component="img" src={src} alt="" sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1.5, display: "block" }} />
                              <IconButton size="small" onClick={() => removeGalleryImage(i)}
                                sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.8)" } }}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <TextField
                              fullWidth size="small" placeholder="Caption (optional)" sx={{ mt: 1 }}
                              value={galleryCaptions[i] || ""}
                              onChange={(e) => updateGalleryCaption(i, e.target.value)}
                            />
                          </Box>
                        ))}
                        <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />} fullWidth sx={{ borderRadius: 99 }}>
                          Add Photo Story Images
                          <input type="file" accept="image/*" multiple hidden onChange={handleGalleryImages} />
                        </Button>
                        <Typography variant="caption" color="text.secondary">JPG, PNG. Max 10MB each.</Typography>
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Settings */}
                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.44 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Settings</Typography>
                      <Stack spacing={1}>
                        <FormControlLabel
                          control={<Switch checked={formData.is_featured} onChange={handleChange} name="is_featured" />}
                          label="Featured Post"
                        />
                        <FormControlLabel
                          control={<Switch checked={formData.is_published} onChange={handleChange} name="is_published" />}
                          label="Published"
                        />
                      </Stack>
                    </CardContent>
                  </MotionCard>

                </Stack>
              </Grid2>
            </Grid2>
          </form>
        </MotionStack>
      </Container>
    </MotionBox>
  );
};

export default AddBlogPostView;
