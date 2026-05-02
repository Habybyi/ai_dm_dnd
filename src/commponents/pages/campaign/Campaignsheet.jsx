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

function Field({ label, value, onChange, type = "text", placeholder = "", style = {} }) {
    return (
        <div style={style}>
            <label style={S.label}>{label}</label>
            <input
                style={S.input}
                type={type}
                value={value ?? ""}
                placeholder={placeholder}
                onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
        </div>
    );
}

function TextArea({ label, value, onChange, rows = 3, placeholder = "" }) {
    return (
        <div>
            <label style={S.label}>{label}</label>
            <textarea
                style={{ ...S.textarea, minHeight: `${rows * 24}px` }}
                value={value ?? ""}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div>
            <label style={S.label}>{label}</label>
            <select
                style={{ ...S.input, cursor: "pointer" }}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function TabOverview({ camp, set }) {
    const STATUS_COLORS = {
        active: { bg: "#103A10", color: "#6BE86B" },
        paused: { bg: "#3A3010", color: "#C8A020" },
        archived: { bg: "#2A2020", color: "#8A6A6A" },
    };
    const statusStyle = STATUS_COLORS[camp.status] ?? STATUS_COLORS.active;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={S.card}>
                <div style={S.sectionTitle}>Campaign Info</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <Field label="Campaign Name" value={camp.name} onChange={(v) => set("name", v)} placeholder="e.g. Curse of Strahd" />
                    <div>
                        <label style={S.label}>Status</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <select
                                style={{ ...S.input, flex: 1, cursor: "pointer" }}
                                value={camp.status ?? "active"}
                                onChange={(e) => set("status", e.target.value)}
                                onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                            >
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="archived">Archived</option>
                            </select>
                            <span style={{
                                padding: "4px 12px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: "600",
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                whiteSpace: "nowrap",
                            }}>
                                {(camp.status ?? "active").toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: "14px" }}>
                    <TextArea label="Description" value={camp.description} onChange={(v) => set("description", v)} rows={3} placeholder="Brief campaign overview..." />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <Field label="Invite Code" value={camp.inviteCode} onChange={(v) => set("inviteCode", v)} placeholder="e.g. SHADOW-REALM-42" />
                    <Field label="Campaign Avatar URL" value={camp.campaignAvatar} onChange={(v) => set("campaignAvatar", v)} placeholder="https://..." />
                </div>
            </div>

            <div style={S.card}>
                <div style={S.sectionTitle}>Session Summary</div>
                <TextArea
                    label="Last Session"
                    value={camp.sessionSummary}
                    onChange={(v) => set("sessionSummary", v)}
                    rows={5}
                    placeholder="What happened last session?"
                />
            </div>
        </div>
    );
}

