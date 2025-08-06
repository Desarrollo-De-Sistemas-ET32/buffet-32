// src/app/components/auth/LoginForm.tsx
import React, { useState } from 'react';

// Definición de las props para el componente LoginForm
interface LoginFormProps {
  onLoginSuccess?: () => void;
  onClose: () => void; // Para cerrar el modal desde el formulario si se decide
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log('Intentando iniciar sesión:', { email, password });
    // Aquí iría la lógica de autenticación real con tu backend
    // Ejemplo ficticio de llamada a API:
    try {
      const response = await fetch('/api/login', { // Asegúrate de que esta sea la ruta correcta de tu API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Inicio de sesión exitoso:', data);
        onLoginSuccess?.(); // Llama a la función de éxito si se proporciona
      } else {
        const errorData = await response.json();
        console.error('Error al iniciar sesión:', errorData);
        alert(`Error al iniciar sesión: ${errorData.message || 'Credenciales inválidas'}`);
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      alert('Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Inicia Sesion</h2>
      <div style={{ marginBottom: '20px' }}>
        {/* Asegúrate de que esta imagen exista en public/logo-et32.png */}
        <img src="/logo-et32.png" alt="Logo ET32" width={80} height={80} style={{ borderRadius: '50%' }} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email-login" style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Mail:</label>
          <input
            type="email"
            id="email-login"
            placeholder="Mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div>
          <label htmlFor="password-login" style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Contraseña:</label>
          <input
            type="password"
            id="password-login"
            placeholder="Contraseña"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#FFD700', // Un tono de amarillo similar al de la imagen
            color: 'white',
            padding: '14px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Login
        </button>
      </form>
      <div style={{ margin: '20px 0', color: '#888' }}>O</div>
      <button
        onClick={() => console.log('Sign in with Google (Not implemented)')}
        style={{
          backgroundColor: 'white',
          color: '#333',
          border: '1px solid #ddd',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%'
        }}
      >
        {/* Asegúrate de que esta imagen exista en public/google-logo.png */}
        <img src="/google-logo.png" alt="Google Logo" width={20} height={20} />
        Sign in with Google
      </button>
      <button
        onClick={onClose} // Cerrar el modal al seleccionar "Continuar sin Registro"
        style={{
          marginTop: '20px',
          backgroundColor: 'transparent',
          color: '#007bff',
          border: 'none',
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}
      >
        Continuar sin Registro
      </button>
      {/* No hay botón de "Regístrate" ya que solo se pidió la vista de login */}
    </div>
  );
};

export default LoginForm;