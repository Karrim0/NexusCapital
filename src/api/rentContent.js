import apiClient from "../utils/apiClient";

export const fetchRentContent = async () => {
  const { data } = await apiClient.get("/rent-content");
  return data.data;
};

export const updateRentContent = async (payload) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  const { data } = await apiClient.post("/rent-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
