// hooks/useProposalEdit.js
import { useState, useCallback } from 'react';
import { proposalApi } from '../services/proposalApi';
import { preparePayloadForSave } from '../utils/dataTransformers';

export const useProposalEdit = (proposalId, userId) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = useCallback((dataToEdit) => {
    if (!dataToEdit) {
      console.error("No data available to edit");
      return;
    }
    
    const clonedData = JSON.parse(JSON.stringify(dataToEdit));
    console.log("Setting editedData with:", clonedData);
    
    setEditedData(clonedData);
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setEditedData(null);
    setIsEditing(false);
  }, []);

  const updateField = useCallback((path, value) => {
    setEditedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const handleSave = async (selectedHistoryData, onSaveSuccess) => {
    try {
      setIsSaving(true);

      if (!editedData?.proposal_id) {
        alert("Error: Missing proposal ID");
        return;
      }

      if (!userId) {
        alert("Error: User not logged in");
        return;
      }

      const contentId = selectedHistoryData?.content_id || editedData?.content_id;
      const coverId = selectedHistoryData?.cover_id || editedData?.cover_id;

      if (!contentId || !coverId) {
        alert("Error: Missing content or cover ID. Please reload the document.");
        return;
      }

      const cleanedData = preparePayloadForSave(editedData, userId, contentId, coverId);
      console.log("✅ Saving cleaned data:", cleanedData);

      const result = await proposalApi.updateProposalDocs(cleanedData);
      console.log("✅ Update success:", result);

      alert("Changes saved successfully!");
      
      setIsEditing(false);
      setEditedData(null);
      
      // Call the success callback to refresh history
      if (onSaveSuccess) {
        await onSaveSuccess();
      }

    } catch (error) {
      console.error("❌ Save error:", error);
      alert(`Save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    editedData,
    isSaving,
    handleEdit,
    handleCancel,
    handleSave,
    updateField,
    setEditedData
  };
};