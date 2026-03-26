// CreateProposal.tsx  — with Save Draft + Load/Resume Draft support
// Changes vs original:
//   1. Accepts optional `draftId` prop — when set, loads the draft on mount
//   2. "Save Draft" button in every step's action bar (saves to localStorage via draftDb)
//   3. On successful final submit the draft is deleted from storage
//   4. API calls only happen on final submit (handleProgramNext, handleSaveProject, etc.)
//      — i.e. drafts are 100% local; no endpoints are touched until the user submits

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  submitProgramProposal,
  fetchProjectList,
  saveProjectProposal,
  fetchActivityList,
  saveActivityProposal
} from '@/api/implementor-api';
import { defaultActivityFormData, defaultProgramFormData, defaultProjectFormData } from '@/constants/defaults';
import { ProgramProposalForm } from '@/components/implementor/create-proposal/program-form';
import { Spinner } from '@/components/implementor/create-proposal/ui/Spinner';
import { getActivityCompletion, getProjectCompletion } from '@/helpers/create-proposal-helper';
import { ProjectProposalForm } from '@/components/implementor/create-proposal/project-form';
import { ActivityProposalForm } from '@/components/implementor/create-proposal/activity-form';
import { StepIndicator } from '@/components/implementor/create-proposal/ui/step-indicator';
import { useToast } from '@/context/toast';
import { draftDb } from '@/types/draft-db';
import type { ProgramFormData, ProjectFormData, ActivityFormData } from '@/types/implementor-types';

interface CreateProposalProps {
  onDirtyChange?: (isDirty: boolean) => void;
  /** If set, the component will load and resume the draft with this id on mount */
  draftId?: string | null;
  /** Called after final submission so the parent can navigate away */
  onSubmitSuccess?: () => void;
  /** Called so the parent can navigate to the Drafts list */
  onGoToDrafts?: () => void;
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

function sumBudgetRows(budget: ProjectFormData['budget'] | ActivityFormData['budget']): number {
  const cats = ['meals', 'transport', 'supplies'] as const;
  return cats.reduce(
    (acc, cat) => acc + budget[cat].reduce((s, r) => s + (parseFloat(String(r.amount)) || 0), 0),
    0,
  );
}

export default function CreateProposal({
  onDirtyChange,
  draftId: initialDraftId,
  onSubmitSuccess,
  onGoToDrafts,
}: CreateProposalProps = {}) {
  const [isDirty, setIsDirty] = useState(false);
  const [step, setStep] = useState(1);

  // Draft tracking
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialDraftId ?? null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);

  const { showToast } = useToast();

  // Step 1
  const [programData, setProgramData] = useState<ProgramFormData>(defaultProgramFormData());
  const [programChildId, setProgramChildId] = useState<number | null>(null);
  const [isSubmittingProgram, setIsSubmittingProgram] = useState(false);

  // Step 2
  const [projectForms, setProjectForms] = useState<ProjectFormData[]>([]);
  const [activeProjectTab, setActiveProjectTab] = useState(0);
  const [projectSaving, setProjectSaving] = useState<Record<number, boolean>>({});
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Step 3
  const [activityFormsByProject, setActivityFormsByProject] = useState<Record<number, ActivityFormData[]>>({});
  const [activeActivityKey, setActiveActivityKey] = useState<{ projectId: number; activityIdx: number } | null>(null);
  const [activitySaving, setActivitySaving] = useState<Record<string, boolean>>({});
  const [loadingActivities, setLoadingActivities] = useState<Record<number, boolean>>({});

  // ── Load draft on mount (if draftId provided) ─────────────────────────────
  useEffect(() => {
    if (!initialDraftId) return;
    const record = draftDb.get(initialDraftId);
    if (!record) return;
    const payload = draftDb.parsePayload(record);
    setProgramData(payload.programData);
    setProgramChildId(payload.programChildId);
    setProjectForms(JSON.parse(payload.projectFormsJson ?? '[]'));
    setActivityFormsByProject(JSON.parse(payload.activityFormsByProjectJson ?? '{}'));
    setActiveProjectTab(payload.activeProjectTab ?? 0);
    setStep(payload.step ?? 1);
    setCurrentDraftId(initialDraftId);
  }, [initialDraftId]);

  const markDirty = useCallback(() => {
    setIsDirty(true);
    onDirtyChange?.(true);
  }, [onDirtyChange]);

