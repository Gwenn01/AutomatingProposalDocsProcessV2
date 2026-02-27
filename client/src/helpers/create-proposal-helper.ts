import type { ActivityFormData, ProgramFormData, ProjectFormData } from "@/utils/implementor-api";

export const getProgramCompletion = (data: ProgramFormData): number => {
  const fields: (keyof ProgramFormData)[] = ['program_title', 'program_leader', 'implementing_agency', 'rationale', 'significance', 'general_objectives', 'specific_objectives', 'methodology', 'sustainability_plan'];
  const filled = fields.filter((f) => (data[f] as string)?.trim()).length;
  const projectsFilled = data.projects.every((p) => p.project_title?.trim() && p.project_leader?.trim());
  return Math.round(((filled + (projectsFilled ? 2 : 0)) / (fields.length + 2)) * 100);
};

export const getProjectCompletion = (data: ProjectFormData): number => {
  const fields: (keyof ProjectFormData)[] = ['implementing_agency', 'rationale', 'significance', 'general_objectives', 'specific_objectives', 'methodology', 'sustainability_plan'];
  const filled = fields.filter((f) => (data[f] as string)?.trim()).length;
  const actsFilled = data.activities.length > 0 && data.activities.every((a) => a.activity_title?.trim());
  return Math.round(((filled + (actsFilled ? 1 : 0)) / (fields.length + 1)) * 100);
};

export const getActivityCompletion = (data: ActivityFormData): number => {
  const fields: (keyof ActivityFormData)[] = ['implementing_agency', 'rationale', 'significance', 'objectives', 'methodology'];
  const filled = fields.filter((f) => (data[f] as string)?.trim()).length;
  return Math.round((filled / fields.length) * 100);
};