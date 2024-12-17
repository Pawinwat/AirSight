import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { getDagRuns, getTaskInstanceLogs, getTaskInstances } from ".";
import { AirflowDagRunsResponse, AirflowTaskInstanceResponse } from "src/types/airflow";

export const useDagRuns = (config: AxiosRequestConfig, connectionId: string, dagId: string) => {
    return useQuery<AirflowDagRunsResponse>({
        queryKey: ['dagRuns', connectionId, dagId, config],
        queryFn: () => getDagRuns(config, connectionId, dagId),
    });
};

export const useTaskInstances = (config: AxiosRequestConfig, connectionId: string, dagId: string, dagRunId: string) => {
    return useQuery<AirflowTaskInstanceResponse>({
        queryKey: ['TaskInstances', connectionId, dagId, config, dagRunId],
        queryFn: () => getTaskInstances(config, connectionId, dagId, dagRunId),
    });
};

export const useTaskInstanceLogs = (config: AxiosRequestConfig, connectionId: string, dagId: string, dagRunId: string,taskId:string,taskTryNumber:string) => {
    return useQuery<string>({
        queryKey: ['useTaskInstanceLogs', connectionId, dagId, config, dagRunId,taskId,taskTryNumber],
        queryFn: () => getTaskInstanceLogs(config, connectionId, dagId, dagRunId,taskId,taskTryNumber),
    });
};