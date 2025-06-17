import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Layout/Navbar";
import ToastNotification from "../components/ToastNotification";
import { formatTimeRange } from "../utils/dateFormat";

function Activity() {
    const [activities, setActivities] = useState([]);
    const [availability, setAvailability] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkingInActivity, setCheckingInActivity] = useState(null);
    const [toast, setToast] = useState({ message: "", type: "" });
    
    // Filtros e paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [selectedDate, setSelectedDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const response = await api.get("/activity", { headers });
            setActivities(response.data);

            const availabilityData = {};
            for (const activity of response.data) {
                try {
                    const res = await api.get(`/activity/${activity.id}/availability`, { headers });
                    availabilityData[activity.id] = res.data;
                } catch (error) {
                    console.error(`Erro ao buscar disponibilidade da atividade ${activity.id}`, error);
                    availabilityData[activity.id] = { availableSlots: 0 };
                }
            }
            setAvailability(availabilityData);
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
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
            
            await fetchData();
            
        } catch (error) {
            console.error("Check-in error:", error);
            setToast({ message: error.response?.data?.message || "Erro ao realizar check-in. Tente novamente.", type: "error" });
        } finally {
            setIsCheckingIn(false);
            setCheckingInActivity(null);
        }
    };

    const handleManualCheckin = (activityId) => {
        navigate(`/checkin?activityId=${activityId}`);
    };

    const getActivityStatus = (activityId) => {
        const slots = availability[activityId]?.availableSlots;
        if (slots === undefined) return { status: "loading", text: "Carregando..." };
        if (slots === 0) return { status: "full", text: "Lotado" };
        if (slots <= 2) return { status: "limited", text: `${slots} vagas` };
        return { status: "available", text: `${slots} vagas` };
    };

    // Função para filtrar e ordenar atividades
    const getFilteredAndSortedActivities = () => {
        let filtered = activities.filter(activity => {
            const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filtro por status
            let matchesStatus = true;
            if (statusFilter === "available") {
                const slots = availability[activity.id]?.availableSlots;
                matchesStatus = slots > 0;
            } else if (statusFilter === "full") {
                const slots = availability[activity.id]?.availableSlots;
                matchesStatus = slots === 0;
            }
            
            // Filtro por data
            let matchesDate = true;
            if (selectedDate) {
                const activityDate = new Date(activity.startTime).toISOString().split('T')[0];
                matchesDate = activityDate === selectedDate;
            }
            
            return matchesSearch && matchesStatus && matchesDate;
        });

        // Ordenação
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.startTime);
                    bValue = new Date(b.startTime);
                    break;
                case 'name':
                    aValue = a.description.toLowerCase();
                    bValue = b.description.toLowerCase();
                    break;
                case 'availability':
                    aValue = availability[a.id]?.availableSlots || 0;
                    bValue = availability[b.id]?.availableSlots || 0;
                    break;
                default:
                    return 0;
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    // Paginação
    const filteredActivities = getFilteredAndSortedActivities();
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

    // Reset página quando filtros mudam
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDate, statusFilter, sortBy, sortOrder]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setSelectedDate("");
        setStatusFilter("all");
        setSortBy("date");
        setSortOrder("asc");
        setCurrentPage(1);
    };

    return (
        <div className="activities-page">
            <Navbar />
            
            <main className="main-content">
                <div className="container">
                    {/* Header */}
                    <div className="page-header fade-in">
                        <h1>🏃‍♂️ Atividades Disponíveis</h1>
                        <p>Encontre e participe das atividades fitness que mais combinam com você</p>
                    </div>

                    {/* Toast Notifications */}
                    {toast.message && (
                        <ToastNotification 
                            message={toast.message} 
                            type={toast.type}
                            onClose={() => setToast({ message: "", type: "" })}
                        />
                    )}

                    {/* Filtros e Busca Avançados */}
                    <div className="filters-section fade-in">
                        <div className="filters-row">
                            {/* Busca */}
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="🔍 Buscar atividades..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>

                            {/* Filtro por Data */}
                            <div className="filter-container">
                                <label htmlFor="date-filter" className="filter-label">Data:</label>
                                <input
                                    type="date"
                                    id="date-filter"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="date-input"
                                />
                            </div>

                            {/* Ordenação */}
                            <div className="filter-container">
                                <label htmlFor="sort-filter" className="filter-label">Ordenar por:</label>
                                <select
                                    id="sort-filter"
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] = e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="sort-select"
                                >
                                    <option value="date-asc">Data (Mais cedo)</option>
                                    <option value="date-desc">Data (Mais tarde)</option>
                                    <option value="name-asc">Nome (A-Z)</option>
                                    <option value="name-desc">Nome (Z-A)</option>
                                    <option value="availability-desc">Mais vagas</option>
                                    <option value="availability-asc">Menos vagas</option>
                                </select>
                            </div>

                            {/* Botão Limpar */}
                            <button 
                                className="btn btn-secondary btn-clear"
                                onClick={clearAllFilters}
                                title="Limpar todos os filtros"
                            >
                                🗑️ Limpar
                            </button>
                        </div>

                        {/* Filtros de Status */}
                        <div className="status-filters">
                            <button 
                                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('all')}
                            >
                                Todas ({activities.length})
                            </button>
                            <button 
                                className={`filter-btn ${statusFilter === 'available' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('available')}
                            >
                                Disponíveis ({activities.filter(a => (availability[a.id]?.availableSlots || 0) > 0).length})
                            </button>
                            <button 
                                className={`filter-btn ${statusFilter === 'full' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('full')}
                            >
                                Lotadas ({activities.filter(a => (availability[a.id]?.availableSlots || 0) === 0).length})
                            </button>
                        </div>

                        {/* Indicador de Resultados */}
                        <div className="results-info">
                            <span className="results-count">
                                {filteredActivities.length} atividade{filteredActivities.length !== 1 ? 's' : ''} encontrada{filteredActivities.length !== 1 ? 's' : ''}
                            </span>
                            {(searchTerm || selectedDate || statusFilter !== 'all') && (
                                <span className="filters-active">
                                    • Filtros ativos
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Conteúdo das Atividades */}
                    <div className="activities-content fade-in">
                        {isLoading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <h3>Carregando atividades...</h3>
                                <p>Buscando as melhores opções para você</p>
                            </div>
                        ) : filteredActivities.length > 0 ? (
                            <div className="activities-grid">
                                {paginatedActivities.map((activity) => {
                                    const statusInfo = getActivityStatus(activity.id);
                                    const isAvailable = availability[activity.id]?.availableSlots > 0;
                                    const isCheckingInThis = checkingInActivity === activity.id;
                                    
                                    return (
                                        <div key={activity.id} className="activity-card">
                                            <div className="card-header">
                                                <div className="activity-id">#{activity.id}</div>
                                                <div className={`status-badge badge-${statusInfo.status}`}>
                                                    {statusInfo.text}
                                                </div>
                                            </div>

                                            <div className="card-body">
                                                <h3 className="activity-title">{activity.description}</h3>
                                                
                                                <div className="activity-details">
                                                    <div className="detail-row">
                                                        <span className="detail-icon">🕐</span>
                                                        <span className="detail-label">Horário:</span>
                                                        <span className="detail-value">
                                                            {formatTimeRange(activity.startTime, activity.finishTime)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="detail-row">
                                                        <span className="detail-icon">👥</span>
                                                        <span className="detail-label">Limite:</span>
                                                        <span className="detail-value">
                                                            {activity.limitPeople} pessoas
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="detail-row">
                                                        <span className="detail-icon">📍</span>
                                                        <span className="detail-label">Disponível:</span>
                                                        <span className="detail-value">
                                                            {statusInfo.text}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card-footer">
                                                {isAvailable ? (
                                                    <button
                                                        onClick={() => handleDirectCheckin(activity.id)}
                                                        disabled={isCheckingInThis}
                                                        className="btn btn-success btn-lg"
                                                        style={{ width: '100%' }}
                                                    >
                                                        {isCheckingInThis ? (
                                                            <>
                                                                <span className="spinner"></span>
                                                                Fazendo Check-in...
                                                            </>
                                                        ) : (
                                                            <>✅ Check-in Rápido</>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="btn btn-secondary btn-lg"
                                                        style={{ width: '100%' }}
                                                    >
                                                        🚫 Sem Vagas Disponíveis
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>Nenhuma atividade encontrada</h3>
                                <p>Tente ajustar seus filtros ou busque por outro termo</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={clearAllFilters}
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        )}

                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <div className="pagination">
                                    {/* Botão Anterior */}
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        ‹ Anterior
                                    </button>

                                    {/* Números das páginas */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                        // Mostrar apenas páginas próximas à atual
                                        if (
                                            page === 1 || 
                                            page === totalPages || 
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} className="pagination-dots">...</span>;
                                        }
                                        return null;
                                    })}

                                    {/* Botão Próximo */}
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próximo ›
                                    </button>
                                </div>

                                {/* Info da paginação */}
                                <div className="pagination-info">
                                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredActivities.length)} de {filteredActivities.length} atividades
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style jsx>{`
                /* Novos estilos para filtros e paginação */
                .page-header {
                    text-align: center;
                    margin-bottom: var(--space-xl);
                }

                .page-header h1 {
                    margin: 0 0 var(--space-sm);
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .page-header p {
                    margin: 0;
                    font-size: 1.125rem;
                    color: var(--text-secondary);
                }

                .filters-section {
                    background: var(--background-elevated);
                    border-radius: var(--radius-lg);
                    padding: var(--space-xl);
                    margin-bottom: var(--space-xl);
                    box-shadow: var(--shadow-sm);
                }

                .filters-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1.5fr auto;
                    gap: var(--space-lg);
                    align-items: end;
                    margin-bottom: var(--space-lg);
                }

                .search-container {
                    display: flex;
                    flex-direction: column;
                }

                .search-input {
                    width: 100%;
                    padding: var(--space-md);
                    border: 2px solid var(--gray-200);
                    border-radius: var(--radius-md);
                    font-size: 1rem;
                    transition: border-color 0.2s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary-500);
                }

                .filter-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                }

                .filter-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                }

                .date-input, .sort-select {
                    padding: var(--space-md);
                    border: 2px solid var(--gray-200);
                    border-radius: var(--radius-md);
                    font-size: 1rem;
                    background: white;
                    transition: border-color 0.2s ease;
                }

                .date-input:focus, .sort-select:focus {
                    outline: none;
                    border-color: var(--primary-500);
                }

                .btn-clear {
                    height: fit-content;
                    white-space: nowrap;
                }

                .status-filters {
                    display: flex;
                    gap: var(--space-sm);
                    flex-wrap: wrap;
                }

                .filter-btn {
                    padding: var(--space-sm) var(--space-lg);
                    border: 2px solid var(--gray-200);
                    background: white;
                    border-radius: var(--radius-full);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 0.875rem;
                }

                .filter-btn:hover {
                    border-color: var(--primary-300);
                    background: var(--primary-50);
                }

                .filter-btn.active {
                    background: var(--primary-500);
                    border-color: var(--primary-500);
                    color: white;
                }

                .results-info {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    padding-top: var(--space-md);
                    border-top: 1px solid var(--gray-200);
                    margin-top: var(--space-lg);
                }

                .results-count {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .filters-active {
                    color: var(--primary-600);
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .pagination-container {
                    margin-top: var(--space-xl);
                    padding-top: var(--space-xl);
                    border-top: 1px solid var(--gray-200);
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: var(--space-xs);
                    margin-bottom: var(--space-md);
                }

                .pagination-btn {
                    padding: var(--space-sm) var(--space-md);
                    border: 1px solid var(--gray-300);
                    background: white;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 0.875rem;
                    min-width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pagination-btn:hover:not(:disabled) {
                    background: var(--primary-50);
                    border-color: var(--primary-300);
                }

                .pagination-btn.active {
                    background: var(--primary-500);
                    border-color: var(--primary-500);
                    color: white;
                    font-weight: 600;
                }

                .pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination-dots {
                    padding: var(--space-sm);
                    color: var(--text-secondary);
                    font-weight: bold;
                }

                .pagination-info {
                    text-align: center;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .activities-page {
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

                .page-header {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: var(--space-xl);
                    align-items: center;
                    margin-bottom: var(--space-2xl);
                    padding: var(--space-xl);
                    background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%);
                    border-radius: var(--radius-lg);
                    color: var(--text-inverse);
                }

                .header-content h1 {
                    font-size: 2.5rem;
                    margin-bottom: var(--space-sm);
                    color: var(--text-inverse);
                }

                .header-content p {
                    font-size: 1.125rem;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 0;
                }

                .header-stats {
                    display: flex;
                    gap: var(--space-xl);
                }

                .stat {
                    text-align: center;
                    padding: var(--space-lg);
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-lg);
                    backdrop-filter: blur(10px);
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-inverse);
                    margin-bottom: var(--space-xs);
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.8);
                }

                .controls-section {
                    display: flex;
                    gap: var(--space-lg);
                    align-items: center;
                    margin-bottom: var(--space-xl);
                    padding: var(--space-lg);
                    background: var(--bg-primary);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                }

                .search-wrapper {
                    flex: 1;
                }

                .search-input {
                    width: 100%;
                    padding: var(--space-md) var(--space-lg);
                    border: 2px solid var(--gray-300);
                    border-radius: var(--radius-md);
                    font-size: 1rem;
                    font-family: inherit;
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    transition: all 0.2s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--secondary);
                    box-shadow: 0 0 0 3px rgb(16 185 129 / 0.1);
                }

                .filters {
                    display: flex;
                    gap: var(--space-sm);
                }

                .filter-btn {
                    padding: var(--space-sm) var(--space-lg);
                    border: 2px solid var(--gray-300);
                    border-radius: var(--radius-md);
                    background: var(--bg-primary);
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .filter-btn:hover {
                    border-color: var(--secondary);
                    color: var(--secondary);
                }

                .filter-btn.active {
                    background: var(--secondary);
                    color: var(--text-inverse);
                    border-color: var(--secondary);
                }

                .activities-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: var(--space-xl);
                }

                .activity-card {
                    background: var(--bg-primary);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 1px solid var(--gray-200);
                }

                .activity-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-lg);
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--gray-200);
                }

                .activity-id {
                    font-weight: 600;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .status-badge {
                    padding: var(--space-xs) var(--space-sm);
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .badge-available {
                    background: var(--success);
                    color: var(--text-inverse);
                }

                .badge-limited {
                    background: var(--warning);
                    color: var(--text-inverse);
                }

                .badge-full {
                    background: var(--error);
                    color: var(--text-inverse);
                }

                .badge-loading {
                    background: var(--gray-400);
                    color: var(--text-inverse);
                }

                .card-body {
                    padding: var(--space-xl);
                }

                .activity-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: var(--space-lg);
                }

                .activity-details {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }

                .detail-row {
                    display: grid;
                    grid-template-columns: auto auto 1fr;
                    gap: var(--space-sm);
                    align-items: center;
                }

                .detail-icon {
                    font-size: 1rem;
                }

                .detail-label {
                    font-weight: 500;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .detail-value {
                    color: var(--text-primary);
                    font-size: 0.875rem;
                    justify-self: end;
                }

                .card-footer {
                    padding: var(--space-lg);
                    background: var(--bg-tertiary);
                    border-top: 1px solid var(--gray-200);
                }

                .loading-state, .empty-state {
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

                .loading-state h3, .empty-state h3 {
                    color: var(--text-primary);
                    margin-bottom: var(--space-md);
                }

                .loading-state p, .empty-state p {
                    color: var(--text-secondary);
                    margin-bottom: var(--space-lg);
                }

                @media (max-width: 1024px) {
                    .filters-row {
                        grid-template-columns: 1fr 1fr;
                        gap: var(--space-md);
                    }

                    .btn-clear {
                        grid-column: span 2;
                        justify-self: center;
                    }
                }

                @media (max-width: 768px) {
                    .filters-section {
                        padding: var(--space-lg);
                    }

                    .filters-row {
                        grid-template-columns: 1fr;
                        gap: var(--space-md);
                    }

                    .btn-clear {
                        grid-column: span 1;
                    }

                    .status-filters {
                        flex-direction: column;
                    }

                    .filter-btn {
                        text-align: center;
                    }

                    .pagination {
                        flex-wrap: wrap;
                        gap: var(--space-xs);
                    }

                    .pagination-btn {
                        min-width: 35px;
                        height: 35px;
                        font-size: 0.8rem;
                    }

                    .page-header {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }

                    .header-stats {
                        flex-direction: column;
                        gap: var(--space-md);
                    }

                    .controls-section {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .filters {
                        justify-content: center;
                    }

                    .activities-grid {
                        grid-template-columns: 1fr;
                    }

                    .header-content h1 {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default Activity;
