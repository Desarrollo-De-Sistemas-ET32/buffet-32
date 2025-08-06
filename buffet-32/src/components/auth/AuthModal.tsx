// src/app/components/auth/AuthModal.tsx
import React from 'react';
import LoginForm from './LoginForm'; // Importar desde la misma carpeta 'auth'

// Definición de las props para el componente AuthModal
interface AuthModalProps {
  isVisible: boolean; // Para controlar si el modal se muestra
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isVisible, onClose, onLoginSuccess }) => {
  if (!isVisible) {
    return null; // No renderiza nada si no es visible
  }

  // Permite cerrar el modal al hacer clic fuera del contenido del formulario
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Si el clic es directamente en el overlay (no en el contenido del modal), cierra el modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscurecido
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // Asegura que esté por encima de otros elementos
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: 'transparent', // El modal en sí no tiene fondo, solo el contenido del formulario
          borderRadius: '16px',
          maxWidth: '400px',
          width: '90%', // Adaptable a diferentes tamaños de pantalla
          position: 'relative',
          boxShadow: 'none', // La sombra la tiene el LoginForm interno
        }}
        // No añadir onClick aquí para evitar que se propague al overlay y cierre el modal
      >
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          onClose={onClose} // Pasa onClose al LoginForm para el botón "Continuar sin Registro"
        />
      </div>
    </div>
  );
};

export default AuthModal;