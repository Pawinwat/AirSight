import { GetServerSideProps } from 'next';
import { Chart } from 'primereact/chart';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';
import { getDagDetails, getDagRuns, getDagSource, getTaskInstances } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import { Dag, DagRun, DagState, TaskInstance } from 'src/types/airflow';

import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import {
    CategoryScale,
    Chart as ChartJS, // For time-based x-axis
    ChartOptions,
    Legend,
    LinearScale,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Ensure the adapter is installed
import Link from 'next/link';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { MenuItem } from 'primereact/menuitem';
import { Tag } from 'primereact/tag';
import Breadcrumbs from 'src/components/breadcrumb/Breadcrumbs';
import DagRunTemplate from 'src/components/dag/DagRunTemplate';
import PageFrame from 'src/components/layout/PageFrame';
import { PATH } from 'src/routes';
import { ConnectionData } from 'src/types/db';
import { getStatusColor } from 'src/constant/colors';
import { CARD_GAP } from 'src/components/layout/constants';
import { getBaseRequestConfig } from 'src/utils/request';
import { useTaskInstances } from 'src/api/local/airflow/hooks';
import { Accordion, AccordionTab } from 'primereact/accordion';
import TaskLog from 'src/components/dag/TaskLog';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale);

// TypeScript type for chart data points
interface ScatterPoint {
    x: Date; // Execution date as a Date object
    y: number; // Run time in seconds
}

interface SingleDagPageServerProps {
    dag: Dag;
    dag_runs: DagRun[];
    dagSource: string;
    connection: ConnectionData;
    tasks: TaskInstance[]
}
type DagIdPageParams = { connectionId: string; dagId: string; runId: string };

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
    const { connectionId, dagId, runId } = params as DagIdPageParams
    const limit = parseInt((query.limit as string) || '25', 25);
    const offset = parseInt((query.offset as string) || '0', 0);

    const connections = await prisma.connection.findMany({
        where: { is_active: true },
    });

    const connection = connections?.find((rec) => rec.connection_id === connectionId);
    if (!connection || !connection.api_url || !connection.header) {
        return { notFound: true };
    }
    const baseConfig = getBaseRequestConfig(connection)
    const config: AxiosRequestConfig = {
        params: { limit, offset, order_by: '-execution_date' },
        ...baseConfig
    };
    const dagDetailsConfig: AxiosRequestConfig = {
        ...baseConfig
    };
    const taskInstancesConfig: AxiosRequestConfig = {
        ...baseConfig
    };
    const taskInStance = runId ? (getTaskInstances(taskInstancesConfig, dagId, runId)) : {}
    const [runs, dag, tasks] = await Promise.all([
        getDagRuns(config, dagId),
        getDagDetails(dagDetailsConfig, dagId),
        taskInStance
    ]);

    const dagSource: string = await getDagSource(dagDetailsConfig, dag.file_token);
    return {
        props: {
            connection,
            dag,
            dag_runs: runs?.dag_runs || [],
            dagSource,
            tasks
        },
    };
};

const SingleDagPage: React.FC<SingleDagPageServerProps> = ({ dag, dag_runs, dagSource, connection }) => {
    // Map status to colors

    // Prepare data for the scatter plot
    const scatterData = dag_runs
        .filter((run) => run.start_date && run.end_date) // Ensure dates exist
        .map((run) => {
            const startDate = new Date(run.start_date as string).getTime();
            const endDate = new Date(run.end_date as string).getTime();
            const executionDate = new Date(run.execution_date); // X-axis value
            const runTime = (endDate - startDate) / 1000; // Y-axis value in seconds
            const statusColor = getStatusColor(run.state); // Use color based on status
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


    const items: MenuItem[] = [
        {
            label: connection.name as string,
            id: connection.connection_id,
            url: PATH.connectionId(connection.connection_id)

        },
        {
            label: dag.dag_id as string,
            id: dag.dag_id,
            template: () => <Link href={PATH.mainDagId(connection.connection_id, dag.dag_id)}>{dag.dag_id}</Link>
        }

    ];
    const [selectedRun, setSelectedRun] = useState<DagRun | null>(null)

    const handleDagRunClick = (run: DagRun) => {
        setSelectedRun(
            (prev) => prev?.dag_run_id == run.dag_run_id ? null : run
        )
    }
    const taskInstance = useTaskInstances(
        {},
        connection?.connection_id,
        selectedRun?.dag_id as string,
        selectedRun?.dag_run_id as string
    )
    const taskInstanceData = taskInstance?.data?.task_instances

    return (
        <PageFrame>
            <Breadcrumbs model={items} />
            <h1 className="p-text-center">DAG Details: {dag.dag_id}</h1>
            <div
                style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: CARD_GAP }}
            >
                <div
                    style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: CARD_GAP }}

                >
                    <Card
                        title='DAG Metadata'

                    >
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
                            <p>
                                <strong>Schedule Description:</strong> {dag.timetable_description || 'N/A'}
                            </p>
                            {
                                dag.tags?.map((t, index) => (
                                    <Tag
                                        key={index}
                                        value={t.name}
                                        style={{ marginRight: '0.5rem', marginBottom: '0.2rem', cursor: 'pointer' }}
                                        className='p-tag-info'
                                    // className={selectedTags.includes(t.name) ? 'p-tag-success' : 'p-tag-info'} // Highlight selected tags
                                    // onClick={() => handleTagClick(t.name)}
                                    />
                                ))}

                        </div>
                    </Card>

                    <Card
                        title='DAG Runs Execution Times'
                    >
                        <Chart type="line" style={{ height: '40vh', width: '100%' }} data={chartData} options={chartOptions} />
                    </Card>
                </div>

                <InputTextarea
                    style={{ flexGrow: 'unset', width: '50%' }}
                    // autoResize 
                    // cols={90}
                    value={dagSource}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    gap: CARD_GAP,
                    marginTop: CARD_GAP,
                }}

            >
                <Card
                    style={{
                        width: '40%'
                    }}
                >
                    <DataView
                        value={dag_runs}
                        listTemplate={(item, option) =>
                            DagRunTemplate(
                                item,
                                option,
                                handleDagRunClick,
                                {
                                    selected: (run: DagRun) => run?.dag_run_id && (run?.dag_run_id == selectedRun?.dag_run_id)
                                })}
                        paginator rows={5}
                    />
                </Card>
                <div
                    style={{
                        width: '60%',
                        height: '100%'
                    }}
                >
            <Accordion
            >

              {
                taskInstanceData?.map(t => (
                  <AccordionTab
                    key={t.dag_run_id}

                    header={
                      <div
                        style={{
                          gap: '20px'
                        }}
                      >
                        <i className={`pi pi-circle-fill`} style={{ fontSize: '1rem', marginRight: '0.5rem', color: getStatusColor(t.state as DagState) }}></i>
                        {t.task_id}
                      </div>}>

                    <TaskLog
                      connection={connection}
                      taskInstance={t}
                    />
                  </AccordionTab>
                ))
              }
            </Accordion>
                </div>
            </div>
        </PageFrame>
    );
};


export default SingleDagPage;
