import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { useEffect, useState } from 'react'
import { useTaskInstanceLogs } from 'src/api/local/airflow/hooks'
import { getStatusColor } from 'src/constant/colors'
import { useDagRunsContext } from 'src/contexts/useDagsRuns'
import { DagState, TaskInstance } from 'src/types/airflow'
import { ConnectionData } from 'src/types/db'


interface TaskLogProps {
    taskInstance: TaskInstance
    connection: ConnectionData
}
function TaskLog({ taskInstance }: TaskLogProps) {
    const { connection } = useDagRunsContext();

    const [selectedTryNum, setSelectedTryNum] = useState(0)
    useEffect(() => {
        setSelectedTryNum(taskInstance.try_number)
    }, [taskInstance?.try_number])

    const log = useTaskInstanceLogs({
        params: {}
    },
        connection?.connection_id as string,
        taskInstance?.dag_id,
        taskInstance.dag_run_id,
        taskInstance.task_id,
        String(selectedTryNum)
    )

    // Airflow 2.10
    // const tries = useTaskInstanceTries({
    //     params: {}
    // },
    //     connection.connection_id,
    //     taskInstance?.dag_id,
    //     taskInstance.dag_run_id,
    //     taskInstance.task_id
    // )
    return (

        <>
            <div
                style={{
                    display: 'flex'
                }}
            >
                {
                    [...Array(taskInstance.try_number)]?.map((_, tryNum) => <Button
                        // icon={log?.isFetching ? 'pi pi-spin pi-refresh' : 'pi pi-refresh'}
                        // size='small'
                        key={`log-${taskInstance.task_id}-${tryNum}`}
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: ((tryNum + 1) == taskInstance.try_number) ? getStatusColor(taskInstance?.state as DagState) : getStatusColor('failed')
                        }}
                        onClick={(e) => {
                            setSelectedTryNum(tryNum + 1)
                            e.stopPropagation()
                        }}
                        disabled={log?.isFetching}
                    >
                        {tryNum + 1}
                    </Button>)
                }
                <Button
                    icon={log?.isFetching ? 'pi pi-spin pi-refresh' : 'pi pi-refresh'}
                    // size='small'
                    style={{
                        width: '20px',
                        height: '20px'
                    }}
                    onClick={(e) => {
                        log.refetch()
                        e.stopPropagation()
                    }}
                />
            </div>
            <InputTextarea
                style={{
                    'width': '100%'
                }}
                value={log?.data || ''}
                rows={30}
                readOnly
            />

        </>


    )
}

export default TaskLog