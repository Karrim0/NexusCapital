import apiClient from "../utils/apiClient";

export const requestAgentAccount = async (payload) => {
  const { data } = await apiClient.post("/auth/agent-request", payload);
  return data;
};

export const fetchPendingAgents = async () => {
  const { data } = await apiClient.get("/agent-requests");
  return data.agents || [];
};

export const approveAgent = async (userId) => {
  const { data } = await apiClient.post(`/agent-requests/${userId}/approve`);
  return data.user;
};

export const rejectAgent = async (userId) => {
  const { data } = await apiClient.delete(`/agent-requests/${userId}`);
  return data;
};
