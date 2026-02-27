import type { ActivityFormData, ProjectFormData } from "@/utils/implementor-api";
import { Field } from "./Field";
import { AGENDA_OPTIONS, CLUSTER_OPTIONS, TAGGING_OPTIONS } from "@/constants";
import { CheckboxGroup } from "./checkbox-group";

export const CommonProfileFields = ({ data, onChange }: { data: ProjectFormData | ActivityFormData; onChange: (v: any) => void }) => {
  const upd = (field: string, val: any) => onChange({ ...data, [field]: val });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2"><Field label="Implementing Agency / College / Mandated Program" value={data.implementing_agency} onChange={(e) => upd('implementing_agency', e.target.value)} required /></div>
        <div className="md:col-span-2"><Field label="Address / Telephone / Email" value={data.address_tel_email} onChange={(e) => upd('address_tel_email', e.target.value)} /></div>
        <div className="md:col-span-2"><Field label="Cooperating Agency/ies" value={data.cooperating_agencies} onChange={(e) => upd('cooperating_agencies', e.target.value)} /></div>
        <div className="md:col-span-2"><Field label="Extension Site/s or Venue/s" value={data.extension_site} onChange={(e) => upd('extension_site', e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"><CheckboxGroup label="Tagging" options={TAGGING_OPTIONS} selected={data.tagging} onChange={(val) => upd('tagging', val)} /></div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"><CheckboxGroup label="Cluster" options={CLUSTER_OPTIONS} selected={data.cluster} onChange={(val) => upd('cluster', val)} /></div>
        <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200"><CheckboxGroup label="Extension Agenda" options={AGENDA_OPTIONS} selected={data.extension_agenda} onChange={(val) => upd('extension_agenda', val)} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="SDG Addressed" value={data.sdg_addressed} onChange={(e) => upd('sdg_addressed', e.target.value)} />
        <Field label="College / Campus / Mandated Academic Program" value={data.college_mandated_program} onChange={(e) => upd('college_mandated_program', e.target.value)} />
      </div>
    </div>
  );
};