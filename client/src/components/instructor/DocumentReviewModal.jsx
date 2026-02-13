import React from "react";
import { X, Bell } from "lucide-react";
import CustomButton from "../CuttomButton";

const DocumentReviewModal = ({ isOpen, onClose, documentUrl }) => {
  if (!isOpen) return null;

  const reviewFields = [
    { label: "Program Title:", height: "h-24" },
    { label: "Project Title:", height: "h-32" },
    { label: "Target Sector:", height: "h-24" },
    { label: "Specific Objectives:", height: "h-32" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col relative">
        
        {/* Header / Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-1 overflow-hidden p-10 gap-6">
          
          {/* Left: Document View */}
          <div className="flex-1 bg-gray-100 rounded border border-gray-200 overflow-y-auto relative p-4">
            <h2>Document</h2>
            {/* <div className="absolute top-4 left-4 flex flex-col items-center">
               <Bell className="w-6 h-6 text-red-600 fill-red-600" />
               <span className="text-[10px] font-bold bg-white px-1 rounded border border-red-600 -mt-1">2</span>
            </div> */}
            {/* Replace this img with an iframe if loading a real PDF */}
            {/* <img 
              src="https://via.placeholder.com/600x800?text=Document+Preview" 
              className="w-full shadow-md" 
              alt="document" 
            /> */}
          </div>

          {/* Right: Review Sidebar */}
          <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            <h4 className="font-bold text-lg">Review:</h4>
            
            {reviewFields.map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">{field.label}</label>
                <textarea 
                  className={`w-full border border-gray-400 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white ${field.height}`}
                  readOnly // Based on Figma, looks like a view-only for the instructor
                />
              </div>
            ))}

            <div className="w-full flex justify-end">
              <CustomButton
                title="Submit Review"
                handlePress
                containerStyles="w-1/2 text-sm"
                loadingText="Submitting Review..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewModal;