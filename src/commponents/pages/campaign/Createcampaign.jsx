import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepLayout from "../../ui/StepLayout.jsx";
import Input from "../../ui/input.jsx";
import Button from "../../ui/button.jsx";
import Dropdown from "../../ui/Dropdown.jsx";

const TOTAL_STEPS = 4;

const STATUS_OPTIONS = [
    { value: "active",   label: "Active"   },
    { value: "paused",   label: "Paused"   },
    { value: "archived", label: "Archived" },
];

export default function CreateCampaign() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [inviteCode, setInviteCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [mapFiles, setMapFiles] = useState([]);
    const [generalFiles, setGeneralFiles] = useState([]);
    const [handouts, setHandouts] = useState([
        { title: "", imageUrl: "", isShared: false },
    ]);
    const [dragOver, setDragOver] = useState(false);
    const [mapDragOver, setMapDragOver] = useState(false);

    const [data, setData] = useState({
        name: "",
        description: "",
        status: "active",
        campaignAvatar: "",
        aiLoreContext: "",
        sessionSummary: "",
    });

    const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    // ── Invite code ──────────────────────────────────────────────────────────
    const fetchInviteCode = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3030/campaign/getcode", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Server error");

            const json = await res.json();

            setInviteCode(json.code || json.inviteCode || "");
        } catch (e) {
            console.error("getcode error:", e);
        }
    };

    const copyCode = () => {
        if (!inviteCode) return;
        navigator.clipboard.writeText(inviteCode).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    // ── Avatar ───────────────────────────────────────────────────────────────
    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setAvatarPreview(ev.target.result);
            set("campaignAvatar", ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    // ── File helpers ─────────────────────────────────────────────────────────
    const formatSize = (bytes) =>
        bytes > 1_048_576
            ? (bytes / 1_048_576).toFixed(1) + " MB"
            : Math.round(bytes / 1024) + " KB";

    const addMapFiles = (files) => {
        const arr = Array.from(files).map(f => ({
            file: f, name: f.name,
            size: formatSize(f.size),
            preview: URL.createObjectURL(f),
            isActive: false,
            gridSettings: { cellSize: 50, gridColor: "#cccccc" },
        }));
        setMapFiles(prev => [...prev, ...arr]);
    };

    const addGeneralFiles = (files) => {
        const arr = Array.from(files).map(f => ({
            file: f, name: f.name, size: formatSize(f.size),
            isImage: f.type.startsWith("image/"),
        }));
        setGeneralFiles(prev => [...prev, ...arr]);
    };

    const removeMap = (i) => setMapFiles(prev => prev.filter((_, idx) => idx !== i));
    const removeFile = (i) => setGeneralFiles(prev => prev.filter((_, idx) => idx !== i));

    const setActiveMap = (i) =>
        setMapFiles(prev => prev.map((m, idx) => ({ ...m, isActive: idx === i })));

    // ── Handouts ─────────────────────────────────────────────────────────────
    const addHandout = () =>
        setHandouts(prev => [...prev, { title: "", imageUrl: "", isShared: false }]);

    const updateHandout = (i, key, val) =>
        setHandouts(prev => prev.map((h, idx) => idx === i ? { ...h, [key]: val } : h));

    const removeHandout = (i) =>
        setHandouts(prev => prev.filter((_, idx) => idx !== i));

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...data,
                inviteCode,
                maps: mapFiles.map(m => ({
                    name: m.name,
                    imageUrl: m.preview,
                    isActive: m.isActive,
                    gridSettings: m.gridSettings,
                })),
                handouts: handouts.filter(h => h.title.trim()),
            };
            await fetch("http://localhost:3030/campaign/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            navigate("/dashboard");
        } catch (e) {
            console.error(e);
        }
    };

    const next = () => {
        if (step < TOTAL_STEPS) setStep(s => s + 1);
        else handleSubmit();
    };
    const back = () => { if (step > 1) setStep(s => s - 1); };

    // ── Shared styles ─────────────────────────────────────────────────────────
    const sh  = { fontSize: "18px", color: "#E8D5C4", fontFamily: "var(--font-heading)", marginBottom: "20px" };
    const lbl = { fontSize: "11px", color: "#5A4A3A", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "6px" };
    const ta  = {
        width: "100%", backgroundColor: "#2A2A2A", border: "none", borderRadius: "7px",
        color: "#A3A3A3", padding: "10px 12px", fontSize: "13px", fontStyle: "italic",
        fontFamily: "var(--font-body)", resize: "none", outline: "none",
    };
    const card = {
        backgroundColor: "#1E1A16", border: "1px solid #2E2720",
        borderRadius: "8px", padding: "20px",
    };
    const fileDrop = (active) => ({
        border: `2px dashed ${active ? "#8B6914" : "#2E2720"}`,
        borderRadius: "8px", padding: "32px", textAlign: "center",
        cursor: "pointer", transition: "border-color .2s",
        backgroundColor: active ? "rgba(139,105,20,.06)" : "#1E1A16",
    });
    const fileRow = {
        display: "flex", alignItems: "center", gap: "10px",
        backgroundColor: "#2A2A2A", border: "1px solid #2E2720",
        borderRadius: "6px", padding: "8px 12px", marginTop: "6px",
    };
    const removeBtn = {
        background: "none", border: "none", color: "#5A2A2A",
        cursor: "pointer", fontSize: "14px", padding: "0 4px", marginLeft: "auto",
    };
    const toggleBase = (on) => ({
        width: "38px", height: "22px", borderRadius: "11px", cursor: "pointer",
        position: "relative", border: "none", flexShrink: 0, transition: "background .2s",
        backgroundColor: on ? "rgba(20,80,40,.6)" : "#2A2A2A",
        outline: "1px solid " + (on ? "rgba(40,120,60,.5)" : "#3A3A3A"),
    });
    const toggleThumb = (on) => ({
        position: "absolute", top: "3px", left: on ? "18px" : "3px",
        width: "16px", height: "16px", borderRadius: "50%", transition: "left .2s",
        backgroundColor: on ? "#5AC47A" : "#5A4A3A",
    });

    return (
        <StepLayout
            campaignName="Nová kampaň"
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            onNext={next}
            onBack={back}
            nextLabel={step === TOTAL_STEPS ? "Vytvoriť kampaň" : "Next"}
        >

            {/* ===== KROK 1: Základy ===== */}
            {step === 1 && (
                <div>
                    <h3 style={sh}>Základné informácie</h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        {/* Ľavý stĺpec */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <div style={lbl}>Názov kampane *</div>
                                <Input
                                    value={data.name}
                                    onChange={e => set("name", e.target.value)}
                                    placeholder="napr. Curse of Strahd"
                                />
                            </div>

                            <div>
                                <div style={lbl}>Popis</div>
                                <textarea
                                    value={data.description}
                                    onChange={e => set("description", e.target.value)}
                                    placeholder="Krátky popis príbehu, sveta alebo tónu kampane..."
                                    style={ta} rows={4}
                                />
                            </div>

                            <div>
                                <div style={lbl}>Status</div>
                                <Dropdown
                                    options={STATUS_OPTIONS}
                                    value={data.status}
                                    onChange={val => set("status", val)}
                                    placeholder="Vyber status"
                                />
                            </div>

                            <div>
                                <div style={lbl}>Session Summary</div>
                                <textarea
                                    value={data.sessionSummary}
                                    onChange={e => set("sessionSummary", e.target.value)}
                                    placeholder="Čo sa stalo na poslednom sedení..."
                                    style={ta} rows={3}
                                />
                            </div>
                        </div>

                        {/* Pravý stĺpec — avatar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <div style={lbl}>Avatar kampane</div>
                                <label style={{ cursor: "pointer" }}>
                                    <div style={{
                                        width: "140px", height: "140px",
                                        border: "2px dashed #3D3228", borderRadius: "8px",
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center",
                                        overflow: "hidden", backgroundColor: "#1E1A16",
                                        transition: "border-color .2s",
                                    }}
                                         onMouseEnter={e => e.currentTarget.style.borderColor = "#8B6914"}
                                         onMouseLeave={e => e.currentTarget.style.borderColor = "#3D3228"}
                                    >
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="avatar"
                                                 style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <>
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                                     stroke="#4A3C2E" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <path d="M21 15l-5-5L5 21"/>
                                                </svg>
                                                <div style={{ fontSize: "11px", color: "#5A4A3A", marginTop: "8px", fontStyle: "italic" }}>
                                                    Nahrať obrázok
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
                                </label>
                            </div>

                            <div>
                                <div style={lbl}>AI Lore Kontext</div>
                                <textarea
                                    value={data.aiLoreContext}
                                    onChange={e => set("aiLoreContext", e.target.value)}
                                    placeholder="Kontext pre AI asistenta — svet, tón, hlavní NPC..."
                                    style={ta} rows={6}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== KROK 2: Invite kód ===== */}
            {step === 2 && (
                <div>
                    <h3 style={sh}>Invite kód</h3>
                    <p style={{ color: "#5A4A3A", fontSize: "13px", fontStyle: "italic", marginBottom: "24px" }}>
                        Vygeneruj kód — hráči sa ním pripoja ku kampani.
                    </p>

                    <div style={card}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                            <div style={{
                                flex: 1, backgroundColor: "#2A2A2A", borderRadius: "8px",
                                padding: "16px 20px", fontFamily: "var(--font-heading)",
                                fontSize: "22px", letterSpacing: ".25em",
                                color: inviteCode ? "#E8B84B" : "#3A3A3A",
                                textAlign: "center",
                            }}>
                                {inviteCode || "— — — — — — — —"}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <Button onClick={fetchInviteCode}>Generovať kód</Button>
                            <Button onClick={copyCode} disabled={!inviteCode}>
                                {copied ? "✓ Skopírované" : "Kopírovať"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== KROK 3: Mapy & Súbory ===== */}
            {step === 3 && (
                <div>
                    <h3 style={sh}>Mapy & Súbory</h3>

                    {/* MAPY */}
                    <div style={{ marginBottom: "28px" }}>
                        <div style={{ ...lbl, marginBottom: "10px" }}>Mapy kampane</div>

                        <label
                            style={fileDrop(mapDragOver)}
                            onDragOver={e => { e.preventDefault(); setMapDragOver(true); }}
                            onDragLeave={() => setMapDragOver(false)}
                            onDrop={e => {
                                e.preventDefault(); setMapDragOver(false);
                                addMapFiles(e.dataTransfer.files);
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                 stroke="#4A3C2E" strokeWidth="1.3" style={{ margin: "0 auto 8px" }}>
                                <path d="M1 3L5 1L11 3L15 1V13L11 15L5 13L1 15V3Z"/>
                                <path d="M5 1V13M11 3V15"/>
                            </svg>
                            <div style={{ fontSize: "13px", color: "#5A4A3A", fontStyle: "italic" }}>
                                Pretiahnuť mapu sem alebo kliknúť
                            </div>
                            <div style={{ fontSize: "11px", color: "#3A3A3A", marginTop: "4px" }}>PNG, JPG, PDF</div>
                            <input
                                type="file" multiple accept="image/*,.pdf"
                                style={{ display: "none" }}
                                onChange={e => addMapFiles(e.target.files)}
                            />
                        </label>

                        {mapFiles.length > 0 && (
                            <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                {mapFiles.map((m, i) => (
                                    <div key={i} style={{
                                        ...fileRow, flexDirection: "column", alignItems: "flex-start",
                                        padding: "0", overflow: "hidden",
                                        outline: m.isActive ? "2px solid #8B6914" : "none",
                                    }}>
                                        {m.preview && (
                                            <img src={m.preview} alt={m.name}
                                                 style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                                        )}
                                        <div style={{ padding: "8px 12px", width: "100%", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "12px", color: "#A3A3A3", fontStyle: "italic" }}>{m.name}</div>
                                                <div style={{ fontSize: "11px", color: "#5A4A3A" }}>{m.size}</div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <button
                                                    onClick={() => setActiveMap(i)}
                                                    style={{
                                                        background: m.isActive ? "rgba(20,80,40,.5)" : "#2A2A2A",
                                                        border: "1px solid " + (m.isActive ? "rgba(40,120,60,.5)" : "#3A3A3A"),
                                                        borderRadius: "4px", color: m.isActive ? "#5AC47A" : "#5A4A3A",
                                                        fontSize: "10px", padding: "2px 8px", cursor: "pointer",
                                                        fontFamily: "var(--font-heading)", letterSpacing: ".04em",
                                                    }}
                                                >
                                                    {m.isActive ? "● Active" : "Set Active"}
                                                </button>
                                                <button style={removeBtn} onClick={() => removeMap(i)}>✕</button>
                                            </div>
                                        </div>

                                        {/* Grid settings per map */}
                                        <div style={{ padding: "0 12px 10px", display: "flex", gap: "10px", width: "100%" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ ...lbl, fontSize: "9px" }}>Cell Size (px)</div>
                                                <Input
                                                    type="number"
                                                    value={m.gridSettings.cellSize}
                                                    onChange={e => setMapFiles(prev => prev.map((x, idx) =>
                                                        idx === i ? { ...x, gridSettings: { ...x.gridSettings, cellSize: +e.target.value } } : x
                                                    ))}
                                                    placeholder="50"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ ...lbl, fontSize: "9px" }}>Grid Color</div>
                                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                    <input
                                                        type="color"
                                                        value={m.gridSettings.gridColor}
                                                        onChange={e => setMapFiles(prev => prev.map((x, idx) =>
                                                            idx === i ? { ...x, gridSettings: { ...x.gridSettings, gridColor: e.target.value } } : x
                                                        ))}
                                                        style={{ width: "36px", height: "36px", border: "1px solid #3A3A3A", borderRadius: "6px", padding: "2px", backgroundColor: "#2A2A2A", cursor: "pointer" }}
                                                    />
                                                    <Input
                                                        value={m.gridSettings.gridColor}
                                                        onChange={e => setMapFiles(prev => prev.map((x, idx) =>
                                                            idx === i ? { ...x, gridSettings: { ...x.gridSettings, gridColor: e.target.value } } : x
                                                        ))}
                                                        placeholder="#cccccc"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* GENERAL FILES */}
                    <div>
                        <div style={{ ...lbl, marginBottom: "10px" }}>Herné súbory</div>

                        <label
                            style={fileDrop(dragOver)}
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => {
                                e.preventDefault(); setDragOver(false);
                                addGeneralFiles(e.dataTransfer.files);
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                 stroke="#4A3C2E" strokeWidth="1.3" style={{ margin: "0 auto 8px" }}>
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <div style={{ fontSize: "13px", color: "#5A4A3A", fontStyle: "italic" }}>
                                Pretiahnuť súbory sem alebo kliknúť
                            </div>
                            <div style={{ fontSize: "11px", color: "#3A3A3A", marginTop: "4px" }}>
                                PDF, PNG, JPG, MP3, TXT · max 50 MB
                            </div>
                            <input
                                type="file" multiple
                                accept=".pdf,.png,.jpg,.jpeg,.webp,.mp3,.txt,.md"
                                style={{ display: "none" }}
                                onChange={e => addGeneralFiles(e.target.files)}
                            />
                        </label>

                        {generalFiles.map((f, i) => (
                            <div key={i} style={fileRow}>
                                {f.isImage ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <path d="M21 15l-5-5L5 21"/>
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="1.5">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                )}
                                <div style={{ fontSize: "13px", color: "#A3A3A3", fontStyle: "italic", flex: 1 }}>{f.name}</div>
                                <div style={{ fontSize: "11px", color: "#5A4A3A" }}>{f.size}</div>
                                <button style={removeBtn} onClick={() => removeFile(i)}>✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== KROK 4: Handouty ===== */}
            {step === 4 && (
                <div>
                    <h3 style={sh}>Handouty</h3>
                    <p style={{ color: "#5A4A3A", fontSize: "13px", fontStyle: "italic", marginBottom: "20px" }}>
                        Materiály ktoré môžeš zdieľať s hráčmi počas hry.
                    </p>

                    {handouts.map((h, i) => (
                        <div key={i} style={{ ...card, marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={lbl}>Názov handoutu</div>
                                    <Input
                                        value={h.title}
                                        onChange={e => updateHandout(i, "title", e.target.value)}
                                        placeholder="napr. List od Strahda, Mapa Barovia..."
                                    />
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "18px" }}>
                                    <div style={{ fontSize: "11px", color: "#5A4A3A", fontStyle: "italic" }}>
                                        {h.isShared ? "Zdieľané" : "Skryté"}
                                    </div>
                                    <button
                                        style={toggleBase(h.isShared)}
                                        onClick={() => updateHandout(i, "isShared", !h.isShared)}
                                    >
                                        <div style={toggleThumb(h.isShared)} />
                                    </button>
                                    <button style={{ ...removeBtn, marginLeft: "4px" }} onClick={() => removeHandout(i)}>✕</button>
                                </div>
                            </div>

                            <div>
                                <div style={lbl}>URL obrázku (voliteľné)</div>
                                <Input
                                    value={h.imageUrl}
                                    onChange={e => updateHandout(i, "imageUrl", e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>

                            {h.isShared && (
                                <div style={{
                                    marginTop: "10px", padding: "6px 12px", borderRadius: "4px",
                                    backgroundColor: "rgba(20,80,40,.15)",
                                    border: "1px solid rgba(40,120,60,.25)",
                                    fontSize: "11px", color: "#5AC47A", fontStyle: "italic",
                                }}>
                                    ● Viditeľné pre hráčov
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={addHandout}
                        style={{
                            width: "100%", backgroundColor: "#1E1A16",
                            border: "2px dashed #2E2720", borderRadius: "8px",
                            padding: "14px", color: "#5A4A3A", fontSize: "13px",
                            fontStyle: "italic", cursor: "pointer", transition: "border-color .2s",
                            fontFamily: "var(--font-body)",
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#8B6914"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "#2E2720"}
                    >
                        + Pridať handout
                    </button>
                </div>
            )}

        </StepLayout>
    );
}