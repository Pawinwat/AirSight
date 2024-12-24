import { AxiosRequestConfig } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTaskInstanceTries } from 'src/api/airflow';
import { getConnectionById } from 'src/db/connection';
import { getBaseRequestConfig } from 'src/utils/request';

export default async function taskInstancesTriesHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { dagId, connectionId, dagRunId, taskId  } = req.query;
        // Validate connectionId
        if (!connectionId || typeof connectionId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing connectionId' });
        }

        // Fetch connections from the database
        const connection = await getConnectionById(connectionId)

        const baseConfig = getBaseRequestConfig(connection)
        const config = {
            ...baseConfig,
            params: {
                // limit,
                // offset,
                // tags,
                // order_by
            }
        } as AxiosRequestConfig
        const dags = await getTaskInstanceTries(config, dagId as string,dagRunId as string,taskId as string)

        // Example response with the request headers and query params
        return res.status(200).json(dags);
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
