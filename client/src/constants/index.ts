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
