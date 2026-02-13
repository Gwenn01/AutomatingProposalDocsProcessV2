export const normalizeProposal = (rpd = {}) => ({
  cover: rpd.cover_page ?? {},
  projectProfile: rpd.project_profile ?? {},
  rationale: {
    content: rpd.rationale?.rationale_content ?? "",
    reviews: rpd.rationale?.reviews ?? [],
  },
  significance: {
    content: rpd.significance?.significance_content ?? "",
    reviews: rpd.significance?.reviews ?? [],
  },
});