  const markClean = useCallback(() => {
    setIsDirty(false);
    onDirtyChange?.(false);
  }, [onDirtyChange]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // ── Derived budget values ──────────────────────────────────────────────────
  const programBudgetTotal = parseFloat((programData as any).program_budget_total) || 0;

  const getUsedByOtherProjects = (excludeIndex: number): number =>
    projectForms.reduce(
      (sum, pf, i) => (i === excludeIndex ? sum : sum + sumBudgetRows(pf.budget)),
      0,
    );

  const getProjectBudgetTotal = (projectId: number): number => {
    const pf = projectForms.find((p) => p.apiProjectId === projectId);
    return pf ? sumBudgetRows(pf.budget) : 0;
  };

  const getUsedByOtherActivities = (projectId: number, excludeActIdx: number): number => {
    const acts = activityFormsByProject[projectId] || [];
    return acts.reduce((sum, act, ai) => {
      if (ai === excludeActIdx) return sum;
      return sum + sumBudgetRows(act.budget);
    }, 0);
  };

  // ── Save Draft helpers ─────────────────────────────────────────────────────
  const buildPayload = useCallback(() => ({
    programData,
    programChildId,
    projectFormsJson: JSON.stringify(projectForms),
    activityFormsByProjectJson: JSON.stringify(activityFormsByProject),
    activeProjectTab,
    step,
  }), [programData, programChildId, projectForms, activityFormsByProject, activeProjectTab, step]);

  /** Update the current draft (or create one if none exists yet) */
  const handleSaveDraft = useCallback(() => {
    setIsSavingDraft(true);
    try {
      const id = draftDb.upsert(buildPayload(), currentDraftId ?? undefined);
      setCurrentDraftId(id);
      setDraftSavedAt(new Date());
      markClean();
      showToast('Draft updated!', 'success');
    } catch (err: any) {
      showToast(`Failed to save draft: ${err.message}`, 'error');
    } finally {
      setIsSavingDraft(false);
    }
  }, [buildPayload, currentDraftId, markClean, showToast]);

  /** Always create a brand-new draft entry, even if one already exists */
  const handleSaveAsNewDraft = useCallback(() => {
    setIsSavingDraft(true);
    try {
      // Pass no existingId → draftDb.upsert generates a fresh UUID
      const id = draftDb.upsert(buildPayload());
      setCurrentDraftId(id);
      setDraftSavedAt(new Date());
      markClean();
      showToast('Saved as a new draft!', 'success');
    } catch (err: any) {
      showToast(`Failed to save draft: ${err.message}`, 'error');
    } finally {
      setIsSavingDraft(false);
    }
  }, [buildPayload, markClean, showToast]);

  // ── STEP 1: Save Program → GET project list ────────────────────────────────
  const handleProgramNext = async () => {
    if (!programData.program_title.trim()) { showToast('Please enter a Program Title.', 'error'); return; }
    if (programData.projects.some((p) => !p.project_title.trim())) { showToast('Please fill in all Project Titles.', 'error'); return; }
    if (!programData.rationale.trim()) { showToast('Please fill in the Rationale.', 'error'); return; }

    setIsSubmittingProgram(true);
    try {
      const result = await submitProgramProposal(programData);
      const childId = result?.child_id ?? result?.id ?? result?.program_proposal_id;
      if (!childId) throw new Error('API did not return a program child_id.');
      setProgramChildId(Number(childId));

      setLoadingProjects(true);
      const projectListData = await fetchProjectList(Number(childId));
      const forms = projectListData.projects.map((p) => defaultProjectFormData(p));
      setProjectForms(forms);
      setActiveProjectTab(0);
      setStep(2);
      scrollToTop();
      showToast(`Program saved! ID: #${childId}. Fill in each project below.`, 'success');
    } catch (err: any) {
      showToast(`Failed to save program: ${err.message}`, 'error');
    } finally {
      setIsSubmittingProgram(false);
      setLoadingProjects(false);
    }
  };

  // ── STEP 2: Save individual project ───────────────────────────────────────
  const handleSaveProject = async (projectIndex: number) => {
    const form = projectForms[projectIndex];
    if (!form) return;
    if (form.activities.some((a) => !a.activity_title.trim())) {
      showToast('Fill in all Activity Titles for this project.', 'error'); return;
    }
    if (programBudgetTotal > 0) {
      const usedByOthers = getUsedByOtherProjects(projectIndex);
      const current = sumBudgetRows(form.budget);
      if (usedByOthers + current > programBudgetTotal) {
        showToast('Cannot save: project budget exceeds the program total.', 'error'); return;
      }
    }
    setProjectSaving((prev) => ({ ...prev, [projectIndex]: true }));
    try {
      await saveProjectProposal(form.apiProjectId, form);
      setProjectForms((prev) => { const u = [...prev]; u[projectIndex] = { ...u[projectIndex], saved: true }; return u; });
      showToast(`Project "${form.project_title}" saved!`);
      scrollToTop();
    } catch (err: any) {
      showToast(`Failed to save project: ${err.message}`, 'error');
    } finally {
      setProjectSaving((prev) => ({ ...prev, [projectIndex]: false }));
    }
  };

  // ── STEP 2 → STEP 3 ────────────────────────────────────────────────────────
  const handleGoToActivities = async () => {
    const unsaved = projectForms.filter((p) => !p.saved);
    if (unsaved.length > 0) {
      showToast(`Please save all projects first. (${unsaved.length} unsaved)`, 'error'); return;
    }
    const newActivityForms: Record<number, ActivityFormData[]> = {};
    const loadingMap: Record<number, boolean> = {};
    for (const pf of projectForms) {
      loadingMap[pf.apiProjectId] = true;
      setLoadingActivities({ ...loadingMap });
      try {
        const actData = await fetchActivityList(pf.apiProjectId);
        newActivityForms[pf.apiProjectId] = actData.activities.map((a) => defaultActivityFormData(a));
        scrollToTop();
      } catch (err: any) {
        showToast(`Failed to load activities for "${pf.project_title}": ${err.message}`, 'error'); return;
      } finally {
        loadingMap[pf.apiProjectId] = false;
        setLoadingActivities({ ...loadingMap });
        scrollToTop();
      }
    }
    setActivityFormsByProject(newActivityForms);
    const firstProject = projectForms[0];
    if (firstProject && newActivityForms[firstProject.apiProjectId]?.length > 0) {
      setActiveActivityKey({ projectId: firstProject.apiProjectId, activityIdx: 0 });
    }
    setStep(3);
    scrollToTop();
  };

  // ── STEP 3: Save activity ──────────────────────────────────────────────────
  const handleSaveActivity = async (projectId: number, activityIdx: number) => {
    const forms = activityFormsByProject[projectId];
    const form = forms?.[activityIdx];
    if (!form) return;
    const projectBudgetTotal = getProjectBudgetTotal(projectId);
    if (projectBudgetTotal > 0) {
      const usedByOthers = getUsedByOtherActivities(projectId, activityIdx);
      const current = sumBudgetRows(form.budget);
      if (usedByOthers + current > projectBudgetTotal) {
        showToast('Cannot save: activity budget exceeds the program total.', 'error'); return;
      }
    }
    const key = `${projectId}-${activityIdx}`;
    setActivitySaving((prev) => ({ ...prev, [key]: true }));
    try {
      await saveActivityProposal(form.apiActivityId, form);
      setActivityFormsByProject((prev) => {
        const u = { ...prev };
        u[projectId] = [...u[projectId]];
        u[projectId][activityIdx] = { ...u[projectId][activityIdx], saved: true };
        return u;
      });
      showToast(`Activity "${form.activity_title}" saved!`);
    } catch (err: any) {
      showToast(`Failed to save activity: ${err.message}`, 'error');
    } finally {
      setActivitySaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  // ── Submit all → delete draft → reset ─────────────────────────────────────
  const handleSubmitAll = () => {
    const allActivities = Object.values(activityFormsByProject).flat();
    const unsaved = allActivities.filter((a) => !a.saved);
    if (unsaved.length > 0) {
      showToast(`Please save all activities first. (${unsaved.length} unsaved)`, 'error'); return;
    }

    // Delete the draft from local storage — it's been submitted to the API
    if (currentDraftId) {
      draftDb.delete(currentDraftId);
      setCurrentDraftId(null);
    }

    showToast('All proposals submitted successfully! 🎉');
    markClean();
    setProgramData(defaultProgramFormData());
    setProgramChildId(null);
    setProjectForms([]);
    setActivityFormsByProject({});
    setActiveProjectTab(0);
    setActiveActivityKey(null);
    setStep(1);
    scrollToTop();
    onSubmitSuccess?.();
  };

  const updateProjectForm = (index: number, newData: ProjectFormData) => {
    setProjectForms((prev) => { const u = [...prev]; u[index] = newData; return u; });
  };

  const updateActivityForm = (projectId: number, activityIdx: number, newData: ActivityFormData) => {
    setActivityFormsByProject((prev) => {
      const u = { ...prev };
      u[projectId] = [...(u[projectId] || [])];
      u[projectId][activityIdx] = newData;
      return u;
    });
  };

  const allProjectsSaved = projectForms.length > 0 && projectForms.every((p) => p.saved);
  const allActivitiesSaved =
    Object.values(activityFormsByProject).flat().length > 0 &&
    Object.values(activityFormsByProject).flat().every((a) => a.saved);

  // ── Shared Draft Action Bar ────────────────────────────────────────────────
  const DraftBar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl mb-2">
      {/* Left — status */}
      <div className="flex items-center gap-2 text-sm text-amber-700 min-w-0">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="font-medium truncate">
          {currentDraftId
            ? draftSavedAt
              ? `Draft updated at ${draftSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : 'Editing existing draft — save to update.'
            : 'Not saved as draft yet.'}
        </span>
        {isDirty && (
          <span className="text-xs text-amber-500 font-semibold shrink-0">(unsaved changes)</span>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {onGoToDrafts && (
          <button
            onClick={onGoToDrafts}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline transition-colors px-1">
            View all drafts
          </button>
        )}

        {/* Save as New Draft — always creates a fresh entry */}
        <button
          onClick={handleSaveAsNewDraft}
          disabled={isSavingDraft}
          title="Save a separate copy as a new draft"
          className="flex items-center gap-1.5 bg-white hover:bg-amber-50 disabled:opacity-60 text-amber-700 border border-amber-300 hover:border-amber-400 text-xs font-bold px-3 py-2 rounded-xl transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Save as New Draft
        </button>

        {/* Update Draft — overwrites the current draft (or creates one if none) */}
        <button
          onClick={handleSaveDraft}
          disabled={isSavingDraft}
          title={currentDraftId ? 'Overwrite this draft with current changes' : 'Save as draft'}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-[1.03]">
          {isSavingDraft
            ? <><Spinner />Saving...</>
            : <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {currentDraftId ? 'Update Draft' : 'Save Draft'}
              </>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-black">
                {currentDraftId ? 'Edit Draft' : 'Create Proposal'}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">Build your program, projects, and activities step by step.</p>
            </div>
            {onGoToDrafts && (
              <button
                onClick={onGoToDrafts}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-xl transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                My Drafts
              </button>
            )}
          </div>
          {programChildId && (
            <div className="mt-2 inline-flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full font-semibold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Program saved — ID: #{programChildId}
            </div>
          )}
        </div>

        <StepIndicator currentStep={step} />

        {/* ── Draft action bar (shown on every step) ── */}
        <div className="mb-4">
          <DraftBar />
        </div>

        {/* ══ STEP 1 ══════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <ProgramProposalForm
            data={programData}
            onChange={(v) => { setProgramData(v); markDirty(); }}
            onNext={handleProgramNext}
            isSubmitting={isSubmittingProgram}
          />
        )}

        {/* ══ STEP 2 ══════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Configure each project under{' '}
                  <span className="font-semibold text-emerald-700">"{programData.program_title}"</span>
                  {programBudgetTotal > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                      Program budget: {programBudgetTotal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {allProjectsSaved && <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">✓ All projects saved</span>}
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">{projectForms.length} project{projectForms.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-16 gap-3 text-emerald-600 font-semibold">
                <Spinner />Loading projects from server...
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2.5 bg-gray-200/50 p-5 rounded-2xl">
                  <h1 className="font-semibold text-base my-1 text-gray-700">Project list</h1>
                  {projectForms.map((pf, i) => {
                    const pct = getProjectCompletion(pf);
                    const isActive = activeProjectTab === i;
                    const usedByOthers = getUsedByOtherProjects(i);
                    const isOver = programBudgetTotal > 0 && (usedByOthers + sumBudgetRows(pf.budget)) > programBudgetTotal;
                    return (
                      <button key={pf.apiProjectId} onClick={() => setActiveProjectTab(i)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                          ${isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 hover:text-emerald-700'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{i + 1}</span>
                          <span>{pf.project_title || `Project ${i + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isOver && !isActive && <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">⚠ Over budget</span>}
                          {pf.saved
                            ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>✓ Saved</span>
                            : !isActive && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{pct}% filled</span>}
                          <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {projectForms[activeProjectTab] && (
                  <div>
                    <div className="flex items-center gap-4 mb-5 px-5 py-3 rounded-2xl border border-emerald-100 bg-emerald-100/60 backdrop-blur-sm">
                      <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-sm">{activeProjectTab + 1}</div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-medium text-emerald-700 tracking-wide uppercase">Selected Project</span>
                        <h3 className="text-base font-semibold text-gray-900">{projectForms[activeProjectTab].project_title || `Project ${activeProjectTab + 1}`}</h3>
                      </div>
                    </div>
                    <ProjectProposalForm
                      data={projectForms[activeProjectTab]}
                      onChange={(newData) => { updateProjectForm(activeProjectTab, newData); markDirty(); }}
                      onSave={() => handleSaveProject(activeProjectTab)}
                      isSaving={!!projectSaving[activeProjectTab]}
                      programData={programData}
                      isSaved={projectForms[activeProjectTab].saved}
                      programBudgetTotal={programBudgetTotal}
                      usedByOtherProjects={getUsedByOtherProjects(activeProjectTab)}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-end pb-10">
              <button onClick={handleGoToActivities} disabled={!allProjectsSaved}
                title={!allProjectsSaved ? 'Save all projects before continuing' : ''}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold shadow-lg transition-all duration-200
                  ${allProjectsSaved ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {loadingActivities && Object.values(loadingActivities).some(Boolean)
                  ? <><Spinner />Loading Activities...</>
                  : <>Continue to Activities <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3 ══════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Activity Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Fill and save each activity individually
                  {programBudgetTotal > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                      Program budget: {programBudgetTotal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {allActivitiesSaved && <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">✓ All activities saved</span>}
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  {Object.values(activityFormsByProject).flat().filter((a) => a.saved).length} / {Object.values(activityFormsByProject).flat().length} saved
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {projectForms.map((pf) => {
                const activities = activityFormsByProject[pf.apiProjectId] || [];
                return (
                  <div key={pf.apiProjectId} className="space-y-1.5 px-2 py-4 bg-gray-100 rounded-2xl border-2">
                    <div className="flex items-center gap-2 px-1">
                      <p className="text-lg font-medium">Project Title: </p>
                      <h4 className="font-bold text-gray-800 text-lg">{pf.project_title}</h4>
                      <div className="flex-1 h-px bg-gray-100" />
                      {loadingActivities[pf.apiProjectId] && <span className="text-xs text-gray-400 flex items-center gap-1"><Spinner />Loading...</span>}
                    </div>
                    <div className="flex flex-col gap-1 pl-7">
                      {activities.map((act, ai) => {
                        const isActive = activeActivityKey?.projectId === pf.apiProjectId && activeActivityKey?.activityIdx === ai;
                        const pct = getActivityCompletion(act);
                        const usedByOthers = getUsedByOtherActivities(pf.apiProjectId, ai);
                        const isOver = programBudgetTotal > 0 && (usedByOthers + sumBudgetRows(act.budget)) > programBudgetTotal;
                        return (
                          <button key={act.apiActivityId} onClick={() => setActiveActivityKey({ projectId: pf.apiProjectId, activityIdx: ai })}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                              ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600'}`}>
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>{String.fromCharCode(65 + ai)}</span>
                              <span>{act.activity_title || `Activity ${ai + 1}`}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'text-gray-400 bg-gray-100'}`}>#{act.apiActivityId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isOver && !isActive && <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">⚠ Over budget</span>}
                              {act.saved
                                ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>✓ Saved</span>
                                : !isActive && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{pct > 0 ? `${pct}%` : 'Not started'}</span>}
                              <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </button>
                        );
                      })}
                      {activities.length === 0 && !loadingActivities[pf.apiProjectId] && (
                        <p className="text-xs text-gray-400 italic px-4 py-2">No activities found for this project.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {activeActivityKey && (() => {
              const { projectId, activityIdx } = activeActivityKey;
              const form = activityFormsByProject[projectId]?.[activityIdx];
              const projName = projectForms.find((p) => p.apiProjectId === projectId)?.project_title || '';
              const key = `${projectId}-${activityIdx}`;
              if (!form) return null;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-5 px-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md">{String.fromCharCode(65 + activityIdx)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{form.activity_title || `Activity ${activityIdx + 1}`}</h3>
                      <p className="text-xs text-gray-500">Under: {projName}</p>
                    </div>
                  </div>
                  <ActivityProposalForm
                    data={form}
                    onChange={(newData) => { updateActivityForm(projectId, activityIdx, newData); markDirty(); }}
                    onSave={() => handleSaveActivity(projectId, activityIdx)}
                    isSaving={!!activitySaving[key]}
                    isSaved={form.saved}
                    programBudgetTotal={getProjectBudgetTotal(projectId)}
                    usedByOtherActivities={getUsedByOtherActivities(projectId, activityIdx)}
                  />
                </div>
              );
            })()}

            <div className="flex items-center justify-between py-4">
              <button onClick={() => { setStep(2); scrollToTop(); }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-white border border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back to Projects
              </button>
              <button onClick={handleSubmitAll} disabled={!allActivitiesSaved}
                title={!allActivitiesSaved ? 'Save all activities before submitting' : ''}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold shadow-lg transition-all duration-200
                  ${allActivitiesSaved ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Submit Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}