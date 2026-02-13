// components/ReviewerModal/sections/CoverPageSection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import EditableDate from '../components/EditableDate';
import EditableNumber from '../../EditableNumber';
import ReviewList from '../../ReviewList';
import { formatDate } from '../../../../utils/dateFormatters';

const CoverPageSection = ({ normalized, isEditing, updateField }) => {
  return (
    <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-sans text-gray-900 leading-relaxed">
      <div className="space-y-4 font-normal text-base">
        <SubmissionDateField
          value={normalized?.cover.submission_date}
          isEditing={isEditing}
          onChange={(val) => updateField('reviews_per_docs.cover_page.submission_date', val)}
        />

        <Salutation />

        <ProposalContent
          normalized={normalized}
          isEditing={isEditing}
          updateField={updateField}
        />

        <ClosingStatement />

        <Signatures />
      </div>

      <ReviewList reviews={normalized?.cover.reviews} />
    </section>
  );
};

const SubmissionDateField = ({ value, isEditing, onChange }) => (
  <div className={isEditing ? "bg-blue-50 rounded-lg p-3" : ""}>
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      Submission Date:
    </label>
    {isEditing ? (
      <EditableDate value={value} onChange={onChange} className="font-medium" />
    ) : (
      <p className="font-medium">{value || "N/A"}</p>
    )}
  </div>
);

const Salutation = () => (
  <>
    <div className="uppercase">
      <p className='font-bold'>DR. ROY N. VILLALOBOS</p>
      <p>University President</p>
      <p>President Ramon Magsaysay State University</p>
    </div>
    <p>Dear Sir:</p>
  </>
);

const ProposalContent = ({ normalized, isEditing, updateField }) => (
  <div className={isEditing ? "bg-blue-50 rounded-lg p-3 space-y-3" : ""}>
    <p className="text-gray-800">
      I have the honor to submit the proposal for your consideration and appropriate action 
      for the proposed extension program entitled{" "}
      <span className="inline-block">
        <EditableText
          value={normalized?.cover.proposal_summary?.program_title}
          onChange={(val) => updateField('reviews_per_docs.cover_page.proposal_summary.program_title', val)}
          className="inline"
          isEditing={isEditing}
        />
      </span>
      ,{" "}
      <span className="inline-block">
        <EditableText
          value={normalized?.cover?.board_resolution}
          onChange={(val) => updateField('reviews_per_docs.cover_page.board_resolution', val)}
          className="inline"
          isEditing={isEditing}
        />
      </span>
      {" "}with the approved budget of{" "}
      <span className="inline-block">
        <EditableText
          value={normalized?.cover.proposal_summary?.approved_budget?.words}
          onChange={(val) => updateField('reviews_per_docs.cover_page.proposal_summary.approved_budget.words', val)}
          className="inline"
          isEditing={isEditing}
        />
      </span>
      ;{" "}
      <span className="inline-block">
        <EditableText
          value={normalized?.cover.proposal_summary?.approved_budget?.amount}
          onChange={(val) => updateField('reviews_per_docs.cover_page.proposal_summary.approved_budget.amount', val)}
          className="inline"
          isEditing={isEditing}
        />
      </span>
      {" "}with the duration of{" "}
      <span className="inline-block">
        <EditableText
          value={normalized?.cover.proposal_summary?.duration?.words}
          onChange={(val) => updateField('reviews_per_docs.cover_page.proposal_summary.duration.words', val)}
          className="inline"
          isEditing={isEditing}
        />
      </span>
      {" "}years,{" "}
      <span className="inline-block">
        <EditableText
          value={normalized?.cover.proposal_summary?.proposal_coverage_period}
          onChange={(val) => updateField('reviews_per_docs.cover_page.proposal_summary.proposal_coverage_period', val)}
          className="inline"
          isEditing={isEditing}
        />
      </span>.
    </p>

    <ActivityDetails
      normalized={normalized}
      isEditing={isEditing}
      updateField={updateField}
    />

    <ParticipantDetails
      normalized={normalized}
      isEditing={isEditing}
      updateField={updateField}
    />
  </div>
);

