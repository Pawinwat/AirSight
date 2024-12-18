import { InputTextarea } from 'primereact/inputtextarea'
import { useTaskInstanceLogs } from 'src/api/local/airflow/hooks'
import { TaskInstance } from 'src/types/airflow'
import { ConnectionData } from 'src/types/db'


interface TaskLogProps {
    taskInstance: TaskInstance
    connection: ConnectionData
}
function TaskLog({ taskInstance, connection }: TaskLogProps) {
    const log = useTaskInstanceLogs({
        params: {}
    },
        connection.connection_id,
        taskInstance?.dag_id,
        taskInstance.dag_run_id,
        taskInstance.task_id,
        String(taskInstance.try_number)
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
        <InputTextarea
            style={{
                'width': '100%'
            }}
            value={log?.data || ''}
            rows={30}
            readOnly
        />
    )
}

export default TaskLog