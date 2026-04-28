import { useState } from "react";

const COLS = ["L", "N", "C"];
const ROWS = ["G", "N", "E"];

const LABELS = {
    "L-G": "Lawful Good",
    "N-G": "Neutral Good",
    "C-G": "Chaotic Good",
    "L-N": "Lawful Neutral",
    "N-N": "True Neutral",
    "C-N": "Chaotic Neutral",
    "L-E": "Lawful Evil",
    "N-E": "Neutral Evil",
    "C-E": "Chaotic Evil",
};

export default function AlignmentPicker({ value, onChange }) {
    return (
        <div>
            <p style={{ color: "#E8D5C4", fontSize: "14px", textAlign: "center", marginBottom: "10px", fontStyle: "italic" }}>
                Alignment
            </p>

            {/* Header L N C */}
            <div style={{ display: "grid", gridTemplateColumns: "20px repeat(3, 44px)", gap: "6px", marginBottom: "6px" }}>
                <div />
                {COLS.map(c => (
                    <div key={c} style={{ textAlign: "center", fontSize: "12px", color: "#5A4A3A", fontStyle: "italic" }}>{c}</div>
                ))}
            </div>

            {/* Rows G N E */}
            {ROWS.map(row => (
                <div key={row} style={{ display: "grid", gridTemplateColumns: "20px repeat(3, 44px)", gap: "6px", marginBottom: "6px" }}>
                    <div style={{ fontSize: "12px", color: "#5A4A3A", fontStyle: "italic", display: "flex", alignItems: "center" }}>{row}</div>
                    {COLS.map(col => {
                        const key = `${col}-${row}`;
                        const selected = value === key;
                        return (
                            <div
                                key={key}
                                title={LABELS[key]}
                                onClick={() => onChange(key)}
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    backgroundColor: "#2A2A2A",
                                    border: `1px solid ${selected ? "#2A6A2A" : "#1A1A1A"}`,
                                    borderRadius: "7px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "border-color 0.15s, background-color 0.15s",
                                    backgroundColor: selected ? "#1A3A1A" : "#2A2A2A",
                                }}
                            >
                                {selected && (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M3 9L7 13L15 5" stroke="#4A9A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Label vybraného */}
            {value && (
                <p style={{ textAlign: "center", fontSize: "11px", color: "#4A9A4A", marginTop: "6px", fontStyle: "italic" }}>
                    {LABELS[value]}
                </p>
            )}
        </div>
    );
}