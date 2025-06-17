import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activity from "./pages/Activity.jsx";
import CheckinHistory from "./pages/CheckinHistory.jsx";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota pública */}
                <Route path="/" element={<Landing />} />
                
                {/* Rotas de autenticação */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                
                {/* Rotas protegidas */}
                <Route path="/home" element={<Home />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/checkin/history" element={<CheckinHistory />} />
                <Route path="/historico" element={<CheckinHistory />} />
                
                {/* Redirecionar rotas não encontradas para a landing page */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
