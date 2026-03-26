// Drafts.tsx  — list + manage saved proposal drafts
import { useState, useEffect, useCallback } from 'react';
import { draftDb, type DraftRecord } from '@/types/draft-db';

interface DraftsProps {
  /** Called when the user clicks "Edit" on a draft — parent swaps to CreateProposal */
  onEditDraft: (draftId: string) => void;
  /** Called when the user wants to start a brand-new proposal */
  onNewProposal: () => void;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const STEP_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Program', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  2: { label: 'Projects', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  3: { label: 'Activities', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

export default function Drafts({ onEditDraft, onNewProposal }: DraftsProps) {
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const reload = useCallback(() => setDrafts(draftDb.list()), []);

  useEffect(() => { reload(); }, [reload]);

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = (id: string) => {
    draftDb.delete(id);
    setDeletingId(null);
    reload();
  };

  const filtered = search.trim()
    ? drafts.filter((d) => d.program_title.toLowerCase().includes(search.toLowerCase()))
    : drafts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Saved Drafts</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {drafts.length === 0
                ? 'No drafts yet — start a proposal and save it for later.'
                : `${drafts.length} draft${drafts.length !== 1 ? 's' : ''} saved locally on this device.`}
            </p>
          </div>
          <button
            onClick={onNewProposal}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Proposal
          </button>
        </div>

        {/* ── Search ── */}
        {drafts.length > 0 && (
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drafts..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
        )}

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-lg">{search ? 'No matching drafts' : 'No drafts yet'}</p>
              <p className="text-gray-400 text-sm mt-1">
                {search ? 'Try a different search term.' : 'Start a proposal and click "Save Draft" to come back later.'}
              </p>
            </div>
            {!search && (
              <button
                onClick={onNewProposal}
                className="mt-2 text-emerald-600 font-semibold text-sm hover:underline">
                Create your first proposal →
              </button>
            )}
          </div>
        )}

        {/* ── Draft cards ── */}
        <div className="grid gap-4">
          {filtered.map((draft) => {
            const stepInfo = STEP_LABELS[draft.step] ?? STEP_LABELS[1];
            return (
              <div
                key={draft.id}
                className="group bg-white border border-gray-200 hover:border-emerald-300 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Left — icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {/* Middle — info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-base truncate">{draft.program_title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${stepInfo.bg} ${stepInfo.color}`}>
                      Step {draft.step}: {stepInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Last edited {timeAgo(draft.updated_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created {new Date(draft.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-mono text-gray-300">#{draft.id.slice(0, 8)}</span>
                  </div>
                </div>

                {/* Right — actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEditDraft(draft.id)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-[1.03]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Draft
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Local storage notice ── */}
        {drafts.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Drafts are saved locally on this device and are not synced to the server until you submit.
          </p>
        )}
      </div>

      {/* ── Delete confirm modal ── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete this draft?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. The draft will be permanently removed from your device.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-all">
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}