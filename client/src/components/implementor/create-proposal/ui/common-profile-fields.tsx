import { useState } from "react";
import type { ActivityFormData, ProjectFormData } from "@/api/implementor-api";
import { Field } from "./Field";
import { AGENDA_OPTIONS, CLUSTER_OPTIONS, TAGGING_OPTIONS } from "@/constants";
import { CheckboxGroup } from "./checkbox-group";

const SDG_OPTIONS = [
  "SDG 1 – No Poverty",
  "SDG 2 – Zero Hunger",
  "SDG 3 – Good Health and Well-being",
  "SDG 4 – Quality Education",
  "SDG 5 – Gender Equality",
  "SDG 6 – Clean Water and Sanitation",
  "SDG 7 – Affordable and Clean Energy",
  "SDG 8 – Decent Work and Economic Growth",
  "SDG 9 – Industry, Innovation and Infrastructure",
  "SDG 10 – Reduced Inequalities",
  "SDG 11 – Sustainable Cities and Communities",
  "SDG 12 – Responsible Consumption and Production",
  "SDG 13 – Climate Action",
  "SDG 14 – Life Below Water",
  "SDG 15 – Life on Land",
  "SDG 16 – Peace, Justice and Strong Institutions",
  "SDG 17 – Partnerships for the Goals",
];

export type ExtensionSiteRow = {
  id: string;
  country: string;
  region: string;
  province: string;
  district: string;
  municipality: string;
  barangay: string;
};

const EMPTY_ROW = (): ExtensionSiteRow => ({
  id: crypto.randomUUID(),
  country: "",
  region: "",
  province: "",
  district: "",
  municipality: "",
  barangay: "",
});

const SITE_COLUMNS: { key: keyof Omit<ExtensionSiteRow, "id">; label: string }[] = [
  { key: "country",      label: "Country" },
  { key: "region",       label: "Region" },
  { key: "province",     label: "Province" },
  { key: "district",     label: "District" },
  { key: "municipality", label: "Municipality" },
  { key: "barangay",     label: "Barangay" },
];

const cellInput =
  "w-full border-0 bg-transparent px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-0 placeholder:text-gray-300 resize-none overflow-hidden leading-relaxed min-h-[32px]";

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
};

export const CommonProfileFields = ({
  data,
  onChange,
}: {
  data: ProjectFormData | ActivityFormData;
  onChange: (v: any) => void;
}) => {
  const upd = (field: string, val: any) => onChange({ ...data, [field]: val });

  // Extension sites state — seed from data if already an array, else start with 2 blank rows
  const [sites, setSites] = useState<ExtensionSiteRow[]>(() => {
    if (Array.isArray((data as any).extension_sites) && (data as any).extension_sites.length > 0) {
      return (data as any).extension_sites;
    }
    return [EMPTY_ROW(), EMPTY_ROW()];
  });

  const updateSites = (next: ExtensionSiteRow[]) => {
    setSites(next);
    upd("extension_sites", next);
  };

  const updateCell = (id: string, key: keyof Omit<ExtensionSiteRow, "id">, val: string) => {
    updateSites(sites.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  };

  const addRow = () => updateSites([...sites, EMPTY_ROW()]);

  const removeRow = (id: string) => {
    if (sites.length <= 1) return;
    updateSites(sites.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field
            label="Implementing Agency / College / Mandated Program"
            value={data.implementing_agency}
            onChange={(e) => upd("implementing_agency", e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Field
            label="Cooperating Agency/ies /Program /Colleges"
            value={data.cooperating_agencies}
            onChange={(e) => upd("cooperating_agencies", e.target.value)}
          />
        </div>
      </div>

      {/* ── Extension Sites Table ── */}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          Extension Site/s or Venue/s
        </label>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase tracking-wider">
                <th className="border border-gray-200 p-3 text-center font-semibold w-12 whitespace-nowrap">
                  Sites No.
                </th>
                {SITE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="border border-gray-200 px-3 py-2 text-center font-semibold whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="border border-gray-200 px-2 py-2 w-8" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sites.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-200 text-center text-gray-500 font-medium py-1">
                    {idx + 1}.
                  </td>
                  {SITE_COLUMNS.map((col) => (
                    <td key={col.key} className="border border-gray-200 p-1">
                      <textarea
                        rows={1}
                        value={row[col.key]}
                        onChange={(e) => {
                          updateCell(row.id, col.key, e.target.value);
                          autoResize(e.target);
                        }}
                        onInput={(e) => autoResize(e.currentTarget)}
                        placeholder={col.label}
                        className={cellInput}
                      />
                    </td>
                  ))}
                  <td className="border border-gray-200 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={sites.length <= 1}
                      className="text-gray-300 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors px-1 py-1 text-base leading-none"
                      title="Remove row"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="text-base leading-none">+</span> Add Row
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <CheckboxGroup
            label="Tagging"
            options={TAGGING_OPTIONS}
            selected={data.tagging}
            onChange={(val) => upd("tagging", val)}
          />
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <CheckboxGroup
            label="Cluster"
            options={CLUSTER_OPTIONS}
            selected={data.cluster}
            onChange={(val) => upd("cluster", val)}
          />
        </div>
        <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <CheckboxGroup
            label="Extension Agenda"
            options={AGENDA_OPTIONS}
            selected={data.extension_agenda}
            onChange={(val) => upd("extension_agenda", val)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1 px-2">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Sustainable Development Goal (SDG) Addressed
          </label>
          <select
            value={data.sdg_addressed ?? ""}
            onChange={(e) => upd("sdg_addressed", e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-xs text-gray-600 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select an SDG…
            </option>
            {SDG_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="College / Campus / Mandated Academic Program"
          value={data.college_mandated_program}
          onChange={(e) => upd("college_mandated_program", e.target.value)}
        />
      </div>
    </div>
  );
};