// ─────────────────────────────────────────────────────────────────────────────
// monitoring/types.ts
// ─────────────────────────────────────────────────────────────────────────────

export type ProposalType = "Program" | "Project" | "Activity";

export type Proposal = {
  id: number;
  title: string;
  status: string;
  proposal_type: ProposalType;
  reviewer_count: number;
  created_by?: string;
  parent_program?: string;
  parent_project?: string;
  budget_requested?: number;
  budget_approved?: number;
  child_id?: number;
};

export type YearConfig = {
  year: number;
  total_budget: number;
  used_budget: number;
  is_locked: boolean;
};

export type ImplementorLock = {
  user_id: number;
  name: string;
  email: string;
  is_locked: boolean;
  proposals_count: number;
  total_budget_used: number;
  has_pending_budget_request: boolean;
};

export type FilterType = "all" | ProposalType;

export type StatusFilter =
  | "all"
  | "draft"
  | "submitted"
  | "under_review"
  | "for_revision"
  | "for_approval"
  | "approved";

export type ActiveTab = "proposals" | "budget" | "access";
