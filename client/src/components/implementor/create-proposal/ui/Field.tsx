interface FieldProps { label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; readOnly?: boolean; }

export const Field = ({ label, type = 'text', value, onChange, placeholder, required, readOnly }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
    <input type={type} value={value} onChange={onChange} readOnly={readOnly}
      placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
      className={`border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-300 transition-all
        ${readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : required && !value?.trim() ? 'bg-red-50/30 border-red-200' : 'bg-gray-50 border-gray-200'}`}
    />
  </div>
);