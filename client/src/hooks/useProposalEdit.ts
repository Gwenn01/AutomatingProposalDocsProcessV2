// hooks/useProposalEdit.ts
// Manages local editable copies of program / project / activity proposal data.
// Calls the appropriate PUT endpoint on handleSave().

import { useState, useEffect } from "react";
import {
  updateProgramProposal,
  updateProjectProposal,
  updateActivityProposal,
} from "@/utils/implementor-api";
import { useToast } from "@/context/toast";

// ─── helpers ────────────────────────────────────────────────────────────────
const str  = (v: any): string          => (v == null ? "" : String(v));
const arr  = (v: any): string[]        => (Array.isArray(v) ? v.map(str) : []);
const rows = <T,>(v: any, defaults: T): T[] =>
  Array.isArray(v) ? v.map((r: any) => ({ ...defaults, ...r })) : [];

// ─── shape of each editable form ────────────────────────────────────────────
export interface EditableProgram {
  title: string;
  program_title: string;
  program_leader: string;
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
  methodology: { phase: string; activities: string[] }[];
  expected_output_6ps: string[];
  sustainability_plan: string;
  org_and_staffing: { name: string; role: string }[];
  workplan: { month: string; activity: string }[];
  budget_requirements: { item: string; amount: string }[];
}

export interface EditableProject {
  project_title: string;
  project_leader: string;
  members: string[];
  duration_months: string;
  start_date: string;
  end_date: string;
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
  methodology: { phase: string; activities: string[] }[];
  expected_output_6ps: string[];
  budget_requirements: { item: string; amount: string }[];
}

export interface EditableActivity {
  activity_title: string;
  project_leader: string;
  members: string[];
  activity_duration_hours: string;
  activity_date: string;
  implementing_agency: string[];
  cooperating_agencies: string[];
  extension_sites: string[];
  tags: string[];
  clusters: string[];
  agendas: string[];
  sdg_addressed: string;
  mandated_academic_program: string;
  rationale: string;
  objectives: string;
  methodology: string;
  expected_output_6ps: string[];
  plan_of_activity: { time: string; activity: string; person_responsible: string }[];
  budget_requirements: { item: string; amount: string }[];
}

// ─── defaults ────────────────────────────────────────────────────────────────
const defaultProgram  = (): EditableProgram  => ({
  title: "",
  program_title: "", program_leader: "",
  implementing_agency: [], cooperating_agencies: [], extension_sites: [],
  tags: [], clusters: [], agendas: [],
  sdg_addressed: "", mandated_academic_program: "",
  rationale: "", significance: "",
  general_objectives: "", specific_objectives: "",
  methodology: [], expected_output_6ps: [],
  sustainability_plan: "",
  org_and_staffing: [],
  workplan: [],
  budget_requirements: [],
});

const defaultProject  = (): EditableProject  => ({
  project_title: "", project_leader: "", members: [],
  duration_months: "", start_date: "", end_date: "",
  implementing_agency: [], cooperating_agencies: [], extension_sites: [],
  tags: [], clusters: [], agendas: [],
  sdg_addressed: "", mandated_academic_program: "",
  rationale: "", significance: "",
  general_objectives: "", specific_objectives: "",
  methodology: [], expected_output_6ps: [],
  budget_requirements: [],
});

const defaultActivity = (): EditableActivity => ({
  activity_title: "", project_leader: "", members: [],
  activity_duration_hours: "", activity_date: "",
  implementing_agency: [], cooperating_agencies: [], extension_sites: [],
  tags: [], clusters: [], agendas: [],
  sdg_addressed: "", mandated_academic_program: "",
  rationale: "", objectives: "", methodology: "",
  expected_output_6ps: [],
  plan_of_activity: [],
  budget_requirements: [],
});

// ─── hydrate from API-mapped data ─────────────────────────────────────────────
function hydrateProgram(d: any): EditableProgram {
  if (!d) return defaultProgram();
  return {
    title:                     str(d.program_title),
    program_title:             str(d.program_title),
    program_leader:            str(d.program_leader),
    implementing_agency:       arr(d.implementing_agency),
    cooperating_agencies:      arr(d.cooperating_agencies),
    extension_sites:           arr(d.extension_sites),
    tags:                      arr(d.tags),
    clusters:                  arr(d.clusters),
    agendas:                   arr(d.agendas),
    sdg_addressed:             str(d.sdg_addressed),
    mandated_academic_program: str(d.mandated_academic_program),
    rationale:                 str(d.rationale),
    significance:              str(d.significance),
    general_objectives:        str(d.general_objectives),
    specific_objectives:       str(d.specific_objectives),
    methodology:               rows(d.methodology, { phase: "", activities: [] }),
    expected_output_6ps:       arr(d.expected_output_6ps),
    sustainability_plan:       str(d.sustainability_plan),
    org_and_staffing:          rows(d.org_and_staffing, { name: "", role: "" }),
    workplan:                  rows(d.workplan, { month: "", activity: "" }),
    budget_requirements:       rows(d.budget_requirements, { item: "", amount: "" })
                                 .map((r: any) => ({ ...r, amount: str(r.amount) })),
  };
}

