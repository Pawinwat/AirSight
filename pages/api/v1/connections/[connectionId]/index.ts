import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnectionById } from 'src/db/connection';

export default async function connectionIdHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { connectionId } = req.query;

        if (!connectionId) {
            return res.status(200).json({});
        }
        const connection = await getConnectionById(connectionId as string)


        // Example response with the request headers and query params
        return res.status(200).json(connection);
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
