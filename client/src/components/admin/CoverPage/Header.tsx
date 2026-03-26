// components/admin/Header.tsx
import React from "react";
import { prmsuLogo } from "@/assets";
import { extensionLogo } from "@/assets";

const Header: React.FC = () => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "10px",
                borderBottom: "3px double #888",
                gap: "8px",
            }}
        >
            {/* Left — PRMSU Seal */}
            <div style={{ flexShrink: 0, width: 72, height: 72 }}>
                <img
                    src={prmsuLogo}
                    alt="PRMSU Seal"
                    style={{ width: 72, height: 72, objectFit: "contain" }}
                />
            </div>

            {/* Center — Letterhead Text */}
            <div
                style={{
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "'Times New Roman', Times, serif",
                    lineHeight: 1.4,
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: 11,
                        fontStyle: "italic",
                        color: "#222",
                    }}
                >
                    Republic of the Philippines
                </p>
                <p
                    style={{
                        margin: "1px 0 0",
                        fontSize: 15,
                        fontWeight: "bold",
                        fontStyle: "italic",
                        color: "#1a1a2e",
                        letterSpacing: "0.01em",
                    }}
                >
                    President Ramon Magsaysay State University
                </p>
                <p
                    style={{
                        margin: "1px 0 0",
                        fontSize: 10.5,
                        fontStyle: "italic",
                        color: "#444",
                    }}
                >
                    (Formerly Ramon Magsaysay Technological University)
                </p>
                <p
                    style={{
                        margin: "3px 0 0",
                        fontSize: 12,
                        fontWeight: "bold",
                        fontStyle: "italic",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: "#1a1a2e",
                    }}
                >
                    Extension Services Office
                </p>
                <p
                    style={{
                        margin: "2px 0 0",
                        fontSize: 10,
                        color: "#222",
                    }}
                >
                    Email:{" "}
                    <a
                        href="mailto:university-extensionservice@prmsu.edu.ph"
                        style={{
                            color: "#1a4480",
                            textDecoration: "underline",
                        }}
                    >
                        university-extensionservice@prmsu.edu.ph
                    </a>
                </p>
            </div>

            {/* Right — Extension / ISO Logo */}
            <div style={{ flexShrink: 0, width: 72, height: 72 }}>
                <img
                    src={extensionLogo}
                    alt="Extension Logo"
                    style={{ width: 72, height: 72, objectFit: "contain" }}
                />
            </div>
        </div>
    );
};

export default Header;