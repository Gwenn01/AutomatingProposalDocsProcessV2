import type { ActivityFormData, ApiActivityListResponse, ApiProjectListResponse, BudgetRows, ExpectedOutput6Ps, OrgStaffingItem, ProgramBudgetRow, ProgramFormData, ProjectFormData, WorkplanRow } from "@/types/implementor-types";
import { authFetch, BASE_URL, handleResponse } from "./api-client";

export function toStringArray(value: string): string[] {
  if (!value?.trim()) return [];
  return value.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

export function mapWorkplanRows(rows: WorkplanRow[]): {
  objective: string;
  activity: string;
  expected_output: string;
  timeline: string[];
}[] {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  return rows
    .filter((row) => row.activity?.trim() || row.objective?.trim())
    .map((row) => {
      const timeline: string[] = [];
      [1, 2, 3].forEach((yr) => {
        quarters.forEach((q) => {
          const key = `year${yr}_${q.toLowerCase()}` as keyof WorkplanRow;
          if (row[key]) timeline.push(`Year ${yr} ${q}`);
        });
      });
      return {
        objective: row.objective || '',
        activity: row.activity || '',
        expected_output: row.expected_output || '',
        timeline,
      };
    });
}

export function mapOrgStaffing(rows: OrgStaffingItem[]): { role: string; name: string }[] {
  return rows.filter((r) => r.designation?.trim()).map((r) => ({ role: r.terms, name: r.designation }));
}

export function mapBudgetRows(rows: BudgetRows): { item: string; amount: number }[] {
  return (['meals', 'transport', 'supplies'] as (keyof BudgetRows)[]).flatMap((cat) =>
    rows[cat].filter((r) => r.item?.trim()).map((r) => ({ item: r.item, amount: Number(r.amount) || 0 })),
  );
}

export function mapProgramBudgetRows(rows: ProgramBudgetRow[]): { item: string; amount: number }[] {
  return rows.filter((r) => r.label?.trim()).map((r) => ({ item: r.label, amount: Number(r.total) || 0 }));
}

export function mapExpectedOutput(output: ExpectedOutput6Ps): string[] {
  return Object.values(output).filter(Boolean);
}

export function mapMethodology(text: string): { phase: string; activities: string[] }[] {
  const lines = toStringArray(text);
  return [{ phase: 'Methodology', activities: lines.length ? lines : [text || '—'] }];
}

export function mapExtensionSites(
  sites: Array<{ country: string; region: string; province: string; district: string; municipality: string; barangay: string }>
): { country: string; region: string; province: string; district: string; municipality: string; barangay: string }[] {
  return sites
    .filter((s) => Object.values(s).some((v) => v.trim()))  // skip fully empty rows
    .map(({ country, region, province, district, municipality, barangay }) => ({
      country, region, province, district, municipality, barangay,
    }));
}

export async function submitProgramProposal(
  programData: ProgramFormData,
): Promise<{ child_id: number; [key: string]: any }> {

  const project_list = programData.projects.map((p) => ({
    project_title: p.project_title,
    project_leader: p.project_leader,
    project_member: toStringArray(p.project_members),
    project_duration: Number(p.project_duration_months) || 0,
    project_start_date: p.project_start_date || null,
    project_end_date: p.project_end_date || null,
  }));

  const payload = {
    title: programData.program_title,
    program_title: programData.program_title,
    program_leader: programData.program_leader,
    project_list,
    implementing_agency: toStringArray(programData.implementing_agency),
    cooperating_agencies: toStringArray(programData.cooperating_agencies),
    extension_sites: mapExtensionSites((programData as any).extension_sites ?? []),
    tags: programData.tagging,
    clusters: programData.cluster,
    agendas: programData.extension_agenda,
    sdg_addressed: programData.sdg_addressed,
    mandated_academic_program: programData.college_mandated_program,
    rationale: programData.rationale,
    significance: programData.significance,
    general_objectives: programData.general_objectives,
    specific_objectives: programData.specific_objectives,
    methodology: programData.methodology,
    expected_output_6ps: mapExpectedOutput(programData.expected_output),
    sustainability_plan: programData.sustainability_plan,
    org_and_staffing: mapOrgStaffing(programData.org_staffing),
    workplan: mapWorkplanRows(programData.workplan),

    // ── Single total amount from Step 1's budget input ──────────────────
    budget_requirements: [
      {
        item: 'Total Program Budget',
        amount: parseFloat((programData as any).program_budget_total) || 0,
      },
    ],
  };

  if (import.meta.env.DEV) {
    console.log('[submitProgramProposal] payload:', JSON.stringify(payload, null, 2));
  }

  const res = await authFetch(`${BASE_URL}/program-proposal/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const postResult: any = await handleResponse(res);

  if (postResult?.child_id) return postResult;

  const listRes = await authFetch(`${BASE_URL}/proposals-node/Program`);
  const list: Array<{ id: number; child_id: number; title: string; created_at: string }> =
    await handleResponse(listRes);

  const matching = list
    .filter((p) => p.title === programData.program_title)
    .sort((a, b) => b.id - a.id);

  const found = matching[0];

  if (!found?.child_id) {
    const latest = [...list].sort((a, b) => b.id - a.id)[0];
    if (!latest?.child_id) {
      throw new Error('Could not resolve child_id for the created program proposal.');
    }
    if (import.meta.env.DEV) {
      console.log('[submitProgramProposal] resolved child_id (fallback latest):', latest.child_id);
    }
    return { ...postResult, child_id: latest.child_id };
  }

  if (import.meta.env.DEV) {
    console.log('[submitProgramProposal] resolved child_id:', found.child_id);
  }
  return { ...postResult, child_id: found.child_id };
}

export async function fetchProjectList(childId: number): Promise<ApiProjectListResponse> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/projects/`);
  return handleResponse<ApiProjectListResponse>(res);
}

export async function saveProjectProposal(projectId: number, form: ProjectFormData): Promise<any> {
  const payload = {
    activity_list: form.activities.map((act) => ({
      activity_title: act.activity_title,
      project_leader: act.project_leader || form.project_leader,
      project_member: toStringArray(act.project_members),
      activity_duration: Number(act.activity_duration) || 8,
      activity_date: act.activity_date || null,
    })),
    implementing_agency: toStringArray(form.implementing_agency),
    cooperating_agencies: toStringArray(form.cooperating_agencies),
    extension_sites: mapExtensionSites((form as any).extension_sites ?? []),
    tags: form.tagging,
    clusters: form.cluster,
    agendas: form.extension_agenda,
    sdg_addressed: form.sdg_addressed,
    mandated_academic_program: form.college_mandated_program,
    rationale: form.rationale,
    significance: form.significance,
    general_objectives: form.general_objectives,
    specific_objectives: form.specific_objectives,
    methodology: form.methodology,
    expected_output_6ps: mapExpectedOutput(form.expected_output),
    sustainability_plan: form.sustainability_plan,
    org_and_staffing: mapOrgStaffing(form.org_staffing),
    workplan: mapWorkplanRows(form.workplan),
    budget_requirements: mapBudgetRows(form.budget),
  };

  if (import.meta.env.DEV) {
    console.log(`[saveProjectProposal] projectId=${projectId}`, JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchActivityList(projectId: number): Promise<ApiActivityListResponse> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/activities/`);
  return handleResponse<ApiActivityListResponse>(res);
}

export async function saveActivityProposal(activityId: number, form: ActivityFormData): Promise<any> {
  const payload = {
    implementing_agency: toStringArray(form.implementing_agency),
    cooperating_agencies: toStringArray(form.cooperating_agencies),
    extension_sites: mapExtensionSites((form as any).extension_sites ?? []),
    tags: form.tagging,
    clusters: form.cluster,
    agendas: form.extension_agenda,
    sdg_addressed: form.sdg_addressed,
    mandated_academic_program: form.college_mandated_program,
    rationale: form.rationale,
    significance: form.significance,
    objectives_of_activity: form.objectives,
    methodology: form.methodology,
    expected_output_6ps: mapExpectedOutput(form.expected_output),
    sustainability_plan: form.sustainability_plan,
    org_and_staffing: mapOrgStaffing(form.org_staffing),
    plan_of_activity: form.schedule.rows
      .filter((r) => r.activity?.trim())
      .map((r) => ({
        time: r.time,
        activity: `${r.activity}${r.speaker ? ` — ${r.speaker}` : ''}`,
      })),
    budget_requirements: mapBudgetRows(form.budget),
  };

  if (import.meta.env.DEV) {
    console.log(`[saveActivityProposal] activityId=${activityId}`, JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/activity-proposal/${activityId}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export type ProposalNodeType = 'Program' | 'Project' | 'Activity';

export async function fetchProgramProposalDetail(childId: number | string): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/`);
  return handleResponse<any>(res);
}

export async function fetchProposalsNode(type: ProposalNodeType): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposals-node/${type}`);
  const data = await handleResponse<any>(res);
  console.log(`[fetchProposalsNode/${type}]`, JSON.stringify(data, null, 2));
  return data;
}

export async function fetchProjectProposalDetail(projectId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${projectId}/`);
  return handleResponse<any>(res);
}

