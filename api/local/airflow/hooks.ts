import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { getDagRuns, getDags, getTaskInstanceLogs, getTaskInstances, getTaskInstanceTries, triggerDag } from ".";
import { AirflowDagRunsResponse, AirflowDagsResponse, AirflowTaskInstanceResponse } from "src/types/airflow";
const currentTime = new Date().toISOString();


export const useDags = (config: AxiosRequestConfig, connectionId: string | null, dagId: string | null) => {
    return useQuery<AirflowDagsResponse>({
        queryKey: ['useDags', connectionId, dagId, config],
        queryFn: () => getDags(config, connectionId as string, dagId as string),
        enabled: !!dagId && !!connectionId,
        placeholderData: {
            dags: [],
            total_entries: 0
        }
    });
};

export const useDagRuns = (config: AxiosRequestConfig, connectionId: string | null, dagId: string | null) => {
    return useQuery<AirflowDagRunsResponse>({
        queryKey: ['dagRuns', connectionId, dagId, config],
        queryFn: () => getDagRuns(config, connectionId as string, dagId as string),
        enabled: !!dagId && !!connectionId,
        placeholderData: {
            dag_runs: [],
            total_entries: 0
        }
    });
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