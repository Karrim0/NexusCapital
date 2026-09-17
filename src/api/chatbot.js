import apiClient from "../utils/apiClient";

export const sendChatMessage = async (message, history = []) => {
  const { data } = await apiClient.post("/chatbot", { message, history });
  return data;
};

/**
 * Submits the visitor's details collected before the chat starts. Reuses
 * the site's existing general contact-requests endpoint (same one behind
 * "Customer Contact Requests" in the dashboard), tagged with a distinct
 * subject so it can be filtered into its own "Chatbot Leads" dashboard view.
 */
export const submitChatbotLead = async ({ name, phone, nationality, lookingFor }) => {
  const message = [
    `Nationality: ${nationality || "-"}`,
    `Looking for: ${lookingFor || "-"}`,
  ].join("\n");

  const { data } = await apiClient.post("/contact-requests", {
    name,
    phone,
    subject: "Chatbot Lead",
    message,
  });
  return data;
};
