import React from "react";
import { X } from "lucide-react";

import { getStatusStyle } from "../../utils/statusStyles";

// ================= TYPE DEFINITIONS =================

interface BudgetWords {
  words: string;
  amount: string;
}

interface Duration {
  words: string;
}

interface ProposalSummary {
  program_title: string;
  approved_budget: BudgetWords;
  duration: Duration;
  coverage_period: string;
}

interface ActivityDetails {
  title: string;
  venue: string;
  value_statement: string;
  requested_budget: string;
}

interface ParticipantCount {
  words: string;
  count: number;
}

interface ParticipantPartnerAgency extends ParticipantCount {
  name: string;
}

interface Participants {
  prmsu: ParticipantCount;
  partner_agency: ParticipantPartnerAgency;
  trainees: ParticipantCount;
}

interface CoverPage {
  submission_date?: string;
  proposal_summary?: ProposalSummary;
  activity_details?: ActivityDetails;
  participants?: Participants;
}

interface CoverPages {
  cover_pages?: CoverPage;
}

interface Proponents {
  project_leader: string;
  members: string;
}

interface ProjectProfile {
  program_title: string;
  project_title: string;
  activity_title: string;
  sdg_alignment: string;
  extension_agenda: string;
  proponents: Proponents;
  college_campus_program: string;
  collaborating_agencies: string;
  community_location: string;
  target_sector: string;
  number_of_beneficiaries: string;
  implementation_period: string;
  budgetary_requirements: string;
}

interface Objectives {
  general: string;
  specific: string;
}

interface SixPs {
  publications: string;
  patents: string;
  products: string;
  people_services: string;
  places_partnerships: string;
  policy: string;
  social_impact: string;
  economic_impact: string;
}

interface ExpectedOutputOutcome {
  "6ps": SixPs;
}

interface OrganizationStaffing {
  activity: string;
  designation: string;
  terms: string;
}

interface ScheduleItem {
  time: string;
  activity: string;
  speaker: string;
}

interface PlanOfActivities {
  activity_title: string;
  activity_date: string;
  schedule: ScheduleItem[];
}

interface BudgetItem {
  item: string;
  cost: string | number;
  qty: string | number;
  amount: string | number;
}

interface BudgetTotals {
  grand_total: string | number;
}

interface BudgetaryRequirement {
  meals?: BudgetItem[];
  transport?: BudgetItem[];
  supplies?: BudgetItem[];
  totals?: BudgetTotals;
}

interface ContentPage {
  project_profile?: ProjectProfile;
  rationale?: string;
  significance?: string;
  objectives?: Objectives;
  methodology?: string;
  expected_output_outcome?: ExpectedOutputOutcome;
  sustainability_plan?: string;
  organization_and_staffing?: OrganizationStaffing[];
  plan_of_activities?: PlanOfActivities;
  budgetary_requirement?: BudgetaryRequirement;
}

interface ContentPages {
  content_pages?: ContentPage;
}

interface ProposalData {
  title: string;
  status: string;
  cover_page?: CoverPages;
  full_content?: ContentPages;
  [key: string]: any;
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: ProposalData | null;
}

