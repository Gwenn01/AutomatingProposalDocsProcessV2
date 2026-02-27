import type { BudgetLineItem, BudgetRows } from "@/utils/implementor-api";

export const BudgetTable = ({ rows, onChange }: { rows: BudgetRows; onChange: (v: BudgetRows) => void }) => {
  const handle = (cat: keyof BudgetRows, i: number, field: keyof BudgetLineItem, val: string) => {
    const updated = [...rows[cat]];
    updated[i] = { ...updated[i], [field]: val };
    if (field === 'cost' || field === 'qty') updated[i].amount = (Number(updated[i].cost) || 0) * (Number(updated[i].qty) || 0);
    onChange({ ...rows, [cat]: updated });
  };
  const total = (cat: keyof BudgetRows) => rows[cat].reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const grand = (['meals', 'transport', 'supplies'] as (keyof BudgetRows)[]).reduce((s, c) => s + total(c), 0);
  const cats: { key: keyof BudgetRows; label: string; color: string }[] = [
    { key: 'meals', label: 'A. Meals and Snacks', color: 'text-orange-700 bg-orange-50' },
    { key: 'transport', label: 'B. Transportation', color: 'text-blue-700 bg-blue-50' },
    { key: 'supplies', label: 'C. Supplies and Materials', color: 'text-purple-700 bg-purple-50' },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-900 text-white">{['Item', 'Cost (PHP)', 'Pax / Qty', 'Amount', ''].map((h, i) => <th key={i} className="px-5 py-3 text-left font-bold">{h}</th>)}</tr></thead>
        <tbody>
          {cats.map(({ key, label, color }) => (
            <>
              <tr key={`header-${key}`}><td colSpan={5} className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wide ${color}`}>{label}</td></tr>
              {rows[key].map((row, i) => (
                <tr key={`${key}-${i}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2"><input placeholder="Item description" value={row.item} onChange={(e) => handle(key, i, 'item', e.target.value)} className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" /></td>
                  <td className="px-4 py-2"><input type="number" placeholder="0.00" value={row.cost} onChange={(e) => handle(key, i, 'cost', e.target.value)} className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" /></td>
                  <td className="px-4 py-2"><input type="number" placeholder="0" value={row.qty} onChange={(e) => handle(key, i, 'qty', e.target.value)} className="w-full bg-transparent border-b border-gray-200 focus:border-emerald-500 outline-none text-sm" /></td>
                  <td className="px-4 py-2"><input readOnly value={row.amount ? `₱ ${Number(row.amount).toLocaleString()}` : ''} placeholder="₱ 0" className="w-full bg-gray-100 rounded px-2 py-1 text-sm font-medium text-gray-700 cursor-not-allowed" /></td>
                  <td className="px-2 py-2"><button onClick={() => onChange({ ...rows, [key]: rows[key].filter((_, idx) => idx !== i) })} className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
                </tr>
              ))}
              <tr key={`subtotal-${key}`} className="bg-gray-50"><td colSpan={3} className="px-5 py-2 font-bold text-gray-700 text-sm">Subtotal</td><td className="px-5 py-2 font-bold text-sm">₱ {total(key).toLocaleString()}</td><td /></tr>
              <tr key={`add-${key}`}><td colSpan={5} className="px-5 py-2"><button onClick={() => onChange({ ...rows, [key]: [...rows[key], { item: '', cost: '', qty: '', amount: '' }] })} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Row</button></td></tr>
            </>
          ))}
          <tr className="bg-emerald-700 text-white font-bold"><td colSpan={3} className="px-5 py-3">GRAND TOTAL</td><td className="px-5 py-3">₱ {grand.toLocaleString()}</td><td /></tr>
        </tbody>
      </table>
    </div>
  );
};
