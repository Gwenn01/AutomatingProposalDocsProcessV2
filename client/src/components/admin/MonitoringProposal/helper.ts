// ─────────────────────────────────────────────────────────────────────────────
// monitoring/helpers.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { ProposalType, YearConfig, ImplementorLock } from "./types";

// ── Progress ──────────────────────────────────────────────────────────────────
export const getProgress = (status: string): number => {
  switch (status) {
    case "draft":
      return 10;
    case "submitted":
      return 25;
    case "under_review":
      return 50;
    case "for_revision":
      return 60;
    case "for_approval":
      return 80;
    case "approved":
      return 100;
    default:
      return 0;
  }
};

// ── Currency formatter ────────────────────────────────────────────────────────
export const formatBudget = (n: number): string =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

// ── Type badge classes ────────────────────────────────────────────────────────
export const TYPE_BADGE: Record<ProposalType, string> = {
  Program: "bg-violet-50 text-violet-700 border-violet-200",
  Project: "bg-sky-50    text-sky-700    border-sky-200",
  Activity: "bg-amber-50  text-amber-700  border-amber-200",
};

// ── Progress bar color ────────────────────────────────────────────────────────
export const progressColor = (pct: number): string => {
  if (pct === 100) return "bg-emerald-500";
  if (pct >= 60) return "bg-indigo-400";
  if (pct >= 30) return "bg-amber-400";
  return "bg-slate-300";
};

// ── Mock data ─────────────────────────────────────────────────────────────────
export const MOCK_YEAR_CONFIG: Record<number, YearConfig> = {
  2024: {
    year: 2024,
    total_budget: 5_000_000,
    used_budget: 3_820_000,
    is_locked: false,
  },
  2025: {
    year: 2025,
    total_budget: 6_500_000,
    used_budget: 1_200_000,
    is_locked: false,
  },
  2026: {
    year: 2026,
    total_budget: 7_000_000,
    used_budget: 420_000,
    is_locked: true,
  },
};

export const MOCK_IMPLEMENTORS: ImplementorLock[] = [
  {
    user_id: 1,
    name: "Maria Santos",
    email: "maria@ext.edu",
    is_locked: false,
    proposals_count: 5,
    total_budget_used: 820_000,
    has_pending_budget_request: false,
  },
  {
    user_id: 2,
    name: "Jose Reyes",
    email: "jose@ext.edu",
    is_locked: false,
    proposals_count: 3,
    total_budget_used: 360_000,
    has_pending_budget_request: true,
  },
  {
    user_id: 3,
    name: "Ana Cruz",
    email: "ana@ext.edu",
    is_locked: true,
    proposals_count: 8,
    total_budget_used: 1_240_000,
    has_pending_budget_request: false,
  },
  {
    user_id: 4,
    name: "Ben Torres",
    email: "ben@ext.edu",
    is_locked: false,
    proposals_count: 2,
    total_budget_used: 190_000,
    has_pending_budget_request: false,
  },
  {
    user_id: 5,
    name: "Lea Mendoza",
    email: "lea@ext.edu",
    is_locked: false,
    proposals_count: 6,
    total_budget_used: 970_000,
    has_pending_budget_request: true,
  },
];
