import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { ConnectionData } from "src/types/db";
import { createConnection, getConnection, testConnection, updateConnection } from ".";

export const useConnection = ({ connectionId }: { connectionId: string }) => {
    return useQuery<ConnectionData>({
        queryKey: ['useConnection', connectionId],
        queryFn: () => getConnection(connectionId),
        enabled: !!connectionId
    });
};

interface UseTestConnectionProps {
    config: AxiosRequestConfig
}
export const useTestConnection = () => {
    return useMutation({
        mutationFn: ({
            config
        }: UseTestConnectionProps) => testConnection(config),
    });
};

interface SaveConnectionPayload {
    connectionId: string | undefined
    payload: ConnectionData
}
export const useSaveConnection = () => {
    return useMutation({
        mutationFn: ({ connectionId, payload }: SaveConnectionPayload) => connectionId ? updateConnection(connectionId, payload) : createConnection(payload),
        // enabled: !!connectionId
    });
};