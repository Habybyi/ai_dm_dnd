import { CiSettings } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { GiCrestedHelmet } from "react-icons/gi";
import { FaBookDead } from "react-icons/fa";

import {useNavigate} from "react-router-dom";


export default function SideNav() {
    const navigate = useNavigate();

    const HandleClick = (Where) => {
        if (!Where) {
            console.error("Cesta je nedefinovaná!");
            return;
        }
        navigate(Where);
    }

    return (
        <>
            {/* DESKTOP */}
            <nav className="sidenav-desktop" style={{
                position: "fixed",
                left: 0, top: 0,
                width: "100px",
                height: "100vh",
                backgroundColor: "#181818",
                borderRight: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "24px",
                paddingBottom: "32px",
                zIndex: 100,
            }}>
                <div style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "50%",
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1.5px solid var(--accent-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}>
                    <FaUser size={28} color="#fff" />
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap:'2vh',
                }}>
                    <button
                        onClick={() => HandleClick("/dashboard")}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        style={{
                        width: "62px",
                        height: "62px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                    }}

                    >
                        <FaBookDead size={34} color="#fff"/>
                    </button>
                    <button
                        onClick={() => HandleClick("/characters")}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        style={{
                        width: "62px",
                        height: "62px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                    }}
                    >
                        <GiCrestedHelmet size={34} color="#fff" />
                    </button>
                </div>

                <button style={{
                    width: "62px",
                    height: "62px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                    <CiSettings size={34} color="#fff" />
                </button>
            </nav>

            {/* MOBILE */}
            <nav className="sidenav-mobile" style={{
                position: "fixed",
                bottom: 0, left: 0, right: 0,
                height: "70px",
                backgroundColor: "#181818",
                borderTop: "1px solid var(--border-color)",
                /* display: "flex"  <-- TOTO VYMAŽ */
                alignItems: "center",
                justifyContent: "space-around",
                zIndex: 100,
                paddingBottom: "env(safe-area-inset-bottom)",
            }}>
                onClick={() => HandleClick("/dashboard")}
                <button style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    height: "100%",
                }}>
                    <FaUser size={22} color="#fff" />
                    <span style={{ fontSize: "10px", color: "#9A8A7A" }}>Profil</span>
                </button>

                <button style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    height: "100%",
                }}>
                    <CiSettings size={26} color="#fff" />
                    <span style={{ fontSize: "10px", color: "#9A8A7A" }}>Nastavenia</span>
                </button>
            </nav>
        </>
    );
}