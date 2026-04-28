export default function ProgressDots({ total, current }) {
    return (
        <div style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {Array.from({ length: total }).map((_, i) => {
                const done = i < current - 1;
                const active = i === current - 1;
                return (
                    <div
                        key={i}
                        style={{
                            width: active ? "20px" : "8px",
                            height: "8px",
                            borderRadius: "999px",
                            backgroundColor: active ? "#7A1E1E" : done ? "#3A1A1A" : "#2A2A2A",
                            border: `1px solid ${active ? "#7A1E1E" : done ? "#5A2A2A" : "#3A3A3A"}`,
                            transition: "all 0.3s ease",
                        }}
                    />
                );
            })}
        </div>
    );
}