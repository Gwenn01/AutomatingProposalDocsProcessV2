import { defaultWorkplanRow } from "@/constants/defaults";
import type { WorkplanRow } from "@/utils/implementor-api";

export const WorkplanTable = ({ rows, onChange }: { rows: WorkplanRow[]; onChange: (v: WorkplanRow[]) => void }) => {
  const update = (i: number, key: keyof WorkplanRow, val: any) => { const u = [...rows]; (u[i] as any)[key] = val; onChange(u); };
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[100px]">Objective</th>
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[100px]">Activity</th>
            <th rowSpan={2} className="px-3 py-2 border border-gray-300 text-left font-bold min-w-[90px]">Expected Output</th>
            {['Year 1', 'Year 2', 'Year 3'].map((y) => <th key={y} colSpan={4} className="px-3 py-2 border border-gray-300 text-center font-bold">{y}</th>)}
            <th rowSpan={2} className="px-2 py-2 border border-gray-300 w-8" />
          </tr>
          <tr className="bg-gray-50">{[1, 2, 3].map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => <th key={`${yr}-${q}`} className="px-2 py-1 border border-gray-300 text-center font-semibold w-8">{q}</th>))}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-2 py-2"><textarea rows={2} value={row.objective} onChange={(e) => update(i, 'objective', e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Objective..." /></td>
              <td className="border border-gray-200 px-2 py-2"><textarea rows={2} value={row.activity} onChange={(e) => update(i, 'activity', e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Activity..." /></td>
              <td className="border border-gray-200 px-2 py-2"><textarea rows={2} value={row.expected_output} onChange={(e) => update(i, 'expected_output', e.target.value)} className="w-full bg-transparent outline-none resize-none text-xs" placeholder="Output..." /></td>
              {[1, 2, 3].map((yr) => ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => { const key = `year${yr}_${q.toLowerCase()}` as keyof WorkplanRow; return <td key={`${yr}-${q}`} className="border border-gray-200 px-2 py-2 text-center"><input type="checkbox" checked={row[key] as boolean} onChange={(e) => update(i, key, e.target.checked)} className="rounded text-emerald-600 focus:ring-emerald-500" /></td>; }))}
              <td className="border border-gray-200 px-2 py-2 text-center"><button onClick={() => { if (rows.length > 1) onChange(rows.filter((_, idx) => idx !== i)); }} className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-500 rounded transition-all mx-auto"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4"><button onClick={() => onChange([...rows, defaultWorkplanRow()])} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Row</button></div>
    </div>
  );
};