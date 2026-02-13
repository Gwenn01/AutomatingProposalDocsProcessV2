// services/proposalApi.js
import { API_BASE_URL } from '../constants/proposalConstants';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error:", errorText);
    
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || errorText);
    } catch (parseError) {
      throw new Error(errorText);
    }
  }
  return response.json();
};

export const proposalApi = {
  getHistory: async (proposalId) => {
    const response = await fetch(`${API_BASE_URL}/get-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: proposalId }),
    });
    return handleResponse(response);
  },

  checkUpdateProposal: async (proposalId, userId) => {
    const response = await fetch(`${API_BASE_URL}/check-update-proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: proposalId, user_id: userId }),
    });
    return handleResponse(response);
  },

  getData: async (historyId, status) => {
    const response = await fetch(`${API_BASE_URL}/get-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history_id: historyId, status }),
    });
    return handleResponse(response);
  },

  updateProposalDocs: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/update-proposal-docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },
};