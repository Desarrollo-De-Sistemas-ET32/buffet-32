// src/app/sign-in/page.tsx
'use client'; // Necesario para usar hooks de React y Clerk

import React, { useState } from 'react';
import Image from 'next/image';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Para redireccionar después del login

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter(); // Inicializa el router

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        console.log('Inicio de sesión exitoso con Clerk:', result);
        router.push('/dashboard'); // Redirige al dashboard después del login
      } else {
        console.log('Proceso de inicio de sesión no completado:', result);
        setError('El proceso de inicio de sesión requiere pasos adicionales.');
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión con Clerk:', err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].longMessage || 'Credenciales inválidas.');
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      console.error('Error al iniciar sesión con Google:', err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].longMessage || 'Error al iniciar con Google.');
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Inicia Sesion</h2>
        <div style={{ marginBottom: '20px' }}>
          <Image src="/logo-et32.png" alt="Logo ET32" width={80} height={80} style={{ borderRadius: '50%' }} />
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
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
              disabled={loading || !isLoaded}
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
            {loading ? 'Iniciando...' : 'Login'}
          </button>
        </form>
        <div style={{ margin: '20px 0', color: '#888' }}>O</div>
        <button
          onClick={handleGoogleSignIn}
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
          Sign in with Google
        </button>
        {/* No hay botón "Continuar sin registro" porque es una página dedicada de login */}
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
          ¿No tienes cuenta?{' '}
          <a href="/sign-up" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}