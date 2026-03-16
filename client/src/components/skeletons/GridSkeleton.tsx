import React from "react";

// ── Reusable shimmer bone ─────────────────────────────────────────────────────
const Bone: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

// ── Single card skeleton — mirrors the real grid card exactly ─────────────────
const ProposalCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-[32px] p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border flex flex-col justify-between h-full">
    {/* Top section */}
    <div>
      {/* Status badge — matches <span className="px-4 py-2.5 rounded-full …"> */}
      <div className="flex justify-between items-start mb-5">
        <Bone className="h-9 w-28 rounded-full" />
      </div>

      {/* Title — text-base font-bold */}
      <Bone className="h-4 w-[80%] mb-2" />
      <Bone className="h-4 w-[55%] mb-3" />

      {/* Implementor line */}
      <Bone className="h-3 w-[60%] mb-3" />

      {/* Review status chip — the orange/green/red bordered chip */}
      <Bone className="h-9 w-full rounded-md mb-3" />
    </div>

    {/* Bottom section */}
    <div>
      {/* Assigned Date */}
      <Bone className="h-3 w-[50%] mb-5" />

      {/* Action buttons: View | Review | Users */}
      <div className="flex space-x-3">
        <Bone className="flex-1 h-10 rounded-md" />
        <Bone className="flex-1 h-10 rounded-md" />
        <Bone className="h-10 w-10 flex-none rounded-md" />
      </div>
    </div>
  </div>
);

// ── Main skeleton — mirrors ReviewProposal's full layout ──────────────────────
const GridSkeleton: React.FC = () => (
  <div className="flex-1 bg-white min-h-screen font-sans">
    <div className="">

      {/* Header row: "Review Proposal" title + notification bell */}
      <div className="flex justify-between items-center mb-8">
        <Bone className="h-9 w-56" />
        <Bone className="h-9 w-9 rounded-full" />
      </div>

      {/* Controls row */}
      <div className="flex flex-col xl:flex-row justify-between items-center mb-8 space-y-6 xl:space-y-0">
        {/* Search bar */}
        <Bone className="h-12 w-full xl:w-96 rounded-full" />

        <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto justify-between xl:justify-end">
          {/* Filter tabs: All | Completed | Pending Evaluation */}
          <div className="flex space-x-8">
            <Bone className="h-4 w-16" />
            <Bone className="h-4 w-24" />
            <Bone className="h-4 w-36" />
          </div>

          {/* Grid / Table toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
            <Bone className="h-9 w-9 rounded-lg" />
            <Bone className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Card grid — 1 col → 2 col (md) → 3 col (xl), matching real layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProposalCardSkeleton key={i} />
        ))}
      </div>

    </div>
  </div>
);

export default GridSkeleton;