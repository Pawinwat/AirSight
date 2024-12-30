
import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnectionById, updateConnectionById, createConnection, deleteConnection } from 'src/db/connection';

export default async function connectionIdHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { connectionId } = req.query;
        const method = req.method

        if (method == 'GET') {
            if (!connectionId) {
                return res.status(200).json({});
            }
            const connection = await getConnectionById(connectionId as string)
            return res.status(200).json(connection);
        }
        else if (method == 'PATCH') {
            const connection = await updateConnectionById(connectionId as string, req.body)
            return res.status(200).json(connection);

        }
        else if (method == 'POST') {
            const connection = await createConnection(req.body)
            return res.status(200).json(connection);
        }
        else if (method == 'DELETE') {
            const connection = await deleteConnection(connectionId as string)
            return res.status(200).json(connection);
        }
        else {

        }
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
