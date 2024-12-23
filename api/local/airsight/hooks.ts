import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { ConnectionData } from "src/types/db";
import { getConnection, testConnection } from ".";

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