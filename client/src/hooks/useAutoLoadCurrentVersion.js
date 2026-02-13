// hooks/useAutoLoadCurrentVersion.js
import { useEffect } from 'react';
import { STATUS } from '../constants/proposalConstants';

export const useAutoLoadCurrentVersion = (
  isOpen,
  history,
  selectedHistoryData,
  fetchHistoryData
) => {
  useEffect(() => {
    if (!isOpen || !history.length || selectedHistoryData) return;

    const currentVersion = history.find(item => item.status === STATUS.CURRENT);
    
    if (currentVersion) {
      console.log("Auto-loading current version:", currentVersion);
      fetchHistoryData(currentVersion.history_id, currentVersion.status);
    }
  }, [history, isOpen, selectedHistoryData, fetchHistoryData]);
};