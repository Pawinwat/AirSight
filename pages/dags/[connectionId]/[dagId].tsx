import React from 'react';
import { GetServerSideProps } from 'next';
import { getDagDetails, getDagRuns, getDagSource } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import { AirflowDagRunsResponse, Dag, DagRun } from 'src/types/airflow';
import { InputTextarea } from 'primereact/inputtextarea';
import { Line, Scatter } from 'react-chartjs-2';
import { Chart } from 'primereact/chart';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    TimeScale, // For time-based x-axis
    ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Ensure the adapter is installed
import { AxiosHeaders, AxiosRequestConfig } from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale);

// TypeScript type for chart data points
interface ScatterPoint {
    x: Date; // Execution date as a Date object
    y: number; // Run time in seconds
}

interface SingleDagPageServerProps {
    dag: Dag;
    runs: DagRun[];
    dagSource: string;
}

export const getServerSideProps: GetServerSideProps<SingleDagPageServerProps> = async ({ params, query }) => {
    const { connectionId, dagId } = params as { connectionId: string; dagId: string };
    const limit = parseInt((query.limit as string) || '20', 20);
    const offset = parseInt((query.offset as string) || '0', 0);

    const connections = await prisma.connection.findMany({
        where: { is_active: true },
    });

    const connection = connections?.find((rec) => rec.connection_id === connectionId);
    if (!connection || !connection.api_url || !connection.header) {
        return { notFound: true };
    }

    const config: AxiosRequestConfig = {
        headers: connection.header as AxiosHeaders,
        params: { limit, offset, order_by: '-execution_date' },
        baseURL: connection.api_url,
    };

    const dagDetailsConfig: AxiosRequestConfig = {
        headers: connection.header as AxiosHeaders,
        baseURL: connection.api_url,
    };

    const runs: AirflowDagRunsResponse = await getDagRuns(config, dagId);
    const dag: Dag = await getDagDetails(dagDetailsConfig, dagId);
    const dagSource: string = await getDagSource(dagDetailsConfig, dag.file_token);
    console.log(runs)
    return {
        props: {
            dag,
            runs: runs?.dag_runs || [],
            dagSource,
        },
    };
};

const SingleDagPage: React.FC<SingleDagPageServerProps> = ({ dag, runs, dagSource }) => {
    // Map status to colors
    const statusColors: Record<string, string> = {
        success: 'rgba(75, 192, 75, 1)', // Green
        failed: 'rgba(192, 75, 75, 1)', // Red
        running: 'rgba(75, 75, 192, 1)', // Blue
        queued: 'rgba(192, 192, 75, 1)', // Yellow
        default: 'rgba(128, 128, 128, 1)', // Gray
    };

    // Prepare data for the scatter plot
    const scatterData = runs
        .filter((run) => run.start_date && run.end_date) // Ensure dates exist
        .map((run) => {
            const startDate = new Date(run.start_date as string).getTime();
            const endDate = new Date(run.end_date as string).getTime();
            const executionDate = new Date(run.execution_date); // X-axis value
            const runTime = (endDate - startDate) / 1000; // Y-axis value in seconds
            const statusColor = statusColors[run.state] || statusColors.default; // Use color based on status
            return { x: executionDate, y: runTime, backgroundColor: statusColor };
        });

    // Chart.js data format
    const chartData = {
        datasets: [
            {
                label: 'Run Time vs Execution Date',
                data: scatterData,
                pointBackgroundColor: scatterData.map((point) => point.backgroundColor), // Assign colors dynamically
                pointRadius: 5,
            },
        ],
    };

    // Chart.js options
    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'DAG Run Times',
            },
        },
        scales: {
            x: {
                type: 'time', // Time-based x-axis
                time: {
                    unit: 'day',
                },
                title: {
                    display: true,
                    text: 'Execution Date',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Run Time (seconds)',
                },
            },
        },
    };

    return (
        <div className="p-m-4">
            <h1 className="p-text-center">DAG Details: {dag.dag_id}</h1>

            <div className="p-card">
                <h2 className="p-card-header">DAG Metadata</h2>
                <div className="p-card-body">
                    <p>
                        <strong>Owner:</strong> {dag.owners}
                    </p>
                    <p>
                        <strong>Description:</strong> {dag.description || 'N/A'}
                    </p>
                    <p>
                        <strong>Schedule:</strong> {dag.schedule_interval?.value || 'N/A'}
                    </p>
                </div>
            </div>

            <div className="p-card p-mt-4">
                <h2 className="p-card-header">DAG Runs Execution Times</h2>
                <Chart type="line" style={{ height: '30vh', width: '100%' }} data={chartData} options={chartOptions} />
            </div>

            <InputTextarea
                variant="filled"
                value={dagSource}
                cols={30}
                rows={20}
                style={{
                    width: '100%',
                }}
            />
        </div>
    );
};


export default SingleDagPage;
