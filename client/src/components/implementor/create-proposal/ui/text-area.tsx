interface TextAreaProps { label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; placeholder?: string; required?: boolean; }

export const TextArea = ({ label, value, onChange, rows = 5, placeholder, required }: TextAreaProps) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>}
    <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
      className={`border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-gray-300 transition-all resize-none
        ${required && !value?.trim() ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-gray-50'}`}
    />
  </div>
);