import { AxiosRequestConfig } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDagRuns } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import { getBaseRequestConfig } from 'src/utils/request';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { dagId, connectionId, limit = '10', offset = '0', tags,  order_by } = req.query;
        // Validate connectionId
        if (!connectionId || typeof connectionId !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing connectionId' });
        }

        // Parse limit and offset as integers
        // const parsedLimit = parseInt(limit as string, 10);
        // const parsedOffset = parseInt(offset as string, 10);
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
                limit,
                offset,
                tags,
                order_by
            }
        } as AxiosRequestConfig
        const dags = await getDagRuns(config, dagId as string)

        // Example response with the request headers and query params
        return res.status(200).json(dags);
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
