import type { OrgStaffingItem } from "@/api/implementor-api";

export const OrgStaffingTable = ({ rows, onChange }: { rows: OrgStaffingItem[]; onChange: (v: OrgStaffingItem[]) => void }) => {
  const update = (i: number, field: keyof OrgStaffingItem, value: string) => {
    const u = [...rows]; u[i] = { ...u[i], [field]: value }; onChange(u);
  };

  return (
    <div className="rounded-md border border-[#dce8f0] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-200 border-b border-[#dce8f0] ">
            <th className="text-left px-4 py-3 font-semibold text-base w-1/2">
              Key Person
            </th>
            <th className="text-left px-4 py-3 font-semibold text-base w-1/2">
              Role / Responsibility
            </th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {rows.map((item, i) => (
            <tr key={i} className="border-b border-[#f0f4f8] last:border-0 hover:bg-[#f8fbfd] group">
              <td className="px-3 py-2 align-top">
                <textarea
                  value={item.designation}
                  onChange={(e) => { update(i, "designation", e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                  onFocus={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                  placeholder="Full name"
                  rows={1}
                  className="w-full bg-transparent border-b border-transparent focus:border-[#1a3a5c] focus:outline-none text-[#1a2b3c] placeholder:text-gray-400 py-1 transition-colors resize-none overflow-hidden leading-relaxed"
                />
              </td>
              <td className="px-3 py-2 align-top">
                <textarea
                  value={item.terms}
                  onChange={(e) => { update(i, "terms", e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                  onFocus={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                  placeholder="Describe role / responsibility"
                  rows={1}
                  className="w-full bg-transparent border-b border-transparent focus:border-[#1a3a5c] focus:outline-none text-[#1a2b3c] placeholder:text-gray-400 py-1 transition-colors resize-none overflow-hidden leading-relaxed"
                />
              </td>
              <td className="pr-2">
                <button
                  onClick={() => { if (rows.length > 1) onChange(rows.filter((_, idx) => idx !== i)); }}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[#c5d3df] hover:text-red-400 rounded transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-4 py-3 border-t border-[#f0f4f8]">
        <button
          onClick={() => onChange([...rows, { designation: "", terms: "" }])}
          className="flex items-center gap-1.5 text-[11px] font-bold text-[#1a3a5c] border border-dashed border-[#c5d3df] hover:border-[#1a3a5c] hover:bg-[#f0f6fa] px-3 py-1.5 rounded-lg transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
      </div>
    </div>
  );
};