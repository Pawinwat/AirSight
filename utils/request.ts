import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { ConnectionData } from './../types/db';
import { JsonValue } from '@prisma/client/runtime/library';
export const getBaseRequestConfig = (connectionData: { header: JsonValue | null; api_url: string | null; connection_id: string; name: string | null; is_active: boolean | null; ui_url: string | null; })=>{
    return  {
        headers:connectionData.header  as AxiosHeaders,
        baseURL:connectionData?.api_url
    } as AxiosRequestConfig
}