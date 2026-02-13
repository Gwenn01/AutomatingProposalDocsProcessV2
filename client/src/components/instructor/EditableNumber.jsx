import React from "react";

const EditableNumber = ({ value, onChange, className = "", isEditing }) => {
  if (!isEditing) {
    return <p className={className}>{value || "N/A"}</p>;
  }

  return (
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border-2 border-blue-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none ${className}`}
    />
  );
};

export default EditableNumber;