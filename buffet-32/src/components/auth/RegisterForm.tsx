// components/auth/RegisterForm.tsx
import React, { useState } from 'react';

// Definición de las props para el componente RegisterForm
interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin: () => void;
  onContinueWithoutLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin, onContinueWithoutLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    console.log('Registrarse:', { email, password });
    // Aquí iría la lógica de registro real
    // const response = await fetch('/api/register', { method: 'POST', body: JSON.stringify({ email, password }) });
    // if (response.ok) {
    //   onRegisterSuccess?.();
    // } else {
    //   alert('Error al registrarse');
    // }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Registro</h2>
      <div style={{ marginBottom: '20px' }}>
        <img src="/logo-et32.png" alt="Logo ET32" width={80} height={80} style={{ borderRadius: '50%' }} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email-register" style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Mail:</label>
          <input
            type="email"
            id="email-register"
            placeholder="Mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div>
          <label htmlFor="password-register" style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Contraseña:</label>
          <input
            type="password"
            id="password-register"
            placeholder="Contraseña"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-password-register" style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontSize: '14px', color: '#555' }}>Confirmar contraseña:</label>
          <input
            type="password"
            id="confirm-password-register"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#FFD700',
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
          Registrarse
        </button>
      </form>
      <div style={{ margin: '20px 0', color: '#888' }}>O</div>
      <button
        onClick={() => console.log('Sign up with Google')}
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
        <img src="/google-logo.png" alt="Google Logo" width={20} height={20} />
        Sign up with Google
      </button>
      <button
        onClick={onContinueWithoutLogin}
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
      <button
        onClick={onSwitchToLogin}
        style={{
          marginTop: '10px',
          backgroundColor: 'transparent',
          color: '#007bff',
          border: 'none',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        ¿Ya tienes cuenta? Inicia Sesión
      </button>
    </div>
  );
};

export default RegisterForm;