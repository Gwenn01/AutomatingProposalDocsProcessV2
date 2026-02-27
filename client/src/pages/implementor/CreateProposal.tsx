import { useState, useCallback, useEffect } from 'react';
import {
  submitProgramProposal,
  fetchProjectList,
  saveProjectProposal,
  fetchActivityList,
  saveActivityProposal,
  type ProgramFormData,
  type ProjectFormData,
  type ActivityFormData,
} from '@/utils/implementor-api';
import { defaultActivityFormData, defaultProgramFormData, defaultProjectFormData } from '@/constants/defaults';
import { ProgramProposalForm } from '@/components/implementor/create-proposal/program-form';
import { Spinner } from '@/components/implementor/create-proposal/ui/Spinner';
import { getActivityCompletion, getProjectCompletion } from '@/helpers/create-proposal-helper';
import { ProjectProposalForm } from '@/components/implementor/create-proposal/project-form';
import { ActivityProposalForm } from '@/components/implementor/create-proposal/activity-form';
import { StepIndicator } from '@/components/implementor/create-proposal/ui/step-indicator';

interface CreateProposalProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function CreateProposal({ onDirtyChange }: CreateProposalProps = {}) {
  const [isDirty, setIsDirty] = useState(false);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

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
  // activityForms: keyed by projectId (API id), array of activities per project
  const [activityFormsByProject, setActivityFormsByProject] = useState<Record<number, ActivityFormData[]>>({});
  const [activeActivityKey, setActiveActivityKey] = useState<{ projectId: number; activityIdx: number } | null>(null);
  const [activitySaving, setActivitySaving] = useState<Record<string, boolean>>({});
  const [loadingActivities, setLoadingActivities] = useState<Record<number, boolean>>({});

  const markDirty = useCallback(() => {
    setIsDirty((prev) => {
      if (!prev) onDirtyChange?.(true);
      return true;
    });
  }, [onDirtyChange]);

  const markClean = useCallback(() => {
    setIsDirty(false);
    onDirtyChange?.(false);
  }, [onDirtyChange]);

