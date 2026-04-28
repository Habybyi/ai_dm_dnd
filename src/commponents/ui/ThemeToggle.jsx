import { useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(true);

    const toggle = () => {
        setDark(!dark);
        // neskôr tu prepneme CSS class na document.body
        document.body.classList.toggle("light-mode");
    };

    return (
        <button
            onClick={toggle}
            title={dark ? "Prepnúť na svetlý režim" : "Prepnúť na tmavý režim"}
            style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: dark ? "#1A1F3A" : "#E8E8E8",
                border: `2px solid ${dark ? "#2A3060" : "#C8C8C8"}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 200,
                transition: "background-color 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
            {dark ? (
                // Mesiac
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                          stroke="#9AA8D4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ) : (
                // Slnko
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4" stroke="#555" strokeWidth="2"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                          stroke="#555" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            )}
        </button>
    );
}