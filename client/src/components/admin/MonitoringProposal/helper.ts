// ─────────────────────────────────────────────────────────────────────────────
// monitoring/helpers.ts
// ─────────────────────────────────────────────────────────────────────────────

import type { ProposalType } from "./types";

// ── Progress ──────────────────────────────────────────────────────────────────
export const getProgress = (progress: string | number): number => {
  if (typeof progress === "string") {
    return parseFloat(progress) || 0;
  }
  return progress;
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
