'use server'
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { motion } from 'framer-motion'; // Import Framer Motion
import prisma from 'src/lib/prisma';
import { ConnectionData } from 'src/types/db';

export async function getServerSideProps() {
  const connections = await prisma.connection.findMany({
    where: {
      is_active: true,
    },
    select: {
      connection_id: true,
      name: true,
      ui_url: true,
    },
  });
  return {
    props: {
      connections,
    },
  };
}

interface MainPageProps {
  connections: ConnectionData[];
}

const MainPage: React.FC<MainPageProps> = ({ connections }: MainPageProps) => {
  const router = useRouter(); // Initialize the useRouter hook

  const handleAddClick = (connectionId?: number | string) => {
    const targetUrl = `/config${!!connectionId ? `/${connectionId}` : ''}`;
    router.push(targetUrl); // Navigate to the /config page
  };

  const openInNewTab = (url?: string | null) => {
    if (!url) return;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const openDashboard = (connectionId?: number | string) => {
    const targetUrl = `/dashboard${!!connectionId ? `/${connectionId}` : ''}`;
    router.push(targetUrl); // Navigate to the /config page
  };

  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        justifyContent: 'center',
      }}
    >
      {connections.map((item) => (
        <motion.div
          key={item.connection_id}
          initial={{ opacity: 0, y: 30 }} // Start off a little below
          animate={{ opacity: 1, y: 0 }} // End at its normal position
          transition={{
            duration: 0.6, // Control how long the animation takes
            type: 'spring', // Spring-like animation for more natural feel
            damping: 25, // Helps the animation settle with a bounce
            stiffness: 200, // Controls the stiffness of the spring
          }}
        >
          <Card
            title={item.name}
            style={{
              width: '200px',
              aspectRatio: '1/1',
              position: 'relative',
              transition: 'transform 0.3s ease',
              overflow: 'hidden',
              cursor:'pointer'
            }}
            className="p-card-hover"
            onClick={() => openDashboard(item.connection_id)}
          >
            <div className="button-container">
              <Button
                onClick={(e) => {
                  openInNewTab(item.ui_url);
                  e.stopPropagation();
                }}
                icon="pi pi-external-link"
                outlined
                size="small"
                className="settings-button"
              />
              <Button
                onClick={(e) => {
                  handleAddClick(item.connection_id);
                  e.stopPropagation();
                }}
                icon="pi pi-cog"
                outlined
                size="small"
                className="settings-button"
              />
              <Button
                onClick={() => handleAddClick(item.connection_id)}
                icon="pi pi-trash"
                outlined
                size="small"
                severity="danger"
              />
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Add New Connection Card with Centered Icon */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} // Start off a little below
        animate={{ opacity: 1, y: 0 }} // End at its normal position
        transition={{
          duration: 0.6,
          type: 'spring',
          damping: 25,
          stiffness: 200,
        }}
      >
        <Card
          style={{
            width: '200px',
            aspectRatio: '1/1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => handleAddClick()}
          className="p-card-hover"
        >
          <i
            className="pi pi-plus"
            style={{
              fontSize: '3rem',
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default MainPage;
