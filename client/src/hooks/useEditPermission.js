// hooks/useEditPermission.js
import { useState, useEffect } from 'react';
import { proposalApi } from '../services/proposalApi';

export const useEditPermission = (proposalId, userId) => {
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    if (!proposalId || !userId) return;
    checkEditPermission();
  }, [proposalId, userId]);

  const checkEditPermission = async () => {
    try {
      const data = await proposalApi.checkUpdateProposal(proposalId, userId);
      console.log("Check Update Proposal Response:", data);
      
      setCanEdit(data.status);
      
      if (!data.status) {
        console.log("Note:", data.message);
      }
    } catch (err) {
      console.error("Failed to check update proposal:", err);
      setCanEdit(false);
    }
  };

  return { canEdit };
};