import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { getStatusColor, getStatusIcon, STATE_COLORS } from 'src/constant/colors';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';
import { DagRun, DagState } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';
import DagRunTemplate from './DagRunTemplate';
interface DagRunListProps {
    connection: ConnectionData
}
function DagRunList({ connection }: DagRunListProps) {
    const {
        runData,
        handleDagRunClick,
        selectedRunsTags,
        handleStatusFilterClick,
        runStat,
        dagRuns,
        selectedRun
    } = useDagRunsContext()
    return (
        <DataView
            value={runData}
            listTemplate={(item, option) =>
                DagRunTemplate(
                    item,
                    option,
                    handleDagRunClick,
                    {
                        selected: (run: DagRun) => {
                            return run && !!(run?.dag_run_id == selectedRun?.dag_run_id) && !!(run?.dag_id == selectedRun?.dag_id)
                        },
                        connection
                    })}
            paginator
            rows={5}
            emptyMessage="No run"
            header={
                <div
                    style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}
                >
                    <p>
                        Recent
                    </p>
                    <div
                        style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}
                    >
                        {Object.keys(STATE_COLORS).map((statusKey) => (
                            <Tag
                            icon={getStatusIcon(statusKey as DagState)}
                                key={`tag-${statusKey}`}
                                style={{
                                    backgroundColor: getStatusColor(statusKey as DagState),
                                    cursor: 'pointer',
                                    transform: selectedRunsTags.includes(statusKey)
                                        ? 'translateY(var(--translate-y)) translateX(var(--translate-x))'
                                        : 'none',
                                    boxShadow: selectedRunsTags.includes(statusKey)
                                        ? 'var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-color)'
                                        : 'none',
                                }}
                                onClick={() => handleStatusFilterClick(statusKey)}
                            >
                                {statusKey}{`(${runStat?.[statusKey] || 0})`}
                            </Tag>
                        ))}
                    </div>
                    <Button
                        icon={dagRuns?.isFetching ? 'pi pi-spin pi-refresh' : 'pi pi-refresh'}
                        onClick={() => {
                            dagRuns?.refetch()
                        }}
                        disabled={dagRuns?.isFetching}
                        style={{
                            width: '40px',
                            height: '20px'
                        }}
                    />
                    <Checkbox checked />
                </div>
            }
        />
    )
}

export default DagRunList