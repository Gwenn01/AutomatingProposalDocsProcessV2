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
            {/* DATE — Emerald Green Date Input */}
            {/* DATE SECTION */}
            <div style={{ marginBottom: 24 }}>
                {onDateChange ? (
                    /* CREATE MODE: May Input at "SUBMISSION DATE" indicator */
                    <>
                        <input
                            type="date"
                            value={date ?? ""}
                            onChange={(e) => onDateChange?.(e.target.value)}
                            style={{
                                fontFamily: "'Times New Roman', Times, serif",
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "#059669", // Emerald 600
                                background: "#f0fdf4", // Emerald 50
                                border: "none",
                                borderBottom: "2px solid #10b981", // Emerald 500
                                outline: "none",
                                padding: "6px 10px",
                                width: "200px",
                                cursor: "pointer",
                                borderRadius: "4px 4px 0 0",
                            }}
                        />
                        <p style={{ fontSize: 10, color: "#10b981", marginTop: 4, fontWeight: "bold", letterSpacing: "0.05em" }}>
                            SUBMISSION DATE
                        </p>
                    </>
                ) : (
                    /* VIEW MODE: Parehong Emerald style para sa text pero WALANG indicator sa ilalim */
                    <p style={{
                        display: "inline-block",
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#059669",
                        background: "#f0fdf4",
                        borderBottom: "2px solid #10b981",
                        padding: "6px 10px",
                        minWidth: "200px",
                        margin: 0,
                        borderRadius: "4px 4px 0 0",
                    }}>
                        {date}
                    </p>
                )}
            </div>

            {/* Recipient Block */}
            <div style={{ marginBottom: 20 }}>
                <p style={{ ...pStyle, fontWeight: "bold" }}>{recipientName}</p>
                <p style={{ ...pStyle }}>{recipientTitle}</p>
                <p style={{ ...pStyle }}>{recipientSchool}</p>
            </div>

            {/* Salutation */}
            <p style={{ ...pStyle, marginBottom: 16 }}>Dear Sir:</p>

            {/* Editable Body textarea with Green Accents */}
            <div style={{ position: "relative" }}>
                {/* Eto ang Input Indicator sa LOOB ng textarea */}
                {onBodyChange && (
                    <div style={{
                        position: "absolute",
                        top: "8px",
                        right: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        pointerEvents: "none", // Para hindi maharangan ang click sa textarea
                        opacity: 0.6
                    }}>
                        <span style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: "#10b981",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}>
                            Input Letter Body
                        </span>
                    </div>
                )}

                <textarea
                    value={body}
                    onChange={(e) => onBodyChange?.(e.target.value)}
                    spellCheck={false}
                    placeholder="Start typing the formal letter content here..."
                    style={{
                        width: "100%",
                        minHeight: "400px",
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: 14,
                        lineHeight: 1.8,
                        color: "#000",
                        background: "#fcfdfc",
                        border: "1px solid #ecfdf5",
                        borderLeft: "4px solid #10b981", // Emerald 500 left accent
                        outline: "none",
                        resize: "none",
                        padding: "30px 20px 20px 20px", // Tinaasan ang top padding (30px) para hindi matakpan ng indicator ang text
                        margin: 0,
                        textAlign: "justify",
                        whiteSpace: "pre-wrap",
                        overflowY: "hidden",
                        cursor: "text",
                        boxSizing: "border-box",
                        borderRadius: "0 8px 8px 0",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                    }}
                    onInput={(e) => {
                        const el = e.currentTarget;
                        el.style.height = "auto";
                        el.style.height = el.scrollHeight + "px";
                    }}
                />
            </div>
        </div>
    );
};

export default Letter;