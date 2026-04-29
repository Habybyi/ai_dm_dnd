import { GiDwarfFace } from "react-icons/gi";

export default function AddCharaceterButton({ onClick }) {
    return (
        <div style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid #3A2A2A",
            borderRadius: "16px",
            width: "300px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
        }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                <GiDwarfFace size={100} />
            </div>

            <button
                onClick={onClick}
                style={{
                    width: "100%",
                    backgroundColor: "var(--accent-primary)",
                    color: "var(--text-primary)",
                    border: "none",
                    borderRadius: "999px",
                    padding: "12px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6B2A2A"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#5A1E1E"}
            >
                New Character
            </button>
        </div>
    );
}