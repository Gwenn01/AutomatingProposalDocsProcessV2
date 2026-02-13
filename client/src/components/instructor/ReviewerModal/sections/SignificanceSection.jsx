// components/ReviewerModal/sections/SignificanceSection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const SignificanceSection = ({ normalized, isEditing, updateField }) => {
  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-5 text-xl">
        {SECTION_TITLES.SIGNIFICANCE}
      </h3>
      <div className={isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"}>
        <EditableText
          value={normalized?.significance.content}
          onChange={(val) => updateField('reviews_per_docs.significance.significance_content', val)}
          multiline={true}
          className="text-base"
          isEditing={isEditing}
        />
      </div>

      <ReviewList reviews={normalized?.significance.reviews} />
    </div>
  );
};

export default SignificanceSection;