export async function fetchActivityProposalDetail(activityId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/activity-proposal/${activityId}/`);
  return handleResponse<any>(res);
}

export async function fetchReviewedProposal(
  proposal_node: number,
  proposal_type: "program" | "project" | "activity"
): Promise<any> {
  const res = await authFetch(
    `${BASE_URL}/proposal-review/proposal/${proposal_node}/${proposal_type}/`
  );
  return handleResponse<any>(res);
}

export async function fetchProgramHistoryList(proposal_node: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/program-proposal/${proposal_node}/history-list/`);
  return handleResponse<any>(res);
}

export async function fetchProjectHistoryList(proposal_node: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/project-proposal/${proposal_node}/history-list/`);
  return handleResponse<any>(res);
}

export async function fetchActivityHistoryList(proposal_node: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/activity-proposal/${proposal_node}/history-list/`);
  return handleResponse<any>(res);
}

export async function updateProgramProposal(childId: number, payload: Record<string, any>): Promise<any> {
  if (import.meta.env.DEV) {
    console.log(`[updateProgramProposal] child_id=${childId}`, JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/program-proposal/${childId}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(res);
}

export async function updateProjectProposal(childId: number, payload: Record<string, any>): Promise<any> {
  if (import.meta.env.DEV) {
    console.log(`[updateProjectProposal] child_id=${childId}`, JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/project-proposal/${childId}/update-project-save-history/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(res);
}

export async function updateActivityProposal(childId: number, payload: Record<string, any>): Promise<any> {
  if (import.meta.env.DEV) {
    console.log(`[updateActivityProposal] child_id=${childId}`, JSON.stringify(payload, null, 2));
  }
  const res = await authFetch(`${BASE_URL}/activity-proposal/${childId}/update-activity-save-history/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return handleResponse<any>(res);
}

export async function getListofReviewer(proposal_id: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/reviewer-proposal-list/${proposal_id}`)
  return handleResponse<any>(res);
}

export async function getNotifications(): Promise<any> {
  const res = await authFetch(`${BASE_URL}/admin/notifications/`)
  return handleResponse<any>(res);
}

export async function checkReviews(proposal_id: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/proposal/${proposal_id}/check-reviews/`)
  return handleResponse<any>(res);
}

export async function fetchHistoryReview(
  proposalNode: number,
  historyId: number,
  version: number,
  proposalType: "program" | "project" | "activity"
): Promise<any> {
  const res = await authFetch(
    `${BASE_URL}/proposal-review/proposal-history/${proposalNode}/${historyId}/${version}/${proposalType}/`
  );
  return handleResponse<any>(res);
}

