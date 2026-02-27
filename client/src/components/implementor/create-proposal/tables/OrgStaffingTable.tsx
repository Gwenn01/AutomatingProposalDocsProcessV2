import type { OrgStaffingItem } from "@/utils/implementor-api";

export const OrgStaffingTable = ({ rows, onChange }: { rows: OrgStaffingItem[]; onChange: (v: OrgStaffingItem[]) => void }) => {
  const update = (i: number, field: keyof OrgStaffingItem, value: string) => { const u = [...rows]; u[i] = { ...u[i], [field]: value }; onChange(u); };
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-[1fr_1.5fr_1.5fr_32px] px-4 py-3 bg-gray-100 border-b-2 border-emerald-500 text-xs font-bold text-gray-900 gap-3">
        <span>Activity / Role</span><span>Designation / Name</span><span>Terms of Reference</span><span />
      </div>
      {rows.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.5fr_1.5fr_32px] gap-3 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 items-start">
          <input value={item.activity} onChange={(e) => update(i, 'activity', e.target.value)} placeholder="Activity / role" className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-gray-800" />
          <textarea rows={2} value={item.designation} onChange={(e) => update(i, 'designation', e.target.value)} placeholder="Full name" className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
          <textarea rows={2} value={item.terms} onChange={(e) => update(i, 'terms', e.target.value)} placeholder="Terms of reference" className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs resize-none outline-none focus:ring-2 focus:ring-emerald-500" />
          <button onClick={() => { if (rows.length > 1) onChange(rows.filter((_, idx) => idx !== i)); }} className="mt-1 w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
      <div className="p-4">
        <button onClick={() => onChange([...rows, { activity: '', designation: '', terms: '' }])} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Row
        </button>
      </div>
    </div>
  );
};