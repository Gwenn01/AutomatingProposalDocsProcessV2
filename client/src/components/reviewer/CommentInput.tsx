import React, { useState, useEffect } from "react";
import { MessageSquare, Lock, CheckCircle } from "lucide-react";

interface CommentInputProps {
  sectionName: string;
  InputValue: string;
  onCommentChange: (inputValue: string, commentValue: string) => void;
  value?: string;
  disabled?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({
  sectionName,
  InputValue,
  onCommentChange,
  value = "",
  disabled = false,
}) => {
  const [comment, setComment] = useState<string>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    setComment(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    const newValue = e.target.value;
    setComment(newValue);
    onCommentChange(InputValue, newValue);
  };

  return (
    <div
      className={`my-6 border rounded-2xl p-5 transition-all ${
        disabled ? "border-gray-300 bg-gray-50" : "border-green-200 bg-green-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {disabled ? (
            <Lock className="w-6 h-6 text-gray-500" />
          ) : (
            <MessageSquare className="w-6 h-6 text-green-600" />
          )}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <label
              className={`text-sm font-semibold ${
                disabled ? "text-gray-700" : "text-green-900"
              }`}
            >
              Reviewer's Comment - {sectionName}
            </label>

            {disabled && (
              <span className="flex items-center gap-1 text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Reviewed
              </span>
            )}
          </div>

          {/* Info message when locked */}
          {disabled && (
            <div className="mb-3 text-xs text-gray-600 bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg">
              You have already reviewed, Please wait for the proponent to submit
              a revision before making further comments.
            </div>
          )}

          {/* Textarea */}
          <textarea
            value={comment}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => !disabled && setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              disabled
                ? "Review submitted. Waiting for revision..."
                : "Enter your review comments here..."
            }
            className={`w-full px-4 py-3 border rounded-xl resize-none transition-all focus:outline-none ${
              disabled
                ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-600"
                : isFocused
                  ? "border-green-500 ring-2 ring-green-200 bg-white"
                  : "border-gray-300 bg-white"
            }`}
            rows={4}
          />

          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">{comment.length} characters</p>

            {!disabled && (
              <span className="text-xs text-green-600">
                You can edit this comment
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
