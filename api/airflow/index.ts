import axios, { AxiosRequestConfig } from "axios";
import { AirflowDagsResponse, Version } from "src/types/airflow";


/**
 * Get a list of DAGs from the Airflow instance.
 * @param config - Axios request configuration including baseURL, headers, and params.
 * @returns List of DAGs.
 */
export const getVersion = async (config: AxiosRequestConfig) => {
  const { data } = await axios.get(`${config.baseURL}/api/v1/version`, config);
  return data as Version;
};

/**
 * Get the instance health status.
 * @param config - Axios request configuration including baseURL and headers.
 * @returns Instance health status.
 */
export const getInstanceStatus = async (config: AxiosRequestConfig) => {
  const { data } = await axios.get(`${config.baseURL}/health`, config);
  return data;
};

/**
 * Get a list of DAGs from the Airflow instance.
 * @param config - Axios request configuration including baseURL, headers, and params.
 * @returns List of DAGs.
 */
export const getDags = async (config: AxiosRequestConfig) => {
  const { data } = await axios.get(`${config.baseURL}/api/v1/dags`, config);
  return data as AirflowDagsResponse;
};

/**
 * Get the details of a specific DAG.
 * @param config - Axios request configuration including baseURL, headers.
 * @param dagId - The ID of the DAG.
 * @returns DAG details.
 */
export const getDagDetails = async (config: AxiosRequestConfig, dagId: string) => {
  const url = `${config.baseURL}/api/v1/dags/${dagId}`
  const { data } = await axios.get(url, config);
  return data;
};

/**
 * Trigger a DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG to be triggered.
 * @param payload - Additional parameters for the DAG run.
 * @returns The triggered DAG run details.
 */
export const triggerDag = async (
  config: AxiosRequestConfig,
  dagId: string,
  payload: Record<string, any>
) => {
  // const url = `${config.baseURL}/api/v1/dags/${dagId}/dagRuns`
  try {

    const { data } = await axios.post(
      `${config.baseURL}/api/v1/dags/${dagId}/dagRuns`,
      payload,
      config
    );
    return data;
  }
  catch (e: any) {
    return e.response.data
  }
};

/**
 * Get the list of DAG runs for a specific DAG.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @returns List of DAG runs.
 */
export const getDagRuns = async (config: AxiosRequestConfig, dagId: string) => {
  const { data } = await axios.get(`${config.baseURL}/api/v1/dags/${dagId}/dagRuns`, config);
  return data;
};

/**
 * Get details of a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @param runId - The ID of the DAG run.
 * @returns DAG run details.
 */
export const getDagRunDetails = async (
  config: AxiosRequestConfig,
  dagId: string,
  runId: string
) => {
  const { data } = await axios.get(
    `${config.baseURL}/api/v1/dags/${dagId}/dagRuns/${runId}`,
    config
  );
  return data;
};

/**
 * Get task instances for a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @param runId - The ID of the DAG run.
 * @returns List of task instances.
 */
export const getTaskInstances = async (
  config: AxiosRequestConfig,
  dagId: string,
  runId: string
) => {
  const { data } = await axios.get(
    `${config.baseURL}/api/v1/dags/${dagId}/dagRuns/${runId}/taskInstances`,
    config
  );
  return data;
};

/**
 * Get the details of a specific task instance.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @param runId - The ID of the DAG run.
 * @param taskId - The ID of the task.
 * @returns Task instance details.
 */
export const getTaskInstanceDetails = async (
  config: AxiosRequestConfig,
  dagId: string,
  runId: string,
  taskId: string
) => {
  const { data } = await axios.get(
    `${config.baseURL}/api/v1/dags/${dagId}/dagRuns/${runId}/taskInstances/${taskId}`,
    config
  );
  return data;
};

/**
 * Update a DAG's configuration.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG to update.
 * @param payload - Updated DAG configuration data.
 * @returns Updated DAG details.
 */
