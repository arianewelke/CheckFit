import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Layout/Navbar";
import { formatTimeRange, formatDateTime } from "../utils/dateFormat";

function CheckinHistory() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                
                if (!token) {
                    setError("Token não encontrado. Faça login novamente.");
                    navigate("/auth/login");
                    return;
                }
                
                const response = await api.get("/checkin/history", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setHistory(response.data || []);
            } catch (error) {
                console.error("Error fetching history:", error);
                setError(error.response?.data?.message || "Erro ao carregar histórico");
                
                if (error.response?.status === 401) {
                    navigate("/auth/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [navigate]);

    const getStatusBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'confirmed':
            case 'confirmado':
                return <span className="status-badge status-confirmed">✅ Confirmado</span>;
            case 'pending':
            case 'pendente':
                return <span className="status-badge status-pending">⏳ Pendente</span>;
            case 'cancelled':
            case 'cancelado':
                return <span className="status-badge status-cancelled">❌ Cancelado</span>;
            default:
                return <span className="status-badge status-confirmed">✅ Realizado</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="app-layout">
                <Navbar />
                <main className="main-content">
                    <div className="container">
                        <div className="loading-state">
                            <div className="spinner-large"></div>
                            <p>Carregando histórico...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Navbar />
            
            <main className="main-content">
                <div className="container">
                    {/* Header */}
                    <div className="page-header fade-in">
                        <h1>📋 Histórico de Check-ins</h1>
                        <p>Acompanhe todos os seus check-ins realizados</p>
                    </div>

                    {error && (
                        <div className="alert alert-error fade-in">
                            {error}
                        </div>
                    )}

                    {/* Content */}
                    <div className="history-container fade-in">
                        {history.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📅</div>
                                <h3>Nenhum check-in encontrado</h3>
                                <p>Você ainda não realizou nenhum check-in. Comece agora!</p>
                                <div className="empty-actions">
                                    <button
                                        onClick={() => navigate("/activity")}
                                        className="btn btn-primary"
                                    >
                                        Ver Atividades
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Statistics */}
                                <div className="history-stats">
                                    <div className="stat-item">
                                        <div className="stat-number">{history.length}</div>
                                        <div className="stat-label">Total de Check-ins</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">
                                            {history.filter(item => item.status !== 'cancelled').length}
                                        </div>
                                        <div className="stat-label">Confirmados</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">
                                            {new Set(history.map(item => 
                                                new Date(item.checkinTime || item.createdAt).toDateString()
                                            )).size}
                                        </div>
                                        <div className="stat-label">Dias Ativos</div>
                                    </div>
                                </div>

                                {/* History List */}
                                <div className="history-list">
                                    {history.map((item, index) => (
                                        <div key={index} className="history-item">
                                            <div className="item-header">
                                                <div className="item-title">
                                                    <span className="activity-icon">🏃‍♂️</span>
                                                    <span className="activity-id">
                                                        Atividade {item.activityId || item.idActivity || ""}
                                                    </span>
                                                </div>
                                                {getStatusBadge(item.status)}
                                            </div>
                                            
                                            <div className="item-details">
                                                <div className="detail-item">
                                                    <span className="detail-icon">⏰</span>
                                                    <span className="detail-text">
                                                        {item.checkinTime ? 
                                                            formatDateTime(item.checkinTime) : 
                                                            (item.createdAt ? formatDateTime(item.createdAt) : 'Data não disponível')
                                                        }
                                                    </span>
                                                </div>
                                                
                                                {item.activityName && (
                                                    <div className="detail-item">
                                                        <span className="detail-icon">📝</span>
                                                        <span className="detail-text">{item.activityName}</span>
                                                    </div>
                                                )}
                                                
                                                {item.startTime && item.endTime && (
                                                    <div className="detail-item">
                                                        <span className="detail-icon">🕐</span>
                                                        <span className="detail-text">
                                                            {formatTimeRange(item.startTime, item.endTime)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-footer fade-in">
                        <button
                            onClick={() => navigate("/activity")}
                            className="btn btn-primary"
                        >
                            <span>🏃‍♂️</span>
                            Ver Atividades
                        </button>
                        <button
                            onClick={() => navigate("/home")}
                            className="btn btn-secondary"
                        >
                            <span>🏠</span>
                            Início
                        </button>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .history-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: var(--space-lg) 0;
                }

                .history-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: var(--space-md);
                    margin-bottom: var(--space-xl);
                }

                .stat-item {
                    background: var(--background-elevated);
                    padding: var(--space-lg);
                    border-radius: var(--radius-md);
                    text-align: center;
                    box-shadow: var(--shadow-sm);
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary-600);
                    margin-bottom: var(--space-xs);
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    margin-bottom: var(--space-xl);
                }

                .history-item {
                    background: var(--background-elevated);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                    overflow: hidden;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .history-item:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    background: var(--gray-50);
                    border-bottom: 1px solid var(--gray-200);
                }

                .item-title {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }

                .activity-icon {
                    font-size: 1.25rem;
                }

                .activity-id {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .status-badge {
                    padding: var(--space-xs) var(--space-sm);
                    border-radius: var(--radius-full);
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-confirmed {
                    background: var(--success-100);
                    color: var(--success-700);
                }

                .status-pending {
                    background: var(--warning-100);
                    color: var(--warning-700);
                }

                .status-cancelled {
                    background: var(--error-100);
                    color: var(--error-700);
                }

                .item-details {
                    padding: var(--space-lg);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }

                .detail-icon {
                    font-size: 1rem;
                    width: 20px;
                    text-align: center;
                }

                .detail-text {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                .empty-state {
                    text-align: center;
                    padding: var(--space-4xl) var(--space-lg);
                    background: var(--background-elevated);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: var(--space-lg);
                }

                .empty-state h3 {
                    margin: 0 0 var(--space-md);
                    font-size: 1.5rem;
                    color: var(--text-primary);
                }

                .empty-state p {
                    margin: 0 0 var(--space-xl);
                    color: var(--text-secondary);
                }

                .empty-actions {
                    display: flex;
                    gap: var(--space-md);
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .quick-actions-footer {
                    display: flex;
                    gap: var(--space-md);
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: var(--space-xl);
                }

                .quick-actions-footer .btn {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }

                .loading-state {
                    text-align: center;
                    padding: var(--space-4xl) var(--space-lg);
                }

                .spinner-large {
                    width: 3rem;
                    height: 3rem;
                    border: 3px solid var(--gray-200);
                    border-top: 3px solid var(--primary-500);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto var(--space-lg);
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .history-container {
                        padding: var(--space-md);
                    }

                    .item-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--space-sm);
                    }

                    .quick-actions-footer {
                        flex-direction: column;
                    }

                    .empty-actions {
                        flex-direction: column;
                        align-items: center;
                    }

                    .empty-actions .btn {
                        width: 100%;
                        max-width: 200px;
                    }
                }
            `}</style>
        </div>
    );
}

export default CheckinHistory;
