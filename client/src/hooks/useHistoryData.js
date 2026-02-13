// hooks/useHistoryData.js
import { useState } from 'react';
import { proposalApi } from '../services/proposalApi';
import { structureHistoryData } from '../utils/dataTransformers';

export const useHistoryData = (proposalData) => {
  const [selectedHistoryData, setSelectedHistoryData] = useState(null);
  const [loadingHistoryData, setLoadingHistoryData] = useState(false);
  const [isDocumentReady, setIsDocumentReady] = useState(false);

  const fetchHistoryData = async (historyId, status) => {
    try {
      setLoadingHistoryData(true);
      setIsDocumentReady(false);

      const data = await proposalApi.getData(historyId, status);
      const structuredData = structureHistoryData(data, proposalData, status, historyId);

      setSelectedHistoryData(structuredData);
      setIsDocumentReady(true);
    } catch (error) {
      console.error("Failed to fetch history data:", error);
      console.error("Error stack:", error.stack);
      alert("Failed to load history data. Please try again.");
    } finally {
      setLoadingHistoryData(false);
    }
  };

  return { 
    selectedHistoryData, 
    loadingHistoryData, 
    isDocumentReady, 
    fetchHistoryData,
    setSelectedHistoryData 
  };
};