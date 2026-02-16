import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import CommentInput from "@/components/reviewer/CommentInput";
import PreviousComment from "@/components/reviewer/PreviousComment";
import { useToast } from "@/context/toast";

interface User {
  user_id: string;
  fullname: string;
}

interface History {
  history_id: string;
  proposal_id: string;
  status: string;
  version_no: number;
  created_at: string;
}

interface Review {
  id: string;
  comment: string;
  reviewer_name?: string;
  created_at?: string;
}

interface Proponents {
  project_leader: string;
  members: string;
}

interface ProjectProfile {
  program_title?: string;
  project_title?: string;
  activity_title?: string;
  sdg_alignment?: string;
  extension_agenda?: string;
  proponents?: Proponents;
  college_campus_program?: string;
  collaborating_agencies?: string;
  community_location?: string;
  target_sector?: string;
  number_of_beneficiaries?: string;
  implementation_period?: string;
  budgetary_requirements?: string;
  reviews?: Review[];
}

interface ContentSection {
  content: string;
  reviews?: Review[];
}

interface ObjectivesSection {
  general?: ContentSection;
  specific?: ContentSection;
}

interface SixPs {
  publications?: string;
  patents?: string;
  products?: string;
  people_services?: string;
  places_partnerships?: string;
  policy?: string;
  social_impact?: string;
  economic_impact?: string;
}

interface ExpectedOutputOutcome {
  "6ps"?: SixPs;
  reviews?: Review[];
}

interface StaffingItem {
  activity: string;
  designation: string;
  terms: string;
}

interface OrganizationStaffing {
  content?: StaffingItem[];
  reviews?: Review[];
}

interface ScheduleItem {
  time: string;
  activity: string;
  speaker: string;
}

interface PlanOfActivitiesContent {
  activity_title?: string;
  activity_date?: string;
  schedule?: ScheduleItem[];
}

interface PlanOfActivities {
  content?: PlanOfActivitiesContent;
  reviews?: Review[];
}

interface BudgetItem {
  item: string;
  cost: string;
  qty: string;
  amount: string;
}

interface BudgetTotals {
  grand_total?: number;
}

interface BudgetaryRequirementContent {
  meals?: BudgetItem[];
  transport?: BudgetItem[];
  supplies?: BudgetItem[];
  totals?: BudgetTotals;
}

interface BudgetaryRequirement {
  content?: BudgetaryRequirementContent;
  reviews?: Review[];
}

interface ContentPages {
  project_profile?: ProjectProfile;
  rationale?: ContentSection;
  significance?: ContentSection;
  objectives?: ObjectivesSection;
  methodology?: ContentSection;
  expected_output_outcome?: ExpectedOutputOutcome;
  sustainability_plan?: ContentSection;
  organization_and_staffing?: OrganizationStaffing;
  plan_of_activities?: PlanOfActivities;
  budgetary_requirement?: BudgetaryRequirement;
}

interface FullContent {
  content_pages?: ContentPages;
}

interface ProposalSummary {
  program_title?: string;
  board_resolution?: string;
  approved_budget?: {
    words?: string;
    amount?: string;
  };
  duration?: {
    words?: string;
  };
  proposal_coverage_period?: string;
}

interface ActivityDetails {
  title?: string;
  venue?: string;
  value_statement?: string;
  requested_budget?: string;
}

interface Participants {
  prmsu?: {
    words?: string;
    count?: string;
  };
  partner_agency?: {
    words?: string;
    count?: string;
    name?: string;
  };
  trainees?: {
    words?: string;
    count?: string;
  };
}

interface CoverPages {
  submission_date?: string;
  proposal_summary?: ProposalSummary;
  activity_details?: ActivityDetails;
  participants?: Participants;
}

interface CoverPage {
  cover_pages?: CoverPages;
  reviews?: Review[];
}