export const updateDag = async (
  config: AxiosRequestConfig,
  dagId: string,
  payload: Record<string, any>
) => {
  const { data } = await axios.patch(
    `${config.baseURL}/api/v1/dags/${dagId}`,
    payload,
    config
  );
  return data;
};


/**
 * Get the details of a specific DAG.
 * @param config - Axios request configuration including baseURL, headers.
 * @param dagId - The ID of the DAG.
 * @returns DAG details.
 */
export const getDagSource = async (config: AxiosRequestConfig, fileToken: string) => {
  const url = `${config.baseURL}/api/v1/dagSources/${fileToken}`
  console.log(url)
  const { data } = await axios.get(url, config);
  return data;
};


/**
 * Get the logs for a specific task instance.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @param runId - The ID of the DAG run.
 * @param taskId - The ID of the task.
 * @param taskTryNumber - The try number of the task instance.
 * @returns Task instance logs.
 */
export const getTaskInstanceLogs = async (
  config: AxiosRequestConfig,
  dagId: string,
  runId: string,
  taskId: string,
  taskTryNumber: string
) => {
  const { data } = await axios.get(
    `${config.baseURL}/api/v1/dags/${dagId}/dagRuns/${runId}/taskInstances/${taskId}/logs/${taskTryNumber}`,
    config
  );
  return data;
};

/**
 * Clear task instances for a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @param payload - Parameters for clearing task instances (e.g., include_downstream, include_future, etc.).
 * @returns Response indicating the result of the clear operation.
 */
export const clearTaskInstances = async (
  config: AxiosRequestConfig,
  dagId: string,
  payload: Record<string, any>
) => {
  const { data } = await axios.post(
    `${config.baseURL}/api/v1/dags/${dagId}/clearTaskInstances`,
    payload,
    config
  );
  return data;
};

/**
 * Get the status of all task instances for a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @param runId - The ID of the DAG run.
 * @returns Status of all task instances.
 */
export const getTaskInstanceStatuses = async (
  config: AxiosRequestConfig,
  dagId: string,
  runId: string
) => {
  const { data } = await axios.get(
    `${config.baseURL}/api/v1/dags/${dagId}/dagRuns/${runId}/taskInstances`,
    config
  );
  return data;
};

/**
 * Get event logs from the Airflow instance.
 * @param config - Axios request configuration including baseURL and headers.
 * @param offset - The offset for pagination.
 * @param limit - The limit for pagination.
 * @returns Event logs.
 */
export const getEventLogs = async (
  config: AxiosRequestConfig,
  offset: number = 0,
  limit: number = 100
) => {
  const { data } = await axios.get(
    `${config.baseURL}/api/v1/eventLogs?offset=${offset}&limit=${limit}`,
    config
  );
  return data;
};

/**
 * Get the log configuration of the Airflow instance.
 * @param config - Axios request configuration including baseURL and headers.
 * @returns Log configuration details.
 */
export const getLogConfig = async (config: AxiosRequestConfig) => {
  const { data } = await axios.get(`${config.baseURL}/api/v1/config/logging`, config);
  return data;
};

/**
 * Get the details of a specific log.
 * @param config - Axios request configuration including baseURL and headers.
 * @param logId - The ID of the log entry.
 * @returns Log entry details.
 */
export const getLogDetails = async (config: AxiosRequestConfig, logId: string) => {
  const { data } = await axios.get(`${config.baseURL}/api/v1/eventLogs/${logId}`, config);
  return data;
};


/**
 * Get task instances for a specific DAG run.
 * @param config - Axios request configuration including baseURL and headers.
 * @param dagId - The ID of the DAG.
 * @param runId - The ID of the DAG run.
 * @param taskId - The ID of the task.
 * @returns List of task instances.
 */
export const getTaskInstanceTries = async (
  config: AxiosRequestConfig,
  dagId: string,
  runId: string,
  taskId: string
) => {
  const { data } = await axios.get(
    `${config.baseURL}/api/v1/dags/${dagId}/dagRuns/${runId}/taskInstances/${taskId}/tries`,
    config
  );
  return data;
};
