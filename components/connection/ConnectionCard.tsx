import { motion } from 'framer-motion';
import router from 'next/router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useDagRuns24Hours } from 'src/api/local/airflow/hooks';
import { PATH } from 'src/routes';
import { InstanceStatus } from 'src/types/airflow';
import { ConnectionCardData } from '../../types/main-page';
import DagRunEye from '../dag/DagRunEye';
import DagRunStat from '../dag/DagRunStat';
import StatusChip from './StatusChip';
import { cardStyle } from './style';
interface ConnectionCardProps {
    data: ConnectionCardData;
    isVertical: boolean;
}

function ConnectionCard({ data, isVertical }: ConnectionCardProps) {
    const runParams = {
        offset: 0,
        limit: 100,
        order_by: '-execution_date',
    };
    // console.log(roundToNearestMinutes(new Date(),{nearestTo:5}))
    const dagRuns = useDagRuns24Hours(
        { params: runParams },
        data?.connection_id as string,
        `~`
    );
    const runStat = dagRuns?.data?.dag_runs?.reduce((acc, run) => {
        acc[run.state] = (acc[run.state] || 0) + 1; // Increment the count for the state
        return acc;
    }, {} as Record<string, number>);


    const openInNewTab = (url?: string | null) => {
        if (!url) return;
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const openDashboard = (connectionId?: string) => {
        const targetUrl = PATH.connectionId(connectionId as string)
        router.push(targetUrl);
    };

    const handleConfigClick = (connectionId: string) => {
        router.push(PATH.config(connectionId));
    };


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
                title={<div
                    style={{
                        display: 'flex',
                        gap: 5,
                        flexDirection: 'row',
                        //   justifyContent:'center',
                        alignItems: 'center'
                    }}
                >
                    <div>
                        {data.name}
                    </div>
                    <div>
                        {data?.version?.version}
                    </div>
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

                </div>}
                style={{
                    ...(isVertical
                        ? { width: '95vw', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', alignItems: 'center' }
                        : { width: cardStyle.manage.size, aspectRatio: '1/1' }),
                    position: 'relative',
                    transition: 'transform 0.3s ease',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                className="p-card-hover"
                onClick={() => openDashboard(data.connection_id)}
            //                 footer={
            // <Button icon="pi pi-heart" rounded outlined severity="help" aria-label="Favorite" />

            //                 }
            >
                <div style={{ display:'flex', gap: 5, flexDirection: 'column', justifyContent: 'center',alignItems:'center' }}>
                    <DagRunEye data={dagRuns?.data?.dag_runs || []} />
                    <DagRunStat data={runStat} />

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
