import apiClient from "../utils/apiClient";

// GET the current home page content (public — used by HomeView).
export const fetchHomeContent = async () => {
  const { data } = await apiClient.get("/home-content");
  return data.data;
};

// Save home page content from the dashboard.
// `payload` is a plain object (the full/partial content tree).
// `logoFile` is an optional File selected in the dashboard logo uploader.
// `heroBackgroundFile` is an optional File selected in the hero background uploader.
export const updateHomeContent = async (payload, logoFile, heroBackgroundFile) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (logoFile) {
    formData.append("logo", logoFile);
  }
  if (heroBackgroundFile) {
    formData.append("hero_background", heroBackgroundFile);
  }
  const { data } = await apiClient.post("/home-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
