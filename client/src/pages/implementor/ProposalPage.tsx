// ProposalPage.tsx
// Top-level page that switches between:
//   - "drafts" view  → <Drafts />
//   - "create" view  → <CreateProposal />  (new or editing a draft)
//
// Drop this file into your pages / routes directory and point your router at it.
// Example with react-router: <Route path="/proposals/create" element={<ProposalPage />} />

import { useState } from 'react';
import CreateProposal from '@/pages/implementor/CreateProposal';
import Drafts from '@/pages/implementor/Drafts';

type View =
  | { mode: 'create'; draftId?: string }   // new proposal or editing a draft
  | { mode: 'drafts' };                    // drafts list

export default function ProposalPage() {
  const [view, setView] = useState<View>({ mode: 'create' });

  if (view.mode === 'drafts') {
    return (
      <Drafts
        onEditDraft={(draftId) => setView({ mode: 'create', draftId })}
        onNewProposal={() => setView({ mode: 'create' })}
      />
    );
  }

  return (
    <CreateProposal
      key={view.draftId ?? 'new'}      // remount when switching drafts
      draftId={view.draftId ?? null}
      onGoToDrafts={() => setView({ mode: 'drafts' })}
      onSubmitSuccess={() => setView({ mode: 'drafts' })}
    />
  );
}