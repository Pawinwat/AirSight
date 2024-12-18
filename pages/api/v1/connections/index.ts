import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/lib/prisma';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // const { limit = '10', offset = '0', tags, only_active } = req.query;


    // Parse limit and offset as integers
    // const parsedLimit = parseInt(limit as string, 10);
    // const parsedOffset = parseInt(offset as string, 10);

    // Fetch connections from the database
    const connections = await prisma.connection.findMany({
      where: {
        is_active: true,
      },
    });

    // Example response with the request headers and query params
    return res.status(200).json(connections);
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
