export const CheckboxGroup = ({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <div className="grid grid-cols-1 gap-1.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-start gap-2.5 cursor-pointer group">
          <input type="checkbox" checked={selected.includes(opt)}
            onChange={(e) => { if (e.target.checked) onChange([...selected, opt]); else onChange(selected.filter((o) => o !== opt)); }}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0" />
          <span className="text-xs text-gray-700 group-hover:text-gray-900 leading-relaxed">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);