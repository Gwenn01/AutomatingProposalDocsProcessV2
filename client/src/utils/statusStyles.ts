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
