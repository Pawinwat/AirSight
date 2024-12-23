import { useRouter } from 'next/router';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useDagRuns, useTaskInstances } from 'src/api/local/airflow/hooks';
import { useConnection } from 'src/api/local/airsight/hooks';
import { DagRun, TaskInstance } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';


interface DagRunsContextValues {
    connection: ConnectionData | null;
    // setConnection: React.Dispatch<React.SetStateAction<ConnectionData | null>>;
    runData: DagRun[];
    runStat: Record<string, number> | undefined;
    dagRuns: ReturnType<typeof useDagRuns>; // Type for the `dagRuns` hook
    handleDagRunClick: (run: DagRun) => void;
    handleStatusFilterClick: (status: string) => void;
    selectedRunsTags: string[];
    setSelectedRunsTags: React.Dispatch<React.SetStateAction<string[]>>;
    selectedRun: DagRun | null;
    setSelectedRun: React.Dispatch<React.SetStateAction<DagRun | null>>;
    taskInstanceData: TaskInstance[] | undefined
}


const DagRunsContext = createContext<DagRunsContextValues | undefined>(undefined);
interface TaskProviderProps {
    children: ReactNode
}

export const DagRunsProvider = ({ children }: TaskProviderProps) => {
    const router = useRouter();
    const { query } = router;
    const dagId = query.dagId || `~`
    const connectionId = query.connectionId as string

    // const [connection, setConnection] = useState<ConnectionData | null>(null)
    // const [dagId, setDagId] = useState<string | null>(null)
    const connectionHook = useConnection({
        connectionId

    })
    const connection = connectionHook?.data || null
    // useEffect(() => {
    //   \
    // }, [connectionId])


    const [selectedRunsTags, setSelectedRunsTags] = useState<string[]>(
        query.run_tags ? (query.tags as string).split(',') : []
    );
    const [selectedRun, setSelectedRun] = useState<DagRun | null>(null)

    const handleDagRunClick = (run: DagRun) => {
        setSelectedRun(
            (prev) => prev?.dag_run_id == run?.dag_run_id ? null : run
        )
    }
    const handleStatusFilterClick = (status: string) => {
        const newTags = selectedRunsTags.includes(status)
            ? selectedRunsTags.filter((t) => t !== status)
            : [...selectedRunsTags, status];
        setSelectedRunsTags(newTags);
    };

    const runParams = {
        offset: 0,
        limit: 200,
        order_by: '-execution_date',

    }
    const dagRuns = useDagRuns({
        params: runParams
    },
        connectionId as string,
        dagId as string
    )
    const dagRunsData = dagRuns?.data?.dag_runs
    const runData = dagRunsData?.filter(run => (selectedRunsTags?.length === 0) || selectedRunsTags.includes(run.state)) || []
    const runStat = dagRunsData?.reduce((acc, run) => {
        acc[run.state] = (acc[run.state] || 0) + 1; // Increment the count for the state
        return acc;
    }, {} as Record<string, number>);


    const taskInstance = useTaskInstances(
        {
            // params:{
            //     order_by:'start_date'
            // }
        },
        connectionId as string,
        selectedRun?.dag_id as string,
        selectedRun?.dag_run_id as string
    )
    const taskInstanceData = taskInstance?.data?.task_instances
        ?.map(task => ({ ...task, dag_run_id: selectedRun?.dag_run_id as string }))


    return (
        <DagRunsContext.Provider value={{
            connection,
            runData,
            runStat,
            dagRuns,
            handleDagRunClick,
            handleStatusFilterClick,
            selectedRunsTags, setSelectedRunsTags,
            selectedRun, setSelectedRun,
            taskInstanceData,

        }}>
            {children}
        </DagRunsContext.Provider>
    );
};

// Custom hook to use the Task Context
export const useDagRunsContext = () => {
    const context = useContext(DagRunsContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};