  // Warn on browser reload / tab close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);



  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [step]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  };

  // ── STEP 1: Save Program → GET project list ──────────────────────────────
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

      // Fetch the project list from the API
      setLoadingProjects(true);
      const projectListData = await fetchProjectList(Number(childId));
      const forms = projectListData.projects.map((p) => defaultProjectFormData(p));
      setProjectForms(forms);
      setActiveProjectTab(0);
      setStep(2);
      scrollToTop();
      showToast(`Program saved! ID: #${childId}. Fill in each project below.`);
    } catch (err: any) {
      showToast(`Failed to save program: ${err.message}`, 'error');
    } finally {
      setIsSubmittingProgram(false);
      setLoadingProjects(false);
    }
  };

  // ── STEP 2: Save individual project via PUT /api/project-proposal/{id}/ ──
  const handleSaveProject = async (projectIndex: number) => {
    const form = projectForms[projectIndex];
    if (!form) return;
    if (form.activities.some((a) => !a.activity_title.trim())) { showToast('Fill in all Activity Titles for this project.', 'error'); return; }

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

  // ── STEP 2 → STEP 3: All projects must be saved ───────────────────────────
  const handleGoToActivities = async () => {
    const unsaved = projectForms.filter((p) => !p.saved);
    if (unsaved.length > 0) {
      showToast(`Please save all projects first. (${unsaved.length} unsaved)`, 'error');
      return;
    }

    // Fetch activities for each project
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
        showToast(`Failed to load activities for "${pf.project_title}": ${err.message}`, 'error');
        return;
      } finally {
        loadingMap[pf.apiProjectId] = false;
        setLoadingActivities({ ...loadingMap });
        scrollToTop();
      }
    }

    setActivityFormsByProject(newActivityForms);

    // Set first activity as active
    const firstProject = projectForms[0];
    if (firstProject && newActivityForms[firstProject.apiProjectId]?.length > 0) {
      setActiveActivityKey({ projectId: firstProject.apiProjectId, activityIdx: 0 });
    }

    setStep(3);
    scrollToTop();
  };

  // ── STEP 3: Save activity via PATCH /api/activity-proposal/{id}/ ──────────
  const handleSaveActivity = async (projectId: number, activityIdx: number) => {
    const forms = activityFormsByProject[projectId];
    const form = forms?.[activityIdx];
    if (!form) return;

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

  // ── Submit all → reset ─────────────────────────────────────────────────────
  const handleSubmitAll = () => {
    const allActivities = Object.values(activityFormsByProject).flat();
    const unsaved = allActivities.filter((a) => !a.saved);
    if (unsaved.length > 0) {
      showToast(`Please save all activities first. (${unsaved.length} unsaved)`, 'error');
      return;
    }
    showToast('All proposals submitted successfully! 🎉');
    markClean();
    // Reset everything
    setProgramData(defaultProgramFormData());
    setProgramChildId(null);
    setProjectForms([]);
    setActivityFormsByProject({});
    setActiveProjectTab(0);
    setActiveActivityKey(null);
    setStep(1);
    scrollToTop();
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
  const allActivitiesSaved = Object.values(activityFormsByProject).flat().length > 0 &&
    Object.values(activityFormsByProject).flat().every((a) => a.saved);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl font-semibold text-sm animate-in slide-in-from-top-2
          ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Proposal</h1>
          <p className="text-gray-500 mt-1 text-sm">Build your program, projects, and activities step by step.</p>
          {programChildId && (
            <div className="mt-2 inline-flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full font-semibold">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Program saved — ID: #{programChildId}
            </div>
          )}
        </div>

        <StepIndicator currentStep={step} />

        {/* ══════════════ STEP 1 ══════════════ */}
        {step === 1 && (
          <ProgramProposalForm
            data={programData}
            onChange={(v) => { setProgramData(v); markDirty(); }}
            onNext={handleProgramNext} isSubmitting={isSubmittingProgram}
          />
        )}

        {/* ══════════════ STEP 2 ══════════════ */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">Configure each project under <span className="font-semibold text-emerald-700">{programData.program_title}</span></p>
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
                {/* Project tab list */}
                <div className="flex flex-col gap-1.5">
                  {projectForms.map((pf, i) => {
                    const pct = getProjectCompletion(pf);
                    const isActive = activeProjectTab === i;
                    return (
                      <button key={pf.apiProjectId} onClick={() => setActiveProjectTab(i)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                          ${isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 hover:text-emerald-700'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{i + 1}</span>
                          <span>{pf.project_title || `Project ${i + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {pf.saved
                            ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>✓ Saved</span>
                            : !isActive && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{pct}% filled</span>}
                          <svg className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active project form */}
                {projectForms[activeProjectTab] && (
                  <div>
                    <div className="flex items-center gap-3 mb-5 px-1">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md">{activeProjectTab + 1}</div>
                      <h3 className="text-lg font-bold text-gray-900">{projectForms[activeProjectTab].project_title || `Project ${activeProjectTab + 1}`}</h3>
                    </div>
                    <ProjectProposalForm
                      data={projectForms[activeProjectTab]}
                      onChange={(newData) => updateProjectForm(activeProjectTab, newData)}
                      onSave={() => handleSaveProject(activeProjectTab)}
                      isSaving={!!projectSaving[activeProjectTab]}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between py-4">
              <button onClick={() => { setStep(1); scrollToTop(); }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-white border border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                Back to Program
              </button>
              <button onClick={handleGoToActivities} disabled={!allProjectsSaved}
                title={!allProjectsSaved ? 'Save all projects before continuing' : ''}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold shadow-lg transition-all duration-200
                  ${allProjectsSaved ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {loadingActivities && Object.values(loadingActivities).some(Boolean) ? (<><Spinner />Loading Activities...</>) : (<>Continue to Activities <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>)}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 3 ══════════════ */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Activity Proposals</h2>
                <p className="text-sm text-gray-500 mt-0.5">Fill and save each activity individually</p>
              </div>
              <div className="flex items-center gap-2">
                {allActivitiesSaved && <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">✓ All activities saved</span>}
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  {Object.values(activityFormsByProject).flat().filter((a) => a.saved).length} / {Object.values(activityFormsByProject).flat().length} saved
                </span>
              </div>
            </div>

            {/* Activity tabs grouped by project */}
            <div className="flex flex-col gap-3">
              {projectForms.map((pf) => {
                const activities = activityFormsByProject[pf.apiProjectId] || [];
                return (
                  <div key={pf.apiProjectId} className="space-y-1.5">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">P</div>
                      <h4 className="font-bold text-gray-800 text-sm">{pf.project_title}</h4>
                      <div className="flex-1 h-px bg-gray-100" />
                      {loadingActivities[pf.apiProjectId] && <span className="text-xs text-gray-400 flex items-center gap-1"><Spinner />Loading...</span>}
                    </div>
                    <div className="flex flex-col gap-1 pl-7">
                      {activities.map((act, ai) => {
                        const key = `${pf.apiProjectId}-${ai}`;
                        const isActive = activeActivityKey?.projectId === pf.apiProjectId && activeActivityKey?.activityIdx === ai;
                        const pct = getActivityCompletion(act);
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

            {/* Active activity form */}
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
                    onChange={(newData) => updateActivityForm(projectId, activityIdx, newData)}
                    onSave={() => handleSaveActivity(projectId, activityIdx)}
                    isSaving={!!activitySaving[key]}
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