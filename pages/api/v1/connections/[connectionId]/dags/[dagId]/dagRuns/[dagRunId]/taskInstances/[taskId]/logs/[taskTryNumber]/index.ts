import { AxiosRequestConfig } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTaskInstanceLogs } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import { getBaseRequestConfig } from 'src/utils/request';

export default async function taskInstancesLogsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { dagId, connectionId, dagRunId, taskId, taskTryNumber  } = req.query;
        // Validate connectionId
        if (!connectionId || typeof connectionId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing connectionId' });
        }

        // Fetch connections from the database
        const connections = await prisma.connection.findFirst({
            where: {
                connection_id: connectionId,
                is_active: true,
            },
        });
        const baseConfig = getBaseRequestConfig(connections)
        const config = {
            ...baseConfig,
            params: {
                // limit,
                // offset,
                // tags,
                // order_by
            }
        } as AxiosRequestConfig
        const dags = await getTaskInstanceLogs(config, dagId as string,dagRunId as string,taskId as string,taskTryNumber as string)

        // Example response with the request headers and query params
        return res.status(200).json(dags);
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
