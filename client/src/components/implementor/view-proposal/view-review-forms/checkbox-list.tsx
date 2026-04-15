import { CheckSquare, Square } from "lucide-react";

export const CheckboxList = ({
  items,
  checked,
}: {
  items: string[];
  checked: (item: string) => boolean;
}) => (
  <div className="space-y-1">
    {items.map((label) => (
      <div key={label} className="flex items-start gap-2 py-0.5">
        <span className="mt-0.5 shrink-0">
          {checked(label) ? (
            <CheckSquare className="w-4 h-4 text-green-600" />
          ) : (
            <Square className="w-4 h-4 text-gray-400" />
          )}
        </span>
        <span className="text-sm">{label}</span>
      </div>
    ))}
  </div>
);