// ─── Review Payload Builder ───────────────────────────────────────────────────
//
// Centralises all the payload-construction logic that was previously inlined
// inside the modal component.  Each proposal type gets its own named helper
// so it's easy to add, remove, or modify fields per type independently.

import type { Comments, DecisionType, TabType } from "@/types/reviewer-comment-types";
import type { ProposalReviewPayload } from "@/types/reviewer-types";

interface BuildPayloadOptions {
  activeTab: TabType;
  comments: Comments;
  decision: DecisionType;
  reviewRound: number;
  programNodeId: number | null;
  proposalData: any;
  selectedProject: any;
  selectedActivity: any;
  projectDetail: any;
  activityDetail: any;
  user: any;
}

// ── Field-key maps per proposal type ─────────────────────────────────────────

const PROGRAM_FIELD_MAP: Record<string, string> = {
  profile_feedback: "profile_feedback",
  implementing_agency_feedback: "implementing_agency_feedback",
  extension_site_feedback: "extension_site_feedback",
  tagging_cluster_extension_feedback: "tagging_cluster_extension_feedback",
  sdg_academic_program_feedback: "sdg_academic_program_feedback",
  rationale_feedback: "rationale_feedback",
  significance_feedback: "significance_feedback",
  objectives_feedback: "objectives_feedback",
  general_objectives_feedback: "general_objectives_feedback",
  specific_objectives_feedback: "specific_objectives_feedback",
  methodology_feedback: "methodology_feedback",
  expected_output_feedback: "expected_output_feedback",
  sustainability_plan_feedback: "sustainability_feedback",
  org_staffing_feedback: "org_staffing_feedback",
  work_plan_feedback: "work_plan_feedback",
  budget_requirements_feedback: "budget_feedback",
};

const PROJECT_FIELD_MAP: Record<string, string> = {
  profile_feedback: "proj_profile_feedback",
  implementing_agency_feedback: "proj_implementing_agency_feedback",
  extension_site_feedback: "proj_extension_site_feedback",
  tagging_cluster_extension_feedback: "proj_tagging_cluster_extension_feedback",
  sdg_academic_program_feedback: "proj_sdg_academic_program_feedback",
  rationale_feedback: "proj_rationale_feedback",
  significance_feedback: "proj_significance_feedback",
  objectives_feedback: "proj_objectives_feedback",
  general_objectives_feedback: "proj_general_objectives_feedback",
  specific_objectives_feedback: "proj_specific_objectives_feedback",
  methodology_feedback: "proj_methodology_feedback",
  expected_output_feedback: "proj_expected_output_feedback",
  sustainability_plan_feedback: "proj_sustainability_feedback",
  org_staffing_feedback: "proj_org_staffing_feedback",
  work_plan_feedback: "proj_work_plan_feedback",
  budget_requirements_feedback: "proj_budget_feedback",
};

const ACTIVITY_FIELD_MAP: Record<string, string> = {
  profile_feedback: "act_profile_feedback",
  implementing_agency_feedback: "act_implementing_agency_feedback",
  extension_site_feedback: "act_extension_site_feedback",
  tagging_cluster_extension_feedback: "act_tagging_cluster_extension_feedback",
  sdg_academic_program_feedback: "act_sdg_academic_program_feedback",
  rationale_feedback: "act_rationale_feedback",
  objectives_feedback: "act_objectives_feedback",
  methodology_feedback: "act_methodology_feedback",
  expected_output_feedback: "act_expected_output_feedback",
  work_plan_feedback: "act_work_plan_feedback",
  budget_requirements_feedback: "act_budget_feedback",
};

// ── Helper: resolve a subset of comments by field map ────────────────────────

function pickComments(
  comments: Comments,
  fieldMap: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fieldMap).map(([payloadKey, commentKey]) => [
      payloadKey,
      comments[commentKey] || "",
    ])
  );
}

// ── Main builder ──────────────────────────────────────────────────────────────

export function buildReviewPayload(
  opts: BuildPayloadOptions,
  overrideDecision?: DecisionType
): ProposalReviewPayload {
  const {
    activeTab,
    comments,
    decision,
    reviewRound,
    programNodeId,
    proposalData,
    selectedProject,
    selectedActivity,
    projectDetail,
    activityDetail,
    user,
  } = opts;

  const resolveAssignment = (): number | undefined => {
    if (activeTab === "activity" && selectedActivity)
      return Number(selectedActivity.assignment);
    if (activeTab === "project" && selectedProject)
      return Number(selectedProject.assignment);
    return proposalData?.assignment_id
      ? Number(proposalData.assignment_id)
      : user?.user_id
      ? Number(user.user_id)
      : undefined;
  };

  const resolveProposalNode = (): number | undefined => {
    if (activeTab === "activity" && selectedActivity)
      return Number(selectedActivity.proposal);
    if (activeTab === "project" && selectedProject)
      return Number(selectedProject.proposal);
    return proposalData?.proposal_id ? Number(proposalData.proposal_id) : undefined;
  };

  const proposal_node = resolveProposalNode();

  if (proposal_node === undefined) {
    throw new Error("proposal_node is required but undefined");
  }

  const base = {
    proposal_reviewer: resolveAssignment(),
    proposal_node,
    decision: overrideDecision ?? decision,
    review_round: String(reviewRound),
  };

  if (activeTab === "program") {
    return {
      ...base,
      proposal_type: "program",
      ...pickComments(comments, PROGRAM_FIELD_MAP),
    };
  }

  if (activeTab === "project") {
    return {
      ...base,
      proposal_type: "project",
      ...pickComments(comments, PROJECT_FIELD_MAP),
    };
  }

  return {
    ...base,
    proposal_type: "activity",
    ...pickComments(comments, ACTIVITY_FIELD_MAP),
  };
}