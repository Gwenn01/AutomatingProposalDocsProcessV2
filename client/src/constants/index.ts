export const NA = "N/A";
export const val = (v: any) => (v !== undefined && v !== null && v !== "" ? v : NA);
export const arrVal = (arr: string[] | undefined) =>
  arr && arr.length > 0 ? arr.join(", ") : NA;

export const SIX_PS_LABELS = [
  "Publications", "Patents/IP", "Products", "People Services",
  "Places and Partnerships", "Policy", "Social Impact", "Economic Impact",
];

export const QUARTERS = [
  "Year 1 Q1", "Year 1 Q2", "Year 1 Q3", "Year 1 Q4",
  "Year 2 Q1", "Year 2 Q2", "Year 2 Q3", "Year 2 Q4",
  "Year 3 Q1", "Year 3 Q2", "Year 3 Q3", "Year 3 Q4",
];


//CREATE PROPOSAL CONSTANTS

export const TAGGING_OPTIONS = [
  'General',
  'Environment and Climate Change (for CECC)',
  'Gender and Development (for GAD)',
  'Mango-Related (for RMC)',
];

export const CLUSTER_OPTIONS = [
  'Health, Education, and Social Sciences',
  'Engineering, Industry, Information Technology',
  'Environment and Natural Resources',
  'Tourism, Hospitality Management, Entrepreneurship, Criminal Justice',
  'Graduate Studies',
  'Fisheries',
  'Agriculture, Forestry',
];

export const AGENDA_OPTIONS = [
  'Business Management and Livelihood Skills Development',
  'Accountability, Good Governance, and Peace and Order',
  'Youth and Adult Functional Literacy and Education',
  'Accessibility, Inclusivity, and Gender and Development',
  'Nutrition, Health, and Wellness',
  "Indigenous People's Rights and Cultural Heritage Preservation",
  'Human Capital Development',
  'Adoption and Commercialization of Appropriate Technologies',
  'Natural Resources, Climate Change, and Disaster Risk Reduction Management',
];