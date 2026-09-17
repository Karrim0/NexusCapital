import apiClient from "../utils/apiClient";

const resolveImageUrl = (raw) => {
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const base =
    import.meta.env.VITE_API_BASE_URL || "https://nexuscapitalredsea.com/api";
  try {
    const url = new URL(base);
    const origin = url.origin;
    if (raw.startsWith("/")) return origin + raw;
    return `${origin}/${raw}`;
  } catch {
    return raw;
  }
};

export const fetchUsers = async (params = {}) => {
  const { role } = params;
  const { data } = await apiClient.get("/admin/users", {
    params: role ? { role } : undefined,
  });
  const list = data.users || [];
  return list.map((u) => ({
    ...u,
    avatar: resolveImageUrl(u.avatar_url || u.avatar || null),
  }));
};

export const fetchUserById = async (id) => {
  const { data } = await apiClient.get(`/admin/users/${id}`);
  const u = data.user;
  if (!u) return null;
  return { ...u, avatar: resolveImageUrl(u.avatar_url || u.avatar || null) };
};

export const createUser = async (payload) => {
  const config = {};
  if (payload instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  const { data } = await apiClient.post("/admin/users", payload, config);
  return data.user;
};

export const updateUser = async (id, payload) => {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await apiClient.post(`/admin/users/${id}`, payload, config);
    return data.user;
  }
  const { data } = await apiClient.put(`/admin/users/${id}`, payload);
  return data.user;
};

export const changeUserPassword = async (id, payload) => {
  const { data } = await apiClient.put(`/admin/users/${id}/password`, payload);
  return data;
};

export const toggleUserStatus = async (id) => {
  const { data } = await apiClient.post(`/admin/users/${id}/toggle-status`);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/admin/users/${id}`);
  return data;
};

