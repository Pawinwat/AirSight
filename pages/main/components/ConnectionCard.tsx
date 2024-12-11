import { motion } from 'framer-motion';
import router from 'next/router';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ConnectionCardData } from '../type';
import StatusChip from './StatusChip';
import { InstanceStatus } from 'src/types/airflow';
interface ConnectionCardProps {
    data: ConnectionCardData
}
function ConnectionCard({ data }: ConnectionCardProps) {
    // const status = useInstanceStatus(data?.api_url as string ,data.header as AxiosHeaders )
    const openInNewTab = (url?: string | null) => {
        if (!url) return;
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const openDashboard = (connectionId?: number | string) => {
        const targetUrl = `/dags${!!connectionId ? `/${connectionId}` : ''}`;
        router.push(targetUrl); // Navigate to the /config page
    };

    return (
        <motion.div
            key={data.connection_id}
            initial={{ opacity: 0, y: 30 }} // Start off a little below
            animate={{ opacity: 1, y: 0 }} // End at its normal position
            transition={{
                duration: 0.6, // Control how long the animation takes
                type: 'spring', // Spring-like animation for more natural feel
                damping: 25, // Helps the animation settle with a bounce
                stiffness: 200, // Controls the stiffness of the spring
            }}
        >
            <Card
                title={data.name}
                style={{
                    width: '200px',
                    aspectRatio: '1/1',
                    position: 'relative',
                    transition: 'transform 0.3s ease',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}
                className="p-card-hover"
                onClick={() => openDashboard(data.connection_id)}
            >
                <div style={{ display: 'flex', gap: 5 }}>
                    {
                        Object.keys(data.status || {})
                            .filter((key) => !!data.status[key as keyof InstanceStatus]?.status) // Ensure the object has a `status` property
                            .map((key) => {
                                const status = data.status[key as keyof InstanceStatus];
                                if (!status) return null; // Skip if the value is undefined

                                return (
                                    <StatusChip
                                        key={key} // Add a unique key for each chip
                                        name={key}
                                        status={{ status: status.status }} // Pass a properly structured object
                                    />
                                )
                            })
                    }
                </div>
                <>
                    {data.version.version}
                </>
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
                            // handleAddClick(data.connection_id);
                            e.stopPropagation();
                        }}
                        icon="pi pi-cog"
                        outlined
                        size="small"
                        className="settings-button"
                    />
                    <Button
                        //   onClick={() => handleAddClick(data.connection_id)}
                        icon="pi pi-trash"
                        outlined
                        size="small"
                        severity="danger"
                    />
                </div>
            </Card>
        </motion.div>
    )
}

export default ConnectionCard