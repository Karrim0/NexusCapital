import apiClient from "../utils/apiClient";

export const fetchLandsContent = async () => {
  const { data } = await apiClient.get("/lands-content");
  return data.data;
};

export const updateLandsContent = async (payload) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  const { data } = await apiClient.post("/lands-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
