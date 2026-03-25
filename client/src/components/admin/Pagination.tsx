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
  onItemsPerPageChange?: (count: number) => void;
  itemName?: string;
}

const AdminPagination = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPrev,
  onNext,
  itemName = "items", // default fallback
}: AdminPaginationProps) => {
  if (totalItems === 0) return null;

  return (
    <div className="shrink-0 border-t border-gray-100 bg-white py-4 flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-8 rounded-b-2xl">

      {/* Left: Info */}
      <span className="text-sm text-gray-500 text-center md:text-left">
        {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} {itemName}
      </span>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-colors ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]"
            }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-sm font-medium text-gray-700 px-2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-colors ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF]"
            }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;