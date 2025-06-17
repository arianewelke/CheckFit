import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Landing() {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Se já estiver logado, redireciona para home
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        }
    }, [navigate]);
    
    const features = [
        {
            icon: "🏃‍♂️",
            title: "Atividades Fitness",
            description: "Explore uma variedade de atividades físicas disponíveis"
        },
        {
            icon: "✅",
            title: "Check-in Fácil",
            description: "Sistema simples e rápido para confirmar sua presença"
        },
        {
            icon: "📊",
            title: "Acompanhe seu Progresso",
            description: "Visualize seu histórico e mantenha-se motivado"
        }
    ];
    
    return (
        <div className="landing-page">
            {/* Header */}
            <header className="landing-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <span className="logo-icon">💪</span>
                            <span className="logo-text">CheckFit</span>
                        </div>
                        <div className="header-actions">
                            <button 
                                onClick={() => navigate("/auth/login")}
                                className="btn btn-secondary"
                            >
                                Entrar
                            </button>
                            <button 
                                onClick={() => navigate("/auth/register")}
                                className="btn btn-primary"
                            >
                                Cadastrar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Sua jornada fitness 
                                <span className="text-gradient"> começa aqui</span>
                            </h1>
                            <p className="hero-description">
                                Gerencie suas atividades físicas, faça check-in nas suas sessões 
                                e acompanhe seu progresso de forma simples e eficiente.
                            </p>
                            <div className="hero-actions">
                                <button 
                                    onClick={() => navigate("/auth/register")}
                                    className="btn btn-primary btn-lg"
                                >
                                    Comece Agora
                                </button>
                                <button 
                                    onClick={() => navigate("/auth/login")}
                                    className="btn btn-secondary btn-lg"
                                >
                                    Já tenho conta
                                </button>
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="hero-card">
                                <div className="hero-emoji">🏋️‍♂️</div>
                                <h3>Pronto para o treino?</h3>
                                <p>Encontre a atividade perfeita para você!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="features-header">
                        <h2>Por que escolher o CheckFit?</h2>
                        <p>Descubra as funcionalidades que tornarão sua rotina fitness mais organizada</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Pronto para transformar sua rotina?</h2>
                        <p>Junte-se a milhares de pessoas que já estão alcançando seus objetivos fitness</p>
                        <button 
                            onClick={() => navigate("/auth/register")}
                            className="btn btn-primary btn-lg"
                        >
                            Cadastre-se Grátis
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <span className="logo-icon">💪</span>
                            <span className="logo-text">CheckFit</span>
                        </div>
                        <p className="footer-text">
                            © 2024 CheckFit. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .landing-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
                }

                .landing-header {
                    padding: var(--space-lg) 0;
                    background-color: var(--bg-primary);
                    box-shadow: var(--shadow-sm);
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }

                .logo-icon {
                    font-size: 2rem;
                }

                .logo-text {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                }

                .header-actions {
                    display: flex;
                    gap: var(--space-md);
                }

                .hero {
                    padding: var(--space-3xl) 0;
                }

                .hero-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-3xl);
                    align-items: center;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.1;
                    margin-bottom: var(--space-lg);
                    color: var(--text-primary);
                }

                .text-gradient {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-description {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    margin-bottom: var(--space-xl);
                    line-height: 1.6;
                }

                .hero-actions {
                    display: flex;
                    gap: var(--space-lg);
                }

                .hero-visual {
                    display: flex;
                    justify-content: center;
                }

                .hero-card {
                    background: var(--bg-primary);
                    padding: var(--space-2xl);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-xl);
                    text-align: center;
                    max-width: 300px;
                    transform: rotate(-5deg);
                    transition: transform 0.3s ease;
                }

                .hero-card:hover {
                    transform: rotate(0deg) scale(1.05);
                }

                .hero-emoji {
                    font-size: 4rem;
                    margin-bottom: var(--space-lg);
                }

                .features {
                    padding: var(--space-3xl) 0;
                    background-color: var(--bg-primary);
                }

                .features-header {
                    text-align: center;
                    margin-bottom: var(--space-3xl);
                }

                .features-header h2 {
                    font-size: 2.5rem;
                    margin-bottom: var(--space-md);
                }

                .features-header p {
                    font-size: 1.125rem;
                    color: var(--text-secondary);
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: var(--space-xl);
                }

                .feature-card {
                    text-align: center;
                    padding: var(--space-xl);
                    border-radius: var(--radius-lg);
                    background: var(--bg-secondary);
                    transition: all 0.3s ease;
                }

                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }

                .feature-icon {
                    font-size: 3rem;
                    margin-bottom: var(--space-lg);
                }

                .feature-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: var(--space-md);
                    color: var(--text-primary);
                }

                .feature-description {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                .cta {
                    padding: var(--space-3xl) 0;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: var(--text-inverse);
                }

                .cta-content {
                    text-align: center;
                }

                .cta h2 {
                    font-size: 2.5rem;
                    margin-bottom: var(--space-md);
                    color: var(--text-inverse);
                }

                .cta p {
                    font-size: 1.125rem;
                    margin-bottom: var(--space-xl);
                    color: rgba(255, 255, 255, 0.9);
                }

                .landing-footer {
                    padding: var(--space-xl) 0;
                    background-color: var(--gray-900);
                    color: var(--text-inverse);
                }

                .footer-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }

                .footer-logo .logo-text {
                    color: var(--text-inverse);
                }

                .footer-text {
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .header-content {
                        flex-direction: column;
                        gap: var(--space-lg);
                    }

                    .hero-content {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: var(--space-xl);
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .hero-actions {
                        flex-direction: column;
                        align-items: center;
                    }

                    .features-grid {
                        grid-template-columns: 1fr;
                    }

                    .footer-content {
                        flex-direction: column;
                        gap: var(--space-md);
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default Landing; 