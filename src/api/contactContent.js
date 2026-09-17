import apiClient from "../utils/apiClient";

export const fetchContactContent = async () => {
  const { data } = await apiClient.get("/contact-content");
  return data.data;
};

export const updateContactContent = async (payload) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  const { data } = await apiClient.post("/contact-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
