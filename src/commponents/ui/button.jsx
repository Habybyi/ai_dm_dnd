export default function Button({ children, onClick, type = "button", disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor: "#4A1E1E",
                color: "#D4A89A",
                border: "2px solid #7A3B3B",
                borderRadius: "999px",
                padding: "10px 28px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                letterSpacing: "0.03em",
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#5A2A2A";
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#4A1E1E";
                e.target.style.color = "#D4A89A";
            }}
            onMouseDown={(e) => {
                e.target.style.backgroundColor = "#6B2E2E";
                e.target.style.color = "#C8E86B";
            }}
            onMouseUp={(e) => {
                e.target.style.backgroundColor = "#5A2A2A";
                e.target.style.color = "#D4A89A";
            }}
        >
            {children}
        </button>
    );
}