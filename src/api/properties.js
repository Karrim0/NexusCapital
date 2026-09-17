import apiClient from "../utils/apiClient";

const resolveImageUrl = (raw) => {
  if (!raw) return null;
  // If already absolute (http/https), return as is
  if (/^https?:\/\//i.test(raw)) return raw;

  // For paths like "/storage/..." coming from Laravel
  const base = import.meta.env.VITE_API_BASE_URL || "https://nexuscapitalredsea.com/api";

  try {
    const url = new URL(base);
    const origin = url.origin; // e.g. http://localhost:8000
    if (raw.startsWith("/")) {
      return origin + raw;
    }
    return `${origin}/${raw}`;
  } catch {
    // Fallback: just return raw
    return raw;
  }
};

// segment: "buy" | "rent" | "lands" | undefined
// options: { scope?: "public" | "dashboard", extraParams?: Record<string, any> }
export const fetchProperties = async (segment, options = {}) => {
  const { scope = "public", extraParams = {} } = options;
  const params = { scope, ...extraParams };
  if (segment) {
    params.for = segment;
  }
  const { data } = await apiClient.get("/properties", { params });
  const list = data.properties || [];
  return list.map((p) => {
    const rawImage = p.main_image_url || p.image || null;
    return {
      ...p,
      image: resolveImageUrl(rawImage),
    };
  });
};

export const fetchPropertyById = async (id) => {
  const { data } = await apiClient.get(`/properties/${id}`);
  const p = data.property;
  if (!p) return null;
  const rawImage = p.main_image_url || p.image || null;
  return {
    ...p,
    image: resolveImageUrl(rawImage),
    images: Array.isArray(p.images)
      ? p.images.map((img) => resolveImageUrl(img))
      : [],
  };
};

export const createProperty = async (payload) => {
  // Support both JSON payload and FormData (for file uploads)
  const config = {};
  if (payload instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  const { data } = await apiClient.post("/properties", payload, config);
  return data.property;
};

export const updateProperty = async (id, payload) => {
  // For FormData (with file uploads), use POST + _method=PUT so PHP/Laravel
  // treat it correctly and نضمن إن كل الحقول توصل في $_POST.
  if (payload instanceof FormData) {
    const form = payload;
    form.append("_method", "PUT");
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await apiClient.post(`/properties/${id}`, form, config);
    return data.property;
  }

  // Pure JSON update can safely use PUT
  const { data } = await apiClient.put(`/properties/${id}`, payload);
  return data.property;
};

export const fetchFavorites = async () => {
  const { data } = await apiClient.get("/favorites");
  const list = data.favorites || [];
  return list.map((p) => {
    const rawImage = p.main_image_url || p.image || null;
    return {
      ...p,
      image: resolveImageUrl(rawImage),
    };
  });
};

export const fetchDeletedProperties = async () => {
  const { data } = await apiClient.get("/properties/deleted");
  const list = data.properties || [];
  return list.map((p) => {
    const rawImage = p.main_image_url || p.image || null;
    return {
      ...p,
      image: resolveImageUrl(rawImage),
    };
  });
};

export const deleteProperty = async (id) => {
  const { data } = await apiClient.delete(`/properties/${id}`);
  return data;
};

export const restoreProperty = async (id) => {
  const { data } = await apiClient.post(`/properties/${id}/restore`);
  return data;
};

export const forceDeleteProperty = async (id) => {
  const { data } = await apiClient.delete(`/properties/${id}/force`);
  return data;
};

export const toggleFavorite = async (propertyId) => {
  const { data } = await apiClient.post(`/properties/${propertyId}/favorite`);
  return data;
};
