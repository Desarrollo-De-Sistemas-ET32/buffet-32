// src/app/sign-up/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      // --- CAMBIO AQUÍ: Añadir el casting a 'string' para result.status en la comparación ---
      // Convertimos result.status a string para que TypeScript no restrinja sus valores posibles.
      if ((result.status as string) === 'complete') {
        await setActive({ session: result.createdSessionId });
        console.log('Registro exitoso con Clerk:', result);
        router.push('/dashboard');
      } else if ((result.status as string) === 'needs_email_verification') { // Este error debería desaparecer
        console.log('Registro exitoso, se requiere verificación de correo:', result);
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        console.log('Proceso de registro no completado:', result);
        // Si necesitas manejar otros estados específicos de Clerk aquí, como 'missing_requirements',
        // también deberías usar (result.status as string) para la comparación.
        setError('El proceso de registro requiere pasos adicionales o hay un problema.');
      }
    } catch (err: any) {
      console.error('Error al registrarse con Clerk:', err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].longMessage || 'Ocurrió un error al registrarse.');
      } else {
        setError('Ocurrió un error inesperado al registrarse.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      console.error('Error al registrarse con Google:', err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].longMessage || 'Error al registrarse con Google.');
      } else {
        setError('Ocurrió un error inesperado al registrarse con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Regístrate</h2>
        <div style={{ marginBottom: '20px' }}>
          <Image src="/logo-et32.png" alt="Logo ET32" width={80} height={80} style={{ borderRadius: '50%' }} />
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
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
              disabled={loading || !isLoaded}
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
              disabled={loading || !isLoaded}
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
              disabled={loading || !isLoaded}
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
              cursor: loading || !isLoaded ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              opacity: loading || !isLoaded ? 0.7 : 1,
            }}
            disabled={loading || !isLoaded}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <div style={{ margin: '20px 0', color: '#888' }}>O</div>
        <button
          onClick={handleGoogleSignUp}
          style={{
            backgroundColor: 'white',
            color: '#333',
            border: '1px solid #ddd',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading || !isLoaded ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            opacity: loading || !isLoaded ? 0.7 : 1,
          }}
          disabled={loading || !isLoaded}
        >
          <Image src="/google-logo.png" alt="Google Logo" width={20} height={20} />
          Sign up with Google
        </button>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/sign-in" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Inicia Sesión
          </a>
        </p>
      </div>
    </div>
  );
}