// ─── Tab: Members ─────────────────────────────────────────────────────────────
function TabMembers({ camp, set }) {
    const members = camp.members ?? [];

    const addMember = () => set("members", [...members, { userId: "", role: "Player", characterId: "" }]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Party Members</div>
                    <button
                        onClick={addMember}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add Member
                    </button>
                </div>

                {members.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No members yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 1fr 90px 36px", gap: "10px" }}>
                            {["User ID / Name", "Role", "Character ID", "Joined", ""].map((h, i) => (
                                <span key={i} style={S.label}>{h}</span>
                            ))}
                        </div>
                        {members.map((m, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 130px 1fr 90px 36px", gap: "10px", alignItems: "center" }}>
                                <input
                                    style={S.input}
                                    value={m.userId}
                                    placeholder="userId or name"
                                    onChange={(e) => {
                                        const updated = [...members];
                                        updated[i] = { ...updated[i], userId: e.target.value };
                                        set("members", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <select
                                    style={{ ...S.input, cursor: "pointer" }}
                                    value={m.role}
                                    onChange={(e) => {
                                        const updated = [...members];
                                        updated[i] = { ...updated[i], role: e.target.value };
                                        set("members", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                >
                                    <option value="DM">DM</option>
                                    <option value="Player">Player</option>
                                    <option value="Spectator">Spectator</option>
                                </select>
                                <input
                                    style={S.input}
                                    value={m.characterId ?? ""}
                                    placeholder="characterId"
                                    onChange={(e) => {
                                        const updated = [...members];
                                        updated[i] = { ...updated[i], characterId: e.target.value };
                                        set("members", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={{ ...S.input, fontSize: "12px" }}
                                    type="date"
                                    value={m.joinedAt ? new Date(m.joinedAt).toISOString().slice(0, 10) : ""}
                                    onChange={(e) => {
                                        const updated = [...members];
                                        updated[i] = { ...updated[i], joinedAt: e.target.value };
                                        set("members", updated);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <button
                                    onClick={() => set("members", members.filter((_, j) => j !== i))}
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

// ─── Tab: Maps & Handouts ─────────────────────────────────────────────────────
function TabMaps({ camp, set }) {
    const maps = camp.maps ?? [];
    const handouts = camp.handouts ?? [];

    const addMap = () => set("maps", [...maps, { name: "", imageUrl: "", isActive: false, gridSettings: { cellSize: 50, gridColor: "#cccccc" } }]);
    const addHandout = () => set("handouts", [...handouts, { title: "", imageUrl: "", isShared: false }]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Maps */}
            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Maps</div>
                    <button
                        onClick={addMap}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add Map
                    </button>
                </div>

                {maps.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No maps added yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 80px 60px 36px", gap: "10px" }}>
                            {["Name", "Image URL", "Cell Size", "Grid Color", "Active", ""].map((h, i) => (
                                <span key={i} style={S.label}>{h}</span>
                            ))}
                        </div>
                        {maps.map((map, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 80px 60px 36px", gap: "10px", alignItems: "center" }}>
                                <input
                                    style={S.input}
                                    value={map.name}
                                    placeholder="Dungeon level 1"
                                    onChange={(e) => {
                                        const u = [...maps]; u[i] = { ...u[i], name: e.target.value }; set("maps", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={S.input}
                                    value={map.imageUrl}
                                    placeholder="https://..."
                                    onChange={(e) => {
                                        const u = [...maps]; u[i] = { ...u[i], imageUrl: e.target.value }; set("maps", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={S.input}
                                    type="number"
                                    min={10}
                                    value={map.gridSettings?.cellSize ?? 50}
                                    onChange={(e) => {
                                        const u = [...maps]; u[i] = { ...u[i], gridSettings: { ...u[i].gridSettings, cellSize: Number(e.target.value) } }; set("maps", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={S.input}
                                    value={map.gridSettings?.gridColor ?? "#cccccc"}
                                    placeholder="#cccccc"
                                    onChange={(e) => {
                                        const u = [...maps]; u[i] = { ...u[i], gridSettings: { ...u[i].gridSettings, gridColor: e.target.value } }; set("maps", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={map.isActive ?? false}
                                        onChange={(e) => {
                                            const u = [...maps]; u[i] = { ...u[i], isActive: e.target.checked }; set("maps", u);
                                        }}
                                        style={{ accentColor: "#7A1E1E", width: "16px", height: "16px", cursor: "pointer" }}
                                    />
                                </div>
                                <button
                                    onClick={() => set("maps", maps.filter((_, j) => j !== i))}
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

            {/* Handouts */}
            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Handouts</div>
                    <button
                        onClick={addHandout}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add Handout
                    </button>
                </div>

                {handouts.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No handouts added yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 36px", gap: "10px" }}>
                            {["Title", "Image URL", "Shared", ""].map((h, i) => (
                                <span key={i} style={S.label}>{h}</span>
                            ))}
                        </div>
                        {handouts.map((h, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 36px", gap: "10px", alignItems: "center" }}>
                                <input
                                    style={S.input}
                                    value={h.title}
                                    placeholder="Ancient map"
                                    onChange={(e) => {
                                        const u = [...handouts]; u[i] = { ...u[i], title: e.target.value }; set("handouts", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={S.input}
                                    value={h.imageUrl}
                                    placeholder="https://..."
                                    onChange={(e) => {
                                        const u = [...handouts]; u[i] = { ...u[i], imageUrl: e.target.value }; set("handouts", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={h.isShared ?? false}
                                        onChange={(e) => {
                                            const u = [...handouts]; u[i] = { ...u[i], isShared: e.target.checked }; set("handouts", u);
                                        }}
                                        style={{ accentColor: "#7A1E1E", width: "16px", height: "16px", cursor: "pointer" }}
                                    />
                                </div>
                                <button
                                    onClick={() => set("handouts", handouts.filter((_, j) => j !== i))}
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

// ─── Tab: Combat ──────────────────────────────────────────────────────────────
function TabCombat({ camp, set }) {
    const initiative = camp.initiativeOrder ?? [];
    const tokens = camp.activeTokens ?? [];

    const addInitiative = () => set("initiativeOrder", [...initiative, ""]);
    const addToken = () => set("activeTokens", [...tokens, { tokenId: "", x: 0, y: 0 }]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Initiative Order */}
            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Initiative Order</div>
                    <button
                        onClick={addInitiative}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add
                    </button>
                </div>

                {initiative.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No characters in initiative.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {initiative.map((charId, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{
                                    fontSize: "11px", color: "var(--text-muted)",
                                    width: "24px", textAlign: "right", fontVariantNumeric: "tabular-nums",
                                }}>
                                    {i + 1}.
                                </span>
                                <input
                                    style={{ ...S.input, flex: 1 }}
                                    value={charId}
                                    placeholder="characterId"
                                    onChange={(e) => {
                                        const u = [...initiative]; u[i] = e.target.value; set("initiativeOrder", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <button
                                    onClick={() => set("initiativeOrder", initiative.filter((_, j) => j !== i))}
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

            {/* Active Tokens */}
            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Active Tokens</div>
                    <button
                        onClick={addToken}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add Token
                    </button>
                </div>

                {tokens.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No tokens placed on map.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 36px", gap: "10px" }}>
                            {["Token ID", "X", "Y", ""].map((h, i) => (
                                <span key={i} style={S.label}>{h}</span>
                            ))}
                        </div>
                        {tokens.map((tok, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 36px", gap: "10px", alignItems: "center" }}>
                                <input
                                    style={S.input}
                                    value={tok.tokenId}
                                    placeholder="tokenId"
                                    onChange={(e) => {
                                        const u = [...tokens]; u[i] = { ...u[i], tokenId: e.target.value }; set("activeTokens", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={{ ...S.input, textAlign: "center" }}
                                    type="number"
                                    value={tok.x ?? 0}
                                    onChange={(e) => {
                                        const u = [...tokens]; u[i] = { ...u[i], x: Number(e.target.value) }; set("activeTokens", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={{ ...S.input, textAlign: "center" }}
                                    type="number"
                                    value={tok.y ?? 0}
                                    onChange={(e) => {
                                        const u = [...tokens]; u[i] = { ...u[i], y: Number(e.target.value) }; set("activeTokens", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <button
                                    onClick={() => set("activeTokens", tokens.filter((_, j) => j !== i))}
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

// ─── Tab: Lore & Log ──────────────────────────────────────────────────────────
function TabLore({ camp, set }) {
    const log = camp.gameLog ?? [];
    const addLog = () => set("gameLog", [...log, { sender: "", message: "", timestamp: new Date().toISOString() }]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={S.card}>
                <div style={S.sectionTitle}>AI Lore Context</div>
                <TextArea
                    label="World Lore & Context"
                    value={camp.aiLoreContext}
                    onChange={(v) => set("aiLoreContext", v)}
                    rows={6}
                    placeholder="World lore, setting details, house rules — context fed to AI generation..."
                />
            </div>

            <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={S.sectionTitle}>Game Log</div>
                    <button
                        onClick={addLog}
                        style={{
                            backgroundColor: "#2A1E1E", border: "1px solid #4A2A2A",
                            color: "var(--text-secondary)", borderRadius: "8px",
                            padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                        }}
                    >
                        + Add Entry
                    </button>
                </div>

                {log.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No log entries yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 36px", gap: "10px" }}>
                            {["Sender", "Message", ""].map((h, i) => (
                                <span key={i} style={S.label}>{h}</span>
                            ))}
                        </div>
                        {log.map((entry, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 36px", gap: "10px", alignItems: "center" }}>
                                <input
                                    style={S.input}
                                    value={entry.sender}
                                    placeholder="DM / player name"
                                    onChange={(e) => {
                                        const u = [...log]; u[i] = { ...u[i], sender: e.target.value }; set("gameLog", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <input
                                    style={S.input}
                                    value={entry.message}
                                    placeholder="Log message..."
                                    onChange={(e) => {
                                        const u = [...log]; u[i] = { ...u[i], message: e.target.value }; set("gameLog", u);
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = "#7A1E1E")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                                />
                                <button
                                    onClick={() => set("gameLog", log.filter((_, j) => j !== i))}
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

// ─── Main ─────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Members", "Maps", "Combat", "Lore & Log"];

export default function CampaignSheet() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("Overview");
    const [camp, setCamp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            const res = await fetch(`/campaign/get/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await res.json();
            setCamp(data.campaign);
            setLoading(false);
        };
        fetchCampaign();
    }, [id]);

    // Generic nested setter via dot notation
    const set = (path, value) => {
        setCamp((prev) => {
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
        console.log(camp);
        setSaving(true);
        await fetch(`/campaign/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(camp),
        });
        await new Promise((r) => setTimeout(r, 600));
        setSaving(false);
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2000);
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SideNav />
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Loading campaign...</p>
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
                            Campaign Sheet
                        </p>
                        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "var(--text-primary)" }}>
                            {camp.name || "Unnamed Campaign"}
                            <span style={{ fontSize: "14px", color: "var(--text-muted)", marginLeft: "12px", fontFamily: "var(--font-body)" }}>
                                {camp.status}
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
                    {activeTab === "Overview"   && <TabOverview camp={camp} set={set} />}
                    {activeTab === "Members"    && <TabMembers  camp={camp} set={set} />}
                    {activeTab === "Maps"       && <TabMaps     camp={camp} set={set} />}
                    {activeTab === "Combat"     && <TabCombat   camp={camp} set={set} />}
                    {activeTab === "Lore & Log" && <TabLore     camp={camp} set={set} />}
                </div>

            </div>
        </div>
    );
}