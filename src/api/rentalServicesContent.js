import apiClient from "../utils/apiClient";

export const fetchRentalServicesContent = async () => {
  const { data } = await apiClient.get("/rental-services-content");
  return data.data;
};

export const updateRentalServicesContent = async (payload, photoFile) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (photoFile) {
    formData.append("manager_photo", photoFile);
  }
  const { data } = await apiClient.post("/rental-services-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
