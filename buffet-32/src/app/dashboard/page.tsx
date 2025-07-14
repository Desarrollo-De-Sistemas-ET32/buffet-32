// src/app/dashboard/page.tsx
'use client'; // Necesario para usar useState y otros hooks de cliente en Next.js App Router

import React, { useState } from 'react';
import Head from 'next/head'; // Todavía puedes usar Head en page.tsx para metadatos del documento
import Image from 'next/image';
import AuthModal from '../../components/auth/AuthModal'; // Ruta de importación actualizada

const DashboardPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Estado simulado de autenticación

  const handleOpenLoginModal = (): void => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = (): void => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = (): void => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    alert('¡Inicio de sesión exitoso! Bienvenido.');
    // Aquí podrías redirigir al usuario o actualizar la UI
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f5' }}>
      {/* Head se puede usar directamente en los componentes page.tsx en el App Router para metadatos */}
      <Head>
        <title>Carrito de Compra - Buffet-ET32</title>
        <meta name="description" content="Carrito de compra del buffet del colegio ET32" />
        {/* <link rel="icon" href="/favicon.ico" /> // favicon.ico ya está en app/dashboard/favicon.ico */}
      </Head>

      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: 'white',
        borderBottom: '1px solid #eee',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}>
        <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#555' }}>
          &larr; {/* Flecha de retroceso */}
        </button>
        <h1 style={{ flexGrow: 1, textAlign: 'center', fontSize: '20px', fontWeight: '600', color: '#333' }}>
          Carrito de Compra
        </h1>
        <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#555' }}>
          {/* Un ícono de carrito de compras */}
          <Image src="/cart-icon.png" alt="Cart" width={24} height={24} /> {/* Asegúrate de que esta imagen exista en public/cart-icon.png */}
        </button>
      </header>

      <main style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Contenido del Carrito de Compra (ejemplo simplificado) */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '90%',
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
            Tu Carrito está Vacío
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            Agrega algunos productos para empezar a comprar.
          </p>
          <button
            onClick={() => alert('Navegar a la página de productos')}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 25px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Explorar Productos
          </button>
        </div>
      </main>

      <footer style={{
        backgroundColor: 'white',
        padding: '16px 20px',
        borderTop: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
      }}>
        <div>
          <span style={{ fontSize: '14px', color: '#555' }}>Total a pagar</span>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>$34</p>
        </div>
        <button
          onClick={handleOpenLoginModal} // Este botón activa el modal de inicio de sesión
          style={{
            backgroundColor: '#FFD700',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(255,215,0,0.3)',
          }}
        >
          Continue to checkout
        </button>
      </footer>

      {/* Renderiza el AuthModal condicionalmente */}
      <AuthModal
        isVisible={showLoginModal}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default DashboardPage;