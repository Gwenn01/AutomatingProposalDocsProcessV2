import { 
  FileEdit, 
  Search, 
  ClipboardList, 
  FileCheck2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  type LucideIcon 
} from "lucide-react";

// The specific data structure for your Breakdown Grid
export interface WorkflowCardStyle {
  label: string;
  color: string;
  icon: LucideIcon;
  description: string;
}

export const getWorkflowCardStyle = (status: string): WorkflowCardStyle => {
  const styles: Record<string, WorkflowCardStyle> = {
    under_review: {
      label: "Under Review",
      color: "#f59e0b", // Amber
      icon: Search,
      description: "Waiting to be assigned"
    },
    for_review: {
      label: "For Review",
      color: "#0ea5e9", // Sky
      icon: ClipboardList,
      description: "Currently being reviewed"
    },
    for_revision: {
      label: "For Revision",
      color: "#f97316", // Orange
      icon: FileEdit,
      description: "Needs some updates"
    },
    for_approval: {
      label: "For Approval",
      color: "#6366f1", // Indigo
      icon: FileCheck2,
      description: "Waiting for final approval"
    },
    approved: {
      label: "Completed",
      color: "#10b981", // Emerald
      icon: CheckCircle,
      description: "All done & Closed"
    },
    rejected: {
      label: "Rejected",
      color: "#ef4444", // Red
      icon: XCircle,
      description: "Not accepted"
    }
  };

  return styles[status] || {
    label: status,
    color: "#94a3b8",
    icon: AlertCircle,
    description: "System status"
  };
};