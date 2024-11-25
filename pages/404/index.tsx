import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

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
        Sorry, the page you're looking for does not exist.
      </p>
      <Button label="Go Home" icon="pi pi-home" onClick={handleGoHome} />
    </div>
  );
};

export default Custom404;
