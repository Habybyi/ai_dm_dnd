export default function StatusIcon({ status }) {
    // status: "neutral" | "success" | "error"

    if (status === "success") {
        return (
            <div style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: "#27AE60",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "18px", fontWeight: "bold"
            }}>
                ✓
            </div>
        );
    }

    if (status === "error") {
        return (
            <div style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: "#C0392B",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "18px", fontWeight: "bold"
            }}>
                ✕
            </div>
        );
    }

    return (
        <div style={{
            width: 36, height: 36, borderRadius: "50%",
            backgroundColor: "#555555",
        }} />
    );
}