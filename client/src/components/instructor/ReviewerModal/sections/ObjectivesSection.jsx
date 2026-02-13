// components/ReviewerModal/sections/ObjectivesSection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const ObjectivesSection = ({ normalized, isEditing, updateField }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-5 text-xl">
        {SECTION_TITLES.OBJECTIVES}
      </h3>
      
      <p className="text-base font-semibold mb-2 mt-3">General Objectives</p>
      <div className={isEditing ? "bg-blue-50 rounded-lg p-4" : "p-5 bg-gray-100"}>
        <EditableText
          value={normalized?.objectives?.general}
          onChange={(val) => updateField('reviews_per_docs.objectives.general_content', val)}
          multiline={true}
          isEditing={isEditing}
        />
      </div>

      <ReviewList reviews={normalized?.objectives.reviewsGeneral} />

      <p className="text-base font-semibold mb-2 mt-3">Specific Objectives</p>
      <div className={isEditing ? "bg-blue-50 rounded-lg p-4" : "p-5 bg-gray-100"}>
        <EditableText
          value={normalized?.objectives?.specific}
          onChange={(val) => updateField('reviews_per_docs.objectives.specific_content', val)}
          multiline={true}
          isEditing={isEditing}
        />
      </div>

      <ReviewList reviews={normalized?.objectives.reviewsSpecific} />
    </div>
  );
};

export default ObjectivesSection;