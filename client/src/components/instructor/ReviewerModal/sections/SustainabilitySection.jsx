// components/ReviewerModal/sections/SustainabilitySection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const SustainabilitySection = ({ normalized, isEditing, updateField }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-10 text-xl">
        {SECTION_TITLES.SUSTAINABILITY}
      </h3>
      <div className={isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"}>
        <EditableText
          value={normalized?.sustainability.content}
          onChange={(val) => updateField('reviews_per_docs.sustainability_plan.sustainability_plan_content', val)}
          multiline={true}
          className="text-base"
          isEditing={isEditing}
        />
      </div>

      <ReviewList reviews={normalized?.sustainability.reviews} />
    </div>
  );
};

export default SustainabilitySection;