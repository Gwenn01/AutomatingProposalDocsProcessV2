import React from "react";

const EditableText = ({ value, onChange, multiline = false, className = "", isEditing }) => {
  if (!isEditing) {
    return <p className={className}>{value || "N/A"}</p>;
  }

  if (multiline) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border-2 border-blue-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none ${className}`}
        rows={4}
      />
    );
  }

  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border-2 border-blue-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none ${className}`}
    />
  );
};

export default EditableText;