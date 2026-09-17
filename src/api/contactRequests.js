import apiClient from "../utils/apiClient";

export const sendPropertyContactRequest = async (propertyId, payload) => {
  const { data } = await apiClient.post(
    `/properties/${propertyId}/contact-requests`,
    payload
  );
  return data.contact_request;
};

export const sendGeneralContactRequest = async (payload) => {
  const { data } = await apiClient.post("/contact-requests", payload);
  return data.contact_request;
};

export const fetchContactRequests = async () => {
  const { data } = await apiClient.get("/contact-requests");
  return data.contact_requests || [];
};

