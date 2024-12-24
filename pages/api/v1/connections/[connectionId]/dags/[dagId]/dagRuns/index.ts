import { AxiosRequestConfig } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDagRuns, triggerDag } from 'src/api/airflow';
import { getConnectionById } from 'src/db/connection';
import { getBaseRequestConfig } from 'src/utils/request';

export default async function dagRunsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {
            dagId,
            connectionId,
            limit = '10',
            offset = '0',
            tags,
            order_by,
            execution_date_gte,
            execution_date_lte,
            start_date_gte,
            start_date_lte,
            end_date_gte,
            end_date_lte,
            updated_at_gte,
            updated_at_lte,
            state
        } = req.query;

        // Validate connectionId
        if (!connectionId || typeof connectionId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing connectionId' });
        }
        const connection = await getConnectionById(connectionId)

        const parsedLimit = parseInt(limit as string, 10);
        const parsedOffset = parseInt(offset as string, 10);
        const baseConfig = getBaseRequestConfig(connection);
        const config: AxiosRequestConfig = {
            ...baseConfig,
            params: {
                limit: parsedLimit,
                offset: parsedOffset,
                tags,
                order_by,
                execution_date_gte,
                execution_date_lte,
                start_date_gte,
                start_date_lte,
                end_date_gte,
                end_date_lte,
                updated_at_gte,
                updated_at_lte,
                state

            },
        };

        // If no connection found, return an error
        if (!connection) {
            return res.status(404).json({ error: 'Connection not found' });
        }

        // Check the request method
        if (req.method === 'GET') {
            const dags = await getDagRuns(config, dagId as string);
            return res.status(200).json(dags);

        }
        else if (req.method === 'POST') {
            // return res.status(200).json({'post':req.body});
            const dags = await triggerDag(baseConfig, dagId as string, req.body);
            return res.status(200).json(dags);
        }
        else {
            // If the method is neither GET nor POST, return a 405 Method Not Allowed error
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
