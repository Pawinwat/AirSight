import { Chart } from 'primereact/chart';
import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';
import { Dag, DagRun, TaskInstance } from 'src/types/airflow';

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
import { useDagDetails, useDagSources } from 'src/api/local/airflow/hooks';
import Breadcrumbs from 'src/components/breadcrumb/Breadcrumbs';
import DagRunEye from 'src/components/dag/DagRunEye';
import DagRunList from 'src/components/dag/DagRunList';
import RunDagButton from 'src/components/dag/RunDagButton';
import { CARD_GAP } from 'src/components/layout/constants';
import PageFrame from 'src/components/layout/PageFrame';
import TaskInstanceView from 'src/components/task/TaskInstanceView';
import { getStatusColor } from 'src/constant/colors';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';
import { PATH } from 'src/routes';
import { ConnectionData } from 'src/types/db';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, TimeScale);

// TypeScript type for chart data points


interface SingleDagPageServerProps {
    dag: Dag;
    dag_runs: DagRun[];
    dagSource: string;
    connection: ConnectionData;
    tasks: TaskInstance[]
}


const SingleDagPage: React.FC<SingleDagPageServerProps> = () => {
    const { connection, dagRuns } = useDagRunsContext()
    const router = useRouter();
    const { query } = router;
    const dagId = query.dagId
    const connectionId = query.connectionId as string
    const dag = useDagDetails({ params: {} }, connectionId, dagId as string)
    const dagData = dag?.data as Dag
    const dagSource = useDagSources(
        { params: {} },
        connectionId,
        dagId as string,
        dag?.data?.file_token as string
    )
    const limit = parseInt((query.limit as string) || '25', 25);
    const offset = parseInt((query.offset as string) || '0', 0);
    // const runParams = {
    //     offset,
    //     limit,
    //     order_by: '-execution_date',
    // };
    // const dagRuns = useDagRuns({
    //     params: runParams
    // },
    //     connectionId as string,
    //     dagId as string
    // )

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
            label: dag?.data?.dag_id as string,
            id: dagData?.dag_id,
            template: () => <Link href={PATH.mainDagId(connection?.connection_id as string, dagData?.dag_id)}>{dagData?.dag_id}</Link>
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
                <h1 className="p-text-center">DAG Details: {dagData?.dag_id}</h1>
                <RunDagButton dagId={dagData?.dag_id} />
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
                                    <strong>Owner:</strong> {dagData?.owners}
                                </p>
                                <p>
                                    <strong>Description:</strong> {dagData?.description || 'N/A'}
                                </p>
                                <p>
                                    <strong>Schedule:</strong> {dagData?.schedule_interval?.value || 'N/A'}
                                </p>
                                <p>
                                    <strong>Schedule Description:</strong> {dagData?.timetable_description || 'N/A'}
                                </p>
                                {
                                    dagData?.tags?.map((t, index) => (
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
                            <DagRunEye
                                style={{
                                    height: '180px', width: '250px'
                                }}
                                data={dagRuns?.data?.dag_runs || []}
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
                    value={dagSource?.data as string}
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
