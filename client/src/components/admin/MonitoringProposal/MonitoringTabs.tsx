import React from "react";
import { ClipboardList, Wallet, Lock } from "lucide-react";
import type { ActiveTab } from "./types";

type Tab = {
  key: ActiveTab;
  label: string;
  icon: React.ElementType;
};

// Replaced emojis with modern SVG icons
const TABS: Tab[] = [
  { key: "proposals", label: "Progress", icon: ClipboardList },
  { key: "budget", label: "Budget", icon: Wallet },
  { key: "access", label: "Access", icon: Lock },
];

type Props = {
  active: ActiveTab;
  onChange: (tab: ActiveTab) => void;
};

const MonitoringTabs = ({ active, onChange }: Props) => (
  // Softer background and border for a modern segmented control look
  <div className="inline-flex p-1 space-x-1 bg-gray-100 border border-gray-200 rounded-xl w-fit">
    {TABS.map(({ key, label, icon: Icon }) => {
      const isActive = active === key;

      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg 
            transition-all duration-200 ease-out outline-none
            focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
            ${
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            }
          `}
        >
          <Icon
            className={`w-4 h-4 transition-colors ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`}
            strokeWidth={isActive ? 2.5 : 2}
          />
          {label}
        </button>
      );
    })}
  </div>
);

export default MonitoringTabs;
