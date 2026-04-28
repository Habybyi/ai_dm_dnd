import { useNavigate, useParams } from "react-router-dom";
import SideNav from "../ui/SideNav.jsx";

const modes = [
    {
        id: "help",
        title: "With Help",
        description: "Prevedieme ťa tvorbou postavy krok po kroku s vysvetleniami.",
        btn: "Create with help",
        path: "help",
    },
    {
        id: "custom",
        title: "Custom",
        description: "Ty rozhoduješ o všetkom. Žiadne obmedzenia — ideálne pre homebrew.",
        btn: "Build yourself",
        path: "custom",
    },
    {
        id: "ai",
        title: "AI Created",
        description: "Nechaj AI aby vygenerovala postavu za teba.",
        btn: "Create with AI",
        path: "ai",
    },
];

export default function NewCharacter() {
    const navigate = useNavigate();
    const { campaignId } = useParams();

    return (
        <div style={{
            backgroundColor: "var(--bg-primary)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
        }}>
            <SideNav />

            <div style={{ width: "100%", maxWidth: "1000px" }}>
                <p style={{ fontSize: "13px", color: "#5A4A3A", fontStyle: "italic", marginBottom: "6px" }}>
                    Campaign · Curse of Strahd
                </p>
                <h2 style={{
                    fontSize: "28px",
                    color: "#E8D5C4",
                    fontFamily: "var(--font-heading)",
                    marginBottom: "40px",
                }}>
                    Create a New Character
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                    {modes.map((mode) => (
                        <div
                            key={mode.id}
                            style={{
                                backgroundColor: "#1E1E1E",
                                border: "1px solid #2A2020",
                                borderRadius: "14px",
                                padding: "32px 28px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                minHeight: "280px",
                            }}
                        >
                            <h3 style={{
                                color: "#E8D5C4",
                                fontSize: "20px",
                                fontFamily: "var(--font-heading)",
                            }}>
                                {mode.title}
                            </h3>

                            <p style={{
                                color: "#5A4A3A",
                                fontSize: "14px",
                                fontStyle: "italic",
                                flex: 1,
                                lineHeight: "1.6",
                            }}>
                                {mode.description}
                            </p>

                            <button
                                onClick={() => navigate(`/characters/create/${mode.path}`)}
                                style={{
                                    backgroundColor: "#7A1E1E",
                                    border: "none",
                                    borderRadius: "999px",
                                    color: "#E8D5C4",
                                    padding: "13px 20px",
                                    fontSize: "14px",
                                    fontStyle: "italic",
                                    cursor: "pointer",
                                    width: "100%",
                                    fontFamily: "var(--font-body)",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#8B2A2A"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7A1E1E"}
                            >
                                {mode.btn}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}