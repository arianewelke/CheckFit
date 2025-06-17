import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        cpf: "",
        phone: "",
        dateBirth: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.cpf || !formData.phone || !formData.dateBirth || !formData.password || !formData.confirmPassword) {
            setError("Por favor, preencha todos os campos");
            return false;
        }
        
        if (formData.password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres. Letras e números");
            return false;
        }

        if (formData.cpf.length < 11) {
            setError("O CPF deve ter 11 dígitos");
            return false;
        }

        if (formData.phone.length < 11) {
            setError("O número de telefone deve ter 11 dígitos");
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                cpf: formData.cpf,
                phone: formData.phone,
                dateBirth: formData.dateBirth,
                password: formData.password
            });
            
            // Auto-login após registro bem-sucedido
            localStorage.setItem("token", response.data);
            navigate("/home");
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.response?.data?.message || "Erro ao criar conta. Tente novamente.");
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
                        <h1>Crie sua conta</h1>
                        <p>Junte-se à nossa comunidade fitness e comece sua jornada</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="Seu nome completo"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cpf" className="form-label">
                                CPF
                            </label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                className="form-input"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                                maxLength={11}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Número de telefone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="form-input"
                                placeholder="00 00000-0000"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                                maxLength={11}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateBirth" className="form-label">
                                Data de Nascimento
                            </label>
                            <input
                                type="date"
                                id="dateBirth"
                                name="dateBirth"
                                className="form-input"
                                value={formData.dateBirth}
                                onChange={handleChange}
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
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                            <small className="form-help">Mínimo de 6 caracteres com letras e números</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                                    Criando conta...
                                </>
                            ) : (
                                "Criar Conta"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p>
                            Já tem uma conta?{" "}
                            <Link to="/auth/login" className="auth-link">
                                Entre aqui
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
                            <div className="visual-icon">🚀</div>
                            <h3>Comece sua jornada hoje!</h3>
                            <p>Transforme seus hábitos e alcance seus objetivos fitness</p>
                        </div>
                        <div className="benefits-list">
                            <div className="benefit">
                                <span className="benefit-icon">✅</span>
                                <span>Check-in fácil e rápido</span>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">📊</span>
                                <span>Acompanhe seu progresso</span>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">🎯</span>
                                <span>Alcance seus objetivos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%);
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
                    padding: var(--space-2xl);
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: var(--space-xl);
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
                    color: var(--secondary);
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

                .form-help {
                    display: block;
                    margin-top: var(--space-xs);
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
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
                    margin-top: var(--space-lg);
                    padding-top: var(--space-lg);
                    border-top: 1px solid var(--gray-200);
                }

                .auth-footer p {
                    margin-bottom: var(--space-md);
                    color: var(--text-secondary);
                }

                .auth-link {
                    color: var(--secondary);
                    font-weight: 500;
                    text-decoration: none;
                }

                .auth-link:hover {
                    color: var(--secondary-dark);
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
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
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

                .benefits-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }

                .benefit {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.9);
                }

                .benefit-icon {
                    font-size: 1rem;
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
                        max-height: none;
                    }

                    .benefits-list {
                        gap: var(--space-sm);
                    }

                    .visual-card {
                        margin-bottom: var(--space-lg);
                    }
                }
            `}</style>
        </div>
    );
}

export default Register;
