import { useEffect, useMemo, useState } from "react";
import { Box, Container, Stack, Typography, TextField, InputAdornment, Chip, Button, Grid2, CircularProgress } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { Link } from "react-router-dom";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import { fetchBlogPosts } from "../api/blogPosts";
import { nx, fontHeading } from "../theme/nexusHomeTheme";

const BlogListView = () => {
  const { content: home } = useHomeContent();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = activeCategory === "ALL" || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        [p.title, p.excerpt, p.category, ...(p.tags || [])].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [posts, search, activeCategory]);

  return (
    <>
      <SEOHead
        title={`Blog | ${home.brand_name} | Hurghada Property Guides & Updates`}
        description="Read the latest Hurghada property guides and local updates before you shortlist a Red Sea property."
        url="/blog"
      />
      <Box sx={{ bgcolor: nx.cream, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 4 }}>
            <Box sx={{ maxWidth: 640 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>NEXUS CAPITAL BLOG</Typography>
              </Stack>
              <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.9rem", md: "2.4rem" }, lineHeight: 1.2 }}>
                Read the latest Hurghada property guides and local updates before you shortlist
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                component={Link}
                to="/buy"
                startIcon={<SearchRoundedIcon />}
                sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}
              >
                ASK FOR SHORTLIST
              </Button>
              <Button
                component={Link}
                to="/projects"
                sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, borderRadius: 999, px: 3, py: 1.2, fontSize: "0.78rem", "&:hover": { bgcolor: "#1a1f2b" } }}
              >
                VIEW PROJECTS
              </Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 3 }}>
            <TextField
              placeholder="Search by area, city, budget or buyer topic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              sx={{ maxWidth: { sm: 420 }, bgcolor: nx.creamPaper, borderRadius: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
            />
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.82rem", whiteSpace: "nowrap" }}>
              {loading ? "Loading..." : `Showing ${filtered.length} of ${posts.length} guides`}
            </Typography>
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 5 }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat === "ALL" ? "All Guides" : cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  bgcolor: activeCategory === cat ? nx.ink : "rgba(25,21,16,0.06)",
                  color: activeCategory === cat ? nx.textOnDark : nx.textOnCream,
                  "&:hover": { bgcolor: activeCategory === cat ? nx.ink : "rgba(25,21,16,0.1)" },
                }}
              />
            ))}
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: nx.gold }} />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography sx={{ color: nx.textOnCreamMuted, textAlign: "center", py: 8 }}>
              No guides match this search yet. Try a different keyword or category.
            </Typography>
          ) : (
            <Grid2 container spacing={3}>
              {filtered.map((post) => (
                <Grid2 key={post.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <BlogCard post={post} />
                </Grid2>
              ))}
            </Grid2>
          )}
        </Container>
      </Box>
    </>
  );
};

const BlogCard = ({ post }) => (
  <Box
    component={Link}
    to={`/blog/${post.slug}`}
    sx={{ textDecoration: "none", bgcolor: nx.creamPaper, borderRadius: 3, overflow: "hidden", boxShadow: "0 14px 34px rgba(25,21,16,0.06)", height: "100%", display: "flex", flexDirection: "column" }}
  >
    <Box
      sx={{
        position: "relative",
        height: 150,
        backgroundImage: post.cover_image ? `url(${post.cover_image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        bgcolor: "#1b2436",
        flexShrink: 0,
      }}
    >
      {!post.cover_image && (
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ApartmentRoundedIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: 32 }} />
        </Box>
      )}
      {post.category && (
        <Chip label={post.category} size="small" sx={{ position: "absolute", top: 10, left: 10, bgcolor: nx.creamPaper, color: nx.textOnCream, fontWeight: 700, fontSize: "0.6rem" }} />
      )}
      {post.reading_time_label && (
        <Chip label={post.reading_time_label} size="small" sx={{ position: "absolute", bottom: 10, left: 10, bgcolor: "rgba(10,12,16,0.75)", color: "#fff", fontWeight: 600, fontSize: "0.6rem" }} />
      )}
    </Box>

    <Box sx={{ p: 2.25, flex: 1, display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontFamily: fontHeading, fontWeight: 700, color: nx.textOnCream, fontSize: "1rem", lineHeight: 1.35, mb: 1 }}>
        {post.title}
      </Typography>
      {post.excerpt && (
        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.78rem", lineHeight: 1.6, mb: 1.5, flex: 1 }}>
          {post.excerpt.length > 120 ? `${post.excerpt.slice(0, 120)}...` : post.excerpt}
        </Typography>
      )}
      {!!(post.tags || []).length && (
        <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mb: 1.5 }}>
          {post.tags.slice(0, 3).map((tag, i) => (
            <Chip key={i} label={tag} size="small" sx={{ bgcolor: "rgba(25,21,16,0.05)", fontSize: "0.62rem", fontWeight: 600 }} />
          ))}
        </Stack>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: "auto", pt: 1, borderTop: "1px solid rgba(25,21,16,0.06)" }}>
        <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem" }}>Read guide →</Typography>
        {post.card_type_label && (
          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.68rem" }}>{post.card_type_label}</Typography>
        )}
      </Stack>
    </Box>
  </Box>
);

export default BlogListView;
