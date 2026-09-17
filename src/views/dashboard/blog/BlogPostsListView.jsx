import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
  alpha,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import { MotionBox, MotionStack, MotionCard } from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import { useNavigate } from "react-router-dom";
import { fetchAdminBlogPosts, deleteBlogPost } from "../../../api/blogPosts";

const BlogPostsListView = () => {
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAdminBlogPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load blog posts:", err);
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const handleMenuOpen = (e, post) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    setDeleting(true);
    try {
      await deleteBlogPost(selectedPost.id);
      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      alert("Failed to delete blog post.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      sx={{ minHeight: "100vh", py: { xs: 3, md: 4 }, bgcolor: "background.default", direction: settings.direction }}
    >
      <Container maxWidth="xl">
        <MotionStack initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} spacing={3}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Blog Posts List</Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                {filtered.length} posts
              </Typography>
            </Box>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/dashboard/blog/add")}
                sx={{ borderRadius: 99 }}
              >
                Add Blog Post
              </Button>
            )}
          </Stack>

          {/* Search */}
          <TextField
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />

          {/* Table */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
              bgcolor: "background.paper",
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: (theme) => theme.palette.mode === "dark" ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Post</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Reading Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography color="error">{error}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Stack alignItems="center" spacing={1}>
                          <ArticleRoundedIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                          <Typography color="text.secondary">No blog posts found.</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && filtered.map((post) => (
                    <TableRow
                      key={post.id}
                      hover
                      sx={{ cursor: "pointer", "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04) } }}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={post.cover_image} variant="rounded" sx={{ width: 48, height: 48, borderRadius: 1.5 }}>
                            <ArticleRoundedIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                              {post.title}
                            </Typography>
                            {post.is_featured && (
                              <Chip label="Featured" size="small" color="warning" sx={{ mt: 0.5, fontWeight: 600, fontSize: "0.62rem", height: 18 }} />
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{post.category || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{post.reading_time_label || "—"}</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={post.is_published ? "Published" : "Draft"}
                          size="small"
                          color={post.is_published ? "success" : "default"}
                          sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/blog/${post.slug}`); }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          {isAdmin && (
                            <>
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/blog/${post.id}/edit`); }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => { e.stopPropagation(); setSelectedPost(post); setDeleteDialogOpen(true); }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionCard>
        </MotionStack>
      </Container>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Delete Blog Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{selectedPost?.title}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 99 }}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting} sx={{ borderRadius: 99 }}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Row menu (kept for consistency; not currently opened anywhere but harmless) */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { navigate(`/blog/${selectedPost?.slug}`); handleMenuClose(); }}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} /> View
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={() => { navigate(`/dashboard/blog/${selectedPost?.id}/edit`); handleMenuClose(); }}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} /> Edit
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }} sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> Delete
          </MenuItem>
        )}
      </Menu>
    </MotionBox>
  );
};

export default BlogPostsListView;
