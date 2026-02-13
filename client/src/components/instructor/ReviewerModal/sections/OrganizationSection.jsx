// components/ReviewerModal/sections/OrganizationSection.jsx
import React from 'react';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const OrganizationSection = ({ normalized, isEditing, setEditedData }) => {
  const handleFieldChange = (index, field, value) => {
    setEditedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData.reviews_per_docs.organization_and_staffing.organization_and_staffing_content[index]) {
        newData.reviews_per_docs.organization_and_staffing.organization_and_staffing_content[index] = {};
      }
      newData.reviews_per_docs.organization_and_staffing.organization_and_staffing_content[index][field] = value;
      return newData;
    });
  };

  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">
        {SECTION_TITLES.ORGANIZATION}{" "}
        <span className="text-base italic font-semibold">
          (Persons involved and responsibility)
        </span>
      </h3>

      <table className="w-full border border-black text-sm">
        <tbody>
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

          {normalized?.organization?.content.length > 0 ? (
            normalized.organization.content.map((item, index) => (
              <tr key={index} className="border-b border-black">
                <td className="border-r border-black px-4 py-3 text-gray-900">
                  {item.activity || "N/A"}
                </td>
                <td className="border-r border-black px-4 py-3 whitespace-pre-line">
                  {isEditing ? (
                    <textarea
                      value={item.designation || ""}
                      onChange={(e) => handleFieldChange(index, 'designation', e.target.value)}
                      className="w-full border-2 border-blue-500 rounded-lg px-2 py-1"
                      rows={3}
                    />
                  ) : (
                    item.designation || "N/A"
                  )}
                </td>
                <td className="px-4 py-3 text-gray-900 whitespace-pre-line">
                  {isEditing ? (
                    <textarea
                      value={item.terms || ""}
                      onChange={(e) => handleFieldChange(index, 'terms', e.target.value)}
                      className="w-full border-2 border-blue-500 rounded-lg px-2 py-1"
                      rows={3}
                    />
                  ) : (
                    item.terms || "N/A"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center px-4 py-3 text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ReviewList reviews={normalized?.organization.reviews} />
    </div>
  );
};

export default OrganizationSection;