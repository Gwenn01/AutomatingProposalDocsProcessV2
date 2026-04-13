import type { ApiActivity } from "./shared-types";


export interface MethodologyPhase { phase: string; activities: string[]; }
export interface WorkplanItem     { month: string; activity: string; }
export interface BudgetItem       { item: string; amount: number | string; }
export interface Comments { [key: string]: string; }

export type SidebarFields = {
  assignment: number;
  proposal: number;
  child_id: number;
  implementor: number;
  project_title: string;
  project_leader: string;
  activity_title: string;
  activity_date: string;
  type: string;
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string | null;
  activities?: ApiActivity[];
  start_date: string;
  end_date: string;
};

export type ProjectListFields = {
  proposal_id: number;
  child_id: number;
  implementor: number;
  project_title: string;
  project_leader: string;
  type: string;
  status: string;
  reviewer_count: number;
  version_no: number;
  is_reviewed: boolean;
  assigned_at: string | null;
  activities?: ApiActivity[];
  start_date: string;
  end_date: string;
  assignment: number;
  proposal: number;
  activity_date: string;
  activity_title: string;
};

export interface ApiProposalDetail {
  id: number;
  proposal: number;
  program_title: string;
  program_leader: string;
  project_list: any[];
  implementing_agency: string | string[];
  cooperating_agencies: string[];
  extension_sites: { country: string; region: string; province: string; district: string; municipality: string; barangay: string }[];
  tags: string[];
  clusters: string[];
  agendas: string[];
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: string;
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: { name: string; role: string }[];
  workplan: WorkplanItem[];
  budget_requirements: BudgetItem[];
  created_at: string;
}