import SideNav from "../ui/SideNav.jsx";
import CampaignCard from "../ui/CampaignCard.jsx";
import AddCampaignButton from "../ui/AddCampaignButton.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";

const mockCampaigns = [
    { id: 1, name: "Curse of Strahd", role: "player", characterName: "Chris Reland Fred", level: 5, image: null },
    { id: 2, name: "Curse of Strahd", role: "dm", playerCount: 6, image: null },
];

export default function Dashboard() {

    const navigate = useNavigate();

    const [Campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:3030/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Nepodarilo sa načítať dáta');
                }

                const data = await response.json();

                setCampaigns(data.campaigns);
                setLoading(false);
            } catch (err) {
                console.error("Chyba:", err);
                setLoading(false);
            }
        };

        fetchMyData();
    }, []);

    if (loading) return <div>Loading your exiting stories...</div>;

    return (
        <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex" }}>
            <SideNav />

            <div className="dashboard-content" style={{ flex: 1 }}>
                <h1 style={{ marginBottom: "32px", marginTop: "8px" }}>Campaigns</h1>

                <div className="campaign-grid">
                    {Campaigns.map((c) => (
                        <CampaignCard
                            key={c.id}
                            name={c.name}
                            image={c.image}
                            role={c.role || "Uknown"}
                            characterName={c.characterName}
                            level={c.level}
                            playerCount={c.playerCount || 0}
                            onOpen={() => console.log("Open", c.name)}
                        />
                    ))}
                    <AddCampaignButton onClick={() => navigate("/campaign/create")} />
                </div>
            </div>

            <ThemeToggle />
        </div>
    );
}