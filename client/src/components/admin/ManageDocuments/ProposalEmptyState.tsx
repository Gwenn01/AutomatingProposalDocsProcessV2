import { FileText } from "lucide-react";

const ProposalsEmptyState = () => {
  return (
    <div className="py-24 text-center">
      <FileText size={40} className="text-slate-200 mx-auto mb-4" />
      <p className="text-slate-400 uppercase text-xs font-bold tracking-widest">
        No proposals found
      </p>
    </div>
  );
};

export default ProposalsEmptyState;