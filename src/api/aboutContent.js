import apiClient from "../utils/apiClient";

export const fetchAboutContent = async () => {
  const { data } = await apiClient.get("/about-content");
  return data.data;
};

// payload: plain content object. heroBackgroundFile / chairmanPhotoFile: optional File objects.
export const updateAboutContent = async (payload, heroBackgroundFile, chairmanPhotoFile) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (heroBackgroundFile) formData.append("hero_background", heroBackgroundFile);
  if (chairmanPhotoFile) formData.append("chairman_photo", chairmanPhotoFile);
  const { data } = await apiClient.post("/about-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
