// components/ReviewerModal/components/HistoryPanel.jsx
import React from 'react';
import { X } from "lucide-react";
import { formatDateShort } from '../../../../utils/dateFormatters';

const HistoryPanel = ({ 
  history, 
  loading, 
  selectedHistoryData, 
  onHistorySelect, 
  onClose 
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="bg-white h-[95vh] w-1/5 max-w-2xl shadow-sm border border-gray-200 flex flex-col rounded-tr-xl rounded-br-xl">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">History</h2>
          <p className="text-xs text-gray-400 mt-1">Recent changes of proposal</p>
        </div>

        <button
          onClick={handleClose}
          className="p-3 bg-gray-200 rounded-full text-black hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <LoadingHistoryList />
        ) : history.length === 0 ? (
          <EmptyHistoryState />
        ) : (
          <HistoryList
            history={history}
            selectedHistoryData={selectedHistoryData}
            onHistorySelect={onHistorySelect}
          />
        )}
      </div>
    </div>
  );
};

const LoadingHistoryList = () => (
  <div className="px-2 py-2 space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-2 rounded-xl bg-gray-100">
        <div className="w-9 h-9 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
          <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyHistoryState = () => (
  <p className="text-sm text-gray-400 text-center py-10">
    No history available
  </p>
);

const HistoryList = ({ history, selectedHistoryData, onHistorySelect }) => (
  <div className="space-y-2">
    {history.map((item) => (
      <HistoryItem
        key={item.history_id}
        item={item}
        isSelected={selectedHistoryData?.history_id === item.history_id}
        onSelect={() => onHistorySelect(item.history_id, item.status)}
      />
    ))}
  </div>
);

const HistoryItem = ({ item, isSelected, onSelect }) => {
  const label = item.status === "current" 
    ? "Current Proposal" 
    : `Revise ${item.version_no}`;

  const formattedDate = formatDateShort(item.created_at);

  return (
    <div
      onClick={onSelect}
      className={`flex items-start gap-3 p-4 rounded-xl transition cursor-pointer ${
        isSelected
          ? 'bg-emerald-100 border-2 border-emerald-500'
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-semibold">
        V{item.version_no}
      </div>

      <div className="flex-1">
        <p className="text-sm text-gray-700 font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-1">
          Proposal ID {item.proposal_id} • {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default HistoryPanel;