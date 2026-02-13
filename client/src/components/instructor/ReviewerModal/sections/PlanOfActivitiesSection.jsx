// components/ReviewerModal/sections/PlanOfActivitiesSection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import EditableDate from '../components/EditableDate';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';
import { formatDate } from '../../../../utils/dateFormatters';

const PlanOfActivitiesSection = ({ normalized, isEditing, updateField, setEditedData }) => {
  const handleScheduleFieldChange = (index, field, value) => {
    setEditedData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.reviews_per_docs.plan_of_activities.plan_of_activities_content.schedule[index][field] = value;
      return newData;
    });
  };

  return (
    <div>
      <h3 className="font-bold text-gray-900 pt-10 text-xl">
        {SECTION_TITLES.PLAN_OF_ACTIVITIES}
      </h3>
      
      <div className={isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"}>
        <EditableText
          value={normalized?.planOfActivities?.content?.activity_title}
          onChange={(val) => updateField('reviews_per_docs.plan_of_activities.plan_of_activities_content.activity_title', val)}
          className="text-xl font-bold text-center"
          isEditing={isEditing}
        />
      </div>

      <p className="text-lg mt-3 text-center">
        {isEditing ? (
          <EditableDate
            value={normalized?.planOfActivities?.content?.activity_date}
            onChange={(val) => updateField('reviews_per_docs.plan_of_activities.plan_of_activities_content.activity_date', val)}
          />
        ) : (
          formatDate(normalized?.planOfActivities?.content?.activity_date)
        )}
      </p>

      <p className="text-lg mt-2 mb-5 text-center font-semibold">PROGRAMME</p>

      <table className="w-full border border-black text-sm">
        <tbody>
          <tr className="border-b border-black">
            <td className="w-1/5 border-r border-black px-4 py-3 text-center font-bold">
              Time
            </td>
            <td className="w-1/3 border-r border-black px-4 py-3 text-center font-bold">
              Part of the program
            </td>
          </tr>

          {normalized?.planOfActivities?.content?.schedule?.length > 0 ? (
            normalized.planOfActivities.content.schedule.map((item, index) => (
              <tr key={index} className="border-b border-black">
                <td className="border-r border-black px-4 py-3 text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.time || ""}
                      onChange={(e) => handleScheduleFieldChange(index, 'time', e.target.value)}
                      className="w-full border-2 border-blue-500 rounded-lg px-2 py-1"
                    />
                  ) : (
                    item.time || "N/A"
                  )}
                </td>
                <td className="border-r border-black px-4 py-3 whitespace-pre-line">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.activity || ""}
                        onChange={(e) => handleScheduleFieldChange(index, 'activity', e.target.value)}
                        placeholder="Activity"
                        className="w-full border-2 border-blue-500 rounded-lg px-2 py-1"
                      />
                      <input
                        type="text"
                        value={item.speaker || ""}
                        onChange={(e) => handleScheduleFieldChange(index, 'speaker', e.target.value)}
                        placeholder="Speaker"
                        className="w-full border-2 border-blue-500 rounded-lg px-2 py-1"
                      />
                    </div>
                  ) : (
                    <>
                      <p>{item.activity || "Not Assigned"}</p>
                      <p>{item.speaker || "Not Assigned"}</p>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center px-4 py-3 text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ReviewList reviews={normalized?.planOfActivities.reviews} />
    </div>
  );
};

export default PlanOfActivitiesSection;