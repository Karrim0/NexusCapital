import apiClient from "../utils/apiClient";

export const fetchServicesContent = async () => {
  const { data } = await apiClient.get("/services-content");
  return data.data;
};

export const updateServicesContent = async (payload) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  const { data } = await apiClient.post("/services-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
