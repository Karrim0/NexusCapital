import apiClient from "../utils/apiClient";

const resolveImageUrl = (raw) => {
  if (!raw) return null;
  // Fix escaped slashes from JSON e.g. https:\/\/
  const cleaned = String(raw).replace(/\\\//g, "/");
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  const base =
    import.meta.env.VITE_API_BASE_URL || "https://nexuscapitalredsea.com/api";
  try {
    const url = new URL(base);
    const origin = url.origin;
    if (cleaned.startsWith("/")) return origin + cleaned;
    return `${origin}/${cleaned}`;
  } catch {
    return cleaned;
  }
};

const normalizeProject = (p) => ({
  ...p,
  cover_image: resolveImageUrl(p.cover_image || null),
  main_image: resolveImageUrl(p.main_image_url || p.main_image || p.cover_image || null),
  images: Array.isArray(p.images)
    ? p.images.map((item) =>
        typeof item === "string"
          ? { url: resolveImageUrl(item), caption: null }
          : { url: resolveImageUrl(item?.url), caption: item?.caption || null }
      )
    : [],
  project_details: p.project_details || null,
  location_advantage: p.location_advantage || null,
  architectural_vision: p.architectural_vision || null,
  lifestyle_amenities: p.lifestyle_amenities || null,
  investment_potential: p.investment_potential || null,
  payment_plans: p.payment_plans || null,
  amenities: p.amenities || null,
  mins_from_airport: p.mins_from_airport || null,
  mins_from_hospitals: p.mins_from_hospitals || null,
  mins_from_downtown: p.mins_from_downtown || null,
  mins_from_beach: p.mins_from_beach || null,
  location_description: p.location_description || null,
  badges: Array.isArray(p.badges) ? p.badges : [],
  offer_discount_percent: p.offer_discount_percent ?? null,
  offer_deadline_label: p.offer_deadline_label || null,
  residence_highlights: Array.isArray(p.residence_highlights) ? p.residence_highlights : [],
  investment_cards: Array.isArray(p.investment_cards) ? p.investment_cards : [],
  lifestyle_cards: Array.isArray(p.lifestyle_cards) ? p.lifestyle_cards : [],
  payment_plan_rows: Array.isArray(p.payment_plan_rows) ? p.payment_plan_rows : [],
  buyer_journey_steps: Array.isArray(p.buyer_journey_steps) ? p.buyer_journey_steps : [],
  project_faqs: Array.isArray(p.project_faqs) ? p.project_faqs : [],
});

export const fetchProjects = async () => {
  const { data } = await apiClient.get("/projects");
  const list = Array.isArray(data) ? data : (data.projects || data.data || []);
  return list.map(normalizeProject);
};

export const fetchProjectById = async (id) => {
  const { data } = await apiClient.get(`/projects/${id}`);
  const p = data.id ? data : (data.project || null);
  if (!p) return null;
  return normalizeProject(p);
};

export const createProject = async (payload) => {
  const config = {};
  if (payload instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  const { data } = await apiClient.post("/projects", payload, config);
  return data.project || data;
};

export const updateProject = async (id, payload) => {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await apiClient.post(`/projects/${id}`, payload, config);
    return data.project || data;
  }
  const { data } = await apiClient.put(`/projects/${id}`, payload);
  return data.project || data;
};

export const deleteProject = async (id) => {
  const { data } = await apiClient.delete(`/projects/${id}`);
  return data;
};
