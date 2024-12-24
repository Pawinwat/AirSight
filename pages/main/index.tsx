import { AxiosHeaders } from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence for transitions
import { useRouter } from 'next/router'; // Import the useRouter hook
import { Card } from 'primereact/card';
import React, { useState } from 'react'; // Import useState
import { getInstanceStatus, getVersion } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import ConnectionCard from './components/ConnectionCard';
import { MainPageProps } from '../../types/main-page';
import { PATH } from 'src/routes';
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';

export async function getServerSideProps() {
  // Fetch connections from the database
  const connections = await prisma.connection.findMany({
    where: {
      is_active: true,
    },
    select: {
      connection_id: true,
      name: true,
      ui_url: true,
      api_url: true,
      header: true,
    },
  });
  // Fetch instance status for each connection and append it
  const connectionsWithStatus = await Promise.all(
    connections.map(async (con) => {
      try {
        const status = await getInstanceStatus({
          baseURL: con.api_url as string,
          headers: con.header as AxiosHeaders
        });
        const version = await getVersion({
          baseURL: con.api_url as string,
          headers: con.header as AxiosHeaders
        });
        return { ...con, status, version }; // Append the status to the connection object
      } catch (error) {
        console.error(`Error fetching status for connection ${con.connection_id}:`, error);
        return { ...con, status: 'Error' }; // Handle errors by appending a default error status
      }
    })
  );

  return {
    props: {
      connections: connectionsWithStatus,
    },
  };
}

const MainPage: React.FC<MainPageProps> = ({ connections }: MainPageProps) => {
  const router = useRouter(); // Initialize the useRouter hook
  const [isVertical, setIsVertical] = useState(true); // State to toggle layout direction

  const handleAddClick = (connectionId?: string) => {
    const targetUrl = PATH.config(connectionId as string);
    router.push(targetUrl); // Navigate to the /config page
  };

  const toggleDirection = () => {
    setIsVertical(!isVertical); // Toggle between vertical and horizontal
  };

  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center',
      }}
    >
      <ButtonGroup>
        <Button onClick={toggleDirection} disabled={!isVertical} label="Manage" icon="pi pi-th-large" />
        <Button onClick={toggleDirection} disabled={isVertical} label="Monitoring" icon="pi pi-list" />
      </ButtonGroup>
      {/* <button
        onClick={toggleDirection}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Toggle Layout
      </button> */}
      <div
        style={{
          // padding: '2rem',
          // display: 'flex',
          // flexDirection: 'column',
          // gap: '1.5rem',
          alignItems: isVertical ? 'flex-start' : 'center',
        }}
      >
        <motion.div
          layout // Enable layout animations
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row', // Toggle layout direction
            gap: '1.5rem',
            alignItems: isVertical ? 'center' : 'flex-start',
          }}
          transition={{
            duration: 0.6,
            type: 'spring',
            damping: 25,
            stiffness: 200,
          }}
        >
          <AnimatePresence>
            {connections.map((item) => (
              <motion.div
                key={item.connection_id}
                layout // Enable layout animations for individual items
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{
                  duration: 0.6,
                  type: 'spring',
                  damping: 25,
                  stiffness: 200,
                }}
              >
                <ConnectionCard data={item} isVertical={isVertical} />
              </motion.div>
            ))}

            {/* Add New Connection Card with Centered Icon */}
            <motion.div
              layout // Enable layout animations
              initial={{ opacity: 0, y: 30 }} // Start off a little below
              animate={{ opacity: 1, y: 0 }} // End at its normal position
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: 0.6,
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
            >
              <Card
                style={{
                  ...(isVertical ? {
                    width: '95vw',
                    // aspectRatio: '1/1',
                  } : {
                    width: '200px',
                    aspectRatio: '1/1',
                  }),

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
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default MainPage;
