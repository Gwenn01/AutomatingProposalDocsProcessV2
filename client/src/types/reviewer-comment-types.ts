// ─── Domain Types ─────────────────────────────────────────────────────────────

import type { ReviewerProjectList, ProposalReviewPayload, ProposalReviewResponse } from "@/types/reviewer-types";

export type TabType = "program" | "project" | "activity";
export type DecisionType = "needs_revision" | "approved";

export type ProjectItem = ReviewerProjectList;
export type ActivityItem = ReviewerProjectList;

export interface Comments {
  [key: string]: string;
}

export interface History {
  history_id: number;
  proposal_id: number;
  status: string;
  version: number;
  version_no: number;
  program_title: string;
  program_leader: string;
  project_title: string;
  project_leader: string;
  activity_title: string;
  created_at: any;
}

export interface MethodologyPhase {
  phase: string;
  activities: string[];
}

export interface WorkplanItem {
  month: string;
  activity: string;
}

export interface BudgetItem {
  item: string;
  amount: number | string;
}

export interface ApiProposalDetail {
  id: number;
  proposal: number;
  program_title: string;
  program_leader: string;
  project_list: any[];
  implementing_agency: string[];
  cooperating_agencies: string[];
  extension_sites: string[];
  tags: string[];
  clusters: string[];
  agendas: string[];
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: MethodologyPhase[];
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: { name: string; role: string }[];
  workplan: WorkplanItem[];
  budget_requirements: BudgetItem[];
  created_at: string;
}

export interface ReviewerCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: any | null;
  proposalDetail: ApiProposalDetail | null;
  reviewe?: string;
  review_id?: string;
  programNode_id?: number;
}