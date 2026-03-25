import { BookOpen, FolderKanban, Activity } from "lucide-react";

interface KpiBottomRowProps {
  totalProgram?: number;
  totalProject?: number;
  totalActivity?: number;
}

const KpiBottomRow = ({
  totalProgram = 0,
  totalProject = 0,
  totalActivity = 0,
}: KpiBottomRowProps) => {
  const cards = [
    {
      label: "Programs",
      subLabel: "Program Proposals",
      value: totalProgram,
      valueClass: "text-primaryGreen",
      icon: BookOpen,
      iconBg: "bg-primaryGreen/10 text-primaryGreen",
      glow: "bg-primaryGreen/10",
    },
    {
      label: "Projects",
      subLabel: "Project Proposals",
      value: totalProject,
      valueClass: "text-primaryGreen",
      icon: FolderKanban,
      iconBg: "bg-primaryGreen/10 text-primaryGreen",
      glow: "bg-primaryGreen/10",
    },
    {
      label: "Activities",
      subLabel: "Activity Proposals",
      value: totalActivity,
      valueClass: "text-primaryGreen",
      icon: Activity,
      iconBg: "bg-primaryGreen/10 text-primaryGreen",
      glow: "bg-primaryGreen/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl bg-white p-8 border border-slate-100 shadow-sm"
          >
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${card.glow} blur-2xl`}
            />
            <div className="relative z-10">
              <div
                className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-[11px] tracking-[0.15em] uppercase text-slate-400">
                  {card.label}
                </p>
                <h3
                  className={`mt-1 text-4xl font-bold tracking-tight tabular-nums ${card.valueClass}`}
                >
                  {card.value.toLocaleString()}
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
