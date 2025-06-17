import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const isAuthenticated = localStorage.getItem("token");
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    
    const isActive = (path) => location.pathname === path;
    
    if (!isAuthenticated) return null;
    
    const menuItems = [
        { path: "/home", label: "Início", icon: "🏠" },
        { path: "/activity", label: "Atividades", icon: "🏃‍♂️" },
       // { path: "/checkin", label: "Check-in", icon: "✅" },
        { path: "/checkin/history", label: "Histórico", icon: "📋" }
    ];
    
    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <div className="navbar-brand" onClick={() => navigate("/home")}>
                        <span className="logo-icon">💪</span>
                        <span className="logo-text">CheckFit</span>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="navbar-menu-desktop">
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`navbar-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <span className="item-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Sair
                        </button>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        className="navbar-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="navbar-menu-mobile">
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMenuOpen(false);
                                }}
                                className={`navbar-item-mobile ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <span className="item-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-secondary btn-sm"
                            style={{ marginTop: '1rem' }}
                        >
                            Sair
                        </button>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .navbar {
                    background-color: var(--bg-primary);
                    border-bottom: 1px solid var(--gray-200);
                    box-shadow: var(--shadow-sm);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                
                .navbar-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 4rem;
                }
                
                .navbar-brand {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                
                .navbar-brand:hover {
                    transform: scale(1.05);
                }
                
                .logo-icon {
                    font-size: 1.5rem;
                }
                
                .logo-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                
                .navbar-menu-desktop {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                }
                
                .navbar-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-xs);
                    padding: var(--space-sm) var(--space-md);
                    border: none;
                    background: none;
                    border-radius: var(--radius-md);
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .navbar-item:hover, .navbar-item.active {
                    color: var(--primary);
                    background-color: var(--bg-secondary);
                }
                
                .item-icon {
                    font-size: 1rem;
                }
                
                .navbar-toggle {
                    display: none;
                    flex-direction: column;
                    gap: 3px;
                    padding: var(--space-sm);
                    border: none;
                    background: none;
                    cursor: pointer;
                }
                
                .navbar-toggle span {
                    width: 20px;
                    height: 2px;
                    background-color: var(--text-primary);
                    transition: all 0.2s ease;
                }
                
                .navbar-menu-mobile {
                    display: none;
                    flex-direction: column;
                    padding: var(--space-lg);
                    border-top: 1px solid var(--gray-200);
                    background-color: var(--bg-primary);
                }
                
                .navbar-item-mobile {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    width: 100%;
                    padding: var(--space-md);
                    border: none;
                    background: none;
                    border-radius: var(--radius-md);
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                }
                
                .navbar-item-mobile:hover, .navbar-item-mobile.active {
                    color: var(--primary);
                    background-color: var(--bg-secondary);
                }
                
                @media (max-width: 768px) {
                    .navbar-menu-desktop {
                        display: none;
                    }
                    
                    .navbar-toggle {
                        display: flex;
                    }
                    
                    .navbar-menu-mobile {
                        display: flex;
                    }
                }
            `}</style>
        </nav>
    );
}

export default Navbar; 