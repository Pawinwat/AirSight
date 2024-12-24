import { GetServerSideProps } from 'next';
import { Chart } from 'primereact/chart';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { getDagDetails, getDagSource } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import { Dag, DagRun, TaskInstance } from 'src/types/airflow';

import { AxiosRequestConfig } from 'axios';
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
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { MenuItem } from 'primereact/menuitem';
import { Tag } from 'primereact/tag';
import { useDagRuns } from 'src/api/local/airflow/hooks';
import Breadcrumbs from 'src/components/breadcrumb/Breadcrumbs';
import PipelineEye from 'src/components/connection/PipelineEye';
import DagRunList from 'src/components/dag/DagRunList';
import RunDagButton from 'src/components/dag/RunDagButton';
import { CARD_GAP } from 'src/components/layout/constants';
import PageFrame from 'src/components/layout/PageFrame';
import TaskInstanceView from 'src/components/task/TaskInstanceView';
import { getStatusColor } from 'src/constant/colors';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';
import { PATH } from 'src/routes';
import { ConnectionData } from 'src/types/db';
import { getBaseRequestConfig } from 'src/utils/request';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale);

// TypeScript type for chart data points


interface SingleDagPageServerProps {
    dag: Dag;
    dag_runs: DagRun[];
    dagSource: string;
    connection: ConnectionData;
    tasks: TaskInstance[]
}
type DagIdPageParams = { connectionId: string; dagId: string; runId: string };

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { connectionId, dagId } = params as DagIdPageParams


    const connections = await prisma.connection.findMany({
        where: { is_active: true },
    });

    const connection = connections?.find((rec) => rec.connection_id === connectionId);
    if (!connection || !connection.api_url || !connection.header) {
        return { notFound: true };
    }
    const baseConfig = getBaseRequestConfig(connection)

    const dagDetailsConfig: AxiosRequestConfig = {
        ...baseConfig
    };

    const [ dag] = await Promise.all([
        getDagDetails(dagDetailsConfig, dagId),
        
    ]);

    const dagSource: string = await getDagSource(dagDetailsConfig, dag.file_token);
    return {
        props: {
            connection,
            dag,
            dagSource
            
        },
    };
};

const SingleDagPage: React.FC<SingleDagPageServerProps> = ({ dag,  dagSource }) => {
    const { connection } = useDagRunsContext()
    const router = useRouter();
    const { query } = router;
    const dagId = query.dagId || `~`
    const connectionId = query.connectionId as string
    const limit = parseInt((query.limit as string) || '25', 25);
    const offset = parseInt((query.offset as string) || '0', 0);
    const runParams = {
        offset,
        limit,
        order_by: '-execution_date',
    };
    const dagRuns = useDagRuns({
        params: runParams
    },
        connectionId as string,
        dagId as string
    )
    // const dags = useDag
    // const tasks = useTaskInstances(
    //     {params:{}},
    //     connectionId as string,
    //     dagId as string,
    //     selectedRun?.dag_run_id  as string
    // )
    // Map status to colors
    // Prepare data for the scatter plot
    const scatterData = dagRuns?.data?.dag_runs
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
                pointBackgroundColor: scatterData?.map((point) => point.backgroundColor), // Assign colors dynamically
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
            label: connection?.name as string,
            id: connection?.connection_id,
            url: PATH.connectionId(connection?.connection_id as string)

        },
        {
            label: dag.dag_id as string,
            id: dag.dag_id,
            template: () => <Link href={PATH.mainDagId(connection?.connection_id as string, dag.dag_id)}>{dag.dag_id}</Link>
        }

    ];



    return (
        <PageFrame>
            <Breadcrumbs model={items} />
            <div
                title='Run Now'
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '20px',
                    // justifyContent:'space-between'
                }}
            >
                <h1 className="p-text-center">DAG Details: {dag.dag_id}</h1>
                <RunDagButton dagId={dag.dag_id} />
            </div>

            <div
                style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: CARD_GAP }}
            >
                <div
                    style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: CARD_GAP }}

                >
                    <Card
                        title='DAG Metadata'

                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
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
                            <PipelineEye
                                style={{
                                    height: '180px', width: '250px'
                                }}
                            />
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
                    // maxHeight:'80vh'
                }}

            >
                <Card
                    style={{
                        width: '40%'
                    }}
                >
                    <DagRunList
                        connection={connection as ConnectionData}
                    />
                </Card>
                <div
                    style={{
                        width: '60%',
                        height: '100%',
                        maxHeight: '80vh',

                        // overflowY:'scroll'
                    }}
                >
                    <TaskInstanceView />
                </div>
            </div>
        </PageFrame>
    );
};


export default SingleDagPage;
