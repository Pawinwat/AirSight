import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import prisma from 'src/lib/prisma';
import { ConnectionData } from 'src/types/db';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useParams, useRouter, redirect } from 'next/navigation';
import { PATH } from 'src/routes';

// Server-side function to fetch connections
export const getServerSideProps: GetServerSideProps = async () => {
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

    return {
        props: {
            connections,
        },
    };
};

interface ConnectionSelectorProps {
    connections: ConnectionData[];
}

function ConnectionSelector({ connections }: ConnectionSelectorProps) {
    const params = useParams()
    const { connectionId } = params as { connectionId: string };
    const [activeTab, setActiveTab] = useState(connections[0]?.connection_id || '');
    const router = useRouter()
    const handleTabClick = (connectionId: string) => {
        setActiveTab(connectionId);
    };

    useEffect(() => {
        setActiveTab(connectionId)
    }, [connectionId])


    return (
        <div className='p-card' style={{ display: 'flex', flexDirection: 'row', gap: 10, padding: 10 }}>
            <Button
                onClick={() => {
                    router.push(PATH.main)
                }}
                icon="pi pi-home"
            //   size="large"
            />
            {connections?.map((conn) => (
                <Button
                    key={conn.connection_id}
                    onClick={() => {
                        router.push(PATH.dagsId(conn.connection_id), { scroll: false })
                    }}
                    style={activeTab === conn.connection_id ? {
                        transform: 'translateY(var(--translate-y)) translateX(var(--translate-x))',
                        boxShadow: 'var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-color)'
                    } : {}}
                >
                    <h5 style={{ margin: 0, padding: '0.2rem' }}>{conn.name}</h5>
                </Button>
            ))}
            <Button
                icon="pi pi-plus"
            />
        </div>
    );
}

export default ConnectionSelector;
