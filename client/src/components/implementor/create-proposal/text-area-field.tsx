
export const TextAreaField: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
}> = ({ value, onChange, rows = 6, placeholder = '' }) => (
  <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none
      focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none" />
);
