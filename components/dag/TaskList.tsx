import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { STATE_COLORS } from 'src/constant/colors';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';
import { DagRun } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';
import DagRunTemplate from './DagRunTemplate';
interface TaskListProps {
    connection:ConnectionData
}
function TaskList({connection}:TaskListProps) {
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
                            return run && !!(run?.dag_run_id == selectedRun?.dag_run_id)
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
                                key={`tag-${statusKey}`}
                                style={{
                                    backgroundColor: STATE_COLORS[statusKey],
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
                    />
                    <Checkbox checked />
                </div>
            }
        />
    )
}

export default TaskList