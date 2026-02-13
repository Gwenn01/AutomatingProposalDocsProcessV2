import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// Fetch proposals + reviews
export const fetchMyProposals = async (userId) => {
  const res = await API.get(`/my-proposals/${userId}`);
  return res.data.proposals.map((row) => ({
    proposal_id: row.proposal_id,
    title: row.title,
    file_path: row.file_path,
    status: row.status,
    submitted_at: row.submitted_at || row.submission_date || null,
    reviews: row.reviews,
  }));
};

// Fetch cover page
export const fetchCoverPage = async (proposalId) => {
  const res = await API.get(`/my-coverpage-proposals/${proposalId}`);
  return res.data;
};

// Fetch proposal content
export const fetchProposalContent = async (proposalId) => {
  const res = await API.get(`/my-content-proposals/${proposalId}`);
  return res.data;
};
