import apiClient from "../utils/apiClient";

export const fetchLegalServicesContent = async () => {
  const { data } = await apiClient.get("/legal-services-content");
  return data.data;
};

export const updateLegalServicesContent = async (payload, photoFile) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (photoFile) {
    formData.append("lawyer_photo", photoFile);
  }
  const { data } = await apiClient.post("/legal-services-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
