import { authFetch, BASE_URL, handleResponse } from "./api-client";
export interface Review {
  reviewer_name: string;
  comment: string;
}
export interface ProgramProposal {
  program_title: string;
  profile: ProfileSection;
  agencies: AgenciesSection;
  tagging_clustering_extension: TaggingClusteringExtension;
  rationale: TextSection;
  significance: TextSection;
  objectives: ObjectivesSection;
  methodology: MethodologySection;
  expected_output_6ps: ExpectedOutput6PS;
  sustainability_plan: TextSection;
  organization_and_staffing: OrganizationStaffingSection;
  work_plan: WorkPlanSection;
  budget_requirements: BudgetRequirementsSection;
}
export interface ProfileSection {
  program_title: string;
  program_leader: string;
  project_list: Project[];
  reviews: Review[];
}

export interface Project {
  project_title: string;
  project_leader: string;
  project_member: string[];
  project_duration: number;
  project_end_date: string;
  project_start_date: string;
}

export interface AgenciesSection {
  implementing_agency: string[];
  cooperating_agency: string[];
  reviews: Review[];
}

export interface TaggingClusteringExtension {
  tags: string[];
  clusters: string[];
  agendas: string[];
  reviews: Review[];
}

export interface TextSection {
  content: string;
  reviews: Review[];
}

export interface ObjectivesSection {
  general: string;
  reviews_general: Review[];
  specific: string;
  reviews_specific: Review[];
}

export interface MethodologySection {
  content: MethodologyPhase[];
  reviews: Review[];
}

export interface MethodologyPhase {
  phase: string;
  activities: string[];
}

export interface ExpectedOutput6PS {
  content: string[];
  reviews: Review[];
}

export interface OrganizationStaffingSection {
  content: StaffRole[];
  reviews: Review[];
}

export interface StaffRole {
  name: string;
  role: string;
}

export interface WorkPlanSection {
  content: WorkPlanItem[];
  reviews: Review[];
}

export interface WorkPlanItem {
  month: string;
  activity: string;
}

export interface BudgetRequirementsSection {
  content: BudgetItem[];
  reviews: Review[];
}

export interface BudgetItem {
  item: string;
  amount: number;
}


export function toStringArray(value: string): string[] {
  if (!value?.trim()) return [];
  return value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

export type ProposalNodeType = 'Program' | 'Project' | 'Activity';

export async function fetchProgramHistoryData(proposal_id: number, history_id: number, version: number): Promise<any> {
    const res = await authFetch(`${BASE_URL}/proposal-review/proposal-history/${proposal_id}/${history_id}/${version}/program/`);
    return handleResponse<any>(res);
}

export async function fetchProjectHistoryData(proposal_id: number, history_id: number, version: number): Promise<any> {
    const res = await authFetch(`${BASE_URL}/proposal-review/proposal-history/${proposal_id}/${history_id}/${version}/project/`);
    return handleResponse<any>(res);
}

export async function fetchActivityHistoryData(proposal_id: number, history_id: number, version: number): Promise<any> {
    const res = await authFetch(`${BASE_URL}/proposal-review/proposal-history/${proposal_id}/${history_id}/${version}/activity/`);
    return handleResponse<any>(res);
}