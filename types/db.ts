import { JsonValue } from "@prisma/client/runtime/library";
import { AxiosRequestHeaders } from "axios";

export interface ConnectionData {
    api_url: string | null | undefined;
    ui_url: string | null | undefined;
    connection_id: string;
    name: string | null;
    url: string | null;
    header: JsonValue |AxiosRequestHeaders | null;
    is_active: boolean | null;
    username:string| null;
    password:string| null;
    
  }