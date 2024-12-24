import { motion } from 'framer-motion';
import router from 'next/router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useDagRuns } from 'src/api/local/airflow/hooks';
import RunBar from 'src/components/connection/RunBar';
import { PATH } from 'src/routes';
import { InstanceStatus } from 'src/types/airflow';
import { ConnectionCardData } from '../../../types/main-page';
import StatusChip from './StatusChip';
import PipelineEye from 'src/components/connection/PipelineEye';
interface ConnectionCardProps {
    data: ConnectionCardData;
    isVertical: boolean;
}

function ConnectionCard({ data, isVertical }: ConnectionCardProps) {
    const runParams = {
        offset: 0,
        limit: 1,
        order_by: '-execution_date',
    };

    // const dagRuns = useDagRuns(
    //     { params: runParams },
    //     data?.connection_id as string,
    //     `~`
    // );

    const openInNewTab = (url?: string | null) => {
        if (!url) return;
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const openDashboard = (connectionId?: number | string) => {
        const targetUrl = `/dags${connectionId ? `/${connectionId}` : ''}`;
        router.push(targetUrl);
    };

    const handleConfigClick = (connectionId: string) => {
        router.push(PATH.config(connectionId));
    };

    // Sample data for the bar chart
    // const barChartData = {
    //     labels: ['Success', 'Failed', 'Running', 'Queued'],
    //     datasets: [
    //         {
    //             label: 'DAG Runs',
    //             backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800'],
    //             data: [
    //                 dagRuns?.data?.dag_runs?.filter(run => run.state == 'success')?.length || 0,
    //                 dagRuns?.data?.dag_runs?.filter(run => run.state == 'failed')?.length || 0,
    //                 dagRuns?.data?.dag_runs?.filter(run => run.state == 'running')?.length || 0,
    //                 dagRuns?.data?.dag_runs?.filter(run => run.state == 'queued')?.length || 0,
    //             ],
    //         },
    //     ],
    // };

    // const barChartOptions: ChartOptions = {
    //     indexAxis: 'x', // For vertical bar chart
    //     plugins: {
    //         legend: {
    //             display: true,
    //             position: 'top',
    //         },
    //     },
    //     responsive: true,
    //     scales: {
    //         x: {
    //             beginAtZero: true,
    //         },
    //     },
    // };

    return (
        <motion.div
            key={data.connection_id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                type: 'spring',
                damping: 25,
                stiffness: 200,
            }}
        >
            <Card
                // title={data.name}
                style={{
                    ...(isVertical
                        ? { width: '95vw', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', alignItems: 'center' }
                        : { width: '200px', aspectRatio: '1/1' }),
                    position: 'relative',
                    transition: 'transform 0.3s ease',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                className="p-card-hover"
                onClick={() => openDashboard(data.connection_id)}
            >
                <div style={{ display: 'flex', gap: 5, flexDirection: 'row' }}>
                    <div
                        style={{ display: 'flex', gap: 5, flexDirection: 'column' }}
                    >
                        <>
                            {data.name}
                        </>
                        <div style={{ display: 'flex', gap: 5 }}>

                            {Object.keys(data.status || {})
                                .filter(
                                    (key) =>
                                        !!data.status[key as keyof InstanceStatus]?.status
                                )
                                .map((key) => {
                                    const status =
                                        data.status[key as keyof InstanceStatus];
                                    if (!status) return null;

                                    return (
                                        <StatusChip
                                            key={key}
                                            name={key}
                                            status={{ status: status.status }}
                                        />
                                    );
                                })}
                        </div>
                        <>
                            {data?.version?.version}
                        </>
                    </div>

                    {/* <div style={{}}>
                    <Chart
                        type="bar"
                        data={barChartData}
                        options={barChartOptions}
                        style={{
                            height: '50px'
                        }}
                    />
                </div> */}
                    {
                        isVertical && <PipelineEye />
                    }
                    {!isVertical && (
                        <div className="button-container">
                            <Button
                                onClick={(e) => {
                                    openInNewTab(data.ui_url);
                                    e.stopPropagation();
                                }}
                                icon="pi pi-external-link"
                                outlined
                                size="small"
                                className="settings-button"
                            />
                            <Button
                                onClick={(e) => {
                                    handleConfigClick(data.connection_id);
                                    console.log('handleAddClick');
                                    e.stopPropagation();
                                }}
                                icon="pi pi-cog"
                                outlined
                                size="small"
                                className="settings-button"
                            />
                            <Button
                                icon="pi pi-trash"
                                outlined
                                size="small"
                                severity="danger"
                            />
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

export default ConnectionCard;
