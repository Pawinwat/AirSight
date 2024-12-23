import { AxiosHeaders } from 'axios';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useRouter } from 'next/router'; // Import the useRouter hook
import { Card } from 'primereact/card';
import React from 'react';
import { getInstanceStatus, getVersion } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import ConnectionCard from './components/ConnectionCard';
import { MainPageProps } from '../../types/main-page';
import { PATH } from 'src/routes';

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
        }
        );
        const version = await getVersion({
          baseURL: con.api_url as string,
          headers: con.header as AxiosHeaders
        })
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
  const handleAddClick = (connectionId?:  string) => {
    const targetUrl = PATH.config(connectionId as string)
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
        <ConnectionCard key={item.connection_id} data={item} />
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