// ================= COMPONENT =================

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  proposalData,
}) => {
  if (!isOpen || !proposalData) return null;

  // Correct mapping based on actual API structure
  const cover: CoverPage = proposalData.cover_page?.cover_pages || {};
  const content: ContentPage = proposalData.full_content?.content_pages || {};

  const statusStyle = getStatusStyle(proposalData.status);

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-overlay-enter">
        {/* 4. Apply the Modal Pop-in Animation Class */}
        <div className="bg-white w-full max-w-5xl h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-modal-enter">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-5 border-b bg-primaryGreen text-white">
            <div>
              <h3 className="font-semibold text-xs">Proposal Details</h3>

              <h1 className="text-lg font-bold mb-2">{proposalData.title}</h1>

              <span
                className={`inline-block px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold ${statusStyle.className}`}
              >
                {statusStyle.label}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-white rounded-full text-black hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-14 overflow-auto bg-white">
            {/* ========== COVER PAGE SECTION ========== */}
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
                  I have the honor to submit the proposal for your consideration
                  and appropriate action for the proposed extension program
                  entitled{" "}
                  {cover.proposal_summary?.program_title || "N/A"}, with the
                  approved budget of{" "}
                  {cover.proposal_summary?.approved_budget?.words || "N/A"};{" "}
                  {cover.proposal_summary?.approved_budget?.amount || "N/A"}{" "}
                  with the duration of{" "}
                  {cover.proposal_summary?.duration?.words || "N/A"} years,{" "}
                  {cover.proposal_summary?.coverage_period || "N/A"}.
                </p>

                <p>
                  This program includes an activity entitled{" "}
                  {cover.activity_details?.title || "N/A"} on{" "}
                  {content.plan_of_activities?.activity_date
                    ? new Date(
                        content.plan_of_activities.activity_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}{" "}
                  at {cover.activity_details?.venue || "N/A"}. This activity is
                  valuable {cover.activity_details?.value_statement || "N/A"}.
                  The requested expenses for this activity from the university
                  is {cover.activity_details?.requested_budget || "N/A"}, which
                  will be used to defray expenses for food, transportation,
                  supplies and materials, and other expenses related to these
                  activities.
                </p>

                <p>
                  Further, there is {cover.participants?.prmsu?.words || "N/A"}{" "}
                  ({cover.participants?.prmsu?.count || "N/A"}) the total number
                  of participants from PRMSU, another{" "}
                  {cover.participants?.partner_agency?.words || "N/A"} (
                  {cover.participants?.partner_agency?.count || "N/A"}) from the
                  collaborating agency,{" "}
                  {cover.participants?.partner_agency?.name || "N/A"}, and{" "}
                  {cover.participants?.trainees?.words || "N/A"} (
                  {cover.participants?.trainees?.count || "N/A"}) trainees from
                  the abovementioned community.
                </p>

                <p className="">
                  Your favorable response regarding this matter will be highly
                  appreciated.
                </p>

                <p className="italic">Prepared by:</p>
                <p className="py-1">Proponent</p>
                <p className="italic">Noted by:</p>

                <div className="">
                  <div className="grid grid-cols-2">
                    <div className="">
                      <p className="pt-4">Campus Extension Coordinator </p>
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
                      <p className="pt-4">College Dean </p>
                      <p className="pt-4"></p>
                      <p className="pt-4 font-bold text-[16px]">
                        KATHERINE M.UY, MAEd
                      </p>
                      <p className="pt-1"> Director, Extension Services</p>
                      <p className="pt-4 italic">Certified Funds Available</p>
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

            {/* ========== CONTENT PAGE SECTION ========== */}
            <section>
              <h2 className="text-xl font-bold my-8">I. PROJECT PROFILE</h2>
              {/* ========== I. PROJECT PROFILE ========== */}
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
                        {content.project_profile?.proponents?.project_leader ||
                          "N/A"}
                      </td>
                    </tr>

                    <tr className="border-b border-black">
                      <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                        Members:
                      </td>
                      <td className="px-4 py-3">
                        {content.project_profile?.proponents?.members || "N/A"}
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
                        {content.project_profile?.community_location || "N/A"}
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
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <div className="">
                  <h3 className="font-bold text-gray-900 pt-10 text-xl ">
                    II. RATIONALE
                  </h3>
                  <p className="text-base mt-3">
                    {content.rationale || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 pt-5 text-xl ">
                    III. SIGNIFICANCE
                  </h3>
                  <p className="text-base mt-3">
                    {content.significance || "N/A"}
                  </p>
                </div>

                {/* OBJECTIVES */}
                <div className="">
                  <h3 className="font-bold text-gray-900 pt-5 text-xl ">
                    IV. OBJECTIVES
                  </h3>
                  <p className="text-base font-semibold mb-2 mt-3">
                    {" "}
                    General Objectives
                  </p>
                  <p className="p-5 bg-gray-100">
                    {content.objectives?.general || "N/A"}
                  </p>
                  <p className="text-base font-semibold mb-2 mt-3">
                    Specific Objectives
                  </p>
                  <p className="p-5 bg-gray-100">
                    {content.objectives?.specific || "N/A"}
                  </p>
                </div>

                <div className="">
                  <h3 className="font-bold text-gray-900 pt-10 text-xl ">
                    V. METHODOLOGY
                  </h3>
                  <p className="text-base mt-3">
                    {content.methodology || "N/A"}
                  </p>
                </div>

                <div className="">
                  <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">
                    VI. EXPECTED OUTPUT/OUTCOME
                  </h3>

                  <table className="w-full border border-black text-sm">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900 text-center">
                          6Ps
                        </td>
                        <td className="px-4 py-3 text-center font-bold">
                          OUTPUT
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                          Publications
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]
                            ?.publications || "N/A"}
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                          Patents/IP
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]?.patents ||
                            "N/A"}
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                          Products
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]?.products ||
                            "N/A"}
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                          People Services
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]
                            ?.people_services || "N/A"}
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                          Places and Partnerships
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]
                            ?.places_partnerships || "N/A"}
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                          Policy
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]?.policy ||
                            "N/A"}
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                          Social Impact
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]
                            ?.social_impact || "N/A"}
                        </td>
                      </tr>

                      <tr className="border-b border-black">
                        <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                          Economic Impact
                        </td>
                        <td className="px-4 py-3">
                          {content?.expected_output_outcome?.["6ps"]
                            ?.economic_impact || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="">
                  <h3 className="font-bold text-gray-900 pt-10 text-xl ">
                    VII. SUSTAINABILITY PLAN
                  </h3>
                  <p className="text-base mt-3">
                    {content.sustainability_plan || "N/A"}
                  </p>
                </div>

                <div className="">
                  <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">
                    VIII. ORGANIZATION AND STAFFING{" "}
                    <span className="text-base italic font-semibold">
                      (Persons involved and responsibility){" "}
                    </span>
                  </h3>

                  <table className="w-full border border-black text-sm">
                    <tbody>
                      {/* TABLE HEADER */}
                      <tr className="border-b border-black">
                        <td className="w-1/3 border-r border-black px-4 py-3 text-center font-bold">
                          Activity/s
                        </td>
                        <td className="w-1/3 border-r border-black px-4 py-3 text-center font-bold">
                          Designation / Name
                        </td>
                        <td className="w-1/3 px-4 py-3 text-center font-bold">
                          Terms of Reference
                        </td>
                      </tr>

                      {/* TABLE BODY */}
                      {content?.organization_and_staffing &&
                      content.organization_and_staffing.length > 0 ? (
                        content.organization_and_staffing.map((item, index) => (
                          <tr key={index} className="border-b border-black">
                            <td className="border-r border-black px-4 py-3 text-gray-900">
                              {item.activity || "N/A"}
                            </td>

                            <td className="border-r border-black px-4 py-3 whitespace-pre-line">
                              {item.designation || "N/A"}
                            </td>

                            <td className="px-4 py-3 text-gray-900 whitespace-pre-line">
                              {item.terms || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center px-4 py-3 text-gray-500"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="">
                  <h3 className="font-bold text-gray-900 pt-10 text-xl ">
                    IX. PLAN OF ACTIVITIES
                  </h3>
                  <p className="text-xl font-bold mt-3 text-center">
                    {content.plan_of_activities?.activity_title || "N/A"}
                  </p>
                  <p className="text-lg mt-3 text-center">
                    {content.plan_of_activities?.activity_date
                      ? new Date(
                          content.plan_of_activities.activity_date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>

                  <p className="text-lg mt-2 mb-5 text-center font-semibold">
                    PROGRAMME
                  </p>

                  <table className="w-full border border-black text-sm">
                    <tbody>
                      {/* TABLE HEADER */}
                      <tr className="border-b border-black">
                        <td className="w-1/5 border-r border-black px-4 py-3 text-center font-bold">
                          Time
                        </td>
                        <td className="w-1/3 border-r border-black px-4 py-3 text-center font-bold">
                          Part of the program
                        </td>
                      </tr>

                      {/* TABLE BODY */}
                      {content?.plan_of_activities?.schedule &&
                      content.plan_of_activities.schedule.length > 0 ? (
                        content.plan_of_activities.schedule.map(
                          (item, index) => (
                            <tr key={index} className="border-b border-black">
                              <td className="border-r border-black px-4 py-3 text-gray-900">
                                {item.time || "N/A"}
                              </td>

                              <td className="border-r border-black px-4 py-3 whitespace-pre-line">
                                <p>{item.activity || "Not Assigned"}</p>
                                <p>{item.speaker || "Not Assigned"}</p>
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center px-4 py-3 text-gray-500"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="">
                  <h3 className="font-bold text-gray-900 pt-10 text-xl ">
                    XI. BUDGETARY REQUIREMENT{" "}
                  </h3>
                  <table className="w-full border border-black text-sm mt-6">
                    <tbody>
                      {/* TABLE HEADER */}
                      <tr className="border-b border-black bg-gray-100">
                        <td className="border-r border-black px-4 py-3 font-bold text-center">
                          CATEGORY
                        </td>
                        <td className="border-r border-black px-4 py-3 font-bold text-center">
                          ITEM
                        </td>
                        <td className="border-r border-black px-4 py-3 font-bold text-center">
                          <p>Cost (PHP)</p>
                        </td>
                        <td className="border-r border-black px-4 py-3 font-bold text-center">
                          PAX/QTY.
                        </td>
                        <td className="px-4 py-3 font-bold text-center">
                          AMOUNT
                        </td>
                      </tr>

                      {/* MEALS */}
                      {content?.budgetary_requirement?.meals?.map(
                        (row, index) => (
                          <tr
                            key={`meals-${index}`}
                            className="border-b border-black"
                          >
                            <td className="border-r border-black px-4 py-3">
                              Meals
                            </td>
                            <td className="border-r border-black px-4 py-3">
                              {row.item}
                            </td>
                            <td className="border-r border-black px-4 py-3 text-right">
                              ₱ {row.cost}
                            </td>
                            <td className="border-r border-black px-4 py-3 text-right">
                              {row.qty}
                            </td>
                            <td className="px-4 py-3 text-right">
                              ₱ {row.amount}
                            </td>
                          </tr>
                        )
                      )}

                      {/* TRANSPORT */}
                      {content?.budgetary_requirement?.transport?.map(
                        (row, index) => (
                          <tr
                            key={`transport-${index}`}
                            className="border-b border-black"
                          >
                            <td className="border-r border-black px-4 py-3">
                              Transport
                            </td>
                            <td className="border-r border-black px-4 py-3">
                              {row.item}
                            </td>
                            <td className="border-r border-black px-4 py-3 text-right">
                              ₱ {row.cost}
                            </td>
                            <td className="border-r border-black px-4 py-3 text-right">
                              {row.qty}
                            </td>
                            <td className="px-4 py-3 text-right">
                              ₱ {row.amount}
                            </td>
                          </tr>
                        )
                      )}

                      {/* SUPPLIES */}
                      {content?.budgetary_requirement?.supplies?.map(
                        (row, index) => (
                          <tr
                            key={`supplies-${index}`}
                            className="border-b border-black"
                          >
                            <td className="border-r border-black px-4 py-3">
                              Supplies
                            </td>
                            <td className="border-r border-black px-4 py-3">
                              {row.item}
                            </td>
                            <td className="border-r border-black px-4 py-3 text-right">
                              ₱ {row.cost}
                            </td>
                            <td className="border-r border-black px-4 py-3 text-right">
                              {row.qty}
                            </td>
                            <td className="px-4 py-3 text-right">
                              ₱ {row.amount}
                            </td>
                          </tr>
                        )
                      )}

                      {/* TOTALS */}
                      <tr className="font-bold bg-gray-100">
                        <td
                          colSpan={4}
                          className="border-r border-black px-4 py-3 text-right"
                        >
                          Grand Total
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p>
                            ₱{" "}
                            {content?.budgetary_requirement?.totals
                              ?.grand_total || 0}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="py-4">
                  <p className="italic my-3">Prepared by:</p>
                  <p className="py-1 mb-2">Proponent</p>
                  <p className="italic">Noted by:</p>

                  <div className="">
                    <div className="grid grid-cols-2">
                      <div className="">
                        <p className="pt-4">Campus Extension Coordinator </p>
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
                        <p className="pt-4">College Dean </p>
                        <p className="pt-4"></p>
                        <p className="pt-4 font-bold text-[16px]">
                          KATHERINE M.UY, MAEd
                        </p>
                        <p className="pt-1"> Director, Extension Services</p>
                        <p className="pt-4 italic">Certified Funds Available</p>
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
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentViewerModal;