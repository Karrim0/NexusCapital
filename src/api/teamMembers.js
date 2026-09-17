import apiClient from "../utils/apiClient";

export const fetchTeamMembers = async () => {
  const { data } = await apiClient.get("/team-members");
  return data.data;
};

export const fetchAllTeamMembers = async () => {
  const { data } = await apiClient.get("/admin/team-members");
  return data.data;
};

export const fetchTeamMember = async (id) => {
  const { data } = await apiClient.get(`/team-members/${id}`);
  return data.data;
};

const buildFormData = (member, photoFile) => {
  const formData = new FormData();
  Object.entries(member).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  if (photoFile) {
    formData.append("photo", photoFile);
  }
  return formData;
};

export const createTeamMember = async (member, photoFile) => {
  const { data } = await apiClient.post("/team-members", buildFormData(member, photoFile), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateTeamMember = async (id, member, photoFile) => {
  const { data } = await apiClient.post(`/team-members/${id}`, buildFormData(member, photoFile), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await apiClient.delete(`/team-members/${id}`);
  return data;
};
