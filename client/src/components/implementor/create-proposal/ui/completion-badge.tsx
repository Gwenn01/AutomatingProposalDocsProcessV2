export const CompletionBadge = ({ pct }: { pct: number }) => {
  const color = pct === 100 ? 'bg-emerald-500 text-white' : pct >= 60 ? 'bg-amber-400 text-amber-900' : 'bg-red-100 text-red-600';
  return <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{pct === 100 ? '✓ Complete' : `${pct}%`}</span>;
};