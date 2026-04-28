export default function CampaignCard({ name, image, role, characterName, level, playerCount, onOpen }) {
    const isDM = role === "dm";

    return (
        <div style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            width: "300px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            minHeight: "400px",
        }}>
            <p style={{ color: "var(--text-primary)", fontSize: "18px", fontFamily: "var(--font-heading)", fontWeight: "600", margin: "0 0 12px" }}>
                {name}
            </p>

            {/* Obrázok */}
            <div style={{
                width: "100%",
                height: "180px",
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "8px",
                backgroundImage: image ? `url(${image})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: "12px",
            }} />

            {/* Info — fixná výška aby button bol vždy na rovnakom mieste */}
            <div style={{ height: "42px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {isDM ? (
                    <>
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>Dungeon Master</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>{playerCount} Players</p>
                    </>
                ) : (
                    <>
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>Player</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0, textAlign: "right" }}>
                            {characterName}<br />lvl. {level}
                        </p>
                    </>
                )}
            </div>

            {/* Button vždy na spodku */}
            <button
                onClick={onOpen}
                style={{
                    marginTop: "auto",
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent-primary)"}
            >
                Open campaign
            </button>
        </div>
    );
}