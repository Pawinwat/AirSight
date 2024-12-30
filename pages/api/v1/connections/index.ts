import type { NextApiRequest, NextApiResponse } from 'next';
import { createConnection, getConnectionList } from 'src/db/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const method = req.method
    if (method == 'GET') {
      const connections = await getConnectionList()
      return res.status(200).json(connections);
    }
    else if (method == 'POST') {
      const connection = await createConnection(req.body)
      return res.status(200).json(connection);
    }
    // Example response with the request headers and query params
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
