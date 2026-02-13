// hooks/useAutoInitializeEdit.js
import { useEffect } from 'react';

export const useAutoInitializeEdit = (
  isEditing,
  editedData,
  selectedHistoryData,
  proposalData,
  setEditedData
) => {
  useEffect(() => {
    if (isEditing && !editedData && (selectedHistoryData || proposalData)) {
      const dataToEdit = selectedHistoryData || proposalData;
      const clonedData = JSON.parse(JSON.stringify(dataToEdit));
      console.log("Auto-initializing editedData:", clonedData);
      setEditedData(clonedData);
    }
  }, [isEditing, editedData, selectedHistoryData, proposalData, setEditedData]);
};