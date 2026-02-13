import { createContext, useContext, useEffect, useState } from "react";
import { fetchMyProposals } from "../services/proposalService";

const ProposalContext = createContext();

export const ProposalProvider = ({ user, children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    setLoading(true);
    fetchMyProposals(user.user_id)
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <ProposalContext.Provider value={{ documents, loading }}>
      {children}
    </ProposalContext.Provider>
  );
};

export const useProposals = () => useContext(ProposalContext);