function hydrateProject(d: any): EditableProject {
  if (!d) return defaultProject();
  return {
    project_title:             str(d.project_title),
    project_leader:            str(d.project_leader),
    members:                   arr(d.members),
    duration_months:           str(d.duration_months),
    start_date:                str(d.start_date),
    end_date:                  str(d.end_date),
    implementing_agency:       arr(d.implementing_agency),
    cooperating_agencies:      arr(d.cooperating_agencies),
    extension_sites:           arr(d.extension_sites),
    tags:                      arr(d.tags),
    clusters:                  arr(d.clusters),
    agendas:                   arr(d.agendas),
    sdg_addressed:             str(d.sdg_addressed),
    mandated_academic_program: str(d.mandated_academic_program),
    rationale:                 str(d.rationale),
    significance:              str(d.significance),
    general_objectives:        str(d.general_objectives),
    specific_objectives:       str(d.specific_objectives),
    methodology:               rows(d.methodology, { phase: "", activities: [] }),
    expected_output_6ps:       arr(d.expected_output_6ps),
    budget_requirements:       rows(d.budget_requirements, { item: "", amount: "" })
                                 .map((r: any) => ({ ...r, amount: str(r.amount) })),
  };
}

function hydrateActivity(d: any): EditableActivity {
  if (!d) return defaultActivity();
  return {
    activity_title:          str(d.activity_title),
    project_leader:          str(d.project_leader),
    members:                 arr(d.members),
    activity_duration_hours: str(d.activity_duration_hours),
    activity_date:           str(d.activity_date),
    implementing_agency:     arr(d.implementing_agency),
    cooperating_agencies:    arr(d.cooperating_agencies),
    extension_sites:         arr(d.extension_sites),
    tags:                    arr(d.tags),
    clusters:                arr(d.clusters),
    agendas:                 arr(d.agendas),
    sdg_addressed:           str(d.sdg_addressed),
    mandated_academic_program: str(d.mandated_academic_program),
    rationale:               str(d.rationale),
    objectives:              str(d.objectives),
    methodology:             str(d.methodology),
    expected_output_6ps:     arr(d.expected_output_6ps),
    plan_of_activity:        rows(d.plan_of_activity, { time: "", activity: "", person_responsible: "" }),
    budget_requirements:     rows(d.budget_requirements, { item: "", amount: "" })
                               .map((r: any) => ({ ...r, amount: str(r.amount) })),
  };
}

// ─── build final save payloads ────────────────────────────────────────────────
function buildProgramPayload(d: EditableProgram) {
  return {
    title:                     d.program_title,
    program_title:             d.program_title,
    program_leader:            d.program_leader,
    implementing_agency:       d.implementing_agency,
    cooperating_agencies:      d.cooperating_agencies,
    extension_sites:           d.extension_sites,
    tags:                      d.tags,
    clusters:                  d.clusters,
    agendas:                   d.agendas,
    sdg_addressed:             d.sdg_addressed,
    mandated_academic_program: d.mandated_academic_program,
    rationale:                 d.rationale,
    significance:              d.significance,
    general_objectives:        d.general_objectives,
    specific_objectives:       d.specific_objectives,
    methodology:               d.methodology,
    expected_output_6ps:       d.expected_output_6ps,
    sustainability_plan:       d.sustainability_plan,
    org_and_staffing:          d.org_and_staffing,
    workplan:                  d.workplan,
    budget_requirements:       d.budget_requirements.map((r) => ({
      item:   r.item,
      amount: Number(r.amount) || 0,
    })),
  };
}

function buildProjectPayload(d: EditableProject) {
  return {
    project_title:             d.project_title,
    project_leader:            d.project_leader,
    members:                   d.members,
    duration_months:           d.duration_months,
    start_date:                d.start_date || null,
    end_date:                  d.end_date   || null,
    implementing_agency:       d.implementing_agency,
    cooperating_agencies:      d.cooperating_agencies,
    extension_sites:           d.extension_sites,
    tags:                      d.tags,
    clusters:                  d.clusters,
    agendas:                   d.agendas,
    sdg_addressed:             d.sdg_addressed,
    mandated_academic_program: d.mandated_academic_program,
    rationale:                 d.rationale,
    significance:              d.significance,
    general_objectives:        d.general_objectives,
    specific_objectives:       d.specific_objectives,
    methodology:               d.methodology,
    expected_output_6ps:       d.expected_output_6ps,
    budget_requirements:       d.budget_requirements.map((r) => ({
      item:   r.item,
      amount: Number(r.amount) || 0,
    })),
  };
}

