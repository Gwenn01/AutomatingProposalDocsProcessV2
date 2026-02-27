import type { ExpectedOutput6Ps } from "@/utils/implementor-api";

export const ExpectedOutputTable = ({ data, onChange }: { data: ExpectedOutput6Ps; onChange: (v: ExpectedOutput6Ps) => void }) => {
  const rows: { label: string; key: keyof ExpectedOutput6Ps }[] = [
    { label: 'Publications', key: 'publications' }, { label: 'Patents / IP', key: 'patents' },
    { label: 'Products', key: 'products' }, { label: 'People Services', key: 'people_services' },
    { label: 'Places and Partnerships', key: 'places_partnerships' }, { label: 'Policy', key: 'policy' },
    { label: 'Social Impact', key: 'social_impact' }, { label: 'Economic Impact', key: 'economic_impact' },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50 border-b-2 border-emerald-500"><th className="px-5 py-3 text-left font-bold text-gray-900 w-48">6P's Category</th><th className="px-5 py-3 text-left font-bold text-gray-900">Expected Output</th></tr></thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(({ label, key }) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-semibold text-gray-700 bg-gray-50/60">{label}</td>
              <td className="px-5 py-3"><input className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={data[key]} onChange={(e) => onChange({ ...data, [key]: e.target.value })} placeholder={`Enter ${label.toLowerCase()}...`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};