import apiClient from "../utils/apiClient";

export const fetchInvoices = async () => {
  const { data } = await apiClient.get("/invoices");
  return data.invoices || [];
};

export const createInvoice = async (payload) => {
  const { data } = await apiClient.post("/invoices", payload);
  return data.invoice;
};