interface ProposalData {
  proposal_id: string;
  title: string;
  status?: string;
  history_id?: string;
  content_id?: string;
  cover_id?: string;
  is_reviewed?: boolean;
  review_status?: string;
  review_id?: string;
  reviewer_id?: string;
  implementor_id?: string;
  cover_page?: CoverPage;
  full_content?: FullContent;
}

interface ReviewerCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: ProposalData | null;
  reviewe?: string;
}

interface Comments {
  [key: string]: string;
}

const ReviewerCommentModal: React.FC<ReviewerCommentModalProps> = ({
  isOpen,
  onClose,
  proposalData,
  reviewe,
}) => {
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comments>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHistoryData, setSelectedHistoryData] =
    useState<ProposalData | null>(null);
  const [loadingHistoryData, setLoadingHistoryData] = useState<boolean>(false);
  const [isDocumentReady, setIsDocumentReady] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const proposalId = proposalData?.proposal_id;

  const fetchHistoryData = async (historyId: string, status: string) => {
    try {
      setLoadingHistoryData(true);
      setIsDocumentReady(false);

      // API call removed - Mock data would go here
      setAlreadyReviewed(false);

      // Simulate loading
      setTimeout(() => {
        setSelectedHistoryData(proposalData);
        setIsDocumentReady(true);
        setLoadingHistoryData(false);
      }, 500);
    } catch (err) {
      console.error("Failed to fetch history data:", err);
      showToast("Failed to load history data. Please try again.", "error");
      setLoadingHistoryData(false);
    }
  };

  useEffect(() => {
    if (!proposalId || !isOpen) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        // API call removed - Mock data
        setHistory([]);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [proposalId, isOpen]);

  useEffect(() => {
    if (!isOpen || !history.length || selectedHistoryData) return;

    const currentVersion = history.find((item) => item.status === "current");

    if (currentVersion) {
      fetchHistoryData(currentVersion.history_id, currentVersion.status);
    }
  }, [history, isOpen, user]);

  if (!isOpen || !proposalData) return null;

  const activeData = selectedHistoryData || proposalData;
  const cover = activeData.cover_page?.cover_pages || {};
  const content = activeData.full_content?.content_pages || {};

  const handleCommentChange = (InputValue: string, commentValue: string) => {
    setComments((prev) => ({
      ...prev,
      [InputValue]: commentValue,
    }));
  };

  const hasAnyComment = Object.values(comments).some(
    (comment) => comment && comment.trim() !== "",
  );

  const handleSubmitReview = async () => {
    setIsSubmitting(true);

    const currentVersion = history.find((item) => item.status === "current");
    const isFirstReview = currentVersion?.version_no === 0;

    const allReviews = {
      review_round: "1st",
      proposal_type: "Project",
      source_of_fund: "Resolution No. 1436, S. 2025",
      cover_letter_feedback: "",
      form1_proposal_feedback: "",
      project_profile_feedback: "",
      rationale_feedback: "",
      significance_feedback: "",
      general_objectives_feedback: "",
      specific_objectives_feedback: "",
      methodology_feedback: "",
      expected_output_feedback: "",
      potential_impact_feedback: "",
      sustainability_plan_feedback: "",
      org_staffing_feedback: "",
      work_financial_plan_feedback: "",
      budget_summary_feedback: "",
      ...comments,
    };

    // API call removed
    console.log("Review data:", allReviews);

    showToast("Review submitted successfully!", "success");
    setComments({});
    setIsSubmitting(false);
    onClose();
  };

  const handleApprove = async () => {
    try {
      setIsApproving(true);

      const approveData = {
        proposal_id: proposalData?.proposal_id,
        user_id: user?.user_id,
        reviewer_name: user?.fullname,
        decision: "approved",
        title: proposalData?.title,
      };

      console.log("Approving proposal:", approveData);

      // API call removed
      showToast("Proposal approved successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error approving proposal:", error);
      showToast("Failed to approve proposal", "error");
    } finally {
      setIsApproving(false);
    }
  };

  const currentVersion = history.find((item) => item.status === "current");
  const isFirstReview = currentVersion?.version_no === 0;
  const buttonText = isFirstReview ? "Submit Review" : "Update Review";

  const disableButton =
    selectedHistoryData?.review_status ===
    "Already reviewed. Please wait for revision before reviewing again.";

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-overlay-enter">
        <div className="bg-white w-full max-w-5xl h-[95vh] rounded-bl-xl rounded-tl-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-8 py-5 border-b bg-primaryGreen text-white">
            <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>

            <div className="relative z-10 flex flex-1 items-center justify-between">
              <div className="flex flex-col justify-center items-start gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-white/80 rounded-full"></div>
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-emerald-100">
                    Review Proposal
                  </h3>
                </div>
                <h1 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
                  {proposalData.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-14 overflow-auto bg-white">
            {!isDocumentReady ? (
              <div className="w-full h-full px-20 py-5 space-y-6 animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>

                <div className="space-y-3 pt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                <div className="space-y-3 pt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                <div className="space-y-3 pt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ) : (
              <>
                <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-sans text-gray-900 leading-relaxed">
                  <div className="space-y-4 font-normal text-base">
                    <div>
                      <p className="font-medium">
                        {cover.submission_date || "N/A"}
                      </p>
                    </div>

                    <div className="uppercase ">
                      <p className="font-bold">DR. ROY N. VILLALOBOS</p>
                      <p>University President</p>
                      <p>President Ramon Magsaysay State University</p>
                    </div>

                    <p>Dear Sir:</p>

                    <p className="">
                      I have the honor to submit the proposal for your
                      consideration and appropriate action for the proposed
                      extension program entitled{" "}
                      {cover.proposal_summary?.program_title || "N/A"},{" "}
                      {cover.proposal_summary?.board_resolution || "N/A"} with
                      the approved budget of{" "}
                      {cover.proposal_summary?.approved_budget?.words || "N/A"};
                      Php{" "}
                      {cover.proposal_summary?.approved_budget?.amount || "N/A"}{" "}
                      with the duration of{" "}
                      {cover.proposal_summary?.duration?.words || "N/A"} years,{" "}
                      {cover.proposal_summary?.proposal_coverage_period ||
                        "N/A"}
                      .
                    </p>

                    <p>
                      This program includes an activity entitled{" "}
                      {cover.activity_details?.title || "N/A"} on{" "}
                      {content.plan_of_activities?.content?.activity_date
                        ? new Date(
                            content.plan_of_activities.content.activity_date,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}{" "}
                      at {cover.activity_details?.venue || "N/A"}. This activity
                      is valuable{" "}
                      {cover.activity_details?.value_statement || "N/A"}. The
                      requested expenses for this activity from the university
                      is Php {cover.activity_details?.requested_budget || "N/A"}
                      , which will be used to defray expenses for food,
                      transportation, supplies and materials, and other expenses
                      related to these activities.
                    </p>

                    <p>
                      Further, there is{" "}
                      {cover.participants?.prmsu?.words || "N/A"} (
                      {cover.participants?.prmsu?.count || "N/A"}) the total
                      number of participants from PRMSU, another{" "}
                      {cover.participants?.partner_agency?.words || "N/A"} (
                      {cover.participants?.partner_agency?.count || "N/A"}) from
                      the collaborating agency,{" "}
                      {cover.participants?.partner_agency?.name || "N/A"}, and{" "}
                      {cover.participants?.trainees?.words || "N/A"} (
                      {cover.participants?.trainees?.count || "N/A"}) trainees
                      from the abovementioned community.
                    </p>

                    <p className="">
                      Your favorable response regarding this matter will be
                      highly appreciated.
                    </p>

                    <p className="italic">Prepared by:</p>
                    <p className="py-1">Proponent</p>
                    <p className="italic">Noted by:</p>

                    <div className="">
                      <div className="grid grid-cols-2">
                        <div className="">
                          <p className="pt-4">Campus Extension Coordinator</p>
                          <p className="pt-4 italic">Endorsed by:</p>
                          <p className="pt-4"></p>
                          <p className="pt-1">Campus Director</p>
                          <p className="pt-4 italic">Recommending Approval:</p>
                          <p className="pt-7 font-bold text-[16px]">
                            MARLON JAMES A. DEDICATORIA, Ph.D.
                          </p>
                          <p className="pt-1">
                            Vice-President, Research and Development
                          </p>
                        </div>

                        <div className="">
                          <p className="pt-4">College Dean</p>
                          <p className="pt-4"></p>
                          <p className="pt-4 font-bold text-[16px]">
                            KATHERINE M.UY, MAEd
                          </p>
                          <p className="pt-1"> Director, Extension Services</p>
                          <p className="pt-4 italic">
                            Certified Funds Available
                          </p>
                          <p className="pt-7 font-bold text-[16px]">
                            ROBERTO C. BRIONES JR., CPA
                          </p>
                          <p className="pt-1">University Accountant IV</p>
                        </div>
                      </div>
                      <p className="pt-10 italic text-center">Approved by:</p>
                      <p className="pt-5 font-bold text-[16px] text-center">
                        ROY N. VILLALOBOS, DPA
                      </p>
                      <p className="pt-1 text-center">University President</p>
                    </div>
                  </div>
                </section>

                {selectedHistoryData?.status === "current" ? (
                  alreadyReviewed ? (
                    <CommentInput
                      sectionName="Cover Page"
                      onCommentChange={handleCommentChange}
                      InputValue="cover_letter_feedback"
                      value={
                        selectedHistoryData?.cover_page?.reviews?.[0]
                          ?.comment || ""
                      }
                      disabled={alreadyReviewed}
                    />
                  ) : (
                    <CommentInput
                      sectionName="Cover Page"
                      onCommentChange={handleCommentChange}
                      InputValue="cover_letter_feedback"
                    />
                  )
                ) : (
                  <div className="mt-10 p-5 bg-green-50 border-l-4 border-green-400">
                    <div className="space-y-4">
                      {cover?.reviews?.map((review, index) => (
                        <PreviousComment key={index} review={review} />
                      ))}
                    </div>
                  </div>
                )}

                <section>
                  <h2 className="text-xl font-bold my-8">I. PROJECT PROFILE</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full border border-black text-sm">
                      <tbody>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Program Title:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.program_title || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            Project Title:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.project_title || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            Activity Title:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.activity_title || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            SDG's
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.sdg_alignment || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Extension Agenda
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.extension_agenda || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Proponents: Project Leader
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.proponents
                              ?.project_leader || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Members:
                          </td>
                          <td className="px-4 py-3">
                            {(() => {
                              const rawMembers =
                                content.project_profile?.proponents?.members;

                              if (!rawMembers) return "N/A";

                              try {
                                const parsed = JSON.parse(rawMembers);
                                const cleaned = parsed.map((name: string) =>
                                  name.replace(/"/g, ""),
                                );

                                return cleaned.map(
                                  (member: string, index: number) => (
                                    <div key={index}>
                                      <p>{member}</p>
                                    </div>
                                  ),
                                );
                              } catch (error) {
                                return "N/A";
                              }
                            })()}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            College/Campus/Mandated Program:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.college_campus_program ||
                              "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Collaborating Agencies:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.collaborating_agencies ||
                              "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Community Location:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.community_location ||
                              "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Target Sector:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.target_sector || "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Number of Beneficiaries
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.number_of_beneficiaries ||
                              "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Period of Implementation/ Duration:
                          </td>
                          <td className="px-4 py-3">
                            {content.project_profile?.implementation_period ||
                              "N/A"}
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Budgetary Requirements (PhP):
                          </td>
                          <td className="px-4 py-3">
                            Php{" "}
                            {content.project_profile?.budgetary_requirements ||
                              "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {selectedHistoryData?.status === "current" ? (
                      alreadyReviewed ? (
                        <CommentInput
                          sectionName="Project Profile"
                          onCommentChange={handleCommentChange}
                          InputValue="project_profile_feedback"
                          value={
                            selectedHistoryData?.full_content?.content_pages
                              ?.project_profile?.reviews?.[0]?.comment || ""
                          }
                          disabled={alreadyReviewed}
                        />
                      ) : (
                        <CommentInput
                          sectionName="Project Profile"
                          onCommentChange={handleCommentChange}
                          InputValue="project_profile_feedback"
                        />
                      )
                    ) : (
                      <div className="mt-10 p-5 bg-green-50 border-l-4 border-green-400">
                        <div className="space-y-4">
                          {content?.project_profile?.reviews?.map((review) => (
                            <PreviousComment key={review.id} review={review} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div className="">
                      <h3 className="font-bold text-gray-900 pt-10 text-xl ">
                        II. RATIONALE
                      </h3>
                      <p className="text-base mt-3">
                        {content.rationale?.content || "N/A"}
                      </p>

                      {selectedHistoryData?.status === "current" ? (
                        alreadyReviewed ? (
                          <CommentInput
                            sectionName="Rationale"
                            onCommentChange={handleCommentChange}
                            InputValue="rationale_feedback"
                            value={
                              selectedHistoryData?.full_content?.content_pages
                                ?.rationale?.reviews?.[0]?.comment || ""
                            }
                            disabled={alreadyReviewed}
                          />
                        ) : (
                          <CommentInput
                            sectionName="Rationale"
                            onCommentChange={handleCommentChange}
                            InputValue="rationale_feedback"
                          />
                        )
                      ) : (
                        <div className="mt-10 p-5 bg-green-50 border-l-4 border-green-400">
                          <div className="space-y-4">
                            {content?.rationale?.reviews?.map((review) => (
                              <PreviousComment
                                key={review.id}
                                review={review}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional sections would continue here following the same pattern */}
                    {/* For brevity, I'm including just the key structural elements */}
                  </div>
                </section>

                {selectedHistoryData?.status === "current" && (
                  <div className="mt-10 py-6 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="max-w-5xl mx-auto flex justify-end gap-4">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || disableButton}
                        className="px-8 py-3 bg-primaryGreen text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {buttonText}
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setShowApproveConfirm(true)}
                        disabled={disableButton || hasAnyComment}
                        className="px-8 py-3 bg-primaryGreen text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-white h-[95vh] w-1/5 max-w-2xl shadow-sm border border-gray-200 flex flex-col rounded-tr-xl rounded-br-xl">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">History</h2>
              <p className="text-xs text-gray-400 mt-1">
                Recent changes of proposal
              </p>
            </div>

            <button
              onClick={() => {
                setHistory([]);
                setSelectedHistoryData(null);
                onClose();
              }}
              className="p-3 bg-gray-200 rounded-full text-black hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading ? (
              <div className="px-2 py-2 space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2 rounded-xl bg-gray-100"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-300" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                      <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No history available
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => {
                  const label =
                    item.status === "current"
                      ? "Current Proposal"
                      : `Revise ${item.version_no}`;

                  const formattedDate = new Date(
                    item.created_at,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={item.history_id}
                      onClick={() =>
                        fetchHistoryData(item.history_id, item.status)
                      }
                      className={`flex items-start gap-3 p-4 rounded-xl transition cursor-pointer ${
                        selectedHistoryData?.history_id === item.history_id
                          ? "bg-emerald-100 border-2 border-emerald-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-semibold">
                        V{item.version_no}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-medium">
                          {label}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Proposal ID {item.proposal_id} • {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showApproveConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[420px] p-6 shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Approval
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              Do you want to approve the proposal entitled{" "}
              <span className="font-semibold text-gray-800">
                "{proposalData?.title}"
              </span>
              ?
            </p>

            <p className="text-sm text-red-500 mt-2">
              Are you sure there are no comments to add?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowApproveConfirm(false);
                  handleApprove();
                }}
                disabled={isApproving}
                className="px-6 py-2 bg-primaryGreen text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                {isApproving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Approving...
                  </>
                ) : (
                  "Yes, Approve"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewerCommentModal;
