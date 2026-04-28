import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function Dropdown({ options, value, onChange, placeholder = "Choose" }) {
    const [open, setOpen] = useState(false);
    const [hoveredValue, setHoveredValue] = useState(null);
    const dropdownRef = useRef(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        if (open && dropdownRef.current) {
            gsap.fromTo(dropdownRef.current,
                {
                    opacity: 0,
                    y: -12,
                    scaleY: 0.85,
                    transformOrigin: "top center",
                },
                {
                    opacity: 1,
                    y: 0,
                    scaleY: 1,
                    duration: 0.25,
                    ease: "back.out(1.4)",
                }
            );
        }
    }, [open]);

    const handleClose = () => {
        if (dropdownRef.current) {
            gsap.to(dropdownRef.current, {
                opacity: 0,
                y: -8,
                scaleY: 0.9,
                transformOrigin: "top center",
                duration: 0.18,
                ease: "power2.in",
                onComplete: () => setOpen(false),
            });
        } else {
            setOpen(false);
        }
    };

    return (
        <div style={{ position: "relative", width: "220px" }}>

            {/* Trigger */}
            <button
                onClick={() => open ? handleClose() : setOpen(true)}
                style={{
                    width: "100%",
                    backgroundColor: "#2A2A2A",
                    border: "none",
                    borderRadius: "7px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    color: "#A3A3A3",
                    fontSize: "15px",
                    fontStyle: "italic",
                    fontFamily: "var(--font-body)",
                }}
            >
                <span>{selected ? selected.label : placeholder}</span>
                <svg
                    width="11" height="7" viewBox="0 0 11 7" fill="none"
                    style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                    <path d="M1 1L5.5 6L10 1" stroke="#838383" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    ref={dropdownRef}
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        backgroundColor: "#2A2A2A",
                        borderRadius: "7px",
                        padding: "6px",
                        zIndex: 300,
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            disabled={option.disabled}
                            onClick={() => {
                                if (!option.disabled) {
                                    onChange(option.value);
                                    handleClose();
                                }
                            }}
                            onMouseEnter={() => !option.disabled && setHoveredValue(option.value)}
                            onMouseLeave={() => setHoveredValue(null)}
                            style={{
                                width: "100%",
                                backgroundColor: option.disabled
                                    ? "#484141"
                                    : hoveredValue === option.value
                                        ? "#616161"
                                        : "#4D4D4D",
                                border: "none",
                                borderRadius: "7px",
                                padding: "11px 14px",
                                textAlign: "left",
                                cursor: option.disabled ? "not-allowed" : "pointer",
                                color: option.disabled
                                    ? "#585858"
                                    : hoveredValue === option.value
                                        ? "#FFFFFF"
                                        : "#A3A3A3",
                                fontSize: "15px",
                                fontStyle: "italic",
                                fontFamily: "var(--font-body)",
                                transition: "background-color 0.15s, color 0.15s",
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay */}
            {open && (
                <div
                    onClick={handleClose}
                    style={{ position: "fixed", inset: 0, zIndex: 299 }}
                />
            )}
        </div>
    );
}