"use client"
import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import 'primereact/resources/themes/viva-dark/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // PrimeReact core styles
import 'primeicons/primeicons.css'; // PrimeIcons
import '../pages/app.css'
const Custom404: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/'); // Navigate back to the homepage
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.5rem' }}>
        Sorry, the page you&apos;re looking for does not exist.
      </p>
      <Button label="Go Home" icon="pi pi-home" onClick={handleGoHome} outlined/>
    </div>
  );
};

export default Custom404;
