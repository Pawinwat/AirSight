import { AxiosRequestConfig } from "axios";
import { localAxios } from "src/api";



/**
 * Get the list of DAG runs for a specific DAG.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @returns List of DAG runs.
 */
export const getDags = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string
) => {
    const { data } = await localAxios.get(`/api/v1/connections/${connectionId}/dags/${dagId}`, config);
    return data;
};


/**
 * Get the details of a specific DAG.
 * @param config - Axios request configuration including baseURL, headers.
 * @param dagId - The ID of the DAG.
 * @returns DAG details.
 */
export const getDagDetails = async (config: AxiosRequestConfig, connectionId: string, dagId: string) => {
    const { data } = await localAxios.get(`/api/v1/connections/${connectionId}/dags/${dagId}`, config);
    return data;
};

export const getDagSource = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    fileToken: string
) => {
    const { data } = await localAxios.get(`/api/v1/connections/${connectionId}/dags/${dagId}/dagSources/${fileToken}`, config);
    return data;
};

/**
 * Get the list of DAG runs for a specific DAG.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @returns List of DAG runs.
 */
export const getDagRuns = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string
) => {
    const { data } = await localAxios.get(`/api/v1/connections/${connectionId}/dags/${dagId}/dagRuns`, config);
    return data;
};

/**
 * Get the list of DAG runs for a specific DAG.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @returns List of DAG runs.
 */
export const getDagRunsBatch = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    payload: Record<string, any>

) => {
    const { data } = await localAxios.post(`/api/v1/connections/${connectionId}/dags/${dagId}/dagRuns`, payload, config);
    return data;
};

/**
 * Get details of a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @param dagRunId - The ID of the DAG run.
 * @returns DAG run details.
 */
export const getDagRunDetails = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    runId: string
) => {
    const { data } = await localAxios.get(
        `/api/v1/connections/${connectionId}/dags/${dagId}/dagRuns/${runId}`,
        config
    );
    return data;
};

/**
 * Get task instances for a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @param dagRunId - The ID of the DAG run.
 * @returns List of task instances.
 */
export const getTaskInstances = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    runId: string
) => {
    const { data } = await localAxios.get(
        `/api/v1/connections/${connectionId}/dags/${dagId}/dagRuns/${runId}/taskInstances`,
        config
    );
    return data;
};

/**
 * Get the logs for a specific task instance.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @param dagRunId - The ID of the DAG run.
 * @param taskId - The ID of the task.
 * @param taskTryNumber - The try number of the task instance.
 * @returns Task instance logs.
 */
export const getTaskInstanceLogs = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    runId: string,
    taskId: string,
    taskTryNumber: string
) => {
    const { data } = await localAxios.get(
        `/api/v1/connections/${connectionId}/dags/${dagId}/dagRuns/${runId}/taskInstances/${taskId}/logs/${taskTryNumber}`,
        config
    );
    return data;
};

/**
 * Clear task instances for a specific DAG.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @param payload - Parameters for clearing task instances.
 * @returns Response indicating the result of the clear operation.
 */
export const clearTaskInstances = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    payload: Record<string, any>
) => {
    const { data } = await localAxios.post(
        `/api/v1/connections/${connectionId}/dags/${dagId}/clearTaskInstances`,
        payload,
        config
    );
    return data;
};

/**
 * Get event logs from the Airflow instance.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param offset - The offset for pagination.
 * @param limit - The limit for pagination.
 * @returns Event logs.
 */
export const getEventLogs = async (
    config: AxiosRequestConfig,
    connectionId: string,
    offset: number = 0,
    limit: number = 100
) => {
    const { data } = await localAxios.get(
        `/api/v1/eventLogs/${connectionId}?offset=${offset}&limit=${limit}`,
        config
    );
    return data;
};

/**
 * Get details of a specific log.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param logId - The ID of the log entry.
 * @returns Log entry details.
 */
export const getLogDetails = async (
    config: AxiosRequestConfig,
    connectionId: string,
    logId: string
) => {
    const { data } = await localAxios.get(`/api/v1/eventLogs/${connectionId}/${logId}`, config);
    return data;
};



/**
 * Get task instances for a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG.
 * @param runId - The ID of the DAG run.
 * @param taskId - The ID of the task.
 * @returns List of task instances.
 */
export const getTaskInstanceTries = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    runId: string,
    taskId: string
) => {
    const { data } = await localAxios.get(
        `/api/v1/connections/${connectionId}/dags/${dagId}/dagRuns/${runId}/taskInstances/${taskId}/tries`,
        config
    );
    return data;
};



/**
 * Trigger a DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param connectionId - The ID of the connection.
 * @param dagId - The ID of the DAG to be triggered.
 * @param payload - Additional parameters for the DAG run.
 * @returns The triggered DAG run details.
 */
export const triggerDag = async (
    config: AxiosRequestConfig,
    connectionId: string,
    dagId: string,
    payload: Record<string, any>
) => {
    const { data } = await localAxios.post(
        `/api/v1/connections/${connectionId}/dags/${dagId}/dagRuns`,
        payload,
        config
    );
    return data;
};
