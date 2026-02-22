// Define all possible status values
export type ProposalStatus =
  | "submitted"
  | "for_review"
  | "under_review"
  | "final_review"
  | "for_approval"
  | "approved"
  | "for_revision"
  | "rejected"
  | string; // include string for any other fallback

// Define the return type
interface StatusStyle {
  label: string;
  className: string;
}

// Function with typed parameters and return
export const getStatusStyle = (status: ProposalStatus): StatusStyle => {
  switch (status) {
    case "submitted":
      return { label: "Initial Review", className: "bg-[#FFC107] text-white" };

    case "for_review":
      return { label: "For Review", className: "bg-[#38BDF8] text-white" };

    case "under_review":
      return { label: "Under Review", className: "bg-[#FFC107] text-white" };

    case "final_review":
      return { label: "Final Review", className: "bg-[#FBBF24] text-white" };

    case "for_approval":
      return { label: "For Approval", className: "bg-[#6366F1] text-white" };

    case "approved":
      return { label: "Completed", className: "bg-[#22C55E] text-white" };

    case "for_revision":
      return { label: "For Revision", className: "bg-[#F97316] text-white" };

    case "rejected":
      return { label: "Rejected", className: "bg-[#EF4444] text-white" };

    default:
      return { label: status, className: "bg-gray-400 text-white" };
  }
};


export const getStatusStyleAdmin = (status: ProposalStatus): StatusStyle => {
  switch (status) {
    case "submitted":
    case "under_review":
      return { 
        label: status === "submitted" ? "Initial Review" : "Under Review", 
        className: "bg-amber-100/60 text-amber-600 border-amber-200/50" 
      };
    case "for_review":
      return { 
        label: "For Review", 
        className: "bg-sky-100/60 text-sky-600 border-sky-200/50" 
      };
    case "final_review":
      return { 
        label: "Final Review", 
        className: "bg-yellow-100/60 text-yellow-700 border-yellow-200/50" 
      };
    case "for_approval":
      return { 
        label: "For Approval", 
        className: "bg-indigo-100/60 text-indigo-600 border-indigo-200/50" 
      };
    case "approved":
      return { 
        label: "Completed", 
        className: "bg-emerald-100/60 text-emerald-600 border-emerald-200/50" 
      };
    case "for_revision":
      return { 
        label: "For Revision", 
        className: "bg-orange-100/60 text-orange-600 border-orange-200/50" 
      };
    case "rejected":
      return { 
        label: "Rejected", 
        className: "bg-rose-100/60 text-rose-600 border-rose-200/50" 
      };
    default:
      return { 
        label: status, 
        className: "bg-slate-100/60 text-slate-500 border-slate-200/50" 
      };
  }
};