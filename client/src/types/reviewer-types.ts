export type ApiProjectListResponse = {
  id: number;
  program_title: string;
  //projects: ApiProject[];
  projects: ReviewerProjectList[];
};

export type ApiActivityListResponse = {
  id: number;
  project_title: string;
  activities: ApiActivity[];
};

export type ApiProject = {
  id: number;
  project_title: string;
  project_leader: string;
  members: string[];
  duration_months: number;
  start_date: string | null;
  end_date: string | null;
};

export type ReviewerProjectList = {
  assignment: number;
  proposal: number;
  child_id: number;
  implementor: number;
  title: string;
  type: string;
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string | null;
  child_title: string;
  activities?: ApiActivity[];
}

export type ApiActivity = {
  id: number;
  activity_title: string;
  project_leader: string;
  members: string[];
  activity_duration_hours: number;
  activity_date: string | null;
};


// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface ReviewerProposal {
  assignment: number;
  proposal: number;
  child_id: number;
  implementor: number;
  title: string;
  type: 'Program' | 'Project' | 'Activity';
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string;
  child_title: string;
  implementor_name: string;
}

export interface ReviewerNotification {
  id: string;
  is_read: boolean;
  message: string;
  created_at: string;
}

export interface ProposalHistory {
  history_id: string;
  proposal_id: string;
  status: string;
  version_no: number;
  created_at: string;
}

// ─────────────────────────────────────────────
// PROPOSAL REVIEW TYPES
// ─────────────────────────────────────────────

export type ProposalReviewDecision = 'needs_revision' | 'approved';
export type ProposalReviewType = 'program' | 'project' | 'activity';

export interface ProposalReviewBasePayload {
  proposal_reviewer?: number;
  proposal_node: number;
  decision: ProposalReviewDecision;
  review_round: string | number;   // API expects a string e.g. "1"
  proposal_type: ProposalReviewType;
}

export interface ProgramReviewPayload extends ProposalReviewBasePayload {
  proposal_type: 'program';
  profile_feedback?: string;
  implementing_agency_feedback?: string;
  extension_site_feedback?: string;
  tagging_cluster_extension_feedback?: string;
  sdg_academic_program_feedback?: string;
  rationale_feedback?: string;
  significance_feedback?: string;
  objectives_feedback?: string;
  general_objectives_feedback?: string;
  specific_objectives_feedback?: string;
  methodology_feedback?: string;
  expected_output_feedback?: string;
  sustainability_plan_feedback?: string;
  org_staffing_feedback?: string;
  work_plan_feedback?: string;
  budget_requirements_feedback?: string;
}

export interface ProjectReviewPayload extends ProposalReviewBasePayload {
  proposal_type: 'project';
  profile_feedback?: string;
  implementing_agency_feedback?: string;
  extension_site_feedback?: string;
  tagging_cluster_extension_feedback?: string;
  sdg_academic_program_feedback?: string;
  rationale_feedback?: string;
  significance_feedback?: string;
  objectives_feedback?: string;
  general_objectives_feedback?: string;
  specific_objectives_feedback?: string;
  methodology_feedback?: string;
  expected_output_feedback?: string;
  sustainability_plan_feedback?: string;
  org_staffing_feedback?: string;
  work_plan_feedback?: string;
  budget_requirements_feedback?: string;
}

export interface ActivityReviewPayload extends ProposalReviewBasePayload {
  proposal_type: 'activity';
  profile_feedback?: string;
  implementing_agency_feedback?: string;
  extension_site_feedback?: string;
  tagging_cluster_extension_feedback?: string;
  sdg_academic_program_feedback?: string;
  rationale_feedback?: string;
  objectives_feedback?: string;
  methodology_feedback?: string;
  expected_output_feedback?: string;
  work_plan_feedback?: string;
  budget_requirements_feedback?: string;
}

export type ProposalReviewPayload =
  | ProgramReviewPayload
  | ProjectReviewPayload
  | ActivityReviewPayload;

export interface ProposalReviewResponse {
  id?: number;
  proposal_node?: number;
  decision?: ProposalReviewDecision;
  review_round?: number;
  proposal_type?: ProposalReviewType;
  created_at?: string;
  [key: string]: any; // allow additional fields from the API
}