// components/ReviewerModal/sections/RationaleSection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const RationaleSection = ({ normalized, isEditing, updateField }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-10 text-xl">
        {SECTION_TITLES.RATIONALE}
      </h3>
      <div className={isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"}>
        <EditableText
          value={normalized?.rationale.content}
          onChange={(val) => updateField('reviews_per_docs.rationale.rationale_content', val)}
          multiline={true}
          className="text-base"
          isEditing={isEditing}
        />
      </div>

      <ReviewList reviews={normalized?.rationale.reviews} />
    </div>
  );
};

export default RationaleSection;