import SideNav from "../../ui/SideNav.jsx";
import AddCharaceterButton from "../../ui/AddCharaceterButton.jsx";

import {useNavigate} from "react-router-dom";

export default function DashboardCh() {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex" }}>
            <SideNav />

            <div className="dashboard-content" style={{ flex: 1 }}>
                <h1 style={{ marginBottom: "32px", marginTop: "8px" }}>Characters</h1>

                <div className="campaign-grid">
                    <AddCharaceterButton onClick={() => navigate("/characters/create")} />
                </div>
            </div>

        </div>
    );
}