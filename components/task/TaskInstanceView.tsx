import { Accordion, AccordionTab } from 'primereact/accordion'
import { getStatusColor } from 'src/constant/colors'
import { useDagRunsContext } from 'src/contexts/useDagsRuns'
import { DagState } from 'src/types/airflow'
import { ConnectionData } from 'src/types/db'
import TaskLog from './TaskLog'



function TaskInstanceView() {
    const { taskInstanceData, connection } = useDagRunsContext()
    return (
        <Accordion
        >
            {
                taskInstanceData?.map(t => (
                    <AccordionTab
                        key={`${t.dag_run_id}-${t.try_number}`}
                        header={
                            <div
                                style={{
                                    gap: '20px'
                                }}
                            >
                                <i className={`pi pi-circle-fill`} style={{ fontSize: '1rem', marginRight: '0.5rem', color: getStatusColor(t.state as DagState) }}></i>
                                {t.task_id}
                                {t.max_tries}
                            </div>}>
                        <TaskLog
                            connection={connection as ConnectionData}
                            taskInstance={t}
                        />
                    </AccordionTab>
                ))
            }
        </Accordion>
    )
}

export default TaskInstanceView