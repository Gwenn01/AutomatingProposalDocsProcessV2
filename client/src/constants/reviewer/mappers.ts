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


export type HistoryReviewEntry = {
  reviewer_name: string;
  comment: string;
};

export type NormalizedHistoryReview = Record<string, HistoryReviewEntry[] | null>;

export function normalizeHistoryReview(
  raw: any,
  type: "program" | "project" | "activity"
): NormalizedHistoryReview | null {
  if (!raw) return null;

  // Returns array of { reviewer_name, comment } or null if no reviews
  const pick = (section: any): HistoryReviewEntry[] | null => {
    const reviews = section?.reviews;
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    const entries = reviews
      .filter((r: any) => r?.comment?.trim())
      .map((r: any) => ({
        reviewer_name: r.reviewer_name ?? "Reviewer",
        comment: r.comment,
      }));
    return entries.length > 0 ? entries : null;
  };

  if (type === "program") {
    return {
      profile_feedback:                   pick(raw.profile),
      implementing_agency_feedback:       pick(raw.agencies),
      extension_site_feedback:            pick(raw.extension_sites),
      tagging_cluster_extension_feedback: pick(raw.tagging_clustering_extension),
      sdg_academic_program_feedback:      pick(raw.sdg_and_academic_program),
      rationale_feedback:                 pick(raw.rationale),
      significance_feedback:              pick(raw.significance),
      general_objectives_feedback:        pick(raw.objectives),
      specific_objectives_feedback:       null,
      methodology_feedback:               pick(raw.methodology),
      expected_output_feedback:           pick(raw.expected_output_6ps),
      sustainability_plan_feedback:       pick(raw.sustainability_plan),
      org_staffing_feedback:              pick(raw.organization_and_staffing),
      work_plan_feedback:                 pick(raw.workplan),
      budget_requirements_feedback:       pick(raw.budget_requirements),
    };
  }

  if (type === "project") {
    return {
      profile_feedback:                   pick(raw.profile),
      implementing_agency_feedback:       pick(raw.agencies),
      extension_site_feedback:            pick(raw.extension_sites),
      tagging_cluster_extension_feedback: pick(raw.tagging_clustering_extension),
      sdg_academic_program_feedback:      pick(raw.sdg_and_academic_program),
      rationale_feedback:                 pick(raw.rationale),
      significance_feedback:              pick(raw.significance),
      general_objectives_feedback:        pick(raw.objectives),
      specific_objectives_feedback:       null,
      methodology_feedback:               pick(raw.methodology),
      expected_output_feedback:           pick(raw.expected_output_6ps),
      sustainability_plan_feedback:       pick(raw.sustainability_plan),
      org_staffing_feedback:              pick(raw.organization_and_staffing),
      work_plan_feedback:                 pick(raw.workplan),
      budget_requirements_feedback:       pick(raw.budget_requirements),
    };
  }

  // activity
  return {
    profile_feedback:                   pick(raw.profile),
    implementing_agency_feedback:       pick(raw.agencies),
    extension_site_feedback:            pick(raw.extension_sites),
    tagging_cluster_extension_feedback: pick(raw.tagging_clustering_extension),
    sdg_academic_program_feedback:      pick(raw.sdg_and_academic_program),
    rationale_feedback:                 pick(raw.rationale),
    significance_feedback:              pick(raw.significance),
    objectives_feedback:                pick(raw.objectives),
    methodology_feedback:               pick(raw.methodology),
    expected_output_feedback:           pick(raw.expected_output_6ps),
    work_plan_feedback:                 pick(raw.plan_of_activity),
    budget_requirements_feedback:       pick(raw.budget_requirements),
  };
}