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
  const url  = `${config.baseURL}/api/v1/dags/${dagId}`
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
  const { data } = await axios.post(
    `${config.baseURL}/api/v1/dags/${dagId}/dagRuns`,
    payload,
    config
  );
  return data;
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
  const url  = `${config.baseURL}/api/v1/dagSources/${fileToken}`
  console.log(url)
  const { data } = await axios.get(url, config);
  return data;
};