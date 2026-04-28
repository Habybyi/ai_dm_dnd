# ⚔️ D&D Nexus - AI-Powered Dungeon Master Ecosystem

D&D Nexus je moderná SaaS platforma určená pre Dungeon Masterov a hráčov Dungeons & Dragons. Systém kombinuje interaktívny management postáv s umelou inteligenciou (Claude AI), ktorá slúži ako asistent DM-a a generátor herného naratívu v reálnom čase.

## 🚀 Prehľad Systému

Projekt je postavený na modulárnej architektúre, ktorá umožňuje synchronizáciu dát medzi DM-om a všetkými hráčmi súčasne.

### Hlavné Moduly:
* **Frontend (React/Vite):** Vysoko responzívne rozhranie pre DM panel, hráčske karty, inventár a real-time grid mapu.
* **Backend (Node.js/Express):** Orchestrácia dát, autentifikácia používateľov a riadenie toku správ medzi AI a hráčmi.
* **AI Engine (Claude API):** "Mozog" hry, ktorý na základe kontextu (stav postáv + logy) reaguje na akcie hráčov a pomáha budovať príbeh.
* **Database (PostgreSQL/SQLite):** Bezpečné úložisko pre používateľské účty, štatistiky postáv a históriu session.

---

## 🛠 Technický Stack

| Vrstva | Technológia |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, WebSockets |
| **Backend** | Node.js, Express (alternatívne FastAPI) |
| **Databáza** | PostgreSQL / SQLite |
| **AI** | Anthropic Claude API |
| **DevOps** | Docker, Docker-Compose |

---

## 📋 Architektúra a Flow akcie

Podľa definovaného flow-chartu systém funguje nasledovne:
1.  **Hráč koná:** Akcia je odoslaná z Frontendu na Backend.
2.  **Spracovanie:** Backend validuje požiadavku a komunikuje s Claude AI.
3.  **AI Odpoveď:** Claude DM spracuje kontext a vygeneruje odpoveď/následok akcie.
4.  **Broadcast:** Odpoveď je cez WebSockets okamžite odoslaná (broadcast) všetkým pripojeným hráčom.

---

## 📂 Štruktúra projektu

```text
├── frontend/             # Frontend aplikácia
│   ├── pages/            # DMPanel.jsx, CharacterSheet.jsx, MapView.jsx
│   ├── components/       # Znovupoužiteľné UI komponenty
│   └── store/            # State management
├── backend/              # API a Business logika
│   ├── routes/           # Endpointy pre characters, ai, sessions
│   ├── db/               # Modely a migrácie
│   └── middleware/       # Auth a validácie
├── shared/               # Zdieľané typy (TS) a konštanty
├── .env                  # Konfigurácia (API kľúče, DB URL)
└── docker-compose.yml    # Konfigurácia pre Docker kontajnery