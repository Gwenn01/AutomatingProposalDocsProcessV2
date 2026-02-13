// components/ReviewerModal/sections/ExpectedOutputSection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const ExpectedOutputSection = ({ normalized, isEditing, updateField }) => {
  const outputFields = [
    { label: 'Publications', key: 'publications' },
    { label: 'Patents/IP', key: 'patents' },
    { label: 'Products', key: 'products' },
    { label: 'People Services', key: 'people_services' },
    { label: 'Places and Partnerships', key: 'places_partnerships' },
    { label: 'Policy', key: 'policy' },
    { label: 'Social Impact', key: 'social_impact' },
    { label: 'Economic Impact', key: 'economic_impact' },
  ];

  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">
        {SECTION_TITLES.EXPECTED_OUTPUT}
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

          {outputFields.map((field, index) => (
            <tr key={index} className="border-b border-black">
              <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                {field.label}
              </td>
              <td className="px-4 py-3">
                <EditableText
                  value={normalized?.expectedOutput?.content?.[field.key]}
                  onChange={(val) => updateField(`reviews_per_docs.expected_output_outcome.6ps.${field.key}`, val)}
                  isEditing={isEditing}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReviewList reviews={normalized?.expectedOutput.reviews} />
    </div>
  );
};

export default ExpectedOutputSection;