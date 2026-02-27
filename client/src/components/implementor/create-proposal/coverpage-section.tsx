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

import InlineInput from "../InlineInput";
import { SectionHeader } from "./ui/section-header";

export const CoverPageSection: React.FC<{
  cover: CoverPageData;
  onChange: (updates: Partial<CoverPageData>) => void;
}> = ({ cover, onChange }) => {
  const formatDateLong = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <SectionHeader title="Cover Page" subtitle="Formal submission letter details" />
      <section className="p-6 md:p-10 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="space-y-6 text-sm leading-relaxed text-gray-800">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Submission</label>
              <input type="date" value={cover.submission_date}
                onChange={(e) => onChange({ submission_date: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <p className="font-bold text-lg text-gray-900">DR. ROY N. VILLALOBOS</p>
              <p className="text-gray-700 font-medium">University President</p>
              <p className="text-gray-600">President Ramon Magsaysay State University</p>
            </div>
            <p className="text-gray-700 font-medium">Dear Sir:</p>
            <div className="space-y-4 bg-gray-50 rounded-xl p-6">
              <p className="leading-relaxed">
                I have the honor to submit the proposal for your consideration and appropriate action for the proposed extension program entitled{' '}
                <InlineInput type="text" placeholder="(Title referring to approved Board Reso)" width="w-64"
                  value={cover.board_resolution_title} onChange={(e) => onChange({ board_resolution_title: e.target.value })} />,{' '}
                <InlineInput type="text" placeholder="(Board Resolution No.)" width="w-48"
                  value={cover.board_resolution_no} onChange={(e) => onChange({ board_resolution_no: e.target.value })} />{' '}
                with the approved budget of{' '}
                <InlineInput type="text" placeholder="(Total amount in words)" width="w-64"
                  value={cover.approved_budget_words} onChange={(e) => onChange({ approved_budget_words: e.target.value })} />{' '}
                ; (<InlineInput type="number" placeholder="(Total amount in numbers)" width="w-40"
                  value={cover.approved_budget_amount} onChange={(e) => onChange({ approved_budget_amount: e.target.value })} />
                ) with the duration of{' '}
                <InlineInput type="text" placeholder="(in words)" width="w-40"
                  value={cover.duration_words} onChange={(e) => onChange({ duration_words: e.target.value })} />{' '}
                years,{' '}
                <InlineInput type="text" placeholder="(date from–to)" width="w-72"
                  value={cover.date_from_to} onChange={(e) => onChange({ date_from_to: e.target.value })} />.
              </p>
              <p className="leading-relaxed">
                This program includes an activity entitled (<InlineInput type="text" placeholder="activity title" width="w-64"
                  value={cover.activity_title} onChange={(e) => onChange({ activity_title: e.target.value })} />
                ) on{' '}
                <span onClick={() => (document.getElementById('coverDatePicker') as HTMLInputElement)?.showPicker?.()}
                  className="bg-white border-b-2 border-green-500 cursor-pointer text-green-700 font-semibold px-2 py-0.5 rounded hover:bg-green-50">
                  {cover.activity_date ? formatDateLong(cover.activity_date) : 'select date'}
                </span>
                <input id="coverDatePicker" type="date" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  value={cover.activity_date} onChange={(e) => onChange({ activity_date: e.target.value })} />
                {' '}at{' '}
                <InlineInput type="text" placeholder="venue" width="w-40"
                  value={cover.activity_venue} onChange={(e) => onChange({ activity_venue: e.target.value })} />.{' '}
                This activity is valuable{' '}
                <InlineInput type="text" placeholder="(for what)" width="w-32"
                  value={cover.activity_value_statement} onChange={(e) => onChange({ activity_value_statement: e.target.value })} />.{' '}
                The requested expenses for this activity from the university is Php{' '}
                <InlineInput type="number" placeholder="(Total amount)" width="w-48"
                  value={cover.requested_activity_budget} onChange={(e) => onChange({ requested_activity_budget: e.target.value })} />,
                {' '}which will be used to defray expenses for food, transportation, supplies and materials, and other expenses related to these activities.
              </p>
              <p className="leading-relaxed">
                Further, there is{' '}
                <InlineInput type="text" placeholder="(# participants in words)" width="w-48"
                  value={cover.prmsu_participants_words} onChange={(e) => onChange({ prmsu_participants_words: e.target.value })} />{' '}
                (<InlineInput type="number" placeholder="(# in numbers)"
                  value={cover.prmsu_participants_num} onChange={(e) => onChange({ prmsu_participants_num: e.target.value })} />
                ) the total number of participants from PRMSU, another{' '}
                <InlineInput type="text" placeholder="(partner agency # in words)"
                  value={cover.partner_agency_participants_words} onChange={(e) => onChange({ partner_agency_participants_words: e.target.value })} />{' '}
                (<InlineInput type="number" placeholder="(# in numbers)"
                  value={cover.partner_agency_participants_num} onChange={(e) => onChange({ partner_agency_participants_num: e.target.value })} />
                ) from the collaborating agency,{' '}
                <InlineInput type="text" placeholder="(agency name)" width="w-40"
                  value={cover.partner_agency_name} onChange={(e) => onChange({ partner_agency_name: e.target.value })} />,
                {' '}and{' '}
                <InlineInput type="text" placeholder="(# trainees in words)"
                  value={cover.trainees_words} onChange={(e) => onChange({ trainees_words: e.target.value })} />{' '}
                (<InlineInput type="number" placeholder="(# in numbers)"
                  value={cover.trainees_num} onChange={(e) => onChange({ trainees_num: e.target.value })} />
                ) trainees from the abovementioned community.
              </p>
            </div>
            <p className="text-gray-700 pt-4">Your favorable response regarding this matter will be highly appreciated.</p>
          </div>
        </div>
      </section>
    </div>
  );
};