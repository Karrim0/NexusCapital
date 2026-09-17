import apiClient from "../utils/apiClient";

export const fetchProjectsContent = async () => {
  const { data } = await apiClient.get("/projects-content");
  return data.data;
};

// `heroBackgroundFile` is an optional File selected in the dashboard's
// hero background uploader.
export const updateProjectsContent = async (payload, heroBackgroundFile) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (heroBackgroundFile) {
    formData.append("hero_background", heroBackgroundFile);
  }
  const { data } = await apiClient.post("/projects-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
