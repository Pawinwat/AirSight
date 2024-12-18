import { JsonValue } from '@prisma/client/runtime/library';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
export const getBaseRequestConfig = (connectionData: { header: JsonValue | null; api_url: string | null; connection_id: string; name: string | null; is_active: boolean | null; ui_url: string | null; }|undefined|null)=>{
    return  {
        headers:connectionData?.header  as AxiosHeaders,
        baseURL:connectionData?.api_url
    } as AxiosRequestConfig
}