
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
        <span className="mt-0.5 text-sm shrink-0">{checked(label) ? "☑" : "☐"}</span>
        <span className="text-sm">{label}</span>
      </div>
    ))}
  </div>
);