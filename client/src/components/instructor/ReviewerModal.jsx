import React, { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import InlineInput from "./inlineInput";
import ReviewerComment from "./ReviewerComment";
import { getStatusStyle } from "../../utils/statusStyles";
import { useEffect } from "react";
import axios from "axios";
import EditableText from "./EditableText";
import EditableNumber from "./EditableNumber";
import { getHistoryData } from "../../services/api";
import ReviewList from "./ReviewList";
import { useToast } from "../../context/ToastContext";

const ReviewerModal = ({ isOpen, onClose, proposalData, onOpen }) => {
  if (!isOpen || !proposalData) return null;
  const { showToast } = useToast();
  const [canEdit, setCanEdit] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHistoryData, setSelectedHistoryData] = useState(null);
  const [loadingHistoryData, setLoadingHistoryData] = useState(false);
  const [isDocumentReady, setIsDocumentReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const proposalId = proposalData?.proposal_id;

  useEffect(() => {
    if (isOpen && selectedHistoryData) {
      onOpen?.();
    }
  }, [isOpen, selectedHistoryData, onOpen]);

  useEffect(() => {
    if (!proposalId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://127.0.0.1:5000/api/get-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proposal_id: proposalId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched history data:", data);

        // Ensure data is an array before mapping
        if (Array.isArray(data)) {
          const mappedHistory = data
            .map((item) => ({
              history_id: item.history_id,
              proposal_id: item.proposal_id,
              status: item.status, // "current" | "history"
              version_no: item.version_no,
              created_at: item.created_at,
            }))
            .sort((a, b) => a.history_id - b.history_id);

          setHistory(mappedHistory);
          console.log("Mapped history:", mappedHistory);
        } else {
          console.error("Expected array but got:", typeof data);
          setHistory([]);
          onOpen?.();
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistory([]);
        onOpen?.();
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [proposalId]);

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).user_id : null;
  console.log("Content ID:", proposalData?.reviews_per_docs?.content_id);
  console.log("User ID:", userId);

  useEffect(() => {
    if (!proposalId || !userId) return;

    const fetchCheckUpdateProposal = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/check-update-proposal",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              proposal_id: proposalId,
              user_id: userId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Check Update Proposal Response:", data);

        // Update the canEdit state based on the API response
        setCanEdit(data.status);

        if (!data.status) {
          console.log("Note:", data.message);
        }
      } catch (err) {
        console.error("Failed to check update proposal:", err);
        // On error, disable editing to be safe
        setCanEdit(false);
      }
    };

    fetchCheckUpdateProposal();
  }, [proposalId, userId]);

  const fetchHistoryData = async (historyId, status) => {
    try {
      setLoadingHistoryData(true);
      setIsDocumentReady(false);

      const response = await fetch("http://127.0.0.1:5000/api/get-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history_id: historyId,
          user_id: userId,
          user_type: "implementor",
          status: status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Helper function to safely parse JSON strings
      const safeParse = (value, fallback = {}) => {
        if (!value) return fallback;
        if (typeof value === "object") return value;
        try {
          return JSON.parse(value);
        } catch (e) {
          console.error("Failed to parse:", value, e);
          return fallback;
        }
      };

      // Structure the data to match the expected format
      const structuredData = {
        ...proposalData,
        status,
        history_id: historyId,
        content_id: data?.content_id,
        cover_id: data?.cover_id,

        reviews_per_docs: {
          cover_page: {
            submission_date: data.cover_page?.submission_date,

            proposal_summary: {
              program_title: data.cover_page?.proposal_summary?.program_title,
              board_resolution:
                data.cover_page?.proposal_summary?.board_resolution,
              approved_budget: safeParse(
                data.cover_page?.proposal_summary?.approved_budget,
                {
                  words: "",
                  amount: "",
                },
              ),
              duration: safeParse(data.cover_page?.proposal_summary?.duration, {
                words: "",
                years: "",
              }),
              proposal_coverage_period:
                data.cover_page?.proposal_summary?.proposal_coverage_period,
            },
            activity_details: {
              title: data.cover_page?.activity_details?.title,
              date: data.cover_page?.activity_details?.date,
              venue: data.cover_page?.activity_details?.venue,
              value_statement:
                data.cover_page?.activity_details?.value_statement,
              requested_budget:
                data.cover_page?.activity_details?.requested_budget,
            },
            participants: {
              prmsu: safeParse(data.cover_page?.participants?.prmsu, {
                words: "",
                count: "",
              }),
              partner_agency: safeParse(
                data.cover_page?.participants?.partner_agency,
                {
                  words: "",
                  count: "",
                  name: "",
                },
              ),
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
            sustainability_plan_content:
              data.sustainability_plan?.sustainability_plan_content || "",
            reviews: data.sustainability_plan?.reviews || [],
          },

          organization_and_staffing: {
            organization_and_staffing_content: safeParse(
              data.organization_and_staffing?.organization_and_staffing_content,
              [],
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
              },
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
              },
            ),
            reviews: data.budgetary_requirement?.reviews || [],
          },
        },
      };

      setSelectedHistoryData(structuredData);
      setIsDocumentReady(true);
    } catch (error) {
      console.error("Failed to fetch history data:", error);
      console.error("Error stack:", error.stack);
      showToast("Failed to load history data. Please try again.", "error")
      
    } finally {
      setLoadingHistoryData(false);
    }
  };

  console.log("Selected History Data:", selectedHistoryData);

  // Auto-load current version when history is available
  useEffect(() => {
    if (!isOpen || !history.length || selectedHistoryData) return;

    // Find the current version in history
    const currentVersion = history.find((item) => item.status === "current");

    if (currentVersion) {
      console.log("Auto-loading current version:", currentVersion);
      // Automatically fetch and display the current version
      fetchHistoryData(currentVersion.history_id, currentVersion.status);
    }
  }, [history, isOpen]);

  // Add this useEffect after line 260 (after the auto-load useEffect)
  useEffect(() => {
    if (isEditing && !editedData && (selectedHistoryData || proposalData)) {
      const dataToEdit = selectedHistoryData || proposalData;
      const clonedData = JSON.parse(JSON.stringify(dataToEdit));
      console.log("Auto-initializing editedData:", clonedData);
      setEditedData(clonedData);
    }
  }, [isEditing, editedData, selectedHistoryData, proposalData]);

  const rpd = proposalData?.reviews_per_docs;
  if (!rpd && !selectedHistoryData) return null;

  // Determine which data to display:
  // 1. If editing AND editedData exists, use editedData
  // 2. Otherwise, if viewing history, use selectedHistoryData
  // 3. Otherwise, use proposalData
  const activeData =
    isEditing && editedData ? editedData : selectedHistoryData || proposalData;

  // Safety check - if activeData is null, return early
  if (!activeData) {
    console.error("activeData is null", {
      isEditing,
      editedData,
      selectedHistoryData,
      proposalData,
    });
    return null;
  }

  const activeRpd = activeData.reviews_per_docs;

  // Add safety check for activeRpd
  if (!activeRpd) {
    console.error("activeRpd is undefined", {
      activeData,
      selectedHistoryData,
      isEditing,
      editedData,
      proposalData,
    });
    return null;
  }
  // Normalize data from the active source
  const normalized = {
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
        activity_title:
          activeRpd.plan_of_activities?.plan_of_activities_content
            ?.activity_title || "",
        activity_date:
          activeRpd.plan_of_activities?.plan_of_activities_content
            ?.activity_date || "",
        schedule: Array.isArray(
          activeRpd.plan_of_activities?.plan_of_activities_content?.schedule,
        )
          ? activeRpd.plan_of_activities.plan_of_activities_content.schedule
          : [],
      },
      reviews: activeRpd.plan_of_activities?.reviews || [],
    },
    organization: {
      content: Array.isArray(
        activeRpd.organization_and_staffing?.organization_and_staffing_content,
      )
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
        meals: Array.isArray(
          activeRpd.budgetary_requirement?.budgetary_requirement?.meals,
        )
          ? activeRpd.budgetary_requirement.budgetary_requirement.meals
          : [],
        supplies: Array.isArray(
          activeRpd.budgetary_requirement?.budgetary_requirement?.supplies,
        )
          ? activeRpd.budgetary_requirement.budgetary_requirement.supplies
          : [],
        transport: Array.isArray(
          activeRpd.budgetary_requirement?.budgetary_requirement?.transport,
        )
          ? activeRpd.budgetary_requirement.budgetary_requirement.transport
          : [],
        totals:
          activeRpd.budgetary_requirement?.budgetary_requirement?.totals || {},
      },
      reviews: activeRpd.budgetary_requirement?.reviews || [],
    },
  };

  const handleEdit = () => {
    // Deep clone the current displayed data (which could be selectedHistoryData or proposalData)
    const dataToEdit = selectedHistoryData || proposalData;

    if (!dataToEdit) {
      console.error("No data available to edit");
      return;
    }

    // Use JSON parse/stringify for deep clone to ensure no reference issues
    const clonedData = JSON.parse(JSON.stringify(dataToEdit));

    console.log("Setting editedData with:", clonedData);

    // IMPORTANT: Set editedData FIRST, then set isEditing
    setEditedData(clonedData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate that we have the required IDs
      if (!editedData?.proposal_id) {
        showToast("Error: Missing proposal ID", "error")
        return;
      }

      if (!userId) {
        showToast("Error: User not logged in", "error")
        return;
      }

      // Ensure we have content_id and cover_id from selectedHistoryData
      const contentId =
        selectedHistoryData?.content_id || editedData?.content_id;
      const coverId = selectedHistoryData?.cover_id || editedData?.cover_id;

      if (!contentId || !coverId) {
        showToast("Error: Missing content or cover ID. Please reload the document.", "error")
        return;
      }

      // Helper function to clean numeric strings (remove commas, convert to number or null)
      const cleanNumeric = (value) => {
        if (!value || value === "") return null;
        // Remove commas and convert to string, then parse as float
        const cleaned = String(value).replace(/,/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? null : parsed;
      };

      // Helper function to format date to MySQL format (YYYY-MM-DD)
      const formatDateForMySQL = (dateString) => {
        if (!dateString) return null;

        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }

        // Try to parse various date formats
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return null;

          // Convert to YYYY-MM-DD format
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        } catch (e) {
          console.error("Date parsing error:", e);
          return null;
        }
      };

      const cleanedData = {
        proposal_id: editedData.proposal_id,
        user_id: userId,
        content_id: contentId,
        cover_id: coverId,

        cover: {
          submission_date: formatDateForMySQL(
            editedData.reviews_per_docs?.cover_page?.submission_date,
          ),
          board_resolution_title:
            editedData.reviews_per_docs?.cover_page?.proposal_summary
              ?.program_title || null,
          board_resolution_no:
            editedData.reviews_per_docs?.cover_page?.proposal_summary
              ?.board_resolution || null,
          approved_budget_words:
            editedData.reviews_per_docs?.cover_page?.proposal_summary
              ?.approved_budget?.words || null,
          approved_budget_amount: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.proposal_summary
              ?.approved_budget?.amount,
          ),
          duration_words:
            editedData.reviews_per_docs?.cover_page?.proposal_summary?.duration
              ?.words || null,
          duration_years: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.proposal_summary?.duration
              ?.years,
          ),
          date_from_to:
            editedData.reviews_per_docs?.cover_page?.proposal_summary
              ?.proposal_coverage_period || null,
          activity_title:
            editedData.reviews_per_docs?.cover_page?.activity_details?.title ||
            null,
          activity_date: formatDateForMySQL(
            editedData.reviews_per_docs?.cover_page?.activity_details?.date,
          ),
          activity_venue:
            editedData.reviews_per_docs?.cover_page?.activity_details?.venue ||
            null,
          activity_value_statement:
            editedData.reviews_per_docs?.cover_page?.activity_details
              ?.value_statement || null,
          requested_activity_budget: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.activity_details
              ?.requested_budget,
          ),
          prmsu_participants_words:
            editedData.reviews_per_docs?.cover_page?.participants?.prmsu
              ?.words || null,
          prmsu_participants_num: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.participants?.prmsu?.count,
          ),
          partner_agency_participants_words:
            editedData.reviews_per_docs?.cover_page?.participants
              ?.partner_agency?.words || null,
          partner_agency_participants_num: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.participants
              ?.partner_agency?.count,
          ),
          partner_agency_name:
            editedData.reviews_per_docs?.cover_page?.participants
              ?.partner_agency?.name || null,
          trainees_words:
            editedData.reviews_per_docs?.cover_page?.participants?.trainees
              ?.words || null,
          trainees_num: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.participants?.trainees
              ?.count,
          ),
        },

        content: {
          program_title:
            editedData.reviews_per_docs?.project_profile?.program_title || null,
          project_title:
            editedData.reviews_per_docs?.project_profile?.project_title || null,
          activity_title:
            editedData.reviews_per_docs?.project_profile?.activity_title ||
            null,
          sdg_alignment:
            editedData.reviews_per_docs?.project_profile?.sdg_alignment || null,
          extension_agenda:
            editedData.reviews_per_docs?.project_profile?.extension_agenda ||
            null,
          project_leader:
            editedData.reviews_per_docs?.project_profile?.proponents
              ?.project_leader || null,
          members:
            editedData.reviews_per_docs?.project_profile?.proponents?.members ||
            null,
          college_campus_program:
            editedData.reviews_per_docs?.project_profile
              ?.college_campus_program || null,
          collaborating_agencies:
            editedData.reviews_per_docs?.project_profile
              ?.collaborating_agencies || null,
          community_location:
            editedData.reviews_per_docs?.project_profile?.community_location ||
            null,
          target_sector:
            editedData.reviews_per_docs?.project_profile?.target_sector || null,
          number_of_beneficiaries: cleanNumeric(
            editedData.reviews_per_docs?.project_profile
              ?.number_of_beneficiaries,
          ),
          implementation_period:
            editedData.reviews_per_docs?.project_profile
              ?.implementation_period || null,
          total_budget_requested: cleanNumeric(
            editedData.reviews_per_docs?.project_profile
              ?.budgetary_requirements,
          ),
          rationale:
            editedData.reviews_per_docs?.rationale?.rationale_content || null,
          significance:
            editedData.reviews_per_docs?.significance?.significance_content ||
            null,
          general_objectives:
            editedData.reviews_per_docs?.objectives?.general_content || null,
          specific_objectives:
            editedData.reviews_per_docs?.objectives?.specific_content || null,
          methodology:
            editedData.reviews_per_docs?.methodology?.methodology_content ||
            null,
          expected_output_6ps:
            editedData.reviews_per_docs?.expected_output_outcome?.["6ps"] ||
            null,
          social_impact:
            editedData.reviews_per_docs?.expected_output_outcome
              ?.social_impact || null,
          economic_impact:
            editedData.reviews_per_docs?.expected_output_outcome
              ?.economic_impact || null,
          sustainability_plan:
            editedData.reviews_per_docs?.sustainability_plan
              ?.sustainability_plan_content || null,
          org_and_staffing_json:
            editedData.reviews_per_docs?.organization_and_staffing
              ?.organization_and_staffing_content || null,
          activity_schedule_json:
            editedData.reviews_per_docs?.plan_of_activities
              ?.plan_of_activities_content || null,
          budget_breakdown_json:
            editedData.reviews_per_docs?.budgetary_requirement
              ?.budgetary_requirement || null,

          prmsu_participants_count: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.participants?.prmsu?.count,
          ),
          partner_agency_participants_count: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.participants
              ?.partner_agency?.count,
          ),
          trainees_count: cleanNumeric(
            editedData.reviews_per_docs?.cover_page?.participants?.trainees
              ?.count,
          ),
        },
      };

      console.log("✅ Saving cleaned data:", cleanedData);

      const response = await fetch(
        "http://127.0.0.1:5000/api/update-proposal-docs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedData),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);

        // Try to parse as JSON for better error message
        try {
          const errorJson = JSON.parse(errorText);
          showToast(`Save failed: ${errorJson.message || errorText}`, "error")
        } catch {
          showToast(`Save failed: ${errorText}`, "error")
        }

        throw new Error(errorText);
      }

      const result = await response.json();
      console.log("✅ Update success:", result);

      showToast("Changes saved successfully!","error")

      // Reset editing state
      setIsEditing(false);
      setEditedData(null);

      // Reload the history to show the new version
      const historyResponse = await fetch(
        "http://127.0.0.1:5000/api/get-history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proposal_id: editedData.proposal_id,
          }),
        },
      );

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (Array.isArray(historyData)) {
          const mappedHistory = historyData
            .map((item) => ({
              history_id: item.history_id,
              proposal_id: item.proposal_id,
              status: item.status,
              version_no: item.version_no,
              created_at: item.created_at,
            }))
            .sort((a, b) => a.history_id - b.history_id);

          setHistory(mappedHistory);

          // Auto-load the new current version
          const currentVersion = mappedHistory.find(
            (item) => item.status === "current",
          );
          if (currentVersion) {
            await fetchHistoryData(
              currentVersion.history_id,
              currentVersion.status,
            );
          }
        }
      }
    } catch (error) {
      console.error("❌ Save error:", error);
      // Error alert already shown above
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to update nested fields
  const updateField = (path, value) => {
    setEditedData((prev) => {
      // Deep clone to avoid mutation
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newData;

      // Navigate to the parent of the target field
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      // Set the value
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  // Editable date component
  const EditableDate = ({ value, onChange, className = "" }) => {
    if (!isEditing) {
      return <p className={className}>{value || "N/A"}</p>;
    }

    return (
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`border-2 border-blue-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none ${className}`}
      />
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-overlay-enter">
        {isSaving && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
            <div
              className="bg-white rounded-xl px-8 py-6 
                            shadow-lg 
                            flex items-center gap-4
                            animate-[fadeIn_0.25s_ease-out]"
            >
              {/* Minimal Spinner */}
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-200 
                              border-t-emerald-600 animate-spin"
              ></div>

              {/* Text */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Saving changes
                </p>
                <p className="text-xs text-gray-500">Please wait…</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white w-full max-w-5xl h-[95vh] rounded-bl-xl rounded-tl-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-5 border-b bg-primaryGreen text-white">
            <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>

            <div className="relative z-10 flex flex-1 items-center justify-between">
              <div className="flex flex-col justify-center items-start gap-3 mb-3">
                <div className="flex items-center gap-3 ">
                  <div className="w-1 h-5 bg-white/80 rounded-full"></div>
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-emerald-100">
                    {selectedHistoryData?.status === "history"
                      ? "Historical Version"
                      : "Reviewer's Evaluation on Proposal"}
                  </h3>
                </div>
                <h1 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
                  {proposalData.title}
                </h1>
              </div>

              <div
                className={`${selectedHistoryData?.status === "history" ? "hidden" : ""} relative z-10 flex items-center gap-3`}
              >
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    disabled={!canEdit || !isDocumentReady}
                    className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-md font-semibold transition text-sm
                              ${
                                canEdit && isDocumentReady
                                  ? "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                              }`}
                    title={
                      !canEdit
                        ? "Proposal cannot be edited"
                        : !isDocumentReady
                          ? "Loading data..."
                          : "Edit proposal"
                    }
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold transition
                              ${
                                isSaving
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-500 text-white hover:bg-green-700"
                              }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Save
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-semibold transition
                              ${
                                isSaving
                                  ? "bg-gray-300 cursor-not-allowed opacity-50"
                                  : "bg-red-600 text-white hover:bg-red-800"
                              }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-14 overflow-auto bg-white">
            {/* Loading indicator for history data */}
            {!isDocumentReady ? (
              <div className="w-full h-full px-20 py-5 space-y-6 animate-pulse">
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>

                <div className="space-y-3 pt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                <div className="space-y-3 pt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>

                <div className="space-y-3 pt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ) : (
              <>
                {/* ========== COVER PAGE SECTION ========== */}
                <section className="max-w-5xl mx-auto px-5 rounded-sm shadow-sm font-sans text-gray-900 leading-relaxed">
                  <div className="space-y-4 font-normal text-base">
                    <div
                      className={isEditing ? "bg-blue-50 rounded-lg p-3" : ""}
                    >
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Submission Date:
                      </label>

                      <EditableDate
                        value={normalized?.cover.submission_date}
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.cover_page.submission_date",
                            val,
                          )
                        }
                        className="font-medium"
                      />
                    </div>

                    <div className="uppercase ">
                      <p className="font-bold">DR. ROY N. VILLALOBOS</p>
                      <p>University President</p>
                      <p>President Ramon Magsaysay State University</p>
                    </div>

                    <p>Dear Sir:</p>

                    <div
                      className={
                        isEditing ? "bg-blue-50 rounded-lg p-3 space-y-3" : ""
                      }
                    >
                      <p className="text-gray-800">
                        I have the honor to submit the proposal for your
                        consideration and appropriate action for the proposed
                        extension program entitled{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.proposal_summary?.program_title
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.proposal_summary.program_title",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        ,
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover?.proposal_summary
                                ?.board_resolution
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.proposal_summary.board_resolution",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>{" "}
                        with the approved budget of{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.proposal_summary
                                ?.approved_budget?.words
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.proposal_summary.approved_budget.words",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        ;{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.proposal_summary
                                ?.approved_budget?.amount
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.proposal_summary.approved_budget.amount",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>{" "}
                        with the duration of{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.proposal_summary?.duration
                                ?.words
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.proposal_summary.duration.words",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>{" "}
                        years,{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.proposal_summary
                                ?.proposal_coverage_period
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.proposal_summary.proposal_coverage_period",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        .
                      </p>
                      <br />
                      <p className="text-gray-800">
                        This program includes an activity entitled{" "}
                        <span className="inline-block">
                          <EditableText
                            value={normalized?.cover.activity_details?.title}
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.activity_details.title",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>{" "}
                        on{" "}
                        {isEditing ? (
                          <EditableDate
                            value={normalized?.cover.activity_details?.date}
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.activity_details.date",
                                val,
                              )
                            }
                          />
                        ) : (
                          <span>
                            {normalized?.cover.activity_details?.date
                              ? new Date(
                                  normalized?.cover.activity_details.date,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </span>
                        )}{" "}
                        at{" "}
                        <span className="inline-block">
                          <EditableText
                            value={normalized?.cover.activity_details?.venue}
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.activity_details.venue",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        . This activity is valuable{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.activity_details
                                ?.value_statement
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.activity_details.value_statement",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        . The requested expenses for this activity from the
                        university is{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.activity_details
                                ?.requested_budget
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.activity_details.requested_budget",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        , which will be used to defray expenses for food,
                        transportation, supplies and materials, and other
                        expenses related to these activities.
                      </p>
                      <br />
                      <p className="text-gray-800">
                        Further, there is{" "}
                        <span className="inline-block">
                          <EditableText
                            value={normalized?.cover.participants?.prmsu?.words}
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.participants.prmsu.words",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>{" "}
                        (
                        <span className="inline-block">
                          <EditableNumber
                            value={normalized?.cover.participants?.prmsu?.count}
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.participants.prmsu.count",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        ) the total number of participants from PRMSU, another{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.participants?.partner_agency
                                ?.words
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.participants.partner_agency.words",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>{" "}
                        (
                        <span className="inline-block">
                          <EditableNumber
                            value={
                              normalized?.cover.participants?.partner_agency
                                ?.count
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.participants.partner_agency.count",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        ) from the collaborating agency,{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.participants?.partner_agency
                                ?.name
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.participants.partner_agency.name",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        , and{" "}
                        <span className="inline-block">
                          <EditableText
                            value={
                              normalized?.cover.participants?.trainees?.words
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.participants.trainees.words",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>{" "}
                        (
                        <span className="inline-block">
                          <EditableNumber
                            value={
                              normalized?.cover.participants?.trainees?.count
                            }
                            onChange={(val) =>
                              updateField(
                                "reviews_per_docs.cover_page.participants.trainees.count",
                                val,
                              )
                            }
                            className="inline"
                            isEditing={isEditing}
                          />
                        </span>
                        ) trainees from the abovementioned community.
                      </p>
                    </div>

                    <p className="">
                      Your favorable response regarding this matter will be
                      highly appreciated.
                    </p>

                    <p className="italic">Prepared by:</p>
                    <p className="py-1">Proponent</p>
                    <p className="italic">Noted by:</p>

                    <div className="">
                      <div className="grid grid-cols-2">
                        <div className="">
                          <p className="pt-4">Campus Extension Coordinator</p>
                          <p className="pt-4 italic">Endorsed by:</p>
                          <p className="pt-4"></p>
                          <p className="pt-1">Campus Director</p>
                          <p className="pt-4 italic">Recommending Approval:</p>
                          <p className="pt-7 font-bold text-[16px]">
                            MARLON JAMES A. DEDICATORIA, Ph.D.
                          </p>
                          <p className="pt-1">
                            Vice-President, Research and Development
                          </p>
                        </div>

                        <div className="">
                          <p className="pt-4">College Dean</p>
                          <p className="pt-4"></p>
                          <p className="pt-4 font-bold text-[16px]">
                            KATHERINE M.UY, MAEd
                          </p>
                          <p className="pt-1"> Director, Extension Services</p>
                          <p className="pt-4 italic">
                            Certified Funds Available
                          </p>
                          <p className="pt-7 font-bold text-[16px]">
                            ROBERTO C. BRIONES JR., CPA
                          </p>
                          <p className="pt-1">University Accountant IV</p>
                        </div>
                      </div>
                      <p className="pt-10 italic text-center">Approved by:</p>
                      <p className="pt-5 font-bold text-[16px] text-center">
                        ROY N. VILLALOBOS, DPA
                      </p>
                      <p className="pt-1 text-center">University President</p>
                    </div>
                  </div>
                </section>

                {/* ========== REVIEWER'S COMMENTS (Cover page) ========== */}
                <ReviewList reviews={normalized?.cover.reviews} />

                {/* ========== CONTENT PAGE SECTION ========== */}
                <section>
                  <h2 className="text-xl font-bold my-8">I. PROJECT PROFILE</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full border border-black text-sm">
                      <tbody>
                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Program Title:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={normalized?.project_profile?.program_title}
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.program_title",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            Project Title:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={normalized?.project_profile?.project_title}
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.project_title",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            Activity Title:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.project_profile?.activity_title
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.activity_title",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            SDG's
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={normalized?.project_profile?.sdg_alignment}
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.sdg_alignment",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Extension Agenda
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.project_profile?.extension_agenda
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.extension_agenda",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Proponents: Project Leader
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.project_profile?.proponents
                                  ?.project_leader
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.proponents.project_leader",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Members:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.project_profile?.proponents?.members
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.proponents.members",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            College/Campus/Mandated Program:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.project_profile
                                  ?.college_campus_program
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.college_campus_program",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Collaborating Agencies:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.project_profile
                                  ?.collaborating_agencies
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.collaborating_agencies",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Community Location:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.project_profile?.community_location
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.community_location",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Target Sector:
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={normalized?.project_profile?.target_sector}
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.target_sector",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Number of Beneficiaries
                          </td>
                          <td className="px-4 py-3">
                            <EditableNumber
                              value={
                                normalized?.project_profile
                                  ?.number_of_beneficiaries
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.number_of_beneficiaries",
                                  val,
                                )
                              }
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
                              value={
                                normalized?.project_profile
                                  ?.implementation_period
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.implementation_period",
                                  val,
                                )
                              }
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
                              value={
                                normalized?.project_profile
                                  ?.budgetary_requirements
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.project_profile.budgetary_requirements",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Reviewer's Comments - Project Profile */}
                    <ReviewList reviews={normalized?.project_profile.reviews} />
                  </div>

                  {/* RATIONALE */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-10 text-xl">
                      II. RATIONALE
                    </h3>
                    <div
                      className={
                        isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"
                      }
                    >
                      <EditableText
                        value={normalized?.rationale.content}
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.rationale.rationale_content",
                            val,
                          )
                        }
                        multiline={true}
                        className="text-base"
                        isEditing={isEditing}
                      />
                    </div>

                    <ReviewList reviews={normalized?.rationale.reviews} />
                  </div>

                  {/* SIGNIFICANCE */}
                  <div>
                    <h3 className="font-bold text-gray-900 pt-5 text-xl">
                      III. SIGNIFICANCE
                    </h3>
                    <div
                      className={
                        isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"
                      }
                    >
                      <EditableText
                        value={normalized?.significance.content}
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.significance.significance_content",
                            val,
                          )
                        }
                        multiline={true}
                        className="text-base"
                        isEditing={isEditing}
                      />
                    </div>

                    <ReviewList reviews={normalized?.significance.reviews} />
                  </div>

                  {/* OBJECTIVES */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-5 text-xl">
                      IV. OBJECTIVES
                    </h3>

                    <p className="text-base font-semibold mb-2 mt-3">
                      General Objectives
                    </p>
                    <div
                      className={
                        isEditing
                          ? "bg-blue-50 rounded-lg p-4"
                          : "p-5 bg-gray-100"
                      }
                    >
                      <EditableText
                        value={normalized?.objectives?.general}
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.objectives.general_content",
                            val,
                          )
                        }
                        multiline={true}
                        isEditing={isEditing}
                      />
                    </div>

                    <ReviewList
                      reviews={normalized?.objectives.reviewsGeneral}
                    />

                    <p className="text-base font-semibold mb-2 mt-3">
                      Specific Objectives
                    </p>
                    <div
                      className={
                        isEditing
                          ? "bg-blue-50 rounded-lg p-4"
                          : "p-5 bg-gray-100"
                      }
                    >
                      <EditableText
                        value={normalized?.objectives?.specific}
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.objectives.specific_content",
                            val,
                          )
                        }
                        multiline={true}
                        isEditing={isEditing}
                      />
                    </div>

                    <ReviewList
                      reviews={normalized?.objectives.reviewsSpecific}
                    />
                  </div>

                  {/* METHODOLOGY */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-10 text-xl">
                      V. METHODOLOGY
                    </h3>
                    <div
                      className={
                        isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"
                      }
                    >
                      <EditableText
                        value={normalized?.methodology.content}
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.methodology.methodology_content",
                            val,
                          )
                        }
                        multiline={true}
                        className="text-base"
                        isEditing={isEditing}
                      />
                    </div>

                    <ReviewList reviews={normalized?.methodology.reviews} />
                  </div>

                  {/* EXPECTED OUTPUT */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">
                      VI. EXPECTED OUTPUT/OUTCOME
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

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            Publications
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content
                                  ?.publications
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.publications",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            Patents/IP
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content?.patents
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.patents",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="border-r border-black px-4 py-3 font-bold text-gray-900">
                            Products
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content?.products
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.products",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            People Services
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content
                                  ?.people_services
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.people_services",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Places and Partnerships
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content
                                  ?.places_partnerships
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.places_partnerships",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Policy
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content?.policy
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.policy",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Social Impact
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content
                                  ?.social_impact
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.social_impact",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>

                        <tr className="border-b border-black">
                          <td className="w-1/4 border-r border-black px-4 py-3 font-bold text-gray-900">
                            Economic Impact
                          </td>
                          <td className="px-4 py-3">
                            <EditableText
                              value={
                                normalized?.expectedOutput?.content
                                  ?.economic_impact
                              }
                              onChange={(val) =>
                                updateField(
                                  "reviews_per_docs.expected_output_outcome.6ps.economic_impact",
                                  val,
                                )
                              }
                              isEditing={isEditing}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <ReviewList reviews={normalized?.expectedOutput.reviews} />
                  </div>

                  {/* SUSTAINABILITY PLAN */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-10 text-xl">
                      VII. SUSTAINABILITY PLAN
                    </h3>
                    <div
                      className={
                        isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"
                      }
                    >
                      <EditableText
                        value={normalized?.sustainability.content}
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.sustainability_plan.sustainability_plan_content",
                            val,
                          )
                        }
                        multiline={true}
                        className="text-base"
                        isEditing={isEditing}
                      />
                    </div>

                    <ReviewList reviews={normalized?.sustainability.reviews} />
                  </div>

                  {/* ORGANIZATION AND STAFFING */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-10 text-xl mb-5">
                      VIII. ORGANIZATION AND STAFFING{" "}
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
                          normalized?.organization?.content.map(
                            (item, index) => (
                              <tr key={index} className="border-b border-black">
                                <td className="border-r border-black px-4 py-3 text-gray-900">
                                  {item.activity || "N/A"}
                                </td>
                                <td className="border-r border-black px-4 py-3 whitespace-pre-line">
                                  {isEditing ? (
                                    <textarea
                                      value={item.designation || ""}
                                      onChange={(e) => {
                                        setEditedData((prev) => {
                                          const newData = JSON.parse(
                                            JSON.stringify(prev),
                                          );
                                          if (
                                            !newData.reviews_per_docs
                                              .organization_and_staffing
                                              .organization_and_staffing_content[
                                              index
                                            ]
                                          ) {
                                            newData.reviews_per_docs.organization_and_staffing.organization_and_staffing_content[
                                              index
                                            ] = {};
                                          }
                                          newData.reviews_per_docs.organization_and_staffing.organization_and_staffing_content[
                                            index
                                          ].designation = e.target.value;
                                          return newData;
                                        });
                                      }}
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
                                      onChange={(e) => {
                                        setEditedData((prev) => {
                                          const newData = JSON.parse(
                                            JSON.stringify(prev),
                                          );
                                          if (
                                            !newData.reviews_per_docs
                                              .organization_and_staffing
                                              .organization_and_staffing_content[
                                              index
                                            ]
                                          ) {
                                            newData.reviews_per_docs.organization_and_staffing.organization_and_staffing_content[
                                              index
                                            ] = {};
                                          }
                                          newData.reviews_per_docs.organization_and_staffing.organization_and_staffing_content[
                                            index
                                          ].terms = e.target.value;
                                          return newData;
                                        });
                                      }}
                                      className="w-full border-2 border-blue-500 rounded-lg px-2 py-1"
                                      rows={3}
                                    />
                                  ) : (
                                    item.terms || "N/A"
                                  )}
                                </td>
                              </tr>
                            ),
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className="text-center px-4 py-3 text-gray-500"
                            >
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <ReviewList reviews={normalized?.organization.reviews} />
                  </div>

                  {/* PLAN OF ACTIVITIES */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-10 text-xl">
                      IX. PLAN OF ACTIVITIES
                    </h3>

                    <div
                      className={
                        isEditing ? "bg-blue-50 rounded-lg p-4 mt-3" : "mt-3"
                      }
                    >
                      <EditableText
                        value={
                          normalized?.planOfActivities?.content?.activity_title
                        }
                        onChange={(val) =>
                          updateField(
                            "reviews_per_docs.plan_of_activities.plan_of_activities_content.activity_title",
                            val,
                          )
                        }
                        className="text-xl font-bold text-center"
                        isEditing={isEditing}
                      />
                    </div>

                    <p className="text-lg mt-3 text-center">
                      {isEditing ? (
                        <EditableDate
                          value={
                            normalized?.planOfActivities?.content?.activity_date
                          }
                          onChange={(val) =>
                            updateField(
                              "reviews_per_docs.plan_of_activities.plan_of_activities_content.activity_date",
                              val,
                            )
                          }
                        />
                      ) : normalized?.planOfActivities?.content
                          ?.activity_date ? (
                        new Date(
                          normalized?.planOfActivities?.content.activity_date,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      ) : (
                        "N/A"
                      )}
                    </p>

                    <p className="text-lg mt-2 mb-5 text-center font-semibold">
                      PROGRAMME
                    </p>

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

                        {normalized?.planOfActivities?.content?.schedule
                          ?.length > 0 ? (
                          normalized?.planOfActivities?.content.schedule.map(
                            (item, index) => (
                              <tr key={index} className="border-b border-black">
                                <td className="border-r border-black px-4 py-3 text-gray-900">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={item.time || ""}
                                      onChange={(e) => {
                                        setEditedData((prev) => {
                                          const newData = JSON.parse(
                                            JSON.stringify(prev),
                                          );
                                          newData.reviews_per_docs.plan_of_activities.plan_of_activities_content.schedule[
                                            index
                                          ].time = e.target.value;
                                          return newData;
                                        });
                                      }}
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
                                        onChange={(e) => {
                                          setEditedData((prev) => {
                                            const newData = JSON.parse(
                                              JSON.stringify(prev),
                                            );
                                            newData.reviews_per_docs.plan_of_activities.plan_of_activities_content.schedule[
                                              index
                                            ].activity = e.target.value;
                                            return newData;
                                          });
                                        }}
                                        placeholder="Activity"
                                        className="w-full border-2 border-blue-500 rounded-lg px-2 py-1"
                                      />
                                      <input
                                        type="text"
                                        value={item.speaker || ""}
                                        onChange={(e) => {
                                          setEditedData((prev) => {
                                            const newData = JSON.parse(
                                              JSON.stringify(prev),
                                            );
                                            newData.reviews_per_docs.plan_of_activities.plan_of_activities_content.schedule[
                                              index
                                            ].speaker = e.target.value;
                                            return newData;
                                          });
                                        }}
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
                            ),
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={2}
                              className="text-center px-4 py-3 text-gray-500"
                            >
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <ReviewList
                      reviews={normalized?.planOfActivities.reviews}
                    />
                  </div>

                  {/* BUDGETARY REQUIREMENT */}
                  <div className="">
                    <h3 className="font-bold text-gray-900 pt-10 text-xl">
                      XI. BUDGETARY REQUIREMENT
                    </h3>
                    <table className="w-full border border-black text-sm mt-6">
                      <tbody>
                        <tr className="border-b border-black bg-gray-100">
                          <td className="border-r border-black px-4 py-3 font-bold text-center">
                            CATEGORY
                          </td>
                          <td className="border-r border-black px-4 py-3 font-bold text-center">
                            ITEM
                          </td>
                          <td className="border-r border-black px-4 py-3 font-bold text-center">
                            Cost (PHP)
                          </td>
                          <td className="border-r border-black px-4 py-3 font-bold text-center">
                            PAX/QTY.
                          </td>
                          <td className="px-4 py-3 font-bold text-center">
                            AMOUNT
                          </td>
                        </tr>

                        {/* MEALS */}
                        {normalized?.budget?.content?.meals?.map(
                          (row, index) => (
                            <tr
                              key={`meals-${index}`}
                              className="border-b border-black"
                            >
                              <td className="border-r border-black px-4 py-3">
                                Meals
                              </td>
                              <td className="border-r border-black px-4 py-3">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={row.item || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.meals[
                                          index
                                        ].item = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  row.item
                                )}
                              </td>
                              <td className="border-r border-black px-4 py-3 text-right">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={row.cost || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.meals[
                                          index
                                        ].cost = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  `₱ ${row.cost}`
                                )}
                              </td>
                              <td className="border-r border-black px-4 py-3 text-right">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={row.qty || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.meals[
                                          index
                                        ].qty = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  row.qty
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                ₱ {row.amount}
                              </td>
                            </tr>
                          ),
                        )}

                        {/* TRANSPORT */}
                        {normalized?.budget?.content?.transport?.map(
                          (row, index) => (
                            <tr
                              key={`transport-${index}`}
                              className="border-b border-black"
                            >
                              <td className="border-r border-black px-4 py-3">
                                Transport
                              </td>
                              <td className="border-r border-black px-4 py-3">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={row.item || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.transport[
                                          index
                                        ].item = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  row.item
                                )}
                              </td>
                              <td className="border-r border-black px-4 py-3 text-right">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={row.cost || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.transport[
                                          index
                                        ].cost = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  `₱ ${row.cost}`
                                )}
                              </td>
                              <td className="border-r border-black px-4 py-3 text-right">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={row.qty || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.transport[
                                          index
                                        ].qty = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  row.qty
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                ₱ {row.amount}
                              </td>
                            </tr>
                          ),
                        )}

                        {/* SUPPLIES */}
                        {normalized?.budget?.content?.supplies?.map(
                          (row, index) => (
                            <tr
                              key={`supplies-${index}`}
                              className="border-b border-black"
                            >
                              <td className="border-r border-black px-4 py-3">
                                Supplies
                              </td>
                              <td className="border-r border-black px-4 py-3">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={row.item || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.supplies[
                                          index
                                        ].item = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  row.item
                                )}
                              </td>
                              <td className="border-r border-black px-4 py-3 text-right">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={row.cost || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.supplies[
                                          index
                                        ].cost = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  `₱ ${row.cost}`
                                )}
                              </td>
                              <td className="border-r border-black px-4 py-3 text-right">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={row.qty || ""}
                                    onChange={(e) => {
                                      setEditedData((prev) => {
                                        const newData = JSON.parse(
                                          JSON.stringify(prev),
                                        );
                                        newData.reviews_per_docs.budgetary_requirement.budgetary_requirement.supplies[
                                          index
                                        ].qty = e.target.value;
                                        return newData;
                                      });
                                    }}
                                    className="w-full border-2 border-blue-500 rounded px-2 py-1"
                                  />
                                ) : (
                                  row.qty
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                ₱ {row.amount}
                              </td>
                            </tr>
                          ),
                        )}

                        {/* TOTALS */}
                        <tr className="font-bold bg-gray-100">
                          <td
                            colSpan={4}
                            className="border-r border-black px-4 py-3 text-right"
                          >
                            Grand Total
                          </td>
                          <td className="px-4 py-3 text-right">
                            <p>
                              ₱{" "}
                              {normalized?.budget?.content?.totals
                                ?.grand_total || 0}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <ReviewList reviews={normalized?.budget.reviews} />
                  </div>

                  {/* Footer Signatures */}
                  <div className="py-4">
                    <p className="italic my-3">Prepared by:</p>
                    <p className="py-1 mb-2">Proponent</p>
                    <p className="italic">Noted by:</p>

                    <div className="">
                      <div className="grid grid-cols-2">
                        <div className="">
                          <p className="pt-4">Campus Extension Coordinator</p>
                          <p className="pt-4 italic">Endorsed by:</p>
                          <p className="pt-4"></p>
                          <p className="pt-1">Campus Director</p>
                          <p className="pt-4 italic">Recommending Approval:</p>
                          <p className="pt-7 font-bold text-[16px]">
                            MARLON JAMES A. DEDICATORIA, Ph.D.
                          </p>
                          <p className="pt-1">
                            Vice-President, Research and Development
                          </p>
                        </div>

                        <div className="">
                          <p className="pt-4">College Dean</p>
                          <p className="pt-4"></p>
                          <p className="pt-4 font-bold text-[16px]">
                            KATHERINE M.UY, MAEd
                          </p>
                          <p className="pt-1"> Director, Extension Services</p>
                          <p className="pt-4 italic">
                            Certified Funds Available
                          </p>
                          <p className="pt-7 font-bold text-[16px]">
                            ROBERTO C. BRIONES JR., CPA
                          </p>
                          <p className="pt-1">University Accountant IV</p>
                        </div>
                      </div>
                      <p className="pt-10 italic text-center">Approved by:</p>
                      <p className="pt-5 font-bold text-[16px] text-center">
                        ROY N. VILLALOBOS, DPA
                      </p>
                      <p className="pt-1 text-center">University President</p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>

        {/* History Panel */}
        <div className="bg-white h-[95vh] w-1/5 max-w-2xl shadow-sm border border-gray-200 flex flex-col rounded-tr-xl rounded-br-xl">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">History</h2>
              <p className="text-xs text-gray-400 mt-1">
                Recent changes of proposal
              </p>
            </div>

            <button
              onClick={() => {
                setHistory([]);
                setSelectedHistoryData(null);
                onClose();
              }}
              className="p-3 bg-gray-200 rounded-full text-black hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading ? (
              <div className="px-2 py-2 space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2 rounded-xl bg-gray-100"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-300" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                      <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No history available
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => {
                  const label =
                    item.status === "current"
                      ? "Current Proposal"
                      : `Revise ${item.version_no}`;

                  const formattedDate = new Date(
                    item.created_at,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={`${item.history_id}`}
                      onClick={() =>
                        fetchHistoryData(item.history_id, item.status)
                      }
                      className={`flex items-start gap-3 p-4 rounded-xl transition cursor-pointer ${
                        selectedHistoryData?.history_id === item.history_id
                          ? "bg-emerald-100 border-2 border-emerald-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-semibold">
                        V{item.version_no}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-medium">
                          {label}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Proposal ID {item.proposal_id} • {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewerModal;
