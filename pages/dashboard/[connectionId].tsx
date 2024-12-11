import { AxiosRequestConfig, AxiosHeaders } from "axios";
import { motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { Card } from "primereact/card";
import { getDagRuns, getDags } from "src/api/airflow";
import prisma from "src/lib/prisma";
import { pageVariants } from "src/transitions";
import { AirflowDagRunsResponse, AirflowDagsResponse, Dag, DagRun } from "src/types/airflow";
import { DataView } from 'primereact/dataview';
import { CSSProperties } from "react";
import { getStatusColor, getRunTypeColor } from "src/constant/colors";

interface DashboardServerProps {
  connection: {
    connection_id: string;
    name: string;
    ui_url: string;
    header: string;
  };
  dag_runs: DagRun[];
  total_entries: number;
}



export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const { connectionId } = params as { connectionId: string };
  const limit = parseInt((query.limit as string) || '10', 10); // Default 10 items per page
  const offset = parseInt((query.offset as string) || '0', 10); // Default 0 offset
  const connection = await prisma.connection.findFirst({
    where: {
      connection_id: connectionId,
      is_active: true,
    },
  });

  if (!connection || !connection.api_url || !connection.header) {
    return { notFound: true };
  }

  const config: AxiosRequestConfig = {
    headers: connection.header as AxiosHeaders, // Ensure headers are parsed correctly if stored as JSON
    params: {
      limit,
      offset,
      order_by:'-execution_date'
    },
    baseURL: connection.api_url,
  };
  const data: AirflowDagRunsResponse = await getDagRuns(config, '~');
  // console.log(data)
  return {
    props: {
      connection,
      dag_runs: data?.dag_runs || [],
      total_entries: data?.total_entries || 0,
    },
  };
};
const styles: Record<string, CSSProperties> = {
  listItem: {
    backgroundColor: '#2d2d2d', // Dark background
    color: '#f1f1f1',            // Light text color for contrast
    border: '1px solid #444',    // Subtle border
    padding: '8px',              // Reduced padding for compactness
    margin: '6px 0',             // Reduced margin
    borderRadius: '4px',         // Slightly rounded corners
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  dagId: {
    fontSize: '14px',            // Smaller font size for DAG ID
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  status: {
    fontSize: '12px',
    marginBottom: '4px',
  },
  date: {
    fontSize: '12px',
    color: '#aaa',               // Lighter color for dates
    marginBottom: '2px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',                  // Reduced gap between items for compactness
  },
};


const listTemplate = (items: DagRun[]) => {
  if (!items || items.length === 0) return <p>No DAG runs available.</p>;

  let list = items.map((run, index) => (
    <Card className="p-card-item" key={index} style={styles.listItem}>
      <div>
        <h4 style={styles.dagId}>{run.dag_id}</h4>
        <p style={{ ...styles.status, color: getStatusColor(run.state) }}>
          <strong>Status:</strong> {run.state}
        </p>
        <p style={{ ...styles.status, color: getRunTypeColor(run.run_type) }}>
          <strong>Run Type:</strong> {run.run_type}
        </p>
      </div>
      <div>

        <p style={styles.date}><strong>Execution:</strong> {new Date(run.execution_date).toLocaleString()}</p>
        {run.start_date && (
          <p style={styles.date}><strong>Start:</strong> {new Date(run.start_date).toLocaleString()}</p>
        )}
        {run.end_date && (
          <p style={styles.date}><strong>End:</strong> {new Date(run.end_date).toLocaleString()}</p>
        )}
      </div>

    </Card>
  ));

  return <div  style={styles.listContainer}>{list}</div>;
};



export default function DashboardPage({ connection, dag_runs, total_entries }: DashboardServerProps) {
  return <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.5 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', }}>
      <h1>{connection.name}</h1>
      <p>Total Runs: {total_entries}</p>
    </div> <Card>
      <DataView value={dag_runs} listTemplate={listTemplate} paginator rows={5} />

    </Card>
  </motion.div>
}