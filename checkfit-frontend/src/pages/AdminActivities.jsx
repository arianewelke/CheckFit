import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar.jsx";
import { formatTimeRange } from "../utils/dateFormat";

function AdminActivities() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        description: "",
        startTime: "",
        finishTime: "",
        limitPeople: ""
    });

    const role = localStorage.getItem("role");

    useEffect(() => {
        if (role !== "ADMIN") {
            navigate("/home");
            return;
        }
        fetchActivities();
    }, [navigate, role]);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/activity", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(response.data);
        } catch (err) {
            setError("Erro ao carregar atividades.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            await api.post("/activity", {
                description: form.description,
                startTime: form.startTime,
                finishTime: form.finishTime,
                limitPeople: parseInt(form.limitPeople, 10)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess("Atividade criada com sucesso!");
            setForm({ description: "", startTime: "", finishTime: "", limitPeople: "" });
            fetchActivities();
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao criar atividade.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Deseja deletar esta atividade?")) return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/activity/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchActivities();
        } catch (err) {
            setError("Erro ao deletar atividade.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: "2rem" }}>
                <h1>Gerenciar Atividades</h1>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
                    <h2>Nova Atividade</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Descrição</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Ex: Musculação, Yoga, Spinning..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Data/hora de início</label>
                            <input
                                className="form-input"
                                type="datetime-local"
                                value={form.startTime}
                                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Data/hora de fim</label>
                            <input
                                className="form-input"
                                type="datetime-local"
                                value={form.finishTime}
                                onChange={(e) => setForm({ ...form, finishTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Limite de pessoas</label>
                            <input
                                className="form-input"
                                type="number"
                                min="1"
                                placeholder="Ex: 20"
                                value={form.limitPeople}
                                onChange={(e) => setForm({ ...form, limitPeople: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? "Criando..." : "Criar Atividade"}
                        </button>
                    </form>
                </div>

                <h2>Atividades Cadastradas</h2>
                {activities.length === 0 ? (
                    <p>Nenhuma atividade cadastrada.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {activities.map((activity) => (
                            <div key={activity.id} className="card" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>{activity.description}</strong>
                                    <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                        {formatTimeRange(activity.startTime, activity.finishTime)} | Limite: {activity.limitPeople}
                                    </p>
                                </div>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleDelete(activity.id)}
                                >
                                    Deletar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminActivities;
