import SideNav from "../../ui/SideNav.jsx";
import AddCharaceterButton from "../../ui/AddCharaceterButton.jsx";

import {useState} from "react";
import {useNavigate} from "react-router-dom";
import CharacterCard from "../../ui/CharacterCard.jsx";

export default function DashboardCh() {
    const navigate = useNavigate();

    const mockCharacters = [
        { id: 1, characterName: "Martin Goon Land", classlevel: "Fighter 1", race: "Dwarf", background:"Adventurer",alignment:"C-G",  image: null },
    ];

    const [Characters, setCharacters] = useState(mockCharacters);

    return (
        <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex" }}>
            <SideNav />

            <div className="dashboard-content" style={{ flex: 1 }}>
                <h1 style={{ marginBottom: "32px", marginTop: "8px" }}>Characters</h1>

                <div className="campaign-grid">
                    {Characters.map((c) => (
                        <CharacterCard
                            key={c.id}
                            image={c.image}
                            characterName={c.characterName}
                            classlevel={c.classlevel}
                            race={c.race}
                            background={c.background}
                            alignment={c.alignment}
                            onOpen={() => console.log("Open", c.name)}
                        />
                    ))}
                    <AddCharaceterButton onClick={() => navigate("/characters/create")} />
                </div>
            </div>

        </div>
    );
}