import { AxiosRequestConfig } from "axios";
import { localAxios } from "src/api";
import { AirflowVersion, InstanceStatus } from "src/types/airflow";

/**
 * Get a connection.
 * @param connectionId - The ID of the connection.
 */
export const getConnection = async (
    connectionId: string,
) => {
    const { data } = await localAxios.get(
        `/api/v1/connections/${connectionId}`,
    );
    return data;
};

/**
 * Get a connection.
 * @param connectionId - The ID of the connection.
 */
export const testConnection = async (
    config: AxiosRequestConfig,
) => {
    const { data } = await localAxios.post<{
        status: InstanceStatus,
        version: AirflowVersion
    }>(
        `/api/v1/connections/test`,
        config
    );
    return data;
};