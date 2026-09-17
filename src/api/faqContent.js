import apiClient from "../utils/apiClient";

export const fetchFaqContent = async () => {
  const { data } = await apiClient.get("/faq-content");
  return data.data;
};

export const updateFaqContent = async (payload) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  const { data } = await apiClient.post("/faq-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
