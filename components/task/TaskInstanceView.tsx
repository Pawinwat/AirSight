import { motion } from 'framer-motion';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { getStatusColor, getStatusIcon } from 'src/constant/colors';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';
import { DagState } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';
import TaskLog from './TaskLog';

function TaskInstanceView() {
    const { taskInstanceData, connection } = useDagRunsContext();
    const createDynamicTabs = () => {
        return (
            taskInstanceData?.map(t => (

                <AccordionTab
                    key={`${t.dag_run_id}-${t.try_number}`}
                    header={
                        <div
                            style={{
                                gap: '20px',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '5px',
                                    alignItems: 'center'
                                }}
                            >
                                <i
                                    className={getStatusIcon(t.state as DagState)}
                                    style={{ fontSize: '1rem', marginRight: '0.5rem', color: getStatusColor(t.state as DagState) }}
                                >
                                </i>
                                {t.task_id} ({t.try_number})
                            </div>

                            {/* {t.max_tries} */}


                        </div>
                    }
                >
                    {/* Wrap the content inside motion.div for animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} // Initial state when the tab is collapsed
                        animate={{ opacity: 1, scale: 1 }} // State when the tab is expanded
                        exit={{ opacity: 0, scale: 0.95 }} // State when the tab is collapsing
                        transition={{ duration: 0.3 }} // Animation duration
                    >
                        <TaskLog
                            connection={connection as ConnectionData}
                            taskInstance={t}
                        />
                    </motion.div>
                </AccordionTab>
            ))

        )

    };

    return (
        // Wrap the entire Accordion with motion.div for animation
        <motion.div
            initial={{ opacity: 0, y: 20 }} // Initial state when the accordion is hidden
            animate={{ opacity: 1, y: 0 }} // Final state when the accordion is fully visible
            exit={{ opacity: 0, y: 20 }} // State when the accordion is leaving (collapsed)
            transition={{ duration: 0.5 }} // Duration of the animation
        >

            <Accordion>
                {
                    createDynamicTabs()
                }
            </Accordion>
        </motion.div>
    );
}

export default TaskInstanceView;
