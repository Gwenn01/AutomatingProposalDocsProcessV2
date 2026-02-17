
export const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
    <div className="flex items-center gap-3 p-6 border-b border-gray-100">
      <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <div className="p-6 md:p-8">{children}</div>
  </div>
);