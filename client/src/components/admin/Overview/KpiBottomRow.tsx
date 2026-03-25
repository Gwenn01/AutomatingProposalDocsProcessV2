import { BookOpen, FolderKanban, Activity } from "lucide-react";

interface KpiBottomRowProps {
  totalProgram: number;
  totalProject: number;
  totalActivity: number;
}

const KpiBottomRow = ({
  totalProgram,
  totalProject,
  totalActivity,
}: KpiBottomRowProps) => {
  const cards = [
    {
      label: "Programs",
      subLabel: "Program Proposals",
      value: totalProgram,
      valueClass: "text-indigo-600",
      icon: BookOpen,
      iconBg: "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
      glow: "bg-indigo-500/15",
    },
    {
      label: "Projects",
      subLabel: "Project Proposals",
      value: totalProject,
      valueClass: "text-emerald-600",
      icon: FolderKanban,
      iconBg: "bg-emerald-50 text-emerald-600 ring-emerald-500/10",
      glow: "bg-emerald-500/15",
    },
    {
      label: "Activities",
      subLabel: "Activity Proposals",
      value: totalActivity,
      valueClass: "text-amber-600",
      icon: Activity,
      iconBg: "bg-amber-50 text-amber-600 ring-amber-500/10",
      glow: "bg-amber-500/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-[2rem] bg-white/40 p-8 backdrop-blur-md border border-white/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.04)]"
          >
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${card.glow} blur-2xl`}
            />
            <div className="relative z-10">
              <div
                className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-inset ${card.iconBg}`}
              >
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  {card.label}
                </p>
                <h3
                  className={`mt-1 text-4xl font-extrabold tracking-tighter tabular-nums ${card.valueClass}`}
                >
                  {card.value}
                </h3>
                <p className="mt-1 text-[13px] font-medium text-slate-400">
                  {card.subLabel}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiBottomRow;