function buildActivityPayload(d: EditableActivity) {
  return {
    activity_title:            d.activity_title,
    project_leader:            d.project_leader,
    members:                   d.members,
    activity_duration_hours:   d.activity_duration_hours,
    activity_date:             d.activity_date || null,
    implementing_agency:       d.implementing_agency,
    cooperating_agencies:      d.cooperating_agencies,
    extension_sites:           d.extension_sites,
    tags:                      d.tags,
    clusters:                  d.clusters,
    agendas:                   d.agendas,
    sdg_addressed:             d.sdg_addressed,
    mandated_academic_program: d.mandated_academic_program,
    rationale:                 d.rationale,
    objectives:                d.objectives,
    methodology:               d.methodology,
    expected_output_6ps:       d.expected_output_6ps,
    plan_of_activity:          d.plan_of_activity,
    budget_requirements:       d.budget_requirements.map((r) => ({
      item:   r.item,
      amount: Number(r.amount) || 0,
    })),
  };
}

// ─── hook ─────────────────────────────────────────────────────────────────────
export function useProposalEdit({
  activeTab,
  // Program  → PUT /program-proposal/{programChildId}/      payload: proposal = programProposalId
  programChildId,
  programProposalId,
  // Project  → PUT /project-proposal/{projectChildId}/...   payload: proposal = projectProposalId
  projectChildId,
  projectProposalId,
  // Activity → PUT /activity-proposal/{activityChildId}/... payload: proposal = activityProposalId
  activityChildId,
  activityProposalId,
  mappedProgram,
  mappedProject,
  mappedActivity,
  isEditing,
  onEditingChange,
}: {
  activeTab: "program" | "project" | "activity";
  programChildId:    number | null;
  programProposalId: number | null;
  projectChildId:    number | null;
  projectProposalId: number | null;
  activityChildId:   number | null;
  activityProposalId: number | null;
  mappedProgram:   any | null;
  mappedProject:   any | null;
  mappedActivity:  any | null;
  isEditing: boolean;
  onEditingChange: (v: boolean) => void;
}) {
  const [programDraft,  setProgramDraft]  = useState<EditableProgram>(defaultProgram());
  const [projectDraft,  setProjectDraft]  = useState<EditableProject>(defaultProject());
  const [activityDraft, setActivityDraft] = useState<EditableActivity>(defaultActivity());
  const [isSaving,      setIsSaving]      = useState(false);
  const [saveError,     setSaveError]     = useState<string | null>(null);
  const { showToast } = useToast();

  // Use stable scalar IDs as deps so we never trigger on new object references.
  // mappedProgram/Project/Activity are new objects every render even with useMemo
  // (inner arrays differ by reference), so using them directly as deps causes an
  // infinite setState → re-render → setState loop.
  const programDataId  = mappedProgram  ? (mappedProgram.id  ?? mappedProgram.proposal  ?? programChildId)  : null;
  const projectDataId  = mappedProject  ? (mappedProject.id  ?? projectChildId)  : null;
  const activityDataId = mappedActivity ? (mappedActivity.id ?? activityChildId) : null;

  useEffect(() => {
    if (!isEditing && mappedProgram)  setProgramDraft(hydrateProgram(mappedProgram));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programDataId, isEditing]);

  useEffect(() => {
    if (!isEditing && mappedProject)  setProjectDraft(hydrateProject(mappedProject));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDataId, isEditing]);

  useEffect(() => {
    if (!isEditing && mappedActivity) setActivityDraft(hydrateActivity(mappedActivity));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityDataId, isEditing]);

  const handleSave = async () => {
    setSaveError(null);
    setIsSaving(true);
    try {
      if (activeTab === "program") {
        if (!programChildId)    throw new Error("Missing program ID — cannot save.");
        const payload = { proposal: programProposalId, ...buildProgramPayload(programDraft) };
        await updateProgramProposal(programChildId, payload);
        showToast(`Program Updated Successfully`, "success");

      } else if (activeTab === "project") {
        if (!projectChildId)    throw new Error("Missing project ID — cannot save.");
        const payload = { proposal: projectProposalId, ...buildProjectPayload(projectDraft) };
        await updateProjectProposal(projectChildId, payload);
        showToast(`Project Updated Successfully`, "success");

      } else {
        if (!activityChildId)   throw new Error("Missing activity ID — cannot save.");
        const payload = { proposal: activityProposalId, ...buildActivityPayload(activityDraft) };
        await updateActivityProposal(activityChildId, payload);
        showToast(`Activity Updated Successfully`, "success");
      }

      onEditingChange(false);
    } catch (err: any) {
      console.error("[useProposalEdit] save failed:", err);
      setSaveError(err?.message ?? "Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSaveError(null);
    if (activeTab === "program"  && mappedProgram)  setProgramDraft(hydrateProgram(mappedProgram));
    if (activeTab === "project"  && mappedProject)  setProjectDraft(hydrateProject(mappedProject));
    if (activeTab === "activity" && mappedActivity) setActivityDraft(hydrateActivity(mappedActivity));
    onEditingChange(false);
  };

  return {
    programDraft,  setProgramDraft,
    projectDraft,  setProjectDraft,
    activityDraft, setActivityDraft,
    isSaving,
    saveError,
    handleSave,
    handleCancel,
  };
}