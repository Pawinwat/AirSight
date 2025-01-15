import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { useDagRuns } from 'src/api/local/airflow/hooks';
import { getStatusColor, getStatusIcon, STATE_COLORS } from 'src/constant/colors';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';
import { DagRun, DagState } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';
import DagRunTemplate from './DagRunTemplate';
import { useState } from 'react';
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
        selectedRun,
        dagId
    } = useDagRunsContext()
    const [showRecent, setShowRecent] = useState(false)
    const runParams = {
        offset: 0,
        limit: 200,
        order_by: '-execution_date',
    }
    const recentRuns = useDagRuns(
        {
            params: runParams
        },
        connection?.connection_id as string,
        dagId as string,
        showRecent
    )
    const recentDagRunsData = recentRuns?.data?.dag_runs
    const recentRunData = recentDagRunsData?.filter(run => (selectedRunsTags?.length === 0) || selectedRunsTags.includes(run.state)) || []

    const recentRunStat = recentDagRunsData?.reduce((acc, run) => {
        acc[run.state] = (acc[run.state] || 0) + 1; // Increment the count for the state
        return acc;
    }, {} as Record<string, number>);

    const displayData = {
        run:showRecent ? recentRunData: runData,
        stat:showRecent ? recentRunStat: runStat,
        isFetching:showRecent ? recentRuns?.isFetching:dagRuns?.isFetching,
        query:showRecent ? recentRuns:dagRuns
    }

    return (
        <DataView
            value={displayData?.run}
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
                    style={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div>
                        Recent
                        <Checkbox
                            checked={showRecent}
                            onChange={(e) => {
                                setShowRecent(!!e.checked)
                            }}
                            size={10}
                        />
                    </div>
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
                                {statusKey}{`(${displayData?.stat?.[statusKey] || 0})`}
                            </Tag>
                        ))}
                    </div>
                    <Button
                        icon={displayData?.isFetching ? 'pi pi-spin pi-refresh' : 'pi pi-refresh'}
                        onClick={() => {
                            displayData?.query?.refetch()
                        }}
                        disabled={displayData?.isFetching}
                        style={{
                            width: '40px',
                            height: '20px'
                        }}
                    />
                    {/* <Checkbox checked /> */}
                </div>
            }
        />
    )
}

export default DagRunList