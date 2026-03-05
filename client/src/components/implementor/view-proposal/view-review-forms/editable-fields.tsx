// components/reviewer/editable-fields.tsx
// Reusable primitives that render plain text in view mode
// and an input/textarea/list-editor in edit mode.

import React from "react";

// ─────────────────────────────────────────────────────────────
// EditableText – single-line
// ─────────────────────────────────────────────────────────────
interface EditableTextProps {
  value: string;
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

// ─────────────────────────────────────────────────────────────
// EditableTextarea – multi-line
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// EditableArray – comma-joined display; one item per row in edit
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// EditableKeyValueList – list of { [keyField]: string, [valField]: string }
// ─────────────────────────────────────────────────────────────
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