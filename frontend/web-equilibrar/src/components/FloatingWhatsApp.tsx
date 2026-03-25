import React from 'react';
import { useLocation } from 'react-router-dom';

const FloatingWhatsApp: React.FC = () => {
    const location = useLocation();

    const getMessage = (pathname: string) => {
        switch (pathname) {
            case '/':
                return 'Hola, quiero más información sobre el Centro Clínico Equilibrar.';
            case '/rfai':
                return 'Hola, quiero más información sobre el modelo RFAI.';
            case '/test-rfai':
                return 'Hola, me gustaría saber sobre el Test RFAI y cómo funciona.';
            case '/psiquiatria':
                return 'Hola, quiero agendar o consultar sobre el servicio de Psiquiatría.';
            case '/psicologia':
                return 'Hola, quiero agendar o consultar sobre el servicio de Psicología.';
            case '/programa-angustia':
                return 'Hola, quiero saber más sobre el Programa de Angustia.';
            case '/programa-culpa':
                return 'Hola, quiero saber más sobre el Programa de Culpa.';
            case '/programa-irritabilidad':
                return 'Hola, quiero saber más sobre el Programa de Irritabilidad.';
            case '/autoestima-y-amor-propio':
                return 'Hola, quiero información sobre el audio de Autoestima y Amor propio.';
            default:
                return 'Hola, me gustaría obtener más información.';
        }
    };

    const message = encodeURIComponent(getMessage(location.pathname));
    const whatsappUrl = `https://wa.me/56930179724?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#25D366',
                color: '#FFF',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
                zIndex: 9999,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 211, 102, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.3)';
            }}
            aria-label="Contactar por WhatsApp"
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12.031 0C5.385 0 0 5.385 0 12.031C0 14.676 0.853 17.135 2.296 19.167L0.72 23.367L5.053 21.848C7.039 23.155 9.426 23.951 12.031 23.951C18.677 23.951 24.062 18.566 24.062 11.921C24.062 5.275 18.677 -0.001 12.031 -0.001V0ZM18.497 16.96C18.232 17.712 17.18 18.351 16.357 18.533C15.789 18.663 15.029 18.754 11.838 17.436C7.753 15.753 5.12 11.597 4.909 11.314C4.706 11.042 3.167 9.006 3.167 6.892C3.167 4.778 4.254 3.751 4.675 3.315C4.981 2.997 5.503 2.822 5.969 2.822C6.115 2.822 6.246 2.829 6.362 2.836C6.711 2.851 6.885 2.872 7.118 3.431C7.408 4.128 8.12 5.864 8.207 6.046C8.294 6.22 8.353 6.438 8.236 6.671C8.113 6.896 8.018 7.005 7.844 7.208C7.67 7.412 7.481 7.644 7.321 7.811C7.147 8.007 6.958 8.218 7.176 8.595C7.387 8.966 8.12 10.163 9.194 11.121C10.582 12.359 11.664 12.751 12.071 12.918C12.478 13.085 12.724 13.049 12.986 12.766C13.247 12.483 14.002 11.597 14.293 11.161C14.583 10.726 14.859 10.791 15.222 10.922C15.6 11.053 17.591 12.033 17.983 12.229C18.375 12.425 18.636 12.527 18.724 12.679C18.811 12.832 18.811 13.565 18.497 14.318V16.96Z" />
            </svg>
        </a>
    );
};

export default FloatingWhatsApp;
