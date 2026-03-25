type YearFilterProps = {
  value: number;
  onChange: (year: number) => void;
};

const YearFilter = ({ value, onChange }: YearFilterProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    // Changed to justify-start for left alignment
    <div className="flex justify-end">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          my-0 py-1 pl-2 pr-7 
          text-sm font-medium text-gray-700 
          bg-transparent 
          border border-gray-200 rounded-md 
          shadow-none cursor-pointer 
          hover:border-gray-300 
          focus:outline-none focus:border-gray-400 focus:ring-0 
          transition-colors
        "
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearFilter;
