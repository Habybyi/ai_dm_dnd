export default function CharacterCard({ image, characterName, classlevel, race, background, alignment,  onOpen }) {
    return (
        <div style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            width: "300px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            minHeight: "200px",

        }}>
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                maxHeight: "120px",
            }}>
            {/* Obrázok */}
                <div style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "var(--bg-tertiary)",
                    borderRadius: "8px",
                    backgroundImage: image ? `url(${image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "12px",
                }} />

                <div style={{
                    width: "150px",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <h2>{characterName}</h2>
                    <div style={{
                        color: "var(--text-secondary)",
                    }}>
                        <h4>
                        {classlevel} | {race}
                        </h4>
                    </div>
                </div>

            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "16px",
                color: "var(--text-muted)",
            }}>
                <p>
                    {background}
                </p>
                <p>
                    {alignment}
                </p>
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
                Show Character
            </button>
        </div>
    );
}