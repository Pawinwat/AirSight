import { AxiosHeaders, AxiosRequestConfig } from "axios";
import { motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { Card } from "primereact/card";
import { DataView } from 'primereact/dataview';
import { getDagRuns } from "src/api/airflow";
import DagRunTemplate from "src/components/dag/DagRunTemplate";
import prisma from "src/lib/prisma";
import { pageVariants } from "src/transitions";
import { AirflowDagRunsResponse, DagRun } from "src/types/airflow";

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
      <DataView value={dag_runs} listTemplate={DagRunTemplate} paginator rows={5} />

    </Card>
  </motion.div>
}