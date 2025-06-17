import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        if (!email || !password) {
            setError("Por favor, preencha todos os campos");
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data);
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="logo">
                            <span className="logo-icon">💪</span>
                            <span className="logo-text">CheckFit</span>
                        </div>
                        <h1>Bem-vindo de volta!</h1>
                        <p>Entre na sua conta para continuar sua jornada fitness</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            disabled={isLoading}
                            style={{ width: '100%' }}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p>
                            Não tem uma conta?{" "}
                            <Link to="/auth/register" className="auth-link">
                                Cadastre-se aqui
                            </Link>
                        </p>
                        <Link to="/" className="auth-link-back">
                            ← Voltar ao início
                        </Link>
                    </div>
                </div>

                {/* Visual Side */}
                <div className="auth-visual">
                    <div className="visual-content">
                        <div className="visual-card">
                            <div className="visual-icon">🎯</div>
                            <h3>Seus objetivos te esperam!</h3>
                            <p>Entre e continue sua jornada para uma vida mais saudável</p>
                        </div>
                        <div className="visual-stats">
                            <div className="stat">
                                <div className="stat-number">10k+</div>
                                <div className="stat-label">Usuários Ativos</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50k+</div>
                                <div className="stat-label">Check-ins Realizados</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-lg);
                }

                .auth-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    max-width: 1000px;
                    width: 100%;
                    background: var(--bg-primary);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-xl);
                    overflow: hidden;
                }

                .auth-card {
                    padding: var(--space-3xl);
                    display: flex;
                    flex-direction: column;
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: var(--space-2xl);
                }

                .logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-sm);
                    margin-bottom: var(--space-lg);
                }

                .logo-icon {
                    font-size: 2rem;
                }

                .logo-text {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                }

                .auth-header h1 {
                    font-size: 2rem;
                    margin-bottom: var(--space-sm);
                    color: var(--text-primary);
                }

                .auth-header p {
                    color: var(--text-secondary);
                    margin-bottom: 0;
                }

                .auth-form {
                    flex: 1;
                }

                .alert {
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-lg);
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .alert-error {
                    background-color: var(--error);
                    color: var(--text-inverse);
                }

                .auth-footer {
                    text-align: center;
                    margin-top: var(--space-xl);
                    padding-top: var(--space-xl);
                    border-top: 1px solid var(--gray-200);
                }

                .auth-footer p {
                    margin-bottom: var(--space-md);
                    color: var(--text-secondary);
                }

                .auth-link {
                    color: var(--primary);
                    font-weight: 500;
                    text-decoration: none;
                }

                .auth-link:hover {
                    color: var(--primary-dark);
                }

                .auth-link-back {
                    color: var(--text-tertiary);
                    font-size: 0.875rem;
                    text-decoration: none;
                }

                .auth-link-back:hover {
                    color: var(--text-secondary);
                }

                .auth-visual {
                    background: linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%);
                    padding: var(--space-3xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-inverse);
                }

                .visual-content {
                    text-align: center;
                }

                .visual-card {
                    background: rgba(255, 255, 255, 0.1);
                    padding: var(--space-2xl);
                    border-radius: var(--radius-lg);
                    backdrop-filter: blur(10px);
                    margin-bottom: var(--space-xl);
                }

                .visual-icon {
                    font-size: 4rem;
                    margin-bottom: var(--space-lg);
                }

                .visual-card h3 {
                    font-size: 1.5rem;
                    margin-bottom: var(--space-md);
                    color: var(--text-inverse);
                }

                .visual-card p {
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 0;
                }

                .visual-stats {
                    display: flex;
                    gap: var(--space-xl);
                    justify-content: center;
                }

                .stat {
                    text-align: center;
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

                @media (max-width: 768px) {
                    .auth-container {
                        grid-template-columns: 1fr;
                        max-width: 400px;
                    }

                    .auth-visual {
                        order: -1;
                        padding: var(--space-xl);
                    }

                    .auth-card {
                        padding: var(--space-xl);
                    }

                    .visual-stats {
                        flex-direction: column;
                        gap: var(--space-md);
                    }
                }
            `}</style>
        </div>
    );
}

export default Login;
