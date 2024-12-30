import { AxiosRequestConfig } from "axios";
import { localAxios } from "src/api";
import { AirflowVersion, InstanceStatus } from "src/types/airflow";
import { ConnectionData } from "src/types/db";

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
 * @param payload - The Data of the connection.
 */
export const createConnection = async (
    payload: ConnectionData,
) => {
    const { data } = await localAxios.post<ConnectionData>(
        `/api/v1/connections`,
        payload
    );
    return data;
};

/**
 * Get a connection.
 * @param connectionId - The ID of the connection.
 * @param payload - The Data of the connection.
 */
export const updateConnection = async (
    connectionId: string,
    payload: ConnectionData,
) => {
    const { data } = await localAxios.patch<ConnectionData>(
        `/api/v1/connections/${connectionId}`,
        payload
    );
    return data;
};

/**
 * Get a connection.
 * @param connectionId - The ID of the connection.
 */
export const deleteConnection = async (
    connectionId: string,
) => {
    const { data } = await localAxios.delete<ConnectionData>(
        `/api/v1/connections/${connectionId}`
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