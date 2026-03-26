// ─── Snapshot → Form Data Mappers ────────────────────────────────────────────
//
// Each mapper normalises a raw history-snapshot object into the shape expected
// by the corresponding form component.  All fields fall back to sensible
// defaults so the forms never receive `undefined`.

export function mapSnapshotToProgram(data: any): any | null {
  if (!data) return null;

  return {
    id: data.id ?? 0,
    proposal: data.proposal ?? 0,
    program_title: data.profile?.program_title ?? data.program_title ?? "",
    program_leader: data.profile?.program_leader ?? "",
    project_list: data.profile?.project_list ?? [],
    implementing_agency: data.agencies?.implementing_agency ?? [],
    cooperating_agencies:
      data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites:
      data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags: data.tagging_clustering_extension?.tags ?? [],
    clusters: data.tagging_clustering_extension?.clusters ?? [],
    agendas: data.tagging_clustering_extension?.agendas ?? [],
    sdg_addressed:
      data.sdg_and_academic_program?.sdg_addressed ?? data.sdg_addressed ?? "",
    mandated_academic_program:
      data.sdg_and_academic_program?.mandated_academic_program ??
      data.mandated_academic_program ??
      "",
    rationale: data.rationale?.content ?? "",
    significance: data.significance?.content ?? "",
    general_objectives: data.objectives?.general ?? "",
    specific_objectives: data.objectives?.specific ?? "",
    methodology: data.methodology?.content ?? [],
    expected_output_6ps: data.expected_output_6ps?.content ?? [],
    sustainability_plan: data.sustainability_plan?.content ?? "",
    org_and_staffing: data.organization_and_staffing?.content ?? [],
    workplan: data.work_plan?.content ?? [],
    budget_requirements: data.budget_requirements?.content ?? [],
    created_at: data.created_at ?? "",
  };
}

export function mapSnapshotToProject(data: any): any | null {
  if (!data) return null;

  return {
    id: data.id ?? 0,
    project_title: data.profile?.project_title ?? data.project_title ?? "",
    project_leader: data.profile?.project_leader ?? "",
    members: data.profile?.members ?? data.profile?.project_member ?? [],
    duration_months:
      data.profile?.duration_months ?? data.profile?.project_duration ?? "",
    start_date:
      data.profile?.start_date ?? data.profile?.project_start_date ?? null,
    end_date: data.profile?.end_date ?? data.profile?.project_end_date ?? null,
    implementing_agency: data.agencies?.implementing_agency ?? [],
    cooperating_agencies:
      data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites:
      data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags: data.tagging_clustering_extension?.tags ?? [],
    clusters: data.tagging_clustering_extension?.clusters ?? [],
    agendas: data.tagging_clustering_extension?.agendas ?? [],
    sdg_addressed:
      data.sdg_and_academic_program?.sdg_addressed ?? data.sdg_addressed ?? "",
    mandated_academic_program:
      data.sdg_and_academic_program?.mandated_academic_program ??
      data.mandated_academic_program ??
      "",
    rationale: data.rationale?.content ?? "",
    significance: data.significance?.content ?? "",
    general_objectives: data.objectives?.general ?? "",
    specific_objectives: data.objectives?.specific ?? "",
    methodology: data.methodology?.content ?? [],
    expected_output_6ps: data.expected_output_6ps?.content ?? [],
    sustainability_plan: data.sustainability_plan?.content ?? "",
    org_and_staffing: data.organization_and_staffing?.content ?? [],
    workplan: data.work_plan?.content ?? [],
    budget_requirements: data.budget_requirements?.content ?? [],
  };
}

export function mapSnapshotToActivity(data: any): any | null {
  if (!data) return null;

  return {
    id: data.id ?? 0,
    activity_title:
      data.profile?.activity_title ?? data.activity_title ?? "",
    project_leader: data.profile?.project_leader ?? "",
    members: data.profile?.members ?? data.profile?.project_member ?? [],
    activity_duration_hours:
      data.profile?.activity_duration_hours ??
      data.profile?.project_duration ??
      "",
    activity_date:
      data.profile?.activity_date ?? data.profile?.project_start_date ?? null,
    implementing_agency: data.agencies?.implementing_agency ?? [],
    cooperating_agencies:
      data.agencies?.cooperating_agency ?? data.agencies?.cooperating_agencies ?? [],
    extension_sites:
      data.extension_sites?.content ?? data.agencies?.extension_sites ?? [],
    tags: data.tagging_clustering_extension?.tags ?? [],
    clusters: data.tagging_clustering_extension?.clusters ?? [],
    agendas: data.tagging_clustering_extension?.agendas ?? [],
    sdg_addressed:
      data.sdg_and_academic_program?.sdg_addressed ?? data.sdg_addressed ?? "",
    mandated_academic_program:
      data.sdg_and_academic_program?.mandated_academic_program ??
      data.mandated_academic_program ??
      "",
    rationale: data.rationale?.content ?? "",
    objectives:
      data.objectives?.content ?? data.objectives?.general ?? "",
    methodology: data.methodology?.content ?? "",
    expected_output_6ps: data.expected_output_6ps?.content ?? [],
    sustainability_plan: data.sustainability_plan?.content ?? "",
    org_and_staffing: data.organization_and_staffing?.content ?? [],
    plan_of_activity: data.plan_of_activity?.content ?? [],
    budget_requirements: data.budget_requirements?.content ?? [],
  };
}

// ─── History List Normaliser ──────────────────────────────────────────────────

export function normalizeHistoryList(raw: any): any[] {
  if (!raw) return [];

  const items: any[] = Array.isArray(raw)
    ? raw
    : raw.history ?? raw.results ?? [];

  return items.map((item) => ({
    history_id: String(item.history_id ?? item.id ?? ""),
    proposal_id: String(item.proposal_id ?? item.proposal ?? ""),
    status: item.status ?? "unknown",
    version: item.version ?? item.version_no ?? 0,
    version_no: item.version_no ?? item.version ?? 0,
    created_at: item.created_at ?? "",
    program_title: String(
      item.program_title ?? item.project_title ?? item.activity_title ?? ""
    ),
  }));
}