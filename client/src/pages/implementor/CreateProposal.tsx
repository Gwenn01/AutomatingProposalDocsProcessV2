import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import  InlineInput  from '@/components/implementor/InlineInput';
import { useToast } from '@/context/toast';

// ================= TYPE DEFINITIONS =================

interface User {
  user_id: string | number;
  [key: string]: any;
}

interface BudgetRow {
  item: string;
  cost: string | number;
  qty: string | number;
  amount: string | number;
}

interface BudgetRows {
  meals: BudgetRow[];
  transport: BudgetRow[];
  supplies: BudgetRow[];
}

interface CoverPageData {
  submission_date: string;
  board_resolution_title: string;
  board_resolution_no: string;
  approved_budget_words: string;
  approved_budget_amount: string;
  duration_words: string;
  duration_years: string;
  date_from_to: string;
  activity_title: string;
  activity_date: string;
  activity_venue: string;
  activity_value_statement: string;
  requested_activity_budget: string;
  prmsu_participants_words: string;
  prmsu_participants_num: string;
  partner_agency_participants_words: string;
  partner_agency_participants_num: string;
  partner_agency_name: string;
  trainees_words: string;
  trainees_num: string;
}

interface ExpectedOutput6ps {
  publications: string;
  patents: string;
  products: string;
  people_services: string;
  places_partnerships: string;
  policy: string;
  social_impact: string;
  economic_impact: string;
}

interface OrgStaffingItem {
  activity: string;
  designation: string;
  terms: string;
}

interface ContentData {
  program_title: string;
  project_title: string;
  activity_title: string;
  sdg_alignment: string;
  extension_agenda: string;
  project_leader: string;
  members: string;
  college_campus_program: string;
  collaborating_agencies: string;
  community_location: string;
  target_sector: string;
  number_of_beneficiaries: string;
  implementation_period: string;
  total_budget_requested: string;
  rationale: string;
  significance: string;
  general_objectives: string;
  specific_objectives: string;
  methodology: string;
  expected_output_6ps: ExpectedOutput6ps;
  sustainability_plan: string;
  org_and_staffing_json: OrgStaffingItem[];
  prmsu_participants_count: string;
  partner_agency_participants_count: string;
  trainees_count: string;
}

interface ScheduleItem {
  time: string;
  activity: string;
  speaker: string;
}

interface ActivityScheduleData {
  activity_title: string;
  activity_date: string;
  schedule: ScheduleItem[];
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

// ================= COMPONENT PARTS =================

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
  <div className="relative mb-7">
    {/* Input */}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || " "}
      className="
        peer w-full px-4 pt-5 pb-2 text-sm
        bg-white
        border border-gray-300
        rounded-xl
        shadow-sm
        outline-none
        transition-all duration-200 ease-out

        focus:border-emerald-600
        focus:ring-2 focus:ring-emerald-500/20
        focus:shadow-md

        hover:border-gray-400
      "
    />

    {/* Floating Label */}
    <label
      className="
        absolute left-4 top-3 text-sm text-gray-500
        transition-all duration-200 ease-out
        pointer-events-none

        peer-placeholder-shown:top-4
        peer-placeholder-shown:text-sm
        peer-placeholder-shown:text-gray-400

        peer-focus:top-1.5
        peer-focus:text-xs
        peer-focus:text-emerald-600
      "
    >
      {label}
    </label>
  </div>
);

const TextAreaField: React.FC<TextAreaFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  rows = 6 
}) => (
  <div>
    <label className="block text-md font-semibold mb-2">{label}</label>
    <textarea 
      rows={rows}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-gray-100 border-none rounded-sm focus:ring-2 focus:ring-green-600 outline-none"
    />
  </div>
);

// ================= MAIN COMPONENT =================

