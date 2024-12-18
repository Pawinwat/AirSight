import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { connectionId } = req.query;

        if(!connectionId){
            return res.status(200).json({});
        }
        const connection = await prisma.connection.findFirst({
            where: {
                is_active: true,
                connection_id: connectionId as string
            },
        });

        // Example response with the request headers and query params
        return res.status(200).json(connection);
    } catch (error) {
        console.error('Error in API handler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
