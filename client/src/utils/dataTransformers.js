// utils/dataTransformers.js
export const safeParse = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("Failed to parse:", value, e);
    return fallback;
  }
};

export const cleanNumeric = (value) => {
  if (!value || value === "") return null;
  const cleaned = String(value).replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

export const normalizeProposalData = (activeRpd) => {
  if (!activeRpd) return null;

  return {
    cover: activeRpd.cover_page || {},
    project_profile: activeRpd.project_profile || {},
    rationale: {
      content: activeRpd.rationale?.rationale_content || "",
      reviews: activeRpd.rationale?.reviews || [],
    },
    significance: {
      content: activeRpd.significance?.significance_content || "",
      reviews: activeRpd.significance?.reviews || [],
    },
    methodology: {
      content: activeRpd.methodology?.methodology_content || "",
      reviews: activeRpd.methodology?.reviews || [],
    },
    objectives: {
      general: activeRpd.objectives?.general_content || "",
      specific: activeRpd.objectives?.specific_content || "",
      reviewsGeneral: activeRpd.objectives?.reviews_general || [],
      reviewsSpecific: activeRpd.objectives?.reviews_specific || [],
    },
    planOfActivities: {
      content: {
        activity_title: activeRpd.plan_of_activities?.plan_of_activities_content?.activity_title || "",
        activity_date: activeRpd.plan_of_activities?.plan_of_activities_content?.activity_date || "",
        schedule: Array.isArray(activeRpd.plan_of_activities?.plan_of_activities_content?.schedule)
          ? activeRpd.plan_of_activities.plan_of_activities_content.schedule
          : []
      },
      reviews: activeRpd.plan_of_activities?.reviews || [],
    },
    organization: {
      content: Array.isArray(activeRpd.organization_and_staffing?.organization_and_staffing_content)
        ? activeRpd.organization_and_staffing.organization_and_staffing_content
        : [],
      reviews: activeRpd.organization_and_staffing?.reviews || [],
    },
    expectedOutput: {
      content: activeRpd.expected_output_outcome?.["6ps"] || {},
      reviews: activeRpd.expected_output_outcome?.reviews || [],
    },
    sustainability: {
      content: activeRpd.sustainability_plan?.sustainability_plan_content || "",
      reviews: activeRpd.sustainability_plan?.reviews || [],
    },
    budget: {
      content: {
        meals: Array.isArray(activeRpd.budgetary_requirement?.budgetary_requirement?.meals)
          ? activeRpd.budgetary_requirement.budgetary_requirement.meals
          : [],
        supplies: Array.isArray(activeRpd.budgetary_requirement?.budgetary_requirement?.supplies)
          ? activeRpd.budgetary_requirement.budgetary_requirement.supplies
          : [],
        transport: Array.isArray(activeRpd.budgetary_requirement?.budgetary_requirement?.transport)
          ? activeRpd.budgetary_requirement.budgetary_requirement.transport
          : [],
        totals: activeRpd.budgetary_requirement?.budgetary_requirement?.totals || {}
      },
      reviews: activeRpd.budgetary_requirement?.reviews || [],
    },
  };
};

export const preparePayloadForSave = (editedData, userId, contentId, coverId) => {
  return {
    proposal_id: editedData.proposal_id,
    user_id: userId,
    content_id: contentId,
    cover_id: coverId,

    cover: {
      submission_date: editedData.reviews_per_docs?.cover_page?.submission_date || null,
      board_resolution_title: editedData.reviews_per_docs?.cover_page?.proposal_summary?.program_title || null,
      board_resolution_no: editedData.reviews_per_docs?.cover_page?.board_resolution || null,
      approved_budget_words: editedData.reviews_per_docs?.cover_page?.proposal_summary?.approved_budget?.words || null,
      approved_budget_amount: cleanNumeric(editedData.reviews_per_docs?.cover_page?.proposal_summary?.approved_budget?.amount),
      duration_words: editedData.reviews_per_docs?.cover_page?.proposal_summary?.duration?.words || null,
      duration_years: cleanNumeric(editedData.reviews_per_docs?.cover_page?.proposal_summary?.duration?.years),
      date_from_to: editedData.reviews_per_docs?.cover_page?.proposal_summary?.proposal_coverage_period || null,
      activity_title: editedData.reviews_per_docs?.cover_page?.activity_details?.title || null,
      activity_date: editedData.reviews_per_docs?.cover_page?.activity_details?.date || null,
      activity_venue: editedData.reviews_per_docs?.cover_page?.activity_details?.venue || null,
      activity_value_statement: editedData.reviews_per_docs?.cover_page?.activity_details?.value_statement || null,
      requested_activity_budget: cleanNumeric(editedData.reviews_per_docs?.cover_page?.activity_details?.requested_budget),
      prmsu_participants_words: editedData.reviews_per_docs?.cover_page?.participants?.prmsu?.words || null,
      prmsu_participants_num: cleanNumeric(editedData.reviews_per_docs?.cover_page?.participants?.prmsu?.count),
      partner_agency_participants_words: editedData.reviews_per_docs?.cover_page?.participants?.partner_agency?.words || null,
      partner_agency_participants_num: cleanNumeric(editedData.reviews_per_docs?.cover_page?.participants?.partner_agency?.count),
      partner_agency_name: editedData.reviews_per_docs?.cover_page?.participants?.partner_agency?.name || null,
      trainees_words: editedData.reviews_per_docs?.cover_page?.participants?.trainees?.words || null,
      trainees_num: cleanNumeric(editedData.reviews_per_docs?.cover_page?.participants?.trainees?.count),
    },

    content: {
      program_title: editedData.reviews_per_docs?.project_profile?.program_title || null,
      project_title: editedData.reviews_per_docs?.project_profile?.project_title || null,
      activity_title: editedData.reviews_per_docs?.project_profile?.activity_title || null,
      sdg_alignment: editedData.reviews_per_docs?.project_profile?.sdg_alignment || null,
      extension_agenda: editedData.reviews_per_docs?.project_profile?.extension_agenda || null,
      project_leader: editedData.reviews_per_docs?.project_profile?.proponents?.project_leader || null,
      members: editedData.reviews_per_docs?.project_profile?.proponents?.members || null,
      college_campus_program: editedData.reviews_per_docs?.project_profile?.college_campus_program || null,
      collaborating_agencies: editedData.reviews_per_docs?.project_profile?.collaborating_agencies || null,
      community_location: editedData.reviews_per_docs?.project_profile?.community_location || null,
      target_sector: editedData.reviews_per_docs?.project_profile?.target_sector || null,
      number_of_beneficiaries: cleanNumeric(editedData.reviews_per_docs?.project_profile?.number_of_beneficiaries),
      implementation_period: editedData.reviews_per_docs?.project_profile?.implementation_period || null,
      total_budget_requested: cleanNumeric(editedData.reviews_per_docs?.project_profile?.budgetary_requirements),
      rationale: editedData.reviews_per_docs?.rationale?.rationale_content || null,
      significance: editedData.reviews_per_docs?.significance?.significance_content || null,
      general_objectives: editedData.reviews_per_docs?.objectives?.general_content || null,
      specific_objectives: editedData.reviews_per_docs?.objectives?.specific_content || null,
      methodology: editedData.reviews_per_docs?.methodology?.methodology_content || null,
      expected_output_6ps: editedData.reviews_per_docs?.expected_output_outcome?.["6ps"] || null,
      social_impact: editedData.reviews_per_docs?.expected_output_outcome?.social_impact || null,
      economic_impact: editedData.reviews_per_docs?.expected_output_outcome?.economic_impact || null,
      sustainability_plan: editedData.reviews_per_docs?.sustainability_plan?.sustainability_plan_content || null,
      org_and_staffing_json: editedData.reviews_per_docs?.organization_and_staffing?.organization_and_staffing_content || null,
      activity_schedule_json: editedData.reviews_per_docs?.plan_of_activities?.plan_of_activities_content || null,
      budget_breakdown_json: editedData.reviews_per_docs?.budgetary_requirement?.budgetary_requirement || null,
      prmsu_participants_count: cleanNumeric(editedData.reviews_per_docs?.cover_page?.participants?.prmsu?.count),
      partner_agency_participants_count: cleanNumeric(editedData.reviews_per_docs?.cover_page?.participants?.partner_agency?.count),
      trainees_count: cleanNumeric(editedData.reviews_per_docs?.cover_page?.participants?.trainees?.count),
    },
  };
};

export const structureHistoryData = (data, proposalData, status, historyId) => {
  return {
    ...proposalData,
    status,
    history_id: historyId,
    content_id: data?.content_id,
    cover_id: data?.cover_id,

    reviews_per_docs: {
      cover_page: {
        submission_date: data.cover_page?.submission_date,
        board_resolution: data.cover_page?.board_resolution,
        proposal_summary: {
          program_title: data.cover_page?.proposal_summary?.program_title,
          approved_budget: safeParse(data.cover_page?.proposal_summary?.approved_budget, {
            words: "",
            amount: "",
          }),
          duration: safeParse(data.cover_page?.proposal_summary?.duration, {
            words: "",
            years: "",
          }),
          proposal_coverage_period: data.cover_page?.proposal_summary?.proposal_coverage_period,
        },
        activity_details: {
          title: data.cover_page?.activity_details?.title,
          date: data.cover_page?.activity_details?.date,
          venue: data.cover_page?.activity_details?.venue,
          value_statement: data.cover_page?.activity_details?.value_statement,
          requested_budget: data.cover_page?.activity_details?.requested_budget,
        },
        participants: {
          prmsu: safeParse(data.cover_page?.participants?.prmsu, {
            words: "",
            count: "",
          }),
          partner_agency: safeParse(data.cover_page?.participants?.partner_agency, {
            words: "",
            count: "",
            name: "",
          }),
          trainees: safeParse(data.cover_page?.participants?.trainees, {
            words: "",
            count: "",
          }),
        },
        reviews: data.cover_page?.reviews || [],
      },

      project_profile: {
        ...data.project_profile,
        proponents: safeParse(data.project_profile?.proponents, {
          project_leader: "",
          members: "",
        }),
        reviews: data.project_profile?.reviews || [],
      },

      rationale: {
        rationale_content: data.rationale?.rationale_content || "",
        reviews: data.rationale?.reviews || [],
      },

      significance: {
        significance_content: data.significance?.significance_content || "",
        reviews: data.significance?.reviews || [],
      },

      objectives: {
        general_content: data.objectives?.general_content || "",
        specific_content: data.objectives?.specific_content || "",
        reviews_general: data.objectives?.reviews_general || [],
        reviews_specific: data.objectives?.reviews_specific || [],
      },

      methodology: {
        methodology_content: data.methodology?.methodology_content || "",
        reviews: data.methodology?.reviews || [],
      },

      expected_output_outcome: {
        "6ps": safeParse(data.expected_output_outcome?.["6ps"], {}),
        reviews: data.expected_output_outcome?.reviews || [],
      },

      sustainability_plan: {
        sustainability_plan_content: data.sustainability_plan?.sustainability_plan_content || "",
        reviews: data.sustainability_plan?.reviews || [],
      },

      organization_and_staffing: {
        organization_and_staffing_content: safeParse(
          data.organization_and_staffing?.organization_and_staffing_content,
          []
        ),
        reviews: data.organization_and_staffing?.reviews || [],
      },

      plan_of_activities: {
        plan_of_activities_content: safeParse(
          data.plan_of_activities?.plan_of_activities_content,
          {
            activity_title: "",
            activity_date: "",
            schedule: [],
          }
        ),
        reviews: data.plan_of_activities?.reviews || [],
      },

      budgetary_requirement: {
        budgetary_requirement: safeParse(
          data.budgetary_requirement?.budgetary_requirement,
          {
            meals: [],
            supplies: [],
            transport: [],
            totals: {},
          }
        ),
        reviews: data.budgetary_requirement?.reviews || [],
      },
    },
  };
};