const ActivityDetails = ({ normalized, isEditing, updateField }) => (
  <p className="text-gray-800">
    This program includes an activity entitled{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.activity_details?.title}
        onChange={(val) => updateField('reviews_per_docs.cover_page.activity_details.title', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    {" "}on{" "}
    {isEditing ? (
      <EditableDate
        value={normalized?.cover.activity_details?.date}
        onChange={(val) => updateField('reviews_per_docs.cover_page.activity_details.date', val)}
      />
    ) : (
      <span>{formatDate(normalized?.cover.activity_details?.date)}</span>
    )}
    {" "}at{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.activity_details?.venue}
        onChange={(val) => updateField('reviews_per_docs.cover_page.activity_details.venue', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    . This activity is valuable{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.activity_details?.value_statement}
        onChange={(val) => updateField('reviews_per_docs.cover_page.activity_details.value_statement', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    . The requested expenses for this activity from the university is{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.activity_details?.requested_budget}
        onChange={(val) => updateField('reviews_per_docs.cover_page.activity_details.requested_budget', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    , which will be used to defray expenses for food, transportation, supplies and materials, 
    and other expenses related to these activities.
  </p>
);

const ParticipantDetails = ({ normalized, isEditing, updateField }) => (
  <p className="text-gray-800">
    Further, there is{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.participants?.prmsu?.words}
        onChange={(val) => updateField('reviews_per_docs.cover_page.participants.prmsu.words', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    {" "}(
    <span className="inline-block">
      <EditableNumber
        value={normalized?.cover.participants?.prmsu?.count}
        onChange={(val) => updateField('reviews_per_docs.cover_page.participants.prmsu.count', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    ) the total number of participants from PRMSU, another{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.participants?.partner_agency?.words}
        onChange={(val) => updateField('reviews_per_docs.cover_page.participants.partner_agency.words', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    {" "}(
    <span className="inline-block">
      <EditableNumber
        value={normalized?.cover.participants?.partner_agency?.count}
        onChange={(val) => updateField('reviews_per_docs.cover_page.participants.partner_agency.count', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    ) from the collaborating agency,{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.participants?.partner_agency?.name}
        onChange={(val) => updateField('reviews_per_docs.cover_page.participants.partner_agency.name', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    , and{" "}
    <span className="inline-block">
      <EditableText
        value={normalized?.cover.participants?.trainees?.words}
        onChange={(val) => updateField('reviews_per_docs.cover_page.participants.trainees.words', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    {" "}(
    <span className="inline-block">
      <EditableNumber
        value={normalized?.cover.participants?.trainees?.count}
        onChange={(val) => updateField('reviews_per_docs.cover_page.participants.trainees.count', val)}
        className="inline"
        isEditing={isEditing}
      />
    </span>
    ) trainees from the abovementioned community.
  </p>
);

const ClosingStatement = () => (
  <p>Your favorable response regarding this matter will be highly appreciated.</p>
);

const Signatures = () => (
  <>
    <p className="italic">Prepared by:</p>
    <p className="py-1">Proponent</p>
    <p className="italic">Noted by:</p>

    <div className="grid grid-cols-2">
      <div>
        <p className="pt-4">Campus Extension Coordinator</p>
        <p className="pt-4 italic">Endorsed by:</p>
        <p className="pt-4"></p>
        <p className="pt-1">Campus Director</p>
        <p className="pt-4 italic">Recommending Approval:</p>
        <p className="pt-7 font-bold text-[16px]">MARLON JAMES A. DEDICATORIA, Ph.D.</p>
        <p className="pt-1">Vice-President, Research and Development</p>
      </div>

      <div>
        <p className="pt-4">College Dean</p>
        <p className="pt-4"></p>
        <p className="pt-4 font-bold text-[16px]">KATHERINE M.UY, MAEd</p>
        <p className="pt-1">Director, Extension Services</p>
        <p className="pt-4 italic">Certified Funds Available</p>
        <p className="pt-7 font-bold text-[16px]">ROBERTO C. BRIONES JR., CPA</p>
        <p className="pt-1">University Accountant IV</p>
      </div>
    </div>

    <p className="pt-10 italic text-center">Approved by:</p>
    <p className="pt-5 font-bold text-[16px] text-center">ROY N. VILLALOBOS, DPA</p>
    <p className="pt-1 text-center">University President</p>
  </>
);

export default CoverPageSection;