const CreateProposal: React.FC = () => {
  const navigate = useNavigate();
  const [proposalId, setProposalId] = useState<number | null>(null);
  const { showToast } = useToast();

  const [title, setTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  const [rows, setRows] = useState<BudgetRows>({
    meals: [],
    transport: [],
    supplies: [],
  });

  const [cover, setCover] = useState<CoverPageData>({
    submission_date: "",
    board_resolution_title: "",
    board_resolution_no: "",
    approved_budget_words: "",
    approved_budget_amount: "",
    duration_words: "",
    duration_years: "",
    date_from_to: "",
    activity_title: "",
    activity_date: "",
    activity_venue: "",
    activity_value_statement: "",
    requested_activity_budget: "",
    prmsu_participants_words: "",
    prmsu_participants_num: "",
    partner_agency_participants_words: "",
    partner_agency_participants_num: "",
    partner_agency_name: "",
    trainees_words: "",
    trainees_num: ""
  });

  const [content, setContent] = useState<ContentData>({
    program_title: "",
    project_title: "",
    activity_title: "",
    sdg_alignment: "",
    extension_agenda: "",
    project_leader: "",
    members: "",
    college_campus_program: "",
    collaborating_agencies: "",
    community_location: "",
    target_sector: "",
    number_of_beneficiaries: "",
    implementation_period: "",
    total_budget_requested: "",
    rationale: "",
    significance: "",
    general_objectives: "",
    specific_objectives: "",
    methodology: "",
    expected_output_6ps: {
      publications: "",
      patents: "",
      products: "",
      people_services: "",
      places_partnerships: "",
      policy: "",
      social_impact: "",
      economic_impact: ""
    },
    sustainability_plan: "",
    org_and_staffing_json: [
      { activity: "Proposal Preparation", designation: "", terms: "" },
      { activity: "Program/Certificates", designation: "", terms: "" },
      { activity: "Food Preparation", designation: "", terms: "" },
      { activity: "Resource Speakers", designation: "", terms: "" },
      { activity: "Masters of Ceremony", designation: "", terms: "" },
      { activity: "Secretariat for Attendance", designation: "", terms: "" },
      { activity: "Documentation/Technical", designation: "", terms: "" },
    ],
    prmsu_participants_count: "",
    partner_agency_participants_count: "",
    trainees_count: ""
  });

  const [activitySchedule, setActivitySchedule] = useState<ActivityScheduleData>({
    activity_title: "",
    activity_date: "",
    schedule: [
      { time: "7:30–8:00 AM", activity: "Registration", speaker: "" },
      { time: "8:00–8:05 AM", activity: "Invocation–AV Presentation", speaker: "" },
      { time: "8:20–8:45 AM", activity: "Opening Remarks", speaker: "Dr. Roy N. Villalobos, University President" },
      { time: "8:45–9:00 AM", activity: "Welcome Remarks", speaker: "" },
      { time: "9:00 AM–12:00 NOON", activity: "", speaker: "" },
      { time: "12:00-1:00 PM", activity: "LUNCH BREAK", speaker: "" },
      { time: "1:00-3:00 PM", activity: "", speaker: "" },
      { time: "3:00-4:30 PM", activity: "Open Forum/Evaluation", speaker: "" },
      { time: "4:30-4:45 PM", activity: "Awarding of Certificates", speaker: "" },
      { time: "4:45-4:55 PM", activity: "Closing Remarks", speaker: "" },
      { time: "4:55-5:00 PM", activity: "Photo Opportunity", speaker: "" }
    ]
  });

  const [activeTab, setActiveTab] = useState<string>('program');

  const resetForm = (): void => {
    setProposalId(null);
    setTitle("");
    setRows({ meals: [], transport: [], supplies: [] });
    setCover({
      submission_date: "",
      board_resolution_title: "",
      board_resolution_no: "",
      approved_budget_words: "",
      approved_budget_amount: "",
      duration_words: "",
      duration_years: "",
      date_from_to: "",
      activity_title: "",
      activity_date: "",
      activity_venue: "",
      activity_value_statement: "",
      requested_activity_budget: "",
      prmsu_participants_words: "",
      prmsu_participants_num: "",
      partner_agency_participants_words: "",
      partner_agency_participants_num: "",
      partner_agency_name: "",
      trainees_words: "",
      trainees_num: ""
    });
    setContent({
      program_title: "",
      project_title: "",
      activity_title: "",
      sdg_alignment: "",
      extension_agenda: "",
      project_leader: "",
      members: "",
      college_campus_program: "",
      collaborating_agencies: "",
      community_location: "",
      target_sector: "",
      number_of_beneficiaries: "",
      implementation_period: "",
      total_budget_requested: "",
      rationale: "",
      significance: "",
      general_objectives: "",
      specific_objectives: "",
      methodology: "",
      expected_output_6ps: {
        publications: "",
        patents: "",
        products: "",
        people_services: "",
        places_partnerships: "",
        policy: "",
        social_impact: "",
        economic_impact: ""
      },
      sustainability_plan: "",
      org_and_staffing_json: [
        { activity: "Proposal Preparation", designation: "", terms: "" },
        { activity: "Program/Certificates", designation: "", terms: "" },
        { activity: "Food Preparation", designation: "", terms: "" },
        { activity: "Resource Speakers", designation: "", terms: "" }
      ],
      prmsu_participants_count: "",
      partner_agency_participants_count: "",
      trainees_count: ""
    });
    setActivitySchedule({
      activity_title: "",
      activity_date: "",
      schedule: [
        { time: "7:30–8:00 AM", activity: "Registration", speaker: "" },
        { time: "8:00–8:05 AM", activity: "Invocation–AV Presentation", speaker: "" },
        { time: "8:20–8:45 AM", activity: "Opening Remarks", speaker: "Dr. Roy N. Villalobos, University President" },
        { time: "8:45–9:00 AM", activity: "Welcome Remarks", speaker: "" },
        { time: "9:00 AM–12:00 NOON", activity: "", speaker: "" },
        { time: "12:00-1:00 PM", activity: "LUNCH BREAK", speaker: "" },
        { time: "1:00-3:00 PM", activity: "", speaker: "" },
        { time: "3:00-4:30 PM", activity: "Open Forum/Evaluation", speaker: "" },
        { time: "4:30-4:45 PM", activity: "Awarding of Certificates", speaker: "" },
        { time: "4:45-4:55 PM", activity: "Closing Remarks", speaker: "" },
        { time: "4:55-5:00 PM", activity: "Photo Opportunity", speaker: "" }
      ]
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const updateScheduleRow = (index: number, field: keyof ScheduleItem, value: string): void => {
    const updated = [...activitySchedule.schedule];
    updated[index][field] = value;
    setActivitySchedule({ ...activitySchedule, schedule: updated });
  };

  const addScheduleRow = (): void => {
    setActivitySchedule({
      ...activitySchedule,
      schedule: [
        ...activitySchedule.schedule,
        { time: "", activity: "", speaker: "" }
      ]
    });
  };

  const handleChange = (
    category: keyof BudgetRows, 
    index: number, 
    field: keyof BudgetRow, 
    value: string
  ): void => {
    const updated = [...rows[category]];
    updated[index][field] = value;

    if (field === "cost" || field === "qty") {
      const cost = Number(updated[index].cost) || 0;
      const qty = Number(updated[index].qty) || 0;
      updated[index].amount = cost * qty;
    }

    setRows({ ...rows, [category]: updated });
  };

  const addRow = (category: keyof BudgetRows): void => {
    setRows({
      ...rows,
      [category]: [...rows[category], { item: "", cost: "", qty: "", amount: "" }],
    });
  };

  const totalAmount = (category: keyof BudgetRows): number =>
    rows[category].reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const renderRows = (category: keyof BudgetRows): JSX.Element[] =>
    rows[category].map((row, i) => (
      <tr
        key={i}
        className="group border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {/* ITEM */}
        <td className="px-4 py-3">
          <input
            placeholder="Item description"
            className="
              w-full bg-transparent
              border-b border-gray-300
              focus:border-emerald-500
              focus:ring-0
              outline-none
              text-sm text-center
              placeholder:text-gray-400
              transition-colors
            "
            value={row.item}
            onChange={(e) =>
              handleChange(category, i, "item", e.target.value)
            }
          />
        </td>

        {/* COST */}
        <td className="px-4 py-3">
          <input
            type="number"
            placeholder="0.00"
            className="
              w-full bg-transparent
              border-b border-gray-300
              focus:border-emerald-500
              outline-none
              text-sm text-center
              placeholder:text-gray-400
              transition-colors
              appearance-none
            "
            value={row.cost}
            onChange={(e) =>
              handleChange(category, i, "cost", e.target.value)
            }
          />
        </td>

        {/* QTY */}
        <td className="px-4 py-3">
          <input
            type="number"
            placeholder="0"
            className="
              w-full bg-transparent
              border-b border-gray-300
              focus:border-emerald-500
              outline-none
              text-sm text-center
              placeholder:text-gray-400
              transition-colors
              appearance-none
            "
            value={row.qty}
            onChange={(e) =>
              handleChange(category, i, "qty", e.target.value)
            }
          />
        </td>

        {/* AMOUNT */}
        <td className="px-4 py-3">
          <input
            readOnly
            className="
              w-full bg-gray-100
              border border-gray-200
              rounded-md
              text-sm text-center
              font-medium
              text-gray-700
              cursor-not-allowed
            "
            value={row.amount}
          />
        </td>
      </tr>
    ));

  const toNumber = (value: string | number | undefined | null): number | null => {
    if (value === "" || value === null || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  const cleanData = (obj: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    for (const key in obj) {
      if (obj[key] === "") {
        cleaned[key] = null;
      } else {
        cleaned[key] = obj[key];
      }
    }
    return cleaned;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title || title.trim() === '') {
      showToast('Please enter a proposal title before submitting.', "info");
      return;
    }

    if (!cover.activity_date || cover.activity_date.trim() === '') {
      showToast('Please fill in the Activity Date in the Cover Page section.', "info");
      return;
    }

    if (!cover.activity_title || cover.activity_title.trim() === '') {
      showToast('Please fill in the Activity Title in the Cover Page section.', "info");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API calls for proposal submission
      console.log('=== PROPOSAL DATA ===');
      console.log('Title:', title);
      console.log('User ID:', user?.user_id);
      console.log('Cover Page Data:', cover);
      console.log('Content Data:', content);
      console.log('Activity Schedule:', activitySchedule);
      console.log('Budget Rows:', rows);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast('Proposal submitted successfully!', "success");
      resetForm();

    } catch (error) {
      console.error('Error submitting proposal:', error);
      showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivityTitleChange = (value: string): void => {
    setCover(prev => ({ ...prev, activity_title: value }));
    setContent(prev => ({ ...prev, activity_title: value }));
    setActivitySchedule(prev => ({ ...prev, activity_title: value }));
  };

  const handleActivityDateChange = (value: string): void => {
    setCover(prev => ({ ...prev, activity_date: value }));
    setActivitySchedule(prev => ({ ...prev, activity_date: value }));
  };

  const formatDateLong = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8 animate-overlay-enter">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Create Proposal</h2>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to submit your extension program proposal
            </p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="space-y-6">
          
          {/* Title Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              <h3 className="text-xl font-bold text-gray-900">Proposal Title</h3>
            </div>
            <InputField 
              type='text'
              label=""
              placeholder="Enter your proposal title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Cover Page Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-5">
              <h2 className="text-2xl font-bold text-white">Cover Page</h2>
              <p className="text-white/80 text-sm mt-1">Formal submission letter details</p>
            </div>
            
            <section className="p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
                <div className="space-y-6 text-sm leading-relaxed text-gray-800">
                  
                  {/* Date Selection */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Submission</label>
                    <input 
                      placeholder='Select Date of Submission'
                      className='w-full md:w-auto border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all'
                      type="date" 
                      value={cover.submission_date}
                      onChange={(e) => setCover({ ...cover, submission_date: e.target.value })}
                    />
                  </div>

                  {/* Recipient Info Card */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
                    <p className='font-bold text-lg text-gray-900'>DR. ROY N. VILLALOBOS</p>
                    <p className="text-gray-700 font-medium">University President</p>
                    <p className="text-gray-600">President Ramon Magsaysay State University</p>
                  </div>

                  <p className="text-gray-700 font-medium">Dear Sir:</p>

                  {/* Program Details */}
                  <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-800 leading-relaxed">
                      I have the honor to submit the proposal for your consideration and appropriate action 
                      for the proposed extension program entitled 
                      <InlineInput 
                        type='text' 
                        placeholder="(Title referring to approved Board Reso)" 
                        width="w-full md:w-72"
                        value={cover.board_resolution_title}
                        onChange={(e) => setCover({ ...cover, board_resolution_title: e.target.value })}
                      />, 
                      <InlineInput 
                        type='text' 
                        placeholder="(Board Resolution No.)" 
                        width="w-full md:w-48"
                        value={cover.board_resolution_no}
                        onChange={(e) => setCover({ ...cover, board_resolution_no: e.target.value })}
                      />
                      with the approved budget of <InlineInput 
                        type="text" 
                        placeholder="____(Total amount in words)" 
                        value={cover.approved_budget_words}
                        onChange={(e) => setCover({ ...cover, approved_budget_words: e.target.value })}          
                      /> ; 
                      (<InlineInput 
                        type="number" 
                        placeholder="(Total amount in numbers)" 
                        width="w-full md:w-40"
                        value={cover.approved_budget_amount}
                        onChange={(e) => setCover({ ...cover, approved_budget_amount: e.target.value })}
                      />) with the duration 
                      of <InlineInput 
                        type='text' 
                        placeholder="____in words (in numbers)" 
                        width="w-full md:w-40" 
                        value={cover.duration_words}
                        onChange={(e) => setCover({ ...cover, duration_words: e.target.value })}          
                      /> years, 
                      <InlineInput 
                        type='text' 
                        placeholder="(date from-to). (please refer to the approved Board Reso)" 
                        width="w-full md:w-80" 
                        value={cover.date_from_to}
                        onChange={(e) => setCover({ ...cover, date_from_to: e.target.value })}          
                      />.
                    </p>

                    <p className="text-gray-800 leading-relaxed">
                      This program includes an activity entitled (
                      <InlineInput
                        type='text'
                        placeholder="activity title under the program"
                        width="w-full md:w-64"
                        value={cover.activity_title}
                        onChange={(e) => handleActivityTitleChange(e.target.value)}
                      />) on <input
                        type="text"
                        placeholder="select activity date"
                        value={cover.activity_date ? formatDateLong(cover.activity_date) : ""}
                        readOnly
                        onClick={() => {
                          const picker = document.getElementById("hiddenDatePicker") as HTMLInputElement;
                          picker?.showPicker?.();
                        }}
                        className="bg-white border-b-2 border-green-500 cursor-pointer text-green-700 placeholder:text-green-400 font-semibold text-center px-2 py-1 rounded hover:bg-green-50 transition-colors"
                      />
                      <input
                        id="hiddenDatePicker"
                        type="date"
                        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                        value={cover.activity_date}
                        onChange={(e) => handleActivityDateChange(e.target.value)}
                      />
                      at 
                      <InlineInput 
                        type='text' 
                        placeholder="___ venue" 
                        width="w-full md:w-32" 
                        value={cover.activity_venue}
                        onChange={(e) => setCover({ ...cover, activity_venue: e.target.value })}          
                      />. This activity is valuable 
                      <InlineInput 
                        type='text' 
                        placeholder="____for what" 
                        width="w-full md:w-24" 
                        value={cover.activity_value_statement}
                        onChange={(e) => setCover({ ...cover, activity_value_statement: e.target.value })}          
                      />. The requested expenses 
                      for this activity from the university is Php 
                      <InlineInput 
                        placeholder="____(Total amount in numbers)" 
                        width="w-full md:w-48" 
                        type="number"
                        value={cover.requested_activity_budget}
                        onChange={(e) => setCover({ ...cover, requested_activity_budget: e.target.value })}          
                      />, 
                      which will be used to defray expenses for food, transportation, supplies and materials, 
                      and other expenses related to these activities.
                    </p>

                    <p className="text-gray-800 leading-relaxed">
                      Further, there is <InlineInput 
                        type='text' 
                        placeholder="____number of participants in words" 
                        value={cover.prmsu_participants_words}
                        onChange={(e) => setCover({ ...cover, prmsu_participants_words: e.target.value })}          
                      /> 
                      (<InlineInput 
                        type='number' 
                        placeholder="number of participants in numbers"
                        value={cover.prmsu_participants_num}
                        onChange={(e) => setCover({ ...cover, prmsu_participants_num: e.target.value })}          
                      /> ) the total number of participants from PRMSU, 
                      another <InlineInput 
                        type='text' 
                        placeholder="____ total number from partner agency in words" 
                        value={cover.partner_agency_participants_words}
                        onChange={(e) => setCover({ ...cover, partner_agency_participants_words: e.target.value })}          
                      /> 
                      (<InlineInput  
                        placeholder="total number from partner agency in numbers" 
                        type="number"
                        value={cover.partner_agency_participants_num}
                        onChange={(e) => setCover({ ...cover, partner_agency_participants_num: e.target.value })}          
                      /> ) from the collaborating agency, 
                      <InlineInput 
                        type='text' 
                        placeholder="_____(agency name)" 
                        width="w-full md:w-40" 
                        value={cover.partner_agency_name}
                        onChange={(e) => setCover({ ...cover, partner_agency_name: e.target.value })}          
                      />, and 
                      <InlineInput 
                        type='text' 
                        placeholder="____ total number of trainees in words" 
                        value={cover.trainees_words}
                        onChange={(e) => setCover({ ...cover, trainees_words: e.target.value })}          
                      /> 
                      ( <InlineInput 
                        type='number' 
                        placeholder="total number of trainees in numbers"
                        value={cover.trainees_num}
                        onChange={(e) => setCover({ ...cover, trainees_num: e.target.value })}          
                      /> ) trainees from the abovementioned community.
                    </p>
                  </div>

                  <p className="text-gray-700 pt-4">Your favorable response regarding this matter will be highly appreciated.</p>
                </div>
              </div>
            </section>
          </div>
          
          {/* Project Profile Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-5">
              <h3 className="text-2xl font-bold text-white">I. Program/Project Profile</h3>
              <p className="text-white/80 text-sm mt-1">Essential project information and details</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-4">
              {[
                { label: 'Program Title', key: 'program_title' as keyof ContentData, type: 'text' },
                { label: 'Project Title', key: 'project_title' as keyof ContentData, type: 'text' },
                { label: 'Activity Title', key: 'activity_title' as keyof ContentData, type: 'text', onChange: handleActivityTitleChange },
                { label: "SDG's", key: 'sdg_alignment' as keyof ContentData, type: 'text' },
                { label: 'Extension Agenda', key: 'extension_agenda' as keyof ContentData, type: 'text' },
                { label: 'Proponents: Leader', key: 'project_leader' as keyof ContentData, type: 'text' },
                { label: 'Proponents: Members', key: 'members' as keyof ContentData, type: 'text' },
                { label: 'College/Campus/Mandated Program', key: 'college_campus_program' as keyof ContentData, type: 'text' },
                { label: 'Collaborating Agencies', key: 'collaborating_agencies' as keyof ContentData, type: 'text' },
                { label: 'Community Location', key: 'community_location' as keyof ContentData, type: 'text' },
                { label: 'Target Sector', key: 'target_sector' as keyof ContentData, type: 'text' },
                { label: 'Number of Beneficiaries', key: 'number_of_beneficiaries' as keyof ContentData, type: 'number' },
                { label: 'Period of Implementation/Duration', key: 'implementation_period' as keyof ContentData, type: 'text' },
                { label: 'Budgetary Requirements (PhP)', key: 'total_budget_requested' as keyof ContentData, type: 'number' },
              ].map((field, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 group">
                  <span className="md:w-64 text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {field.label}:
                  </span>
                  <input 
                    type={field.type}
                    className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-50 
                    border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none 
                    focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={content[field.key] as string}
                    onChange={(e) => field.onChange 
                      ? field.onChange(e.target.value)
                      : setContent({...content, [field.key]: e.target.value})
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Text Sections (Rationale, Significance, etc.) */}
          {[
            { title: 'II. Rationale', key: 'rationale' as keyof ContentData },
            { title: 'III. Significance', key: 'significance' as keyof ContentData },
          ].map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
              </div>
              <TextAreaField 
                label="" 
                value={content[section.key] as string}
                onChange={(e) => setContent({...content, [section.key]: e.target.value})}
              />
            </div>
          ))}

          {/* Objectives Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              <h2 className='text-xl font-bold text-gray-900'>IV. Objectives</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <label className="font-bold text-gray-900">General Objectives:</label>
                </div>
                <TextAreaField 
                  label="" 
                  value={content.general_objectives}
                  onChange={(e) => setContent({...content, general_objectives: e.target.value})}
                />
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <label className="font-bold text-gray-900">Specific Objectives:</label>
                </div>
                <TextAreaField 
                  label="" 
                  value={content.specific_objectives}
                  onChange={(e) => setContent({...content, specific_objectives: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Methodology Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              <h3 className="text-xl font-bold text-gray-900">V. Methodology</h3>
            </div>
            <TextAreaField 
              label="" 
              value={content.methodology}
              onChange={(e) => setContent({...content, methodology: e.target.value})}
            />
          </div>

          {/* Expected Output Section */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-5">
              <h3 className="text-2xl font-bold text-white">VI. Expected Output/Outcome</h3>
              <p className="text-white/80 text-sm mt-1">6Ps Framework Assessment</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-green-500">
                    <th className="px-6 py-4 text-left font-bold text-gray-900">6Ps</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-900">Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { label: 'Publications', key: 'publications' as keyof ExpectedOutput6ps },
                    { label: 'Patents/IP', key: 'patents' as keyof ExpectedOutput6ps },
                    { label: 'Products', key: 'products' as keyof ExpectedOutput6ps },
                    { label: 'People Services', key: 'people_services' as keyof ExpectedOutput6ps },
                    { label: 'Places and Partnerships', key: 'places_partnerships' as keyof ExpectedOutput6ps },
                    { label: 'Policy', key: 'policy' as keyof ExpectedOutput6ps },
                    { label: 'Social Impact', key: 'social_impact' as keyof ExpectedOutput6ps },
                    { label: 'Economic Impact', key: 'economic_impact' as keyof ExpectedOutput6ps },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">
                        {item.label}
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 
                          rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                          placeholder={`Enter ${item.label.toLowerCase()}...`}
                          value={content.expected_output_6ps[item.key]}
                          onChange={(e) => setContent({
                            ...content, 
                            expected_output_6ps: {...content.expected_output_6ps, [item.key]: e.target.value}
                          })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sustainability Plan */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              <h3 className="text-xl font-bold text-gray-900">VII. Sustainability Plan</h3>
            </div>
            <textarea 
              rows={12}
              className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl 
              focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Describe the sustainability plan for this project..."
              value={content.sustainability_plan}
              onChange={(e) => setContent({...content, sustainability_plan: e.target.value})}
            />
          </div>

          {/* Organization and Staffing */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-5">
              <h2 className="text-2xl font-bold text-white">
                VIII. Organization and Staffing
              </h2>
              <p className="text-white/80 text-sm mt-1 italic">Persons involved and responsibility</p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-green-500">
                  <div className="font-bold text-gray-900 text-sm">Activity's</div>
                  <div className="font-bold text-gray-900 text-sm">Designation/Name</div>
                  <div className="font-bold text-gray-900 text-sm">Terms of Reference</div>
                </div>
                
                {content.org_and_staffing_json.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                    <div className="text-sm font-semibold text-gray-900 self-center">{item.activity}</div>
                    <textarea 
                      placeholder="Full name of faculty. Include also the non-teaching (INSERT THE Plantilla)"
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3 text-xs h-24 resize-none 
                      outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={item.designation}
                      onChange={(e) => {
                        const updated = [...content.org_and_staffing_json];
                        updated[index].designation = e.target.value;
                        setContent({...content, org_and_staffing_json: updated});
                      }}
                    />
                    <textarea 
                      placeholder="Responsibilities and terms of reference"
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3 text-xs h-24 resize-none 
                      outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      value={item.terms}
                      onChange={(e) => {
                        const updated = [...content.org_and_staffing_json];
                        updated[index].terms = e.target.value;
                        setContent({...content, org_and_staffing_json: updated});
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan of Activities */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-5">
              <h2 className="text-2xl font-bold text-white">IX. Plan of Activities</h2>
              <p className="text-white/80 text-sm mt-1">Activity schedule and program flow</p>
            </div>

            <div className="p-6 md:p-10">
              {/* Activity Header Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <input
                  placeholder="ENTER ACTIVITY TITLE HERE"
                  className="w-full text-center font-bold text-xl md:text-2xl outline-none bg-transparent 
                  text-blue-700 placeholder-blue-400 border-b-2 border-blue-400 pb-2 mb-4 focus:border-blue-600 transition-colors"
                  value={activitySchedule.activity_title}
                  onChange={(e) => handleActivityTitleChange(e.target.value)}
                />
                
                <div className='flex items-center justify-center gap-3 mb-3'>
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Date:</span>
                  <input 
                    placeholder='Select Date'
                    className='border-2 border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all'
                    type="date" 
                    value={activitySchedule.activity_date}
                    onChange={(e) => handleActivityDateChange(e.target.value)}
                  />
                </div>
                
                <p className="text-lg font-bold text-center text-gray-900 uppercase tracking-wide">Programme</p>
              </div>

              {/* Schedule Table */}
              <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-600 to-emerald-600">
                      <th className="py-4 px-6 text-center border-r border-white/20">
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-white font-bold text-sm">Time</span>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center">
                        <span className="text-white font-bold text-sm">Part of the Program / Speaker</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activitySchedule.schedule.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 align-top border-r border-gray-200 bg-gray-50">
                          <input 
                            placeholder='e.g., 9:00 AM'
                            className="w-full text-center bg-white border border-gray-200 rounded-lg px-3 py-2 
                            outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            value={row.time}
                            onChange={(e) => updateScheduleRow(index, 'time', e.target.value)}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <input 
                              placeholder='Activity / Part of Program'
                              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 font-semibold 
                              outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                              value={row.activity}
                              onChange={(e) => updateScheduleRow(index, 'activity', e.target.value)}
                            />
                            <input 
                              placeholder='Speaker / Facilitator (optional)'
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 
                              outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" 
                              value={row.speaker}
                              onChange={(e) => updateScheduleRow(index, 'speaker', e.target.value)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button
                onClick={addScheduleRow}
                className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-semibold 
                bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Schedule Row
              </button>
            </div>
          </div>

          {/* Budgetary Requirement */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 md:px-8 py-5 flex items-center gap-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold text-white">X. Budgetary Requirement</h2>
                <p className="text-white/80 text-sm mt-1">Detailed budget breakdown</p>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                      <th className="px-6 py-4 text-left font-bold">Item</th>
                      <th className="px-6 py-4 text-left font-bold">Cost (PHP)</th>
                      <th className="px-6 py-4 text-left font-bold">Pax / Qty</th>
                      <th className="px-6 py-4 text-left font-bold">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {/* Meals Section */}
                    <tr className="bg-gradient-to-r from-orange-50 to-orange-100">
                      <td colSpan={4} className="px-6 py-3 font-bold text-orange-900 flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        A. Meals and Snacks
                      </td>
                    </tr>
                    {renderRows("meals")}
                    <tr className="font-bold bg-orange-100 border-t-2 border-orange-300">
                      <td className="px-6 py-3" colSpan={3}>Subtotal - Meals</td>
                      <td className='px-6 py-3 text-orange-900'>₱ {totalAmount("meals")}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-2">
                        <button
                          onClick={() => addRow("meals")}
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-xs font-semibold 
                          bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Row
                        </button>
                      </td>
                    </tr>

                    {/* Transport Section */}
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <td colSpan={4} className="px-6 py-3 font-bold text-blue-900 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        B. Transportation
                      </td>
                    </tr>
                    {renderRows("transport")}
                    <tr className="font-bold bg-blue-100 border-t-2 border-blue-300">
                      <td className="px-6 py-3" colSpan={3}>Subtotal - Transportation</td>
                      <td className='px-6 py-3 text-blue-900'>₱ {totalAmount("transport")}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-2">
                        <button
                          onClick={() => addRow("transport")}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-semibold 
                          bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Row
                        </button>
                      </td>
                    </tr>

                    {/* Supplies Section */}
                    <tr className="bg-gradient-to-r from-purple-50 to-purple-100">
                      <td colSpan={4} className="px-6 py-3 font-bold text-purple-900 flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        C. Supplies and Materials
                      </td>
                    </tr>
                    {renderRows("supplies")}
                    <tr className="font-bold bg-purple-100 border-t-2 border-purple-300">
                      <td className="px-6 py-3" colSpan={3}>Subtotal - Supplies</td>
                      <td className='px-6 py-3 text-purple-900'>₱ {totalAmount("supplies")}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-2">
                        <button
                          onClick={() => addRow("supplies")}
                          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-xs font-semibold 
                          bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Row
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end py-6">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
              text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 
              transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-green-500/40'}`}
            >
              <span className="flex items-center gap-3">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Proposal
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateProposal;