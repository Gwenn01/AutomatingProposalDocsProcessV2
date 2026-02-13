// hooks/useProposalHistory.js
import { useState, useEffect } from 'react';
import { proposalApi } from '../services/proposalApi';

export const useProposalHistory = (proposalId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!proposalId) return;
    fetchHistory();
  }, [proposalId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await proposalApi.getHistory(proposalId);
      
      console.log("Fetched history data:", data);

      if (Array.isArray(data)) {
        const mappedHistory = data.map(item => ({
          history_id: item.history_id,
          proposal_id: item.proposal_id,
          status: item.status,
          version_no: item.version_no,
          created_at: item.created_at,
        })).sort((a, b) => a.history_id - b.history_id);

        setHistory(mappedHistory);
        console.log("Mapped history:", mappedHistory);
      } else {
        console.error("Expected array but got:", typeof data);
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, fetchHistory, setHistory };
};