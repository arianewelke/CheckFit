import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import ToastNotification from "../components/ToastNotification";
import api from "../services/api";
import {formatTimeRange} from "../utils/dateFormat.js";

function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCheckins: 0,
        weeklyCheckins: 0,
        activeActivities: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkingInActivity, setCheckingInActivity] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "" });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            // Buscar atividades disponíveis
            const activitiesResponse = await api.get("/activity", { headers });
            const activities = activitiesResponse.data;
            
            setStats(prev => ({
                ...prev,
                activeActivities: activities.length
            }));
            
            setRecentActivities(activities.slice(0, 3));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDirectCheckin = async (activityId) => {
        setIsCheckingIn(true);
        setCheckingInActivity(activityId);
        
        try {
            const token = localStorage.getItem("token");
            const response = await api.post("/checkin", 
                { idActivity: activityId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setToast({ message: "🎉 Check-in realizado com sucesso! Sua presença foi confirmada.", type: "success" });
            
            await fetchDashboardData();
            
        } catch (error) {
            console.error("Check-in error:", error);
            setToast({ message: error.response?.data?.message || "Erro ao realizar check-in. Tente novamente.", type: "error" });
        } finally {
            setIsCheckingIn(false);
            setCheckingInActivity(null);
        }
    };

    const quickActions = [
        {
            title: "Ver Atividades",
            description: "Explore todas as atividades disponíveis",
            icon: "🏃‍♂️",
            color: "primary",
            action: () => navigate("/activity")
        },
        {
            title: "Ver Histórico",
            description: "Acompanhe seus check-ins anteriores",
            icon: "📋",
            color: "secondary",
            action: () => navigate("/checkin/history")
        }
    ];

    return (
        <div className="home-page">
            <Navbar />
            
            <main className="main-content">
                <div className="container">
                    {/* Toast Notifications */}
                    {toast.message && (
                        <ToastNotification 
                            message={toast.message} 
                            type={toast.type}
                            onClose={() => setToast({ message: "", type: "" })}
                        />
                    )}

                    {/* Welcome Section */}
                    <section className="welcome-section fade-in">
                        <div className="welcome-content">
                            <h1>Bem-vindo de volta, {userName || "Usuário"}! 💪</h1>
                            <p>Pronto para mais um dia de treino? Vamos continuar sua jornada fitness!</p>
                        </div>
                        <div className="welcome-visual">
                            <div className="streak-card">
                                <div className="streak-icon">🔥</div>
                                <div className="streak-info">
                                    <div className="streak-number">7</div>
                                    <div className="streak-label">Dias consecutivos</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Cards */}
                    <section className="stats-section">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.totalCheckins}</div>
                                    <div className="stat-label">Total de Check-ins</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.weeklyCheckins}</div>
                                    <div className="stat-label">Esta Semana</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.activeActivities}</div>
                                    <div className="stat-label">Atividades Disponíveis</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="actions-section">
                        <h2>Ações Rápidas</h2>
                        <div className="actions-grid">
                            {quickActions.map((action, index) => (
                                <div key={index} className={`action-card action-${action.color}`} onClick={action.action}>
                                    <div className="action-icon">{action.icon}</div>
                                    <div className="action-content">
                                        <h3 className="action-title">{action.title}</h3>
                                        <p className="action-description">{action.description}</p>
                                    </div>
                                    <div className="action-arrow">→</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activities */}
                    <section className="recent-section">
                        <h2>Atividades em Destaque - Check-in Rápido</h2>
                        {isLoading ? (
                            <div className="loading-card">
                                <div className="spinner"></div>
                                <p>Carregando atividades...</p>
                            </div>
                        ) : recentActivities.length > 0 ? (
                            <div className="activities-grid">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="activity-card">
                                        <div className="activity-header">
                                            <h3>{activity.description}</h3>
                                            <span className="badge badge-success">Disponível</span>
                                        </div>
                                        <div className="activity-details">
                                            <div className="detail-row">
                                                <span className="detail-icon">🕐</span>
                                                <span className="detail-label">Horário:</span>
                                                <span className="detail-value">
                                                            {formatTimeRange(activity.startTime, activity.finishTime)}
                                                </span>
                                            </div>
                                            <div className="detail">
                                                <span className="detail-icon">👥</span>
                                                <span>Limite: {activity.limitPeople} pessoas</span>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-success btn-lg"
                                            style={{ width: '100%' }}
                                            onClick={() => handleDirectCheckin(activity.id)}
                                            disabled={checkingInActivity === activity.id}
                                        >
                                            {checkingInActivity === activity.id ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Fazendo Check-in...
                                                </>
                                            ) : (
                                                <>✅ Check-in Rápido</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🏃‍♂️</div>
                                <h3>Nenhuma atividade disponível</h3>
                                <p>Que tal explorar novas atividades?</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate("/activity")}
                                >
                                    Ver Todas as Atividades
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <style jsx>{`
                .home-page {
                    min-height: 100vh;
                    background-color: var(--bg-secondary);
                }

                .main-content {
                    padding: var(--space-xl) 0;
                }

                .alert {
                    padding: var(--space-md) var(--space-lg);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-lg);
                    font-weight: 500;
                    text-align: center;
                    box-shadow: var(--shadow-md);
                }

                .alert-success {
                    background-color: var(--success);
                    color: var(--text-inverse);
                    border: 1px solid var(--secondary-dark);
                }

                .alert-error {
                    background-color: var(--error);
                    color: var(--text-inverse);
                    border: 1px solid #DC2626;
                }

                .welcome-section {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: var(--space-xl);
                    align-items: center;
                    margin-bottom: var(--space-2xl);
                    padding: var(--space-xl);
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    border-radius: var(--radius-lg);
                    color: var(--text-inverse);
                }

                .welcome-content h1 {
                    font-size: 2.5rem;
                    margin-bottom: var(--space-md);
                    color: var(--text-inverse);
                }

                .welcome-content p {
                    font-size: 1.125rem;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 0;
                }

                .streak-card {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    background: rgba(255, 255, 255, 0.1);
                    padding: var(--space-lg);
                    border-radius: var(--radius-lg);
                    backdrop-filter: blur(10px);
                }

                .streak-icon {
                    font-size: 2rem;
                }

                .streak-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-inverse);
                }

                .streak-label {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.8);
                }

                .stats-section {
                    margin-bottom: var(--space-2xl);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-lg);
                }

                .stat-card {
                    background: var(--bg-primary);
                    padding: var(--space-xl);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    transition: all 0.2s ease;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .stat-icon {
                    font-size: 2rem;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .actions-section {
                    margin-bottom: var(--space-2xl);
                }

                .actions-section h2 {
                    margin-bottom: var(--space-lg);
                }

                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: var(--space-lg);
                }

                .action-card {
                    background: var(--bg-primary);
                    padding: var(--space-xl);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-left: 4px solid var(--primary);
                }

                .action-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .action-card.action-success {
                    border-left-color: var(--success);
                }

                .action-card.action-secondary {
                    border-left-color: var(--gray-500);
                }

                .action-icon {
                    font-size: 2rem;
                }

                .action-content {
                    flex: 1;
                }

                .action-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: var(--space-xs);
                    color: var(--text-primary);
                }

                .action-description {
                    color: var(--text-secondary);
                    margin: 0;
                }

                .action-arrow {
                    font-size: 1.25rem;
                    color: var(--text-tertiary);
                    transition: transform 0.2s ease;
                }

                .action-card:hover .action-arrow {
                    transform: translateX(4px);
                }

                .recent-section h2 {
                    margin-bottom: var(--space-lg);
                }

                .activities-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: var(--space-lg);
                }

                .activity-card {
                    background: var(--bg-primary);
                    padding: var(--space-xl);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                    transition: all 0.2s ease;
                }

                .activity-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .activity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--space-md);
                }

                .activity-header h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0;
                }

                .activity-details {
                    margin-bottom: var(--space-lg);
                }

                .detail {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    margin-bottom: var(--space-sm);
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .detail-icon {
                    font-size: 1rem;
                }

                .loading-card {
                    text-align: center;
                    padding: var(--space-2xl);
                    background: var(--bg-primary);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                }

                .empty-state {
                    text-align: center;
                    padding: var(--space-3xl);
                    background: var(--bg-primary);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: var(--space-lg);
                }

                .empty-state h3 {
                    color: var(--text-primary);
                    margin-bottom: var(--space-md);
                }

                .empty-state p {
                    color: var(--text-secondary);
                    margin-bottom: var(--space-lg);
                }

                @media (max-width: 768px) {
                    .welcome-section {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }

                    .welcome-content h1 {
                        font-size: 2rem;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .actions-grid {
                        grid-template-columns: 1fr;
                    }

                    .activities-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;
