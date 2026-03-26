// components/admin/Letter.tsx
import React from "react";

interface LetterProps {
    date?: string;
    onDateChange?: (value: string) => void;
    recipientName?: string;
    recipientTitle?: string;
    recipientSchool?: string;
    body?: string;
    onBodyChange?: (value: string) => void;
}

const DEFAULT_BODY = "";

const pStyle: React.CSSProperties = {
    margin: "0 0 0 0",
    lineHeight: 1.65,
    fontSize: 13,
    fontFamily: "'Times New Roman', Times, serif",
    color: "#000",
};

const Letter: React.FC<LetterProps> = ({
    date,
    onDateChange,
    recipientName = "DR. ROY N. VILLALOBOS",
    recipientTitle = "University President",
    recipientSchool = "President Ramon Magsaysay State University",
    body = DEFAULT_BODY,
    onBodyChange,
}) => {
    return (
        <div
            style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: 13,
                color: "#000",
                lineHeight: 1.65,
            }}
        >
            {/* DATE — editable input */}
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    value={date ?? ""}
                    onChange={(e) => onDateChange?.(e.target.value)}
                    placeholder="DATE"
                    style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: 13,
                        fontWeight: "bold",
                        color: "#cc0000",
                        background: "#f1f5f9",
                        border: "none",
                        borderBottom: "1px dashed #b91c1c",
                        outline: "none",
                        lineHeight: 1.65,
                        padding: "2px 4px",
                        width: "180px",
                        borderRadius: 0,
                    }}
                />
            </div>

            {/* Recipient Block */}
            <div style={{ marginBottom: 14 }}>
                <p style={{ ...pStyle, fontWeight: "bold", marginBottom: 0 }}>{recipientName}</p>
                <p style={{ ...pStyle, marginBottom: 0 }}>{recipientTitle}</p>
                <p style={{ ...pStyle, marginBottom: 0 }}>{recipientSchool}</p>
            </div>

            {/* Salutation */}
            <p style={{ ...pStyle, marginBottom: 12 }}>Dear Sir:</p>

            {/* Editable Body textarea */}
            <textarea
                value={body}
                onChange={(e) => onBodyChange?.(e.target.value)}
                spellCheck={false}
                placeholder="Start typing the letter body..."
                style={{
                    width: "100%",
                    minHeight: "320px",
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "#000",
                    background: "#f1f5f9",
                    border: "none",
                    borderBottom: "1px dashed #b91c1c",
                    outline: "none",
                    resize: "none",
                    padding: "10px 12px",
                    margin: 0,
                    textAlign: "justify",
                    whiteSpace: "pre-wrap",
                    overflowY: "hidden",
                    cursor: "text",
                    boxSizing: "border-box",
                    borderRadius: 4,
                }}
                onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = el.scrollHeight + "px";
                }}
            />
        </div>
    );
};

export default Letter;