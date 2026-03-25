import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  itemsPerPage: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}

const AdminPagination = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPrev,
  onNext,
}: AdminPaginationProps) => {
  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-6 bg-slate-50/50 rounded-[24px] border border-slate-100/80">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-1 overflow-hidden">
          <div className="h-2 w-8 rounded-full bg-indigo-500/20" />
        </div>
        <span className="text-[13px] text-slate-500 font-medium tracking-tight">
          Showing{" "}
          <span className="text-slate-900 font-bold">{startIndex + 1}</span>
          <span className="mx-1 opacity-40">—</span>
          <span className="text-slate-900 font-bold">
            {Math.min(endIndex, totalItems)}
          </span>{" "}
          of{" "}
          <span className="text-slate-900 font-bold">{totalItems}</span>{" "}
          items
        </span>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200/60 shadow-sm">
          <span className="text-[11px] uppercase font-black tracking-widest text-slate-400 ml-1">
            Page
          </span>
          <span className="text-sm font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">
            {currentPage}
          </span>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mr-1">
            of {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className="group flex items-center gap-2.5 pl-3.5 pr-5 h-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-sm"
            title="Previous Page"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform duration-300"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Prev
            </span>
          </button>

          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="group flex items-center gap-2.5 pl-5 pr-3.5 h-10 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md shadow-slate-900/5 hover:shadow-indigo-500/20"
            title="Next Page"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Next
            </span>
            <ChevronRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPagination;