import apiClient from "../utils/apiClient";

const resolveImageUrl = (raw) => {
  if (!raw) return null;
  const cleaned = String(raw).replace(/\\\//g, "/");
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  const base = import.meta.env.VITE_API_BASE_URL || "https://nexuscapitalredsea.com/api";
  try {
    const url = new URL(base);
    const origin = url.origin;
    if (cleaned.startsWith("/")) return origin + cleaned;
    return `${origin}/${cleaned}`;
  } catch {
    return cleaned;
  }
};

const normalizePost = (p) => ({
  ...p,
  cover_image: resolveImageUrl(p.cover_image || null),
  tags: Array.isArray(p.tags) ? p.tags : [],
  quick_facts: Array.isArray(p.quick_facts) ? p.quick_facts : [],
  content_blocks: Array.isArray(p.content_blocks) ? p.content_blocks : [],
  checklist_items: Array.isArray(p.checklist_items) ? p.checklist_items : [],
  benefit_cards: Array.isArray(p.benefit_cards) ? p.benefit_cards : [],
  gallery: Array.isArray(p.gallery)
    ? p.gallery.map((g) => ({ ...g, image: resolveImageUrl(g.image) }))
    : [],
  faqs: Array.isArray(p.faqs) ? p.faqs : [],
});

// Public: only published posts. `category` is optional.
export const fetchBlogPosts = async (category) => {
  const params = category ? { category } : {};
  const { data } = await apiClient.get("/blog-posts", { params });
  const list = Array.isArray(data) ? data : (data.data || []);
  return list.map(normalizePost);
};

// Public: single post by slug.
export const fetchBlogPostBySlug = async (slug) => {
  const { data } = await apiClient.get(`/blog-posts/${slug}`);
  const p = data.data || data;
  return p ? normalizePost(p) : null;
};

// Admin: all posts including unpublished (used by the dashboard list).
export const fetchAdminBlogPosts = async () => {
  const { data } = await apiClient.get("/blog-posts-admin", { params: { scope: "admin" } });
  const list = Array.isArray(data) ? data : (data.data || []);
  return list.map(normalizePost);
};

// Admin: single post by numeric id (used by Edit Blog Post view).
export const fetchAdminBlogPostById = async (id) => {
  const { data } = await apiClient.get(`/blog-posts-admin/${id}`);
  const p = data.data || data;
  return p ? normalizePost(p) : null;
};

export const createBlogPost = async (payload) => {
  const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const { data } = await apiClient.post("/blog-posts", payload, config);
  return normalizePost(data.data || data);
};

export const updateBlogPost = async (id, payload) => {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await apiClient.post(`/blog-posts/${id}`, payload, config);
    return normalizePost(data.data || data);
  }
  const { data } = await apiClient.put(`/blog-posts/${id}`, payload);
  return normalizePost(data.data || data);
};

export const deleteBlogPost = async (id) => {
  const { data } = await apiClient.delete(`/blog-posts/${id}`);
  return data;
};
