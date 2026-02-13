// components/ReviewerModal/index.jsx
import React from 'react';
import { useProposalHistory } from '../../hooks/useProposalHistory';
import { useEditPermission } from '../../hooks/useEditPermission';
import { useHistoryData } from '../../hooks/useHistoryData';
import { useProposalEdit } from '../../hooks/useProposalEdit';
import { useAutoLoadCurrentVersion } from '../../hooks/useAutoLoadCurrentVersion';
import { useAutoInitializeEdit } from '../../hooks/useAutoInitializeEdit';
import { normalizeProposalData } from '../../utils/dataTransformers';
import { STATUS } from '../../constants/proposalConstants';

import Header from './ReviewerModal/components/Header';
import HistoryPanel from './ReviewerModal/components/HistoryPanel';
import CoverPageSection from './ReviewerModal/sections/CoverPageSection';
import ContentSection from './ReviewerModal/sections/ContentSection';
import LoadingState from './ReviewerModal/components/LoadingState';
import SaveModal from './ReviewerModal/components/SaveModal';

const ReviewerModal = ({ isOpen, onClose, proposalData }) => {
  if (!isOpen || !proposalData) return null;

  const proposalId = proposalData?.proposal_id;
 const storedUser = localStorage.getItem("user");
 const userId = storedUser ? JSON.parse(storedUser).user_id : null;

  // Custom hooks
  const { history, loading: historyLoading, fetchHistory, setHistory } = useProposalHistory(proposalId);
  const { canEdit } = useEditPermission(proposalId, userId);
  const { 
    selectedHistoryData, 
    loadingHistoryData, 
    isDocumentReady, 
    fetchHistoryData,
    setSelectedHistoryData 
  } = useHistoryData(proposalData);
  
  const { 
    isEditing, 
    editedData, 
    isSaving, 
    handleEdit, 
    handleCancel, 
    handleSave, 
    updateField,
    setEditedData
  } = useProposalEdit(proposalId, userId);

  // Auto-load current version when history is available
  useAutoLoadCurrentVersion(isOpen, history, selectedHistoryData, fetchHistoryData);

  // Auto-initialize editedData when entering edit mode
  useAutoInitializeEdit(isEditing, editedData, selectedHistoryData, proposalData, setEditedData);

  // Determine active data
  const activeData = (isEditing && editedData) 
    ? editedData 
    : (selectedHistoryData || proposalData);

  // Safety checks
  if (!activeData?.reviews_per_docs) {
    console.error("activeData or reviews_per_docs is undefined", { 
      activeData, 
      selectedHistoryData, 
      isEditing, 
      editedData, 
      proposalData 
    });
    return null;
  }

  const normalized = normalizeProposalData(activeData.reviews_per_docs);

  if (!normalized) {
    console.error("normalized data is null");
    return null;
  }

  // Handle edit button click
  const onEditClick = () => {
    const dataToEdit = selectedHistoryData || proposalData;
    handleEdit(dataToEdit);
  };

  // Handle save with history refresh
  const onSaveClick = async () => {
    await handleSave(selectedHistoryData, async () => {
      // Reload history after save
      const historyData = await fetchHistory();
      
      // Auto-load the new current version
      const currentVersion = historyData?.find(item => item.status === STATUS.CURRENT);
      if (currentVersion) {
        await fetchHistoryData(currentVersion.history_id, currentVersion.status);
      }
    });
  };

  const handleModalClose = () => {
    setSelectedHistoryData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-overlay-enter">
      <SaveModal isSaving={isSaving} />
      
      <div className="bg-white w-full max-w-5xl h-[95vh] rounded-bl-xl rounded-tl-xl shadow-2xl flex flex-col overflow-hidden">
        <Header
          title={proposalData.title}
          isHistorical={selectedHistoryData?.status === STATUS.HISTORY}
          canEdit={canEdit}
          isEditing={isEditing}
          isDocumentReady={isDocumentReady}
          isSaving={isSaving}
          onEdit={onEditClick}
          onSave={onSaveClick}
          onCancel={handleCancel}
        />

        <div className="p-14 overflow-auto bg-white">
          {!isDocumentReady ? (
            <LoadingState />
          ) : (
            <>
              <CoverPageSection
                normalized={normalized}
                isEditing={isEditing}
                updateField={updateField}
              />
              
              <ContentSection
                normalized={normalized}
                isEditing={isEditing}
                updateField={updateField}
                setEditedData={setEditedData}
              />
            </>
          )}
        </div>
      </div>

      <HistoryPanel
        history={history}
        loading={historyLoading}
        selectedHistoryData={selectedHistoryData}
        onHistorySelect={fetchHistoryData}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default ReviewerModal;
