import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideNav from "../../ui/SideNav.jsx";

// ─── Shared styles ────────────────────────────────────────────────────────────
const S = {
    label: {
        fontSize: "10px",
        color: "var(--text-muted)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "6px",
        display: "block",
    },
    input: {
        backgroundColor: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        color: "var(--text-primary)",
        fontSize: "14px",
        padding: "9px 12px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "var(--font-body)",
    },
    textarea: {
        backgroundColor: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        color: "var(--text-primary)",
        fontSize: "13px",
        padding: "10px 12px",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "var(--font-body)",
        resize: "vertical",
        lineHeight: "1.6",
    },
    card: {
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        padding: "20px",
    },
    sectionTitle: {
        fontFamily: "var(--font-heading)",
        fontSize: "13px",
        color: "var(--text-secondary)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: "16px",
    },
};

function Field({ label, value, onChange, type = "text", style = {} }) {
    return (
        <div style={style}>
            <label style={S.label}>{label}</label>
            <input
                style={S.input}
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
        </div>
    );
}

function TextArea({ label, value, onChange, rows = 3 }) {
    return (
        <div>
            <label style={S.label}>{label}</label>
            <textarea
                style={{ ...S.textarea, minHeight: `${rows * 24}px` }}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
        </div>
    );
}

// ─── Tab: Stats ───────────────────────────────────────────────────────────────
function TabStats({ char, set }) {
    const h = char.header ?? {};
    const abilities = char.abilities ?? {};
    const prof = char.proficiencies ?? {};
    const savingThrows = prof.savingThrows ?? {};
    const skills = prof.skills ?? {};

    const ABILITY_KEYS = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
    const ABILITY_SHORT = { strength: "STR", dexterity: "DEX", constitution: "CON", intelligence: "INT", wisdom: "WIS", charisma: "CHA" };

    const SAVING_THROW_KEYS = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

    const SKILL_LIST = [
        { name: "Acrobatics", ability: "dexterity" },
        { name: "Animal Handling", ability: "wisdom" },
        { name: "Arcana", ability: "intelligence" },
        { name: "Athletics", ability: "strength" },
        { name: "Deception", ability: "charisma" },
        { name: "History", ability: "intelligence" },
        { name: "Insight", ability: "wisdom" },
        { name: "Intimidation", ability: "charisma" },
        { name: "Investigation", ability: "intelligence" },
        { name: "Medicine", ability: "wisdom" },
        { name: "Nature", ability: "intelligence" },
        { name: "Perception", ability: "wisdom" },
        { name: "Performance", ability: "charisma" },
        { name: "Persuasion", ability: "charisma" },
        { name: "Religion", ability: "intelligence" },
        { name: "Sleight of Hand", ability: "dexterity" },
        { name: "Stealth", ability: "dexterity" },
        { name: "Survival", ability: "wisdom" },
    ];

    const mod = (score) => Math.floor((score - 10) / 2);
    const modStr = (score) => { const m = mod(score); return (m >= 0 ? "+" : "") + m; };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Header info */}
            <div style={S.card}>
                <div style={S.sectionTitle}>Character Info</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                    <Field label="Character Name" value={h.characterName} onChange={(v) => set("header.characterName", v)} />
                    <Field label="Class & Level" value={h.classLevel} onChange={(v) => set("header.classLevel", v)} />
                    <Field label="Race" value={h.race} onChange={(v) => set("header.race", v)} />
                    <Field label="Background" value={h.background} onChange={(v) => set("header.background", v)} />
                    <Field label="Alignment" value={h.alignment} onChange={(v) => set("header.alignment", v)} />
                    <Field label="Experience Points" value={h.experiencePoints} onChange={(v) => set("header.experiencePoints", v)} type="number" />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "20px" }}>
                {/* Ability Scores */}
                <div style={S.card}>
                    <div style={S.sectionTitle}>Ability Scores</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {ABILITY_KEYS.map((key) => {
                            const score = abilities[key]?.score ?? 10;
                            return (
                                <div key={key} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "var(--bg-tertiary)",
                                    borderRadius: "10px",
                                    padding: "8px 12px",
                                    gap: "10px",
                                }}>
                                    <span style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.08em", width: "32px" }}>
                                        {ABILITY_SHORT[key]}
                                    </span>
                                    <input
                                        type="number"
                                        min={1} max={30}
                                        value={score}
                                        onChange={(e) => set(`abilities.${key}.score`, Number(e.target.value))}
                                        style={{
                                            ...S.input,
                                            width: "52px",
                                            textAlign: "center",
                                            padding: "6px 4px",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: "var(--text-primary)",
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                        onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                    />
                                    <span style={{
                                        fontSize: "14px",
                                        color: "#7A1E1E",
                                        fontWeight: "700",
                                        width: "32px",
                                        textAlign: "right",
                                    }}>
                                        {modStr(score)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Proficiency Bonus */}
                    <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" }}>
                        <label style={S.label}>Proficiency Bonus</label>
                        <input
                            type="number"
                            value={prof.proficiencyBonus ?? 2}
                            onChange={(e) => set("proficiencies.proficiencyBonus", Number(e.target.value))}
                            style={{ ...S.input, textAlign: "center", fontSize: "16px", fontWeight: "700" }}
                            onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Saving Throws */}
                    <div style={S.card}>
                        <div style={S.sectionTitle}>Saving Throws</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            {SAVING_THROW_KEYS.map((key) => {
                                const st = savingThrows[key] ?? {};
                                return (
                                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="checkbox"
                                            checked={st.proficient ?? false}
                                            onChange={(e) => set(`proficiencies.savingThrows.${key}.proficient`, e.target.checked)}
                                            style={{ accentColor: "#7A1E1E", width: "14px", height: "14px", cursor: "pointer" }}
                                        />
                                        <span style={{ fontSize: "12px", color: "var(--text-secondary)", flex: 1 }}>
                                            {ABILITY_SHORT[key]}
                                        </span>
                                        <input
                                            type="number"
                                            value={st.value ?? 0}
                                            onChange={(e) => set(`proficiencies.savingThrows.${key}.value`, Number(e.target.value))}
                                            style={{ ...S.input, width: "52px", textAlign: "center", padding: "4px", fontSize: "13px" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Skills */}
                    <div style={S.card}>
                        <div style={S.sectionTitle}>Skills</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                            {SKILL_LIST.map((skill) => {
                                const key = skill.name.replace(/\s+/g, "");
                                const sk = skills[key] ?? {};
                                return (
                                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="checkbox"
                                            checked={sk.proficient ?? false}
                                            onChange={(e) => set(`proficiencies.skills.${key}.proficient`, e.target.checked)}
                                            style={{ accentColor: "#7A1E1E", width: "14px", height: "14px", cursor: "pointer", flexShrink: 0 }}
                                        />
                                        <span style={{ fontSize: "12px", color: "var(--text-secondary)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {skill.name}
                                            <span style={{ color: "var(--text-muted)", marginLeft: "4px", fontSize: "10px" }}>
                                                ({ABILITY_SHORT[skill.ability]})
                                            </span>
                                        </span>
                                        <input
                                            type="number"
                                            value={sk.value ?? 0}
                                            onChange={(e) => set(`proficiencies.skills.${key}.value`, Number(e.target.value))}
                                            style={{ ...S.input, width: "48px", textAlign: "center", padding: "4px", fontSize: "12px" }}
                                            onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Combat ──────────────────────────────────────────────────────────────
function TabCombat({ char, set }) {
    const combat = char.combat ?? {};
    const hp = combat.hp ?? {};
    const attacks = char.attacks ?? [];
    const [hpDelta, setHpDelta] = useState("");

    const applyHpDelta = (sign) => {
        const delta = parseInt(hpDelta);
        if (isNaN(delta) || delta <= 0) return;
        const newHp = Math.max(0, Math.min((hp.current ?? 0) + sign * delta, hp.max ?? 0));
        set("combat.hp.current", newHp);
        setHpDelta("");
    };

    const hpPercent = hp.max ? Math.round(((hp.current ?? 0) / hp.max) * 100) : 0;
    const hpColor = hpPercent > 60 ? "#2A6A2A" : hpPercent > 25 ? "#7A6A1A" : "#7A1E1E";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* HP Block */}
            <div style={S.card}>
                <div style={S.sectionTitle}>Hit Points</div>
                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {/* HP Visual */}
                    <div style={{ flex: "0 0 220px" }}>
                        <div style={{
                            backgroundColor: "var(--bg-tertiary)",
                            borderRadius: "10px",
                            padding: "20px",
                            textAlign: "center",
                            border: `1px solid ${hpColor}44`,
                        }}>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.1em" }}>CURRENT / MAX</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                <input
                                    type="number"
                                    value={hp.current ?? 0}
                                    onChange={(e) => set("combat.hp.current", Number(e.target.value))}
                                    style={{
                                        ...S.input,
                                        width: "70px",
                                        textAlign: "center",
                                        fontSize: "28px",
                                        fontWeight: "700",
                                        color: hpColor,
                                        border: "none",
                                        backgroundColor: "transparent",
                                        padding: "0",
                                    }}
                                />
                                <span style={{ fontSize: "22px", color: "var(--text-muted)" }}>/</span>
                                <input
                                    type="number"
                                    value={hp.max ?? 0}
                                    onChange={(e) => set("combat.hp.max", Number(e.target.value))}
                                    style={{
                                        ...S.input,
                                        width: "70px",
                                        textAlign: "center",
                                        fontSize: "22px",
                                        color: "var(--text-secondary)",
                                        border: "none",
                                        backgroundColor: "transparent",
                                        padding: "0",
                                    }}
                                />
                            </div>
                            {/* HP Bar */}
                            <div style={{ marginTop: "12px", height: "6px", backgroundColor: "#2A2020", borderRadius: "999px", overflow: "hidden" }}>
                                <div style={{
                                    height: "100%",
                                    width: `${hpPercent}%`,
                                    backgroundColor: hpColor,
                                    borderRadius: "999px",
                                    transition: "width 0.4s ease, background-color 0.4s ease",
                                }} />
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>{hpPercent}%</div>
                        </div>

                        {/* +/- controls */}
                        <div style={{ display: "flex", gap: "8px", marginTop: "12px", alignItems: "center" }}>
                            <button
                                onClick={() => applyHpDelta(-1)}
                                style={{
                                    flex: 1, padding: "9px", borderRadius: "8px",
                                    backgroundColor: "#3A1010", border: "1px solid #5A1E1E",
                                    color: "#E86B6B", fontSize: "18px", cursor: "pointer",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A1818")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3A1010")}
                            >−</button>
                            <input
                                type="number"
                                min={0}
                                value={hpDelta}
                                onChange={(e) => setHpDelta(e.target.value)}
                                placeholder="0"
                                style={{ ...S.input, width: "60px", textAlign: "center", fontSize: "16px" }}
                                onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                            />
                            <button
                                onClick={() => applyHpDelta(1)}
                                style={{
                                    flex: 1, padding: "9px", borderRadius: "8px",
                                    backgroundColor: "#103A10", border: "1px solid #1E5A1E",
                                    color: "#6BE86B", fontSize: "18px", cursor: "pointer",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#184A18")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#103A10")}
                            >+</button>
                        </div>
                    </div>

                    {/* HP details */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Field label="Temporary HP" value={hp.temporary ?? 0} onChange={(v) => set("combat.hp.temporary", v)} type="number" />
                        <Field label="Hit Dice" value={combat.hitDice ?? ""} onChange={(v) => set("combat.hitDice", v)} />
                        {/* Death Saves */}
                        <div>
                            <label style={S.label}>Death Saves</label>
                            <div style={{ display: "flex", gap: "20px" }}>
                                {["successes", "failures"].map((type) => (
                                    <div key={type} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <span style={{ fontSize: "11px", color: type === "successes" ? "#4A8A4A" : "#8A4A4A", letterSpacing: "0.08em" }}>
                                            {type.toUpperCase()}
                                        </span>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            {[0, 1, 2].map((i) => (
                                                <input
                                                    key={i}
                                                    type="checkbox"
                                                    checked={(combat.deathSaves?.[type] ?? 0) > i}
                                                    onChange={(e) => {
                                                        const current = combat.deathSaves?.[type] ?? 0;
                                                        set(`combat.deathSaves.${type}`, e.target.checked ? i + 1 : i);
                                                    }}
                                                    style={{ accentColor: type === "successes" ? "#4A8A4A" : "#8A4A4A", width: "18px", height: "18px", cursor: "pointer" }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Combat Stats */}
            <div style={S.card}>
                <div style={S.sectionTitle}>Combat Stats</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                    <Field label="Armor Class" value={combat.armorClass} onChange={(v) => set("combat.armorClass", v)} type="number" />
                    <Field label="Initiative" value={combat.initiative} onChange={(v) => set("combat.initiative", v)} type="number" />
                    <Field label="Speed" value={combat.speed} onChange={(v) => set("combat.speed", v)} type="number" />
                    <Field label="Inspiration" value={char.proficiencies?.inspiration ?? 0} onChange={(v) => set("proficiencies.inspiration", v)} type="number" />
                </div>
            </div>

            {/* Attacks */}
            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Attacks</div>
                    <button
                        onClick={() => set("attacks", [...attacks, { name: "", bonus: "", damageType: "" }])}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add Attack
                    </button>
                </div>

                {attacks.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No attacks added yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 36px", gap: "10px" }}>
                            <span style={S.label}>Name</span>
                            <span style={S.label}>Bonus</span>
                            <span style={S.label}>Damage / Type</span>
                            <span />
                        </div>
                        {attacks.map((atk, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 36px", gap: "10px", alignItems: "center" }}>
                                <input
                                    style={S.input}
                                    value={atk.name}
                                    placeholder="e.g. Longsword"
                                    onChange={(e) => {
                                        const updated = [...attacks];
                                        updated[i] = { ...updated[i], name: e.target.value };
                                        set("attacks", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={S.input}
                                    value={atk.bonus}
                                    placeholder="+5"
                                    onChange={(e) => {
                                        const updated = [...attacks];
                                        updated[i] = { ...updated[i], bonus: e.target.value };
                                        set("attacks", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={S.input}
                                    value={atk.damageType}
                                    placeholder="1d8+3 slashing"
                                    onChange={(e) => {
                                        const updated = [...attacks];
                                        updated[i] = { ...updated[i], damageType: e.target.value };
                                        set("attacks", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <button
                                    onClick={() => set("attacks", attacks.filter((_, j) => j !== i))}
                                    style={{
                                        backgroundColor: "transparent", border: "1px solid #3A2020",
                                        borderRadius: "6px", color: "#8A4A4A",
                                        width: "36px", height: "36px", cursor: "pointer", fontSize: "14px",
                                    }}
                                >✕</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Tab: Inventory ───────────────────────────────────────────────────────────
function TabInventory({ char, set }) {
    const inv = char.inventory ?? {};
    const equipment = inv.equipment ?? [];
    const money = inv.money ?? {};

    const COINS = [
        { key: "cp", label: "Copper", color: "#A0522D" },
        { key: "sp", label: "Silver", color: "#A8A8A8" },
        { key: "ep", label: "Electrum", color: "#B8A060" },
        { key: "gp", label: "Gold", color: "#C8A020" },
        { key: "pp", label: "Platinum", color: "#7AAABB" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Money */}
            <div style={S.card}>
                <div style={S.sectionTitle}>Currency</div>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    {COINS.map(({ key, label, color }) => (
                        <div key={key} style={{ flex: "1 1 80px", minWidth: "80px" }}>
                            <label style={{ ...S.label, color }}>{label}</label>
                            <input
                                type="number"
                                min={0}
                                value={money[key] ?? 0}
                                onChange={(e) => set(`inventory.money.${key}`, Number(e.target.value))}
                                style={{ ...S.input, textAlign: "center", fontSize: "16px", fontWeight: "600", color }}
                                onFocus={(e) => (e.target.style.borderColor = color)}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Equipment */}
            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Equipment</div>
                    <button
                        onClick={() => set("inventory.equipment", [...equipment, { name: "", weight: 0, quantity: 1 }])}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add Item
                    </button>
                </div>

                {equipment.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No equipment added yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 36px", gap: "10px" }}>
                            <span style={S.label}>Item Name</span>
                            <span style={S.label}>Weight</span>
                            <span style={S.label}>Qty</span>
                            <span />
                        </div>
                        {equipment.map((item, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 36px", gap: "10px", alignItems: "center" }}>
                                <input
                                    style={S.input}
                                    value={item.name}
                                    placeholder="e.g. Torch"
                                    onChange={(e) => {
                                        const updated = [...equipment];
                                        updated[i] = { ...updated[i], name: e.target.value };
                                        set("inventory.equipment", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    type="number" min={0}
                                    style={S.input}
                                    value={item.weight}
                                    onChange={(e) => {
                                        const updated = [...equipment];
                                        updated[i] = { ...updated[i], weight: Number(e.target.value) };
                                        set("inventory.equipment", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    type="number" min={1}
                                    style={S.input}
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const updated = [...equipment];
                                        updated[i] = { ...updated[i], quantity: Number(e.target.value) };
                                        set("inventory.equipment", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <button
                                    onClick={() => set("inventory.equipment", equipment.filter((_, j) => j !== i))}
                                    style={{
                                        backgroundColor: "transparent", border: "1px solid #3A2020",
                                        borderRadius: "6px", color: "#8A4A4A",
                                        width: "36px", height: "36px", cursor: "pointer", fontSize: "14px",
                                    }}
                                >✕</button>
                            </div>
                        ))}
                    </div>
                )}

                {equipment.length > 0 && (
                    <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border-color)", fontSize: "12px", color: "var(--text-muted)" }}>
                        Total weight: {equipment.reduce((sum, item) => sum + (item.weight * item.quantity || 0), 0).toFixed(1)} lbs
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Tab: Features ────────────────────────────────────────────────────────────
function TabFeatures({ char, set }) {
    const f = char.features ?? {};
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={S.card}>
                <div style={S.sectionTitle}>Personality</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <TextArea label="Personality Traits" value={f.personalityTraits} onChange={(v) => set("features.personalityTraits", v)} rows={3} />
                    <TextArea label="Ideals" value={f.ideals} onChange={(v) => set("features.ideals", v)} rows={3} />
                    <TextArea label="Bonds" value={f.bonds} onChange={(v) => set("features.bonds", v)} rows={3} />
                    <TextArea label="Flaws" value={f.flaws} onChange={(v) => set("features.flaws", v)} rows={3} />
                </div>
            </div>
            <div style={S.card}>
                <div style={S.sectionTitle}>Features & Traits</div>
                <TextArea label="Features & Traits" value={f.featuresTraits} onChange={(v) => set("features.featuresTraits", v)} rows={20} />
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const TABS = ["Stats", "Combat", "Inventory", "Features"];

export default function CharacterSheet({data}) {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("Stats");
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);
            // Mock data for development

    useEffect(() => {
        const fetchChar = async () => {
            const res = await fetch(`/characters/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setChar(data.character);
            setLoading(false);
        };
        fetchChar();
    }, [id]);

    // Generic nested setter via dot notation
    const set = (path, value) => {
        setChar((prev) => {
            const updated = JSON.parse(JSON.stringify(prev));
            const keys = path.split(".");
            let obj = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                if (obj[keys[i]] === undefined) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        // TODO:
        await fetch(`/api/characters/${id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
          body: JSON.stringify(char),
        });
        await new Promise((r) => setTimeout(r, 600)); // mock delay
        setSaving(false);
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2000);
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SideNav />
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Loading character...</p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex" }}>
            <SideNav />
            <div style={{ marginLeft: "100px", flex: 1, display: "flex", flexDirection: "column", padding: "28px 40px", maxWidth: "1100px" }}>

                {/* Header bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
                            Character Sheet
                        </p>
                        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "var(--text-primary)" }}>
                            {char.header?.characterName || "Unnamed"}
                            <span style={{ fontSize: "14px", color: "var(--text-muted)", marginLeft: "12px", fontFamily: "var(--font-body)" }}>
                                {char.header?.classLevel} · {char.header?.race}
                            </span>
                        </h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            backgroundColor: savedMsg ? "#1A3A1A" : "#7A1E1E",
                            border: "none", borderRadius: "999px",
                            color: savedMsg ? "#6BE86B" : "var(--text-primary)",
                            padding: "10px 24px", fontSize: "13px",
                            fontStyle: "italic", cursor: saving ? "wait" : "pointer",
                            transition: "background-color 0.3s",
                            minWidth: "120px",
                        }}
                        onMouseEnter={(e) => { if (!savedMsg && !saving) e.currentTarget.style.backgroundColor = "#8B2A2A"; }}
                        onMouseLeave={(e) => { if (!savedMsg && !saving) e.currentTarget.style.backgroundColor = "#7A1E1E"; }}
                    >
                        {saving ? "Saving..." : savedMsg ? "✓ Saved" : "Save Changes"}
                    </button>
                </div>

                {/* Tab bar */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "0" }}>
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                borderBottom: activeTab === tab ? "2px solid #7A1E1E" : "2px solid transparent",
                                color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)",
                                padding: "10px 20px",
                                fontSize: "13px",
                                fontFamily: "var(--font-heading)",
                                letterSpacing: "0.06em",
                                cursor: "pointer",
                                transition: "color 0.2s, border-color 0.2s",
                                marginBottom: "-1px",
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div style={{ flex: 1 }}>
                    {activeTab === "Stats" && <TabStats char={char} set={set} />}
                    {activeTab === "Combat" && <TabCombat char={char} set={set} />}
                    {activeTab === "Inventory" && <TabInventory char={char} set={set} />}
                    {activeTab === "Features" && <TabFeatures char={char} set={set} />}
                </div>

            </div>
        </div>
    );
}