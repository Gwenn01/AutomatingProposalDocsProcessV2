import type { ActivityFormData, ProgramFormData, ProjectFormData } from "@/api/implementor-api";

type Score = { weight: number; filled: boolean };

const pct = (scores: Score[]) => {
  const total = scores.reduce((s, x) => s + x.weight, 0);
  const earned = scores.reduce((s, x) => s + (x.filled ? x.weight : 0), 0);
  return Math.round((earned / total) * 100);
};

const str = (v: unknown) => typeof v === "string" && v.trim().length > 0;
const arr = (v: unknown) => Array.isArray(v) && v.length > 0;

export const getProgramCompletion = (data: ProgramFormData): number =>
  pct([
    // I. Profile — text fields
    { weight: 1, filled: str(data.program_title) },
    { weight: 1, filled: str(data.program_leader) },
    { weight: 1, filled: str(data.implementing_agency) },
    { weight: 1, filled: str(data.address_tel_email) },

    // I. Profile — checkboxes / selects (at least one chosen)
    { weight: 1, filled: arr(data.tagging) },
    { weight: 1, filled: arr(data.cluster) },
    { weight: 1, filled: arr(data.extension_agenda) },

    // I. Profile — optional but tracked
    { weight: 1, filled: str(data.sdg_addressed) },
    { weight: 1, filled: str(data.college_mandated_program) },

    // Projects — every project needs title + leader (worth 2)
    {
      weight: 2,
      filled:
        data.projects.length > 0 &&
        data.projects.every((p) => str(p.project_title) && str(p.project_leader)),
    },

    // II–VII narrative sections
    { weight: 1, filled: str(data.rationale) },
    { weight: 1, filled: str(data.significance) },
    { weight: 1, filled: str(data.general_objectives) },
    { weight: 1, filled: str(data.specific_objectives) },
    { weight: 1, filled: str(data.methodology) },
    { weight: 1, filled: str(data.sustainability_plan) },

    // VI. Expected output — at least one 6P filled
    {
      weight: 1,
      filled: Object.values(data.expected_output ?? {}).some((v) => str(v)),
    },

    // VIII. Org & Staffing — at least one row with name + role
    {
      weight: 1,
      filled: data.org_staffing?.some((r) => str(r.designation) && str(r.terms)) ?? false,
    },

    // IX. Workplan — at least one row with an activity
    {
      weight: 1,
      filled: data.workplan?.some((r) => str(r.activity)) ?? false,
    },

    // X. Budget — at least one line item with a label and a source
    {
      weight: 1,
      filled:
        data.program_budget?.some(
          (r) => str(r.label) && (str(r.prmsu) || str(r.agency))
        ) ?? false,
    },
  ]);

export const getProjectCompletion = (data: ProjectFormData): number =>
  pct([
    // I. Profile — pre-filled from API but user must fill agency info
    { weight: 1, filled: str(data.implementing_agency) },
    { weight: 1, filled: str(data.address_tel_email) },

    // I. Profile — checkboxes
    { weight: 1, filled: arr(data.tagging) },
    { weight: 1, filled: arr(data.cluster) },
    { weight: 1, filled: arr(data.extension_agenda) },
    { weight: 1, filled: str(data.sdg_addressed) },
    { weight: 1, filled: str(data.college_mandated_program) },

    // Activities — every activity needs a title (worth 2)
    {
      weight: 2,
      filled:
        data.activities.length > 0 &&
        data.activities.every((a) => str(a.activity_title)),
    },

    // Narrative sections
    { weight: 1, filled: str(data.rationale) },
    { weight: 1, filled: str(data.significance) },
    { weight: 1, filled: str(data.general_objectives) },
    { weight: 1, filled: str(data.specific_objectives) },
    { weight: 1, filled: str(data.methodology) },
    { weight: 1, filled: str(data.sustainability_plan) },

    // Expected output
    {
      weight: 1,
      filled: Object.values(data.expected_output ?? {}).some((v) => str(v)),
    },

    // Org & staffing
    {
      weight: 1,
      filled: data.org_staffing?.some((r) => str(r.designation) && str(r.terms)) ?? false,
    },

    // Workplan
    {
      weight: 1,
      filled: data.workplan?.some((r) => str(r.activity)) ?? false,
    },

    // Budget — BudgetRows has meals / transport / supplies sub-arrays
    {
      weight: 1,
      filled:
        (["meals", "transport", "supplies"] as const).some((cat) =>
          data.budget?.[cat]?.some((r) => str(r.item) && (str(String(r.amount)) || str(r.cost)))
        ) ?? false,
    },
  ]);

// export const getActivityCompletion = (data: ActivityFormData): number =>
//   pct([
//     // I. Profile
//     { weight: 1, filled: str(data.implementing_agency) },
//     { weight: 1, filled: str(data.address_tel_email) },
//     { weight: 1, filled: arr(data.tagging) },
//     { weight: 1, filled: arr(data.cluster) },
//     { weight: 1, filled: arr(data.extension_agenda) },
//     { weight: 1, filled: str(data.sdg_addressed) },
//     { weight: 1, filled: str(data.college_mandated_program) },
//     { weight: 1, filled: str(data.activity_duration) },

//     // Narrative
//     { weight: 1, filled: str(data.rationale) },
//     { weight: 1, filled: str(data.significance) },
//     { weight: 1, filled: str(data.objectives) },
//     { weight: 1, filled: str(data.methodology) },
//     { weight: 1, filled: str(data.sustainability_plan) },

//     // Expected output
//     {
//       weight: 1,
//       filled: Object.values(data.expected_output ?? {}).some((v) => str(v)),
//     },

//     // Org & staffing
//     {
//       weight: 1,
//       filled: data.org_staffing?.some((r) => str(r.designation) && str(r.terms)) ?? false,
//     },

//     // Schedule (plan_of_activity) — at least one row with an activity
//     {
//       weight: 1,
//       filled: data.schedule?.rows?.some((r) => str(r.activity)) ?? false,
//     },

//     // Budget
//     {
//       weight: 1,
//       filled:
//         (["meals", "transport", "supplies"] as const).some((cat) =>
//           data.budget?.[cat]?.some((r) => str(r.item) && (str(String(r.amount)) || str(r.cost)))
//         ) ?? false,
//     },
//   ]);

export const getActivityCompletion = (data: ActivityFormData): number => {
  const fields: (keyof ActivityFormData)[] = ['implementing_agency', 'rationale', 'significance', 'objectives', 'methodology'];
  const filled = fields.filter((f) => (data[f] as string)?.trim()).length;
  return Math.round((filled / fields.length) * 100);
};