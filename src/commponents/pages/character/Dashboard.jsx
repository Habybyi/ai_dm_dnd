import SideNav from "../../ui/SideNav.jsx";
import AddCharaceterButton from "../../ui/AddCharaceterButton.jsx";

import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import CharacterCard from "../../ui/CharacterCard.jsx";

export default function DashboardCh() {
    const navigate = useNavigate();
    const mockCharacters = [
        { id: 1, characterName: "Martin Goon Land", classlevel: "Fighter 1", race: "Dwarf", background:"Adventurer",alignment:"C-G",  image: null },
    ];

    const [loading, setLoading] = useState(true);
    const [Characters, setCharacters] = useState(mockCharacters);
    const [openCharacterId, setOpenCharacterId] = useState(null);

    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:3030/characters', {
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



                if (data.characters) {
                    setCharacters(data.characters);
                }

                console.log("Prijaté dáta:", data.characters);


                setLoading(false);
            } catch (err) {
                console.error("Chyba pri fetchi:", err);
                setLoading(false);
            }
        };

        fetchMyData();
    }, []);

    if (loading) return <div>Loading your exciting stories...</div>;

    return (
        <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex" }}>
            <SideNav />

            <div className="dashboard-content" style={{ flex: 1 }}>

                    <>
                        <h1 style={{ marginBottom: "32px", marginTop: "8px" }}>Characters</h1>
                        <div className="campaign-grid">
                            {Characters.map((c, i) => (
                                <CharacterCard
                                    key={c._id || c.id}
                                    image={c.header?.image}
                                    characterName={c.header?.characterName}
                                    classlevel={c.header?.classLevel}
                                    race={c.header?.race}
                                    background={c.header?.background}
                                    alignment={c.header?.alignment}
                                    onOpen={() => navigate(`/characters/${c._id}/`)}
                                />
                            ))}
                            <AddCharaceterButton onClick={() => navigate("/characters/create")} />
                        </div>
                    </>

            </div>
        </div>
    );
}