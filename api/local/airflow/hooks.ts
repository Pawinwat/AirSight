import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { AirflowDagRunsResponse, AirflowDagsResponse, AirflowTaskInstanceResponse, Dag } from "src/types/airflow";
import { fetchDagRunsInBatches, getDagDetails, getDagRuns, getDags, getDagSource, getTaskInstanceLogs, getTaskInstances, getTaskInstanceTries, triggerDag } from ".";
const currentTime = new Date().toISOString();


export const useDags = (config: AxiosRequestConfig, connectionId: string | null) => {
    return useQuery<AirflowDagsResponse>({
        queryKey: ['useDags', connectionId, config],
        queryFn: () => getDags(config, connectionId as string),
        enabled: !!connectionId,
        placeholderData: {
            dags: [],
            total_entries: 0
        }
    });
};

export const useDagDetails = (config: AxiosRequestConfig, connectionId: string | null, dagId: string | null) => {
    return useQuery<Dag>({
        queryKey: ['useDagDetails', connectionId, dagId, config],
        queryFn: () => getDagDetails(config, connectionId as string, dagId as string),
        enabled: !!dagId && !!connectionId,
        // placeholderData: {

        // }
    });
};

export const useDagSources = (config: AxiosRequestConfig, connectionId: string | null, dagId: string | null, fileToken: string) => {
    return useQuery<string>({
        queryKey: ['useDagSources', connectionId, dagId, config, fileToken],
        queryFn: () => getDagSource(config, connectionId as string, dagId as string, fileToken),
        enabled: !!dagId && !!connectionId && !!fileToken,
        placeholderData: ""
    });
};

export const useDagRuns = (config: AxiosRequestConfig, connectionId: string | null, dagId: string | null,enable?:boolean) => {
    return useQuery<AirflowDagRunsResponse>({
        queryKey: ['dagRuns', connectionId, dagId, config],
        queryFn: () => getDagRuns(config, connectionId as string, dagId as string),
        enabled: !!dagId && !!connectionId && (enable || (enable===undefined)),
        placeholderData: {
            dag_runs: [],
            total_entries: 0
        }
    });
};

export const useDagRuns24Hours = (config: AxiosRequestConfig, connectionId: string | null, dagId: string | null) => {
    const defaultData = {
        dag_runs: [],
        total_entries: 0
    }
    const [data, setData] = useState<AirflowDagRunsResponse>(defaultData)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    // const [isFetched, setIsFetched] = useState<boolean>(false)

    // const [runStat, setRunStat] = useState<boolean>(false)

    useEffect(() => {
        if(!connectionId || !dagId) return;
        refetch()
    }, [connectionId, dagId])

    const resetData = ()=>{
        setData(defaultData)
    }

    const refetch = ()=>{
        resetData()
        handleFetch()
    }

    const handleFetch = async () => {
        // setIsFetched(false)
        setIsFetching(true)

        let totalEntries = 0;
       try {
        for await (const batch of fetchDagRunsInBatches(config, connectionId as string, dagId as string)) {

            setData((prev) => (
                {
                    dag_runs: [...prev?.dag_runs, ...batch.dag_runs],
                    total_entries: totalEntries
                }
            ))
        }
       }
       catch(e){
        console.log(e)

       }
       finally{
        setIsFetching(false)
        // setIsFetched(true)
       }
    }


    return {
        data,
        isFetching,
        isLoading:isFetching,
        refetch,
        isFetched:!isFetching
    }
};

export const useTaskInstances = (config: AxiosRequestConfig, connectionId: string, dagId: string, dagRunId: string) => {
    return useQuery<AirflowTaskInstanceResponse>({
        queryKey: ['TaskInstances', connectionId, dagId, config, dagRunId],
        queryFn: () => getTaskInstances(config, connectionId, dagId, dagRunId),
        enabled: !!connectionId && !!dagId
    });
};

export const useTaskInstanceLogs = (config: AxiosRequestConfig, connectionId: string, dagId: string, dagRunId: string, taskId: string, taskTryNumber: string) => {
    return useQuery<string>({
        queryKey: ['useTaskInstanceLogs', connectionId, dagId, config, dagRunId, taskId, taskTryNumber],
        queryFn: () => getTaskInstanceLogs(config, connectionId, dagId, dagRunId, taskId, taskTryNumber),
        enabled: !!connectionId && !!dagId && !!dagRunId
    });
};

export const useTaskInstanceTries = (config: AxiosRequestConfig, connectionId: string, dagId: string, dagRunId: string, taskId: string) => {
    return useQuery<string>({
        queryKey: ['useTaskInstanceTries', connectionId, dagId, config, dagRunId, taskId],
        queryFn: () => getTaskInstanceTries(config, connectionId, dagId, dagRunId, taskId),
    });
};

export const useTriggerDag = (config: AxiosRequestConfig, connectionId: string, dagId: string) => {
    return useMutation<string>({
        mutationFn: () => triggerDag(config, connectionId, dagId, {
            dag_run_id: `AirSight-${currentTime}`,
            execution_date: currentTime
        }),
    });
};