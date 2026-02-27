import { CalendarCheck, Check, ClipboardList, FolderKanban } from "lucide-react";

export const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { label: "Program", icon: ClipboardList },
    { label: "Projects", icon: FolderKanban },
    { label: "Activities", icon: CalendarCheck },
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = currentStep === stepNum;
        const isDone = currentStep > stepNum;
        const Icon = step.icon;

        return (
          <div key={i} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  relative flex items-center justify-center
                  w-11 h-11 rounded-full
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-emerald-600 text-white scale-110 shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
                      : isDone
                      ? "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-400"
                      : "bg-gray-100 text-gray-400 ring-2 ring-gray-200"
                  }
                `}
              >
                {isDone ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <Icon
                    className={`w-5 h-5 transition-all
                      ${isActive ? "stroke-[2.5]" : "stroke-[2]"}
                    `}
                  />
                )}

                {/* Active glow */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-emerald-400 blur-md opacity-30 -z-10" />
                )}
              </div>

              <span
                className={`text-xs font-medium tracking-wide transition-colors
                  ${
                    isActive
                      ? "text-emerald-700"
                      : isDone
                      ? "text-emerald-500"
                      : "text-gray-400"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div className="relative mx-3 mb-6">
                <div className="w-20 h-[2px] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500
                      ${
                        currentStep > stepNum
                          ? "w-full bg-emerald-400"
                          : "w-0 bg-emerald-400"
                      }
                    `}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};