import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

export const fetchReviewerProposals = async (reviewerId) => {
  const res = await API.post("/get-docs-for-reviewer", {
    reviewer_id: reviewerId,
  });

  return res.data.map((row) => ({
    id: row.id,
    status: row.status,
    title: row.title,
    description: row.name,
    date: row.date,
    name: row.name,
  }));
};
