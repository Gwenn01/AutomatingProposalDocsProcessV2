// components/ReviewerModal/components/EditableDate.jsx
import React from 'react';

const EditableDate = ({ value, onChange, className = "" }) => {
  return (
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`border-2 border-blue-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none ${className}`}
    />
  );
};

export default EditableDate;