import Link from 'next/link';
import { Card } from 'primereact/card';
import { CSSProperties } from 'react';
import { getRunTypeColor, getStatusColor } from 'src/constant/colors';
import { PATH } from 'src/routes';
import { DagRun } from 'src/types/airflow';
import { CARD_GAP } from '../layout/constants';
import { ConnectionData } from 'src/types/db';

const styles: Record<string, CSSProperties> = {
    listItem: {
        // backgroundColor: '#2d2d2d', // Dark background
        // color: '#f1f1f1',            // Light text color for contrast
        // border: '1px solid #444',    // Subtle border
        // padding: '5px',              // Reduced padding for compactness
        // margin: '6px 0',             // Reduced margin
        // borderRadius: '4px',         // Slightly rounded corners
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
        height: '120px'
    },
    dagId: {
        fontSize: '14px',            // Smaller font size for DAG ID
        fontWeight: 'bold',
        marginTop: '20px',
    },
    status: {
        fontSize: '12px',
        // marginBottom: '4px',
    },
    date: {
        fontSize: '12px',
        color: '#aaa',               // Lighter color for dates
        // marginBottom: '2px',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',                  // Reduced gap between items for compactness
    },
};
type TemplateOption = 'list' | 'grid' | (string & Record<string, unknown>)
const DagRunTemplate = (items: DagRun[], _options?: TemplateOption, _onClick?: (_: DagRun) => void, externalProps?: Record<string, ((run:DagRun) =>void)|boolean|string|number|ConnectionData>) => {
    const paddedItems = [
        ...items,
        ...Array(Math.max(0, 5 - (items?.length || 0))).fill(null), // Pad with null values for empty rows
    ];

    const list = paddedItems.map((run, index) => (
        <Card
            className={externalProps?.selected && (externalProps?.selected instanceof Function) && (externalProps)?.selected(run) ? "p-card-item-hover" : "p-card-item"}
            key={index}
            style={styles.listItem}
            onClick={() => {
                // onClick && onClick(run)
            }}
        >
            {run ? (
                <div style={{ display: 'flex', flexDirection: 'row', gap: CARD_GAP, justifyContent: 'space-between', width: "100%" }}>
                    <div>
                        <Link
                            href={PATH.mainDagId((externalProps?.connection as ConnectionData)?.connection_id, run.dag_id)}
                            style={{ textDecoration: 'none', ...styles.dagId }}
                        >
                            {run.dag_id}
                        </Link>
                        <p style={{ ...styles.status, color: getStatusColor(run.state) }}>
                            <strong>Status:</strong> {run.state}
                        </p>
                        <p style={{ ...styles.status, color: getRunTypeColor(run.run_type) }}>
                            <strong>Run Type:</strong> {run.run_type}
                        </p>
                    </div>
                    <div>
                        <p style={styles.date}>
                            <strong>Execution:</strong> {new Date(run.execution_date).toLocaleString()}
                        </p>
                        {run.start_date && (
                            <p style={styles.date}>
                                <strong>Start:</strong> {new Date(run.start_date).toLocaleString()}
                            </p>
                        )}
                        {run.end_date && (
                            <p style={styles.date}>
                                <strong>End:</strong> {new Date(run.end_date).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'gray', height: '110px' }}>

                </div>
            )}
        </Card>
    ));

    return <div style={styles.listContainer}>{list}</div>;
};




export default DagRunTemplate