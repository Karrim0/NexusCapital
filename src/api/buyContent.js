import apiClient from "../utils/apiClient";

export const fetchBuyContent = async () => {
  const { data } = await apiClient.get("/buy-content");
  return data.data;
};

// `heroBackgroundFile` and `consultationBackgroundFile` are optional Files
// selected in the dashboard's respective image uploaders.
export const updateBuyContent = async (payload, heroBackgroundFile, consultationBackgroundFile) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (heroBackgroundFile) {
    formData.append("hero_background", heroBackgroundFile);
  }
  if (consultationBackgroundFile) {
    formData.append("consultation_background", consultationBackgroundFile);
  }
  const { data } = await apiClient.post("/buy-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
