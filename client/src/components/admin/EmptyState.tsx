import { FileText, type LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon; // default icon if none provided
  message?: string;   // default message if none provided
}

const EmptyState = ({ icon: Icon = FileText, message = "No items found" }: Props) => {
  return (
    <div className="py-24 text-center bg-slate-50/50 rounded-[24px] border-2 border-dashed border-slate-100 mt-4">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-slate-200" />
      </div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;