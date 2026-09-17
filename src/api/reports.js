import apiClient from "../utils/apiClient";

export const fetchAdminSummary = async () => {
  const { data } = await apiClient.get("/admin/reports/summary");
  return data;
};

