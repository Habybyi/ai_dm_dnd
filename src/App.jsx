import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./commponents/pages/register.jsx";
import Login from "./commponents/pages/login.jsx";
import Dashboard from "./commponents/pages/Dashboard.jsx";
import NewCharacter from "./commponents/pages/NewCharacter.jsx";
import Custom from "./commponents/pages/character/Custom.jsx";
import DashboardCh from "./commponents/pages/character/Dashboard.jsx";
import NewCampaign from "./commponents/pages/NewCampaign.jsx";
import CharacterSheet from "./commponents/pages/character/CharacterSheet.jsx";
import CreateCampaign from "./commponents/pages/campaign/CreateCampaign.jsx";
import Campaignsheet from "./commponents/pages/campaign/Campaignsheet.jsx";

import ProtectedRoute from "./commponents/safety/ProtectedRoute.js";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/campaign/create" element={
                // <ProtectedRoute>
                    <NewCampaign />
                // </ProtectedRoute>
            }/>
            <Route path="/campaign/create/custom" element={<CreateCampaign />} />
            <Route path="/campaign/:id" element={<Campaignsheet />} />

            {/*Characters*/}
            <Route path="/characters" element={<DashboardCh />} />
            <Route path="/characters/:id" element={<CharacterSheet />} />

            {/*Creation*/}
            <Route path="/characters/create" element={<NewCharacter />} />
            <Route path="/characters/create/custom" element={<Custom />} />
            {/*<Route path="/characters/create/help" element={<WithHelp />} />*/}
            {/*<Route path="/characters/create/ai" element={<AICreator />} />*/}

        </Routes>
      </BrowserRouter>
  );
}