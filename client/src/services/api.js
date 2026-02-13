import axios from "axios";

// 🔹 Base Axios Instance
const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= PROPOSALS =================
export const getMyProposals = (userId) =>
  api.get(`/my-proposals/${userId}`);

export const getCoverPage = (proposalId) =>
  api.get(`/my-coverpage-proposals/${proposalId}`);

export const getProposalContent = (proposalId) =>
  api.get(`/my-content-proposals/${proposalId}`);

export const getReviewsPerDocs = (proposalId) =>
  api.post(`/get-reviews-per-docs`, {
    proposal_id: proposalId,
  });
// ================= HISTORY =================
export const getHistoryData = (historyId) =>
  api.post("/get-history-data", {
    history_id: historyId,
  });


export default api;
