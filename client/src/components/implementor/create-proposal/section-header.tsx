
export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-5">
    <h3 className="text-2xl font-bold text-white">{title}</h3>
    {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
  </div>
);
