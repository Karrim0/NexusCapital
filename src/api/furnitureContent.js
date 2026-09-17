import apiClient from "../utils/apiClient";

export const fetchFurnitureContent = async () => {
  const { data } = await apiClient.get("/furniture-content");
  return data.data;
};

export const updateFurnitureContent = async (payload, packagePhotoFiles = []) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  packagePhotoFiles.forEach((file, i) => {
    if (file) formData.append(`package_photo_${i}`, file);
  });
  const { data } = await apiClient.post("/furniture-content", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

/**
 * Submits the furnishing quote request form. Reuses the site's existing
 * general contact-requests endpoint (visible to admins in the dashboard's
 * "Customer Contact Requests"), formatting the furniture-specific fields
 * into the message body since that table doesn't have dedicated columns
 * for them.
 */
export const submitFurnitureQuoteRequest = async (form) => {
  const message = [
    `Property Type: ${form.propertyType || "-"}`,
    `Property Location: ${form.propertyLocation || "-"}`,
    `Property Size: ${form.propertySize || "-"}`,
    `Number of Bedrooms: ${form.bedrooms || "-"}`,
    `Preferred Package: ${form.preferredPackage || "-"}`,
    `Additional Notes: ${form.notes || "-"}`,
  ].join("\n");

  const { data } = await apiClient.post("/contact-requests", {
    name: form.name,
    phone: form.phone,
    email: form.email,
    subject: "Furniture & Furnishing Quote Request",
    message,
  });
  return data;
};
