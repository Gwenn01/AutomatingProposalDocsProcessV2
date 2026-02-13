// components/ReviewerModal/sections/ContentSection.jsx
import React from 'react';
import ProjectProfileSection from './ProjectProfileSection';
import RationaleSection from './RationaleSection';
import SignificanceSection from './SignificanceSection';
import ObjectivesSection from './ObjectivesSection';
import MethodologySection from './MethodologySection';
import ExpectedOutputSection from './ExpectedOutputSection';
import SustainabilitySection from './SustainabilitySection';
import OrganizationSection from './OrganizationSection';
import PlanOfActivitiesSection from './PlanOfActivitiesSection';
import BudgetarySection from './BudgetarySection';
import FooterSignatures from './FooterSignatures';

const ContentSection = ({ normalized, isEditing, updateField, setEditedData }) => {
  return (
    <section>
      <ProjectProfileSection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
      />

      <RationaleSection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
      />

      <SignificanceSection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
      />

      <ObjectivesSection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
      />

      <MethodologySection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
      />

      <ExpectedOutputSection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
      />

      <SustainabilitySection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
      />

      <OrganizationSection
        normalized={normalized}
        isEditing={isEditing}
        setEditedData={setEditedData}
      />

      <PlanOfActivitiesSection
        normalized={normalized}
        isEditing={isEditing}
        updateField={updateField}
        setEditedData={setEditedData}
      />

      <BudgetarySection
        normalized={normalized}
        isEditing={isEditing}
        setEditedData={setEditedData}
      />

      <FooterSignatures />
    </section>
  );
};

export default ContentSection;