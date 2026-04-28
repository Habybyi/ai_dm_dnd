import SideNav from "./SideNav.jsx";
import ProgressDots from "./ProgressDots.jsx";

export default function StepLayout({ campaignName, title, children, currentStep, totalSteps, onNext, onBack, nextLabel = "Next" }) {
    return (
        <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex" }}>
            <SideNav />

            <div className="step-wrapper" style={{ marginLeft: "100px", flex: 1, display: "flex", flexDirection: "column", padding: "24px 40px" }}>

                {/* Header */}
                <div style={{ marginBottom: "6px" }}>
                    <p style={{ fontSize: "12px", color: "#5A4A3A", fontStyle: "italic" }}>Campaign · {campaignName}</p>
                    <h2 style={{ fontSize: "18px", color: "#E8D5C4", fontFamily: "var(--font-heading)" }}>Create a New Character</h2>
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {children}
                </div>

                {/* Footer */}
                <div className="step-footer" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "20px",
                    borderTop: "1px solid #2A2020",
                    marginTop: "20px",
                }}>
                    <button
                        onClick={onBack}
                        style={{
                            backgroundColor: "transparent",
                            border: "1px solid #3A2A2A",
                            borderRadius: "999px",
                            color: currentStep > 1 ? "#A3A3A3" : "transparent",
                            borderColor: currentStep > 1 ? "#3A2A2A" : "transparent",
                            cursor: currentStep > 1 ? "pointer" : "default",
                            fontSize: "13px",
                            fontStyle: "italic",
                            padding: "9px 22px",
                        }}
                    >
                        ← Back
                    </button>

                    <ProgressDots total={totalSteps} current={currentStep} />

                    <button
                        onClick={onNext}
                        style={{
                            backgroundColor: "#7A1E1E",
                            border: "none",
                            borderRadius: "999px",
                            color: "#E8D5C4",
                            padding: "9px 22px",
                            fontSize: "13px",
                            fontStyle: "italic",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#8B2A2A"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7A1E1E"}
                    >
                        {nextLabel} →
                    </button>
                </div>

            </div>
        </div>
    );
}