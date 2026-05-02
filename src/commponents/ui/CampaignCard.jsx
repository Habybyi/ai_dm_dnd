export default function CampaignCard({
                                         name,
                                         description,
                                         image,
                                         role,
                                         characterName,
                                         level,
                                         members = [],
                                         status = "active",
                                         onOpen,
                                     }) {
    const isDM = role === "dm";
    const playerCount = members.length;

    const statusLabel = status.toUpperCase();

    const placeholderIcon = (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.2 }}>
            <path d="M24 4L44 40H4L24 4Z" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="24" cy="26" r="6" stroke="white" strokeWidth="2" />
        </svg>
    );

    const dmIcon = (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2Z"
                fill="var(--text-secondary)"
            />
        </svg>
    );

    const playerIcon = (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
                d="M8 1l2 4 5 .7-3.5 3.4.8 4.9L8 12l-4.3 2 .8-4.9L1 5.7 6 5z"
                fill="var(--text-secondary)"
            />
        </svg>
    );

    return (
        <div
            style={{
                width: "280px",
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Hero image */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "160px",
                    backgroundColor: "var(--bg-tertiary)",
                    backgroundImage: image ? `url(${image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {!image && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: isDM
                                ? "linear-gradient(160deg, #1a1a2e 0%, #2d1b4e 50%, #0f3460 100%)"
                                : "linear-gradient(160deg, #0d2818 0%, #1a4a2e 50%, #0a3320 100%)",
                            opacity: 0.9,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {placeholderIcon}
                    </div>
                )}

                {/* Status badge */}
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "999px",
                        padding: "3px 10px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "rgba(255,255,255,0.7)",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {statusLabel}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div
                style={{
                    padding: "14px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    flex: 1,
                }}
            >
                {/* Title + description */}
                <div>
                    <p
                        style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            fontFamily: "var(--font-heading)",
                            color: "var(--text-primary)",
                            margin: "0 0 3px",
                        }}
                    >
                        {name}
                    </p>
                    {description && (
                        <p
                            style={{
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                                margin: 0,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {description}
                        </p>
                    )}
                </div>

                {/* Role info */}
                <div
                    style={{
                        borderTop: "1px solid var(--border-color)",
                        paddingTop: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div
                            style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {isDM ? dmIcon : playerIcon}
                        </div>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            {isDM ? "Dungeon Master" : "Player"}
                        </span>
                    </div>

                    {isDM ? (
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            {playerCount} {playerCount === 1 ? "player" : "players"}
                        </span>
                    ) : (
                        <div style={{ textAlign: "right" }}>
                            <p
                                style={{
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    color: "var(--text-primary)",
                                    margin: 0,
                                }}
                            >
                                {characterName}
                            </p>
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: "var(--text-secondary)",
                                    margin: 0,
                                }}
                            >
                                lvl. {level}
                            </p>
                        </div>
                    )}
                </div>

                {/* Button */}
                <button
                    onClick={onOpen}
                    style={{
                        marginTop: "auto",
                        width: "100%",
                        backgroundColor: "var(--accent-primary)",
                        color: "var(--text-primary)",
                        border: "none",
                        borderRadius: "999px",
                        padding: "11px 0",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "var(--accent-primary)")
                    }
                >
                    Open campaign
                </button>
            </div>
        </div>
    );
}