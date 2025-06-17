import { useEffect, useState } from 'react';

function ToastNotification({ message, type = 'success', duration = 5000, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            setIsExiting(false);

            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose && onClose();
        }, 300);
    };

    if (!message || !isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '🎉';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '✅';
        }
    };

    const getTypeClass = () => {
        switch (type) {
            case 'success':
                return 'toast-success';
            case 'error':
                return 'toast-error';
            case 'warning':
                return 'toast-warning';
            case 'info':
                return 'toast-info';
            default:
                return 'toast-success';
        }
    };

    return (
        <div className={`toast-notification ${getTypeClass()} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
            <div className="toast-content">
                <span className="toast-icon">{getIcon()}</span>
                <span className="toast-message">{message}</span>
                <button 
                    className="toast-close" 
                    onClick={handleClose}
                    aria-label="Fechar notificação"
                >
                    ×
                </button>
            </div>
            
            <style jsx>{`
                .toast-notification {
                    position: fixed;
                    top: 80px; /* Abaixo da navbar */
                    right: 20px;
                    z-index: 1000;
                    max-width: 400px;
                    min-width: 300px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    overflow: hidden;
                    transform: translateX(100%);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .toast-enter {
                    transform: translateX(0);
                    opacity: 1;
                }

                .toast-exit {
                    transform: translateX(100%);
                    opacity: 0;
                }

                .toast-success {
                    background: linear-gradient(135deg, 
                        rgba(34, 197, 94, 0.95), 
                        rgba(22, 163, 74, 0.95)
                    );
                    color: white;
                }

                .toast-error {
                    background: linear-gradient(135deg, 
                        rgba(239, 68, 68, 0.95), 
                        rgba(220, 38, 38, 0.95)
                    );
                    color: white;
                }

                .toast-warning {
                    background: linear-gradient(135deg, 
                        rgba(245, 158, 11, 0.95), 
                        rgba(217, 119, 6, 0.95)
                    );
                    color: white;
                }

                .toast-info {
                    background: linear-gradient(135deg, 
                        rgba(59, 130, 246, 0.95), 
                        rgba(37, 99, 235, 0.95)
                    );
                    color: white;
                }

                .toast-content {
                    display: flex;
                    align-items: center;
                    padding: var(--space-lg);
                    gap: var(--space-md);
                }

                .toast-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .toast-message {
                    flex: 1;
                    font-weight: 500;
                    font-size: 0.95rem;
                    line-height: 1.4;
                }

                .toast-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0.8;
                    transition: opacity 0.2s ease;
                    flex-shrink: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                .toast-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Animação de progresso */
                .toast-notification::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.3);
                    animation: progress ${duration}ms linear;
                }

                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                /* Responsivo */
                @media (max-width: 768px) {
                    .toast-notification {
                        top: 70px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                        min-width: auto;
                    }

                    .toast-content {
                        padding: var(--space-md);
                    }

                    .toast-message {
                        font-size: 0.9rem;
                    }
                }

                /* Múltiplos toasts */
                .toast-notification:nth-child(2) {
                    top: 160px;
                }

                .toast-notification:nth-child(3) {
                    top: 240px;
                }

                .toast-notification:nth-child(4) {
                    top: 320px;
                }
            `}</style>
        </div>
    );
}

export default ToastNotification; 