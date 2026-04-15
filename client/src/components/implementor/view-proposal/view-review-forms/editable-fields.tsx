import React from "react";
interface EditableTextProps {
  value: any;
  onChange: (v: string) => void;
  isEditing: boolean;
  placeholder?: string;
  className?: string;
  displayClassName?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isEditing,
  placeholder = "—",
  className = "",
  displayClassName = "",
}) => {
  if (!isEditing)
    return <span className={displayClassName}>{value || "—"}</span>;

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-sm text-gray-800
                  outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition ${className}`}
    />
  );
};
interface EditableTextareaProps {
  value: string;
  onChange: (v: string) => void;
  isEditing: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export const EditableTextarea: React.FC<EditableTextareaProps> = ({
  value,
  onChange,
  isEditing,
  placeholder = "—",
  rows = 4,
  className = "",
}) => {
  if (!isEditing)
    return <p className={`whitespace-pre-line text-base ${className}`}>{value || "—"}</p>;

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-2 text-sm text-gray-800
                 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition resize-y"
    />
  );
};
interface EditableArrayProps {
  value: string[];
  onChange: (v: string[]) => void;
  isEditing: boolean;
  placeholder?: string;
  displayClassName?: string;
}

export const EditableArray: React.FC<EditableArrayProps> = ({
  value,
  onChange,
  isEditing,
  placeholder = "Add item…",
  displayClassName = "",
}) => {
  if (!isEditing)
    return (
      <span className={displayClassName}>
        {value?.length ? value.join(", ") : "—"}
      </span>
    );

  const update = (idx: number, v: string) => {
    const next = [...value];
    next[idx] = v;
    onChange(next);
  };

  const add = () => onChange([...value, ""]);

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-sm text-gray-800
                       outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 flex items-center gap-1 rounded-lg border border-dashed border-emerald-400
                   px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition"
      >
        + Add
      </button>
    </div>
  );
};

interface EditableKeyValueListProps<T extends Record<string, string>> {
  value: T[];
  onChange: (v: T[]) => void;
  isEditing: boolean;
  keyField: keyof T;
  valField: keyof T;
  keyLabel?: string;
  valLabel?: string;
  emptyTemplate: T;
}

export function EditableKeyValueList<T extends Record<string, string>>({
  value,
  onChange,
  isEditing,
  keyField,
  valField,
  keyLabel = "Name",
  valLabel = "Value",
  emptyTemplate,
}: EditableKeyValueListProps<T>) {
  const update = (idx: number, field: keyof T, v: string) => {
    const next = value.map((row, i) => (i === idx ? { ...row, [field]: v } : row));
    onChange(next);
  };

  const add = () => onChange([...value, { ...emptyTemplate }]);

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  if (!isEditing) return null; // display handled by caller

  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={row[keyField] as string}
            onChange={(e) => update(i, keyField, e.target.value)}
            placeholder={keyLabel}
            className="flex-1 rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-sm text-gray-800
                       outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
          />
          <input
            type="text"
            value={row[valField] as string}
            onChange={(e) => update(i, valField, e.target.value)}
            placeholder={valLabel}
            className="flex-1 rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-sm text-gray-800
                       outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 rounded-lg border border-dashed border-emerald-400
                   px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition"
      >
        + Add row
      </button>
    </div>
  );
}

interface SiteRow {
  country: string; region: string; province: string;
  district: string; municipality: string; barangay: string;
}

interface EditableSiteListProps {
  value: SiteRow[];
  onChange: (v: SiteRow[]) => void;
  isEditing: boolean;
}

export const EditableSiteList: React.FC<EditableSiteListProps> = ({ value, onChange, isEditing }) => {
  if (!isEditing) return null;

  const FIELDS: { key: keyof SiteRow; label: string }[] = [
    { key: "country",      label: "Country"      },
    { key: "region",       label: "Region"       },
    { key: "province",     label: "Province"     },
    { key: "district",     label: "District"     },
    { key: "municipality", label: "Municipality" },
    { key: "barangay",     label: "Barangay"     },
  ];

  const update = (idx: number, field: keyof SiteRow, v: string) => {
    const next = value.map((row, i) => i === idx ? { ...row, [field]: v } : row);
    onChange(next);
  };

  const add = () => onChange([...value, { country: "", region: "", province: "", district: "", municipality: "", barangay: "" }]);

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-700">Site {i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-sm"
            >×</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FIELDS.map(({ key, label }) => (
              <input
                key={key}
                type="text"
                value={row[key]}
                onChange={(e) => update(i, key, e.target.value)}
                placeholder={label}
                className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-gray-800
                           outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 rounded-lg border border-dashed border-emerald-400
                   px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition"
      >+ Add Site</button>
    </div>
  );
};

interface WorkplanEditRow {
  objective: string;
  activity: string;
  expected_output: string;
  timeline: string[];
}

interface EditableWorkplanListProps {
  value: WorkplanEditRow[];
  onChange: (v: WorkplanEditRow[]) => void;
  isEditing: boolean;
}

export const EditableWorkplanList: React.FC<EditableWorkplanListProps> = ({ value, onChange, isEditing }) => {
  if (!isEditing) return null;

  const update = (idx: number, field: keyof WorkplanEditRow, v: any) => {
    const next = value.map((row, i) => i === idx ? { ...row, [field]: v } : row);
    onChange(next);
  };

  const toggleQuarter = (idx: number, quarterLabel: string) => {
    const row = value[idx];
    const timeline = Array.isArray(row.timeline) ? row.timeline : [];
    const next = timeline.includes(quarterLabel)
      ? timeline.filter((q) => q !== quarterLabel)
      : [...timeline, quarterLabel];
    update(idx, "timeline", next);
  };

  const add = () => onChange([...value, { objective: "", activity: "", expected_output: "", timeline: [] }]);

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  const inputCls = "w-full rounded border border-emerald-300 bg-emerald-50/40 px-2 py-1 text-xs outline-none focus:border-emerald-500";

  return (
    <div className="space-y-4">
      {value.map((row, i) => (
        <div key={i} className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Row {i + 1}</span>
            <button type="button" onClick={() => remove(i)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-sm">×</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Objective</label>
              <textarea rows={2} value={row.objective} onChange={(e) => update(i, "objective", e.target.value)}
                placeholder="Objective..." className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Activity</label>
              <textarea rows={2} value={row.activity} onChange={(e) => update(i, "activity", e.target.value)}
                placeholder="Activity..." className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Expected Output</label>
              <textarea rows={2} value={row.expected_output} onChange={(e) => update(i, "expected_output", e.target.value)}
                placeholder="Output..." className={inputCls + " resize-none"} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-500 uppercase mb-2 block">Timeline</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[1, 2, 3].map((yr) => (
                <div key={yr} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 w-12">Year {yr}</span>
                  {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                    const label = `Year ${yr} ${q}`;
                    const checked = Array.isArray(row.timeline) && row.timeline.includes(label);
                    return (
                      <label key={q} className="flex items-center gap-1 text-xs cursor-pointer">
                        <input type="checkbox" checked={checked}
                          onChange={() => toggleQuarter(i, label)}
                          className="rounded text-emerald-600 focus:ring-emerald-500" />
                        {q}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={add}
        className="flex items-center gap-1 rounded-lg border border-dashed border-emerald-400
                   px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition">
        + Add Row
      </button>
    </div>
  );
};

