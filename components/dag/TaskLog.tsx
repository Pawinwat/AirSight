import { InputTextarea } from 'primereact/inputtextarea'
import React from 'react'
import { useTaskInstanceLogs } from 'src/api/local/airflow/hooks'
import { TaskInstance } from 'src/types/airflow'
import { ConnectionData } from 'src/types/db'


interface TaskLogProps {
    taskInstance: TaskInstance
    connection: ConnectionData
}
function TaskLog({ taskInstance, connection }: TaskLogProps) {
    console.log(taskInstance)
    const log = useTaskInstanceLogs({
        params: {}
    },
        connection.connection_id,
        taskInstance?.dag_id,
        taskInstance.dag_run_id,
        taskInstance.task_id,
        String(taskInstance.try_number)
    )
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