import { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import { MotionBox, MotionStack, MotionCard } from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { fetchAdminBlogPostById, updateBlogPost } from "../../../api/blogPosts";
import { StringListEditor, ObjectListEditor } from "../../../components/dashboard/ContentListEditors";

const CONTENT_BLOCK_TYPES = ["heading", "paragraph", "quote", "callout", "table"];

const EditBlogPostView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
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
  const [existingGallery, setExistingGallery] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryCaptions, setGalleryCaptions] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const post = await fetchAdminBlogPostById(id);
        if (!post) {
          alert("Blog post not found.");
          navigate("/dashboard/blog/list");
          return;
        }
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          category: post.category || "",
          reading_time_label: post.reading_time_label || "",
          card_type_label: post.card_type_label || "",
          hero_eyebrow: post.hero_eyebrow || "",
          title_highlight: post.title_highlight || "",
          primary_cta_label: post.primary_cta_label || "",
          primary_cta_url: post.primary_cta_url || "",
          secondary_cta_label: post.secondary_cta_label || "",
          disclaimer: post.disclaimer || "",
          is_published: !!post.is_published,
          is_featured: !!post.is_featured,
        });
        setTags(Array.isArray(post.tags) ? post.tags : []);
        setQuickFacts(Array.isArray(post.quick_facts) ? post.quick_facts : []);
        setContentBlocks(Array.isArray(post.content_blocks) ? post.content_blocks : []);
        setChecklistItems(Array.isArray(post.checklist_items) ? post.checklist_items : []);
        setBenefitCards(Array.isArray(post.benefit_cards) ? post.benefit_cards : []);
        setFaqs(Array.isArray(post.faqs) ? post.faqs : []);
        setCoverPreview(post.cover_image || null);
        setExistingGallery(Array.isArray(post.gallery) ? post.gallery : []);
      } catch (err) {
        console.error("Failed to load blog post:", err);
        alert("Failed to load blog post.");
        navigate("/dashboard/blog/list");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
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

  const removeNewGalleryImage = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setGalleryCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index) => {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index));
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

      payload.append("tags", JSON.stringify(tags.filter(Boolean)));
      payload.append("quick_facts", JSON.stringify(quickFacts));
      payload.append("content_blocks", JSON.stringify(contentBlocks));
      payload.append("checklist_items", JSON.stringify(checklistItems.filter(Boolean)));
      payload.append("benefit_cards", JSON.stringify(benefitCards));
      payload.append("faqs", JSON.stringify(faqs));

      if (coverFile) payload.append("cover_image", coverFile);
      payload.append("existing_gallery", JSON.stringify(existingGallery));
      galleryFiles.forEach((file) => payload.append("gallery_images[]", file));
      if (galleryCaptions.length) payload.append("gallery_captions", JSON.stringify(galleryCaptions));

      await updateBlogPost(id, payload);
      alert("Blog post updated successfully!");
      navigate("/dashboard/blog/list");
    } catch (err) {
      console.error("Failed to update blog post:", err);
      alert("Failed to update blog post. Please try again.");
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
              <Typography variant="h4" fontWeight={800}>Edit Blog Post</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                Update this article's content and settings
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" startIcon={<CancelIcon />}
                onClick={() => navigate("/dashboard/blog/list")} sx={{ borderRadius: 99 }}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />}
                onClick={handleSubmit} disabled={submitting} sx={{ borderRadius: 99 }}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>

              {/* ── Left Column ── */}
              <Grid2 size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>

                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Post Information</Typography>
                      <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Title *" name="title" value={formData.title}
                            onChange={handleChange} error={!!errors.title} helperText={errors.title} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="URL slug" name="slug"
                            value={formData.slug} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Category" name="category"
                            value={formData.category} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <TextField fullWidth multiline minRows={2} label="Excerpt (shown on the listing card)"
                            name="excerpt" value={formData.excerpt} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Reading time label" name="reading_time_label"
                            value={formData.reading_time_label} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Card type label" name="card_type_label"
                            value={formData.card_type_label} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <StringListEditor label="Tags" items={tags} onChange={setTags} />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </MotionCard>

                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Article Hero</Typography>
                      <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Hero eyebrow" name="hero_eyebrow"
                            value={formData.hero_eyebrow} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Title highlight" name="title_highlight"
                            value={formData.title_highlight} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Primary button label" name="primary_cta_label"
                            value={formData.primary_cta_label} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <TextField fullWidth label="Primary button link" name="primary_cta_url"
                            value={formData.primary_cta_url} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <TextField fullWidth label="Secondary button label" name="secondary_cta_label"
                            value={formData.secondary_cta_label} onChange={handleChange} />
                        </Grid2>
                        <Grid2 size={12}>
                          <ObjectListEditor
                            label="Quick facts strip"
                            items={quickFacts}
                            fields={[{ key: "label", label: "Label" }, { key: "value", label: "Value" }]}
                            onChange={setQuickFacts}
                            template={{ label: "", value: "" }}
                          />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </MotionCard>

                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.44 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Article Body</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                        Type must be exactly one of: {CONTENT_BLOCK_TYPES.join(", ")}.
                        "table" = comparison table — first line is the header row, each following line is a data row, columns separated by "|".
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

                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.46 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Checklist & Benefit Cards</Typography>
                      <Stack spacing={2}>
                        <StringListEditor label="Checklist items" items={checklistItems} onChange={setChecklistItems} />
                        <TextField fullWidth multiline minRows={2} label="Disclaimer / important note"
                          name="disclaimer" value={formData.disclaimer} onChange={handleChange} />
                        <Divider sx={{ my: 1 }} />
                        <ObjectListEditor
                          label="Numbered benefit cards"
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
                          {coverPreview ? "Replace Cover Image" : "Upload Cover Image"}
                          <input type="file" accept="image/*" hidden onChange={handleCoverImage} />
                        </Button>
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  <MotionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }} sx={cardSx}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Photo Story</Typography>
                      <Stack spacing={1.5}>
                        {existingGallery.map((g, i) => (
                          <Box key={`existing-${i}`} sx={{ border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.15)}`, borderRadius: 2, p: 1 }}>
                            <Box sx={{ position: "relative" }}>
                              <Box component="img" src={g.image} alt="" sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1.5, display: "block" }} />
                              <IconButton size="small" onClick={() => removeExistingGalleryImage(i)}
                                sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.6)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.8)" } }}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <TextField
                              fullWidth size="small" placeholder="Caption" sx={{ mt: 1 }}
                              value={g.caption || ""}
                              onChange={(e) => setExistingGallery((prev) => prev.map((item, idx) => idx === i ? { ...item, caption: e.target.value } : item))}
                            />
                          </Box>
                        ))}
                        {galleryPreviews.map((src, i) => (
                          <Box key={`new-${i}`} sx={{ border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.15)}`, borderRadius: 2, p: 1 }}>
                            <Box sx={{ position: "relative" }}>
                              <Box component="img" src={src} alt="" sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1.5, display: "block" }} />
                              <IconButton size="small" onClick={() => removeNewGalleryImage(i)}
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

export default EditBlogPostView;
