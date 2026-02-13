// components/ReviewerModal/sections/MethodologySection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const MethodologySection = ({ normalized, isEditing, updateField }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-10 text-xl">
        {SECTION_TITLES.METHODOLOGY}
      </h3>
      <div className={isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"}>
        <EditableText
          value={normalized?.methodology.content}
          onChange={(val) => updateField('reviews_per_docs.methodology.methodology_content', val)}
          multiline={true}
          className="text-base"
          isEditing={isEditing}
        />
      </div>

      <ReviewList reviews={normalized?.methodology.reviews} />
    </div>
  );
};

export default MethodologySection;