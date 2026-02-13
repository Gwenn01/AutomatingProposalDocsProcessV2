// components/ReviewerModal/sections/ProjectProfileSection.jsx
import React from 'react';
import EditableText from '../../EditableText';
import EditableNumber from '../../EditableNumber';
import ReviewList from '../../ReviewList';
import { SECTION_TITLES } from '../../../../constants/proposalConstants';

const ProjectProfileSection = ({ normalized, isEditing, updateField }) => {
  const profileFields = [
    {
      label: 'Program Title:',
      path: 'reviews_per_docs.project_profile.program_title',
      value: normalized?.project_profile?.program_title,
    },
    {
      label: 'Project Title:',
      path: 'reviews_per_docs.project_profile.project_title',
      value: normalized?.project_profile?.project_title,
    },
    {
      label: 'Activity Title:',
      path: 'reviews_per_docs.project_profile.activity_title',
      value: normalized?.project_profile?.activity_title,
    },
    {
      label: "SDG's",
      path: 'reviews_per_docs.project_profile.sdg_alignment',
      value: normalized?.project_profile?.sdg_alignment,
    },
    {
      label: 'Extension Agenda',
      path: 'reviews_per_docs.project_profile.extension_agenda',
      value: normalized?.project_profile?.extension_agenda,
    },
    {
      label: 'Proponents: Project Leader',
      path: 'reviews_per_docs.project_profile.proponents.project_leader',
      value: normalized?.project_profile?.proponents?.project_leader,
    },
    {
      label: 'Members:',
      path: 'reviews_per_docs.project_profile.proponents.members',
      value: normalized?.project_profile?.proponents?.members,
    },
    {
      label: 'College/Campus/Mandated Program:',
      path: 'reviews_per_docs.project_profile.college_campus_program',
      value: normalized?.project_profile?.college_campus_program,
    },
    {
      label: 'Collaborating Agencies:',
      path: 'reviews_per_docs.project_profile.collaborating_agencies',
      value: normalized?.project_profile?.collaborating_agencies,
    },
    {
      label: 'Community Location:',
      path: 'reviews_per_docs.project_profile.community_location',
      value: normalized?.project_profile?.community_location,
    },
    {
      label: 'Target Sector:',
      path: 'reviews_per_docs.project_profile.target_sector',
      value: normalized?.project_profile?.target_sector,
    },
  ];

  return (
    <>
      <h2 className="text-xl font-bold my-8">{SECTION_TITLES.PROJECT_PROFILE}</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border border-black text-sm">
          <tbody>
            {profileFields.map((field, index) => (
              <tr key={index} className="border-b border-black">
                <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                  {field.label}
                </td>
                <td className="px-4 py-3">
                  <EditableText
                    value={field.value}
                    onChange={(val) => updateField(field.path, val)}
                    isEditing={isEditing}
                  />
                </td>
              </tr>
            ))}

            <tr className="border-b border-black">
              <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                Number of Beneficiaries
              </td>
              <td className="px-4 py-3">
                <EditableNumber
                  value={normalized?.project_profile?.number_of_beneficiaries}
                  onChange={(val) => updateField('reviews_per_docs.project_profile.number_of_beneficiaries', val)}
                  isEditing={isEditing}
                />
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                Period of Implementation/ Duration:
              </td>
              <td className="px-4 py-3">
                <EditableText
                  value={normalized?.project_profile?.implementation_period}
                  onChange={(val) => updateField('reviews_per_docs.project_profile.implementation_period', val)}
                  isEditing={isEditing}
                />
              </td>
            </tr>

            <tr className="border-b border-black">
              <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                Budgetary Requirements (PhP): 
              </td>
              <td className="px-4 py-3">
                Php{" "}
                <EditableNumber
                  value={normalized?.project_profile?.budgetary_requirements}
                  onChange={(val) => updateField('reviews_per_docs.project_profile.budgetary_requirements', val)}
                  isEditing={isEditing}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <ReviewList reviews={normalized?.project_profile.reviews} />
      </div>
    </>
  );
};

export default ProjectProfileSection;