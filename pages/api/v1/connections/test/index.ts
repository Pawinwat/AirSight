import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        // Extract the Axios configuration from the request body
        const axiosConfig: AxiosRequestConfig = req.body;

        if (!axiosConfig || typeof axiosConfig !== 'object') {
            return res.status(400).json({ error: 'Invalid Axios configuration provided.' });
        }
        // Make the HTTP request using Axios
        const health = await axios({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL + '/api/v1/health',
        });
        const version = await axios({
            ...axiosConfig,
            baseURL: axiosConfig.baseURL + '/api/v1/version',
        });
        // Return the response data to the client
        return res.status(200).json({
            version:version?.data,
            status: health.data
        });
    } catch (error) {
        console.error('Error making request:', error);

        // Handle Axios-specific errors
        if (axios.isAxiosError(error)) {
            return res.status(error.response?.status || 500).json({
                error: error.message,
                details: error.response?.data || null,
            });
        }

        // Handle other errors
        return res.status(500).json({ error: 'Internal server error' });
    }
}
