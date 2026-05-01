import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepLayout from "../../ui/StepLayout.jsx";
import Input from "../../ui/input.jsx";
import AlignmentPicker from "../../ui/AlignmentPicker.jsx";

const TOTAL_STEPS = 8;

export default function Custom() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [data, setData] = useState({
        characterName: "", playerName: "", background: "", alignment: "",
        age: "", height: "", weight: "", eyes: "", hair: "", skin: "",
        race: "", racialTraits: "",
        class: "", level: "1", subclass: "", hitDie: "",
        str: "", dex: "", con: "", int: "", wis: "", cha: "",
        skills: "", proficiencies: "", languages: "", tools: "",
        cp: "0", sp: "0", gp: "0", ep: "0", pp: "0", equipment: "",
        spellcastingAbility: "", spellSaveDC: "", spellAttackBonus: "",
        cantrips: [], spells: [],
        personalityTraits: "", ideals: "", bonds: "", flaws: "", backstory: "", allies: "",
    });

    const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));
    const handleSubmit = async () => {
       try {
            const token = localStorage.getItem('token');

           const response = await fetch("http://localhost:3030/character/create", {
               method: "POST",
               headers: { "Content-Type": "application/json" ,'Authorization': `Bearer ${token}`},
               body: JSON.stringify({
                    data
               }),
           });
           navigate("/characters")
       } catch (e) {
           console.log(e);
       }
    };
    const next = () => { if (step < TOTAL_STEPS) { setStep(s => s + 1); } else {handleSubmit();}};
    const back = () => { if (step > 1) setStep(s => s - 1); }

    const fieldStyle = { marginBottom: "14px" };

    return (
        <StepLayout
            campaignName="Curse of Strahd"
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            onNext={next}
            onBack={back}
            nextLabel={step === TOTAL_STEPS ? "Vytvoriť postavu" : "Next"}
        >

            {/* ===== KROK 1: Základy ===== */}
            {step === 1 && (
                <div>
                    <h3 style={sh}>Základné informácie</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Meno postavy</div>
                                <Input value={data.characterName} onChange={e => set("characterName", e.target.value)} placeholder="napr. Thorin Darkblade" />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Meno hráča</div>
                                <Input value={data.playerName} onChange={e => set("playerName", e.target.value)} placeholder="tvoje meno" />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Pozadie (Background)</div>
                                <Input value={data.background} onChange={e => set("background", e.target.value)} placeholder="napr. Soldier, Criminal..." />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                                <div style={fieldStyle}>
                                    <div style={lbl}>Vek</div>
                                    <Input value={data.age} onChange={e => set("age", e.target.value)} placeholder="145" />
                                </div>
                                <div style={fieldStyle}>
                                    <div style={lbl}>Výška</div>
                                    <Input value={data.height} onChange={e => set("height", e.target.value)} placeholder={`4'5"`} />
                                </div>
                                <div style={fieldStyle}>
                                    <div style={lbl}>Váha</div>
                                    <Input value={data.weight} onChange={e => set("weight", e.target.value)} placeholder="165 lb" />
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                                <div style={fieldStyle}>
                                    <div style={lbl}>Oči</div>
                                    <Input value={data.eyes} onChange={e => set("eyes", e.target.value)} placeholder="Brown" />
                                </div>
                                <div style={fieldStyle}>
                                    <div style={lbl}>Vlasy</div>
                                    <Input value={data.hair} onChange={e => set("hair", e.target.value)} placeholder="Black" />
                                </div>
                                <div style={fieldStyle}>
                                    <div style={lbl}>Koža</div>
                                    <Input value={data.skin} onChange={e => set("skin", e.target.value)} placeholder="Tan" />
                                </div>
                            </div>
                        </div>

                        {/* Alignment */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AlignmentPicker value={data.alignment} onChange={val => set("alignment", val)} />
                        </div>
                    </div>
                </div>
            )}

            {/* ===== KROK 2: Rasa ===== */}
            {step === 2 && (
                <div>
                    <h3 style={sh}>Rasa</h3>
                    <div style={fieldStyle}>
                        <div style={lbl}>Rasa</div>
                        <Input value={data.race} onChange={e => set("race", e.target.value)} placeholder="napr. Dwarf, Half-Dragon, Homebrew..." />
                    </div>
                    <div style={fieldStyle}>
                        <div style={lbl}>Rasové schopnosti & vlastnosti</div>
                        <textarea
                            value={data.racialTraits}
                            onChange={e => set("racialTraits", e.target.value)}
                            placeholder="napr. Darkvision 60ft, Dwarven Resilience, Stone Cunning..."
                            style={ta}
                            rows={8}
                        />
                    </div>
                </div>
            )}

            {/* ===== KROK 3: Trieda ===== */}
            {step === 3 && (
                <div>
                    <h3 style={sh}>Trieda</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Trieda</div>
                                <Input value={data.class} onChange={e => set("class", e.target.value)} placeholder="napr. Fighter, Homebrew Warlord..." />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Subclass / Archetype</div>
                                <Input value={data.subclass} onChange={e => set("subclass", e.target.value)} placeholder="napr. Battle Master, Eldritch Knight..." />
                            </div>
                        </div>
                        <div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Level</div>
                                <Input type="number" value={data.level} onChange={e => set("level", e.target.value)} placeholder="1" />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Hit Die</div>
                                <Input value={data.hitDie} onChange={e => set("hitDie", e.target.value)} placeholder="napr. d10, d12..." />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== KROK 4: Ability Scores ===== */}
            {step === 4 && (
                <div>
                    <h3 style={sh}>Ability Scores</h3>
                    <p style={{ color: "#5A4A3A", fontSize: "13px", fontStyle: "italic", marginBottom: "20px" }}>
                        Zadaj hodnoty aké chceš — žiadne obmedzenia.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
                        {[
                            { key: "str", label: "Strength" },
                            { key: "dex", label: "Dexterity" },
                            { key: "con", label: "Constitution" },
                            { key: "int", label: "Intelligence" },
                            { key: "wis", label: "Wisdom" },
                            { key: "cha", label: "Charisma" },
                        ].map(({ key, label }) => {
                            const mod = Math.floor((parseInt(data[key]) - 10) / 2);
                            const modStr = isNaN(mod) ? "—" : (mod >= 0 ? `+${mod}` : `${mod}`);
                            return (
                                <div key={key} style={{ backgroundColor: "#2A2A2A", borderRadius: "10px", padding: "14px 10px", textAlign: "center" }}>
                                    <div style={{ fontSize: "10px", color: "#5A4A3A", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>{label}</div>
                                    <input
                                        type="number"
                                        value={data[key]}
                                        onChange={e => set(key, e.target.value)}
                                        placeholder="—"
                                        style={{
                                            width: "100%", backgroundColor: "#1E1E1E", border: "none", borderRadius: "7px",
                                            color: "#E8D5C4", fontSize: "22px", fontWeight: "600", textAlign: "center",
                                            padding: "8px 4px", fontFamily: "var(--font-body)",
                                        }}
                                    />
                                    <div style={{ fontSize: "13px", color: "#7A1E1E", marginTop: "8px" }}>{modStr}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ===== KROK 5: Skills & Proficiencies ===== */}
            {step === 5 && (
                <div>
                    <h3 style={sh}>Skills & Proficiencies</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Skills (Proficiency Bonus: +{Math.ceil(parseInt(data.level || 1) / 4) + 1})</div>
                                <textarea value={data.skills} onChange={e => set("skills", e.target.value)}
                                          placeholder="napr.&#10;Athletics +7&#10;Perception +4&#10;Intimidation +2" style={ta} rows={6} />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Tool Proficiencies</div>
                                <textarea value={data.tools} onChange={e => set("tools", e.target.value)}
                                          placeholder="napr. Smith's tools, Thieves' tools..." style={ta} rows={3} />
                            </div>
                        </div>
                        <div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Other Proficiencies</div>
                                <textarea value={data.proficiencies} onChange={e => set("proficiencies", e.target.value)}
                                          placeholder="napr. All armor, shields, simple & martial weapons..." style={ta} rows={4} />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Languages</div>
                                <textarea value={data.languages} onChange={e => set("languages", e.target.value)}
                                          placeholder="napr. Common, Dwarvish, Elvish..." style={ta} rows={4} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== KROK 6: Výbava ===== */}
            {step === 6 && (
                <div>
                    <h3 style={sh}>Výbava & Meny</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "20px" }}>
                        {[
                            { key: "cp", label: "CP" },
                            { key: "sp", label: "SP" },
                            { key: "ep", label: "EP" },
                            { key: "gp", label: "GP" },
                            { key: "pp", label: "PP" },
                        ].map(({ key, label }) => (
                            <div key={key}>
                                <div style={lbl}>{label}</div>
                                <Input type="number" value={data[key]} onChange={e => set(key, e.target.value)} placeholder="0" />
                            </div>
                        ))}
                    </div>
                    <div style={fieldStyle}>
                        <div style={lbl}>Vybavenie & Itemy</div>
                        <textarea value={data.equipment} onChange={e => set("equipment", e.target.value)}
                                  placeholder="napr.&#10;Battleaxe +1&#10;Chain Mail&#10;Shield&#10;Health Potion x2&#10;Rope 50ft" style={ta} rows={10} />
                    </div>
                </div>
            )}

            {/* ===== KROK 7: Kúzla ===== */}
            {step === 7 && (
                <div>
                    <h3 style={sh}>Kúzla</h3>

                    {/* Spellcasting stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
                        <div>
                            <div style={lbl}>Spellcasting Ability</div>
                            <Input value={data.spellcastingAbility} onChange={e => set("spellcastingAbility", e.target.value)} placeholder="napr. INT, WIS, CHA" />
                        </div>
                        <div>
                            <div style={lbl}>Spell Save DC</div>
                            <Input type="number" value={data.spellSaveDC} onChange={e => set("spellSaveDC", e.target.value)} placeholder="napr. 14" />
                        </div>
                        <div>
                            <div style={lbl}>Spell Attack Bonus</div>
                            <Input value={data.spellAttackBonus} onChange={e => set("spellAttackBonus", e.target.value)} placeholder="napr. +6" />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

                        {/* CANTRIPS tabuľka */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <div style={lbl}>Cantrips</div>
                                <button
                                    onClick={() => set("cantrips", [...data.cantrips, { name: "" }])}
                                    style={addBtn}
                                >+ Pridať</button>
                            </div>

                            {/* Header */}
                            <div style={tableHeader}>
                                <span>Názov cantrip</span>
                            </div>

                            {data.cantrips.length === 0 && (
                                <div style={emptyRow}>Žiadne cantrips</div>
                            )}

                            {data.cantrips.map((c, i) => (
                                <div key={i} style={tableRow}>
                                    <input
                                        style={cellInput}
                                        value={c.name}
                                        onChange={e => {
                                            const updated = [...data.cantrips];
                                            updated[i] = { ...updated[i], name: e.target.value };
                                            set("cantrips", updated);
                                        }}
                                        placeholder="napr. Fire Bolt"
                                    />
                                    <button
                                        onClick={() => set("cantrips", data.cantrips.filter((_, idx) => idx !== i))}
                                        style={removeBtn}
                                    >✕</button>
                                </div>
                            ))}
                        </div>

                        {/* SPELLS tabuľka */}
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <div style={lbl}>Kúzla (Spells)</div>
                                <button
                                    onClick={() => set("spells", [...data.spells, { level: "", name: "", prepared: false }])}
                                    style={addBtn}
                                >+ Pridať</button>
                            </div>

                            {/* Header */}
                            <div style={{ ...tableHeader, gridTemplateColumns: "60px 1fr 60px" }}>
                                <span>Level</span>
                                <span>Názov</span>
                                <span style={{ textAlign: "center" }}>Prep</span>
                            </div>

                            {data.spells.length === 0 && (
                                <div style={emptyRow}>Žiadne kúzla</div>
                            )}

                            {data.spells.map((s, i) => (
                                <div key={i} style={{ ...tableRow, gridTemplateColumns: "60px 1fr 40px 28px" }}>
                                    <input
                                        style={{ ...cellInput, textAlign: "center" }}
                                        value={s.level}
                                        onChange={e => {
                                            const updated = [...data.spells];
                                            updated[i] = { ...updated[i], level: e.target.value };
                                            set("spells", updated);
                                        }}
                                        placeholder="1"
                                    />
                                    <input
                                        style={cellInput}
                                        value={s.name}
                                        onChange={e => {
                                            const updated = [...data.spells];
                                            updated[i] = { ...updated[i], name: e.target.value };
                                            set("spells", updated);
                                        }}
                                        placeholder="napr. Fireball"
                                    />
                                    {/* Prepared checkbox */}
                                    <div
                                        onClick={() => {
                                            const updated = [...data.spells];
                                            updated[i] = { ...updated[i], prepared: !updated[i].prepared };
                                            set("spells", updated);
                                        }}
                                        style={{
                                            width: "28px", height: "28px", borderRadius: "6px", margin: "0 auto",
                                            backgroundColor: s.prepared ? "#1A3A1A" : "#2A2A2A",
                                            border: `1px solid ${s.prepared ? "#2A6A2A" : "#3A3A3A"}`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {s.prepared && (
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M2 7L5.5 10.5L12 4" stroke="#4A9A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => set("spells", data.spells.filter((_, idx) => idx !== i))}
                                        style={removeBtn}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p style={{ fontSize: "11px", color: "#5A4A3A", fontStyle: "italic", marginTop: "16px" }}>
                        Ak postava nemá kúzla, môžeš tento krok preskočiť.
                    </p>
                </div>
            )}

            {/* ===== KROK 8: Backstory ===== */}
            {step === 8 && (
                <div>
                    <h3 style={sh}>Backstory & Osobnosť</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Personality Traits</div>
                                <textarea value={data.personalityTraits} onChange={e => set("personalityTraits", e.target.value)}
                                          placeholder="Ako sa tvoja postava správa?" style={ta} rows={3} />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Ideals</div>
                                <textarea value={data.ideals} onChange={e => set("ideals", e.target.value)}
                                          placeholder="V čo tvoja postava verí?" style={ta} rows={3} />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Bonds</div>
                                <textarea value={data.bonds} onChange={e => set("bonds", e.target.value)}
                                          placeholder="Čo je pre tvoju postavu najdôležitejšie?" style={ta} rows={3} />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Flaws</div>
                                <textarea value={data.flaws} onChange={e => set("flaws", e.target.value)}
                                          placeholder="Slabiny tvojej postavy?" style={ta} rows={3} />
                            </div>
                        </div>
                        <div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Backstory</div>
                                <textarea value={data.backstory} onChange={e => set("backstory", e.target.value)}
                                          placeholder="Príbeh tvojej postavy..." style={ta} rows={8} />
                            </div>
                            <div style={fieldStyle}>
                                <div style={lbl}>Allies & Organizations</div>
                                <textarea value={data.allies} onChange={e => set("allies", e.target.value)}
                                          placeholder="Spojenci, frakcie, organizácie..." style={ta} rows={4} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </StepLayout>
    );
}

const sh = { fontSize: "18px", color: "#E8D5C4", fontFamily: "var(--font-heading)", marginBottom: "20px" };
const lbl = { fontSize: "11px", color: "#5A4A3A", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "6px" };
const ta = {
    width: "100%", backgroundColor: "#2A2A2A", border: "none", borderRadius: "7px",
    color: "#A3A3A3", padding: "10px 12px", fontSize: "13px", fontStyle: "italic",
    fontFamily: "var(--font-body)", resize: "none", outline: "none",
};

const addBtn = {
    backgroundColor: "#2A2A2A", border: "1px solid #3A3A3A", borderRadius: "999px",
    color: "#A3A3A3", fontSize: "11px", padding: "4px 12px", cursor: "pointer",
    fontStyle: "italic",
};
const removeBtn = {
    backgroundColor: "transparent", border: "none", color: "#5A2A2A",
    cursor: "pointer", fontSize: "14px", padding: "0 4px",
};
const tableHeader = {
    display: "grid", gridTemplateColumns: "1fr",
    backgroundColor: "#1A1A1A", borderRadius: "7px 7px 0 0",
    padding: "7px 12px", fontSize: "10px", color: "#5A4A3A",
    textTransform: "uppercase", letterSpacing: ".08em", gap: "8px",
};
const tableRow = {
    display: "grid", gridTemplateColumns: "1fr 28px",
    backgroundColor: "#2A2A2A", borderTop: "1px solid #1A1A1A",
    padding: "6px 8px", gap: "6px", alignItems: "center",
};
const cellInput = {
    backgroundColor: "transparent", border: "none", color: "#A3A3A3",
    fontSize: "13px", fontStyle: "italic", fontFamily: "var(--font-body)",
    outline: "none", width: "100%", padding: "2px 4px",
};
const emptyRow = {
    backgroundColor: "#2A2A2A", borderTop: "1px solid #1A1A1A",
    padding: "12px", textAlign: "center", color: "#3A3A3A",
    fontSize: "12px", fontStyle: "italic",
};