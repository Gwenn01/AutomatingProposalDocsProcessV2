import { VersionHistoryItem } from ".";

export const HistoryPanel: React.FC<{
  activeHistory: any[];
  historyLoading: boolean;
  selectedHistoryVersion: any;
  onSelectVersion: (item: any) => void;
}> = ({ activeHistory, historyLoading, selectedHistoryVersion, onSelectVersion }) => (
  <div
    style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    className="bg-white h-full w-72 flex-shrink-0 flex flex-col border-l border-gray-100"
  >
    {/* Panel header */}
    <div className="px-5 pt-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-base font-semibold text-gray-900 tracking-tight">
          Version History
        </span>
        {!historyLoading && activeHistory.length > 0 && (
          <span className="ml-auto text-[10px] font-semibold bg-gray-100 text-gray-400 rounded-full px-2 py-0.5">
            {activeHistory.length}
          </span>
        )}
      </div>
      <p className="text-[11px] text-gray-400 leading-tight">
        Track changes to this proposal
      </p>
    </div>

    {/* History list */}
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
      {historyLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-5 h-5 border-[2.5px] border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 tracking-wide">Loading history…</p>
        </div>
      ) : activeHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <svg
            className="w-8 h-8 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
          <p className="text-xs text-gray-400 text-center">
            No history available yet
          </p>
        </div>
      ) : (
        activeHistory.map((item, index) => (
          <VersionHistoryItem
            key={item.history_id}
            item={item}
            index={index}
            total={activeHistory.length}
            isSelected={selectedHistoryVersion?.history_id === item.history_id}
            onClick={() => onSelectVersion(item)}
          />
        ))
      )}
    </div>
  </div>
);