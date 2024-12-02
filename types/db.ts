import { JsonValue } from "@prisma/client/runtime/library";

export interface ConnectionData {
    api_url: string | null | undefined;
    ui_url: string | null | undefined;
    connection_id: string;
    name: string | null;
    url: string | null;
    header: JsonValue | null;
    is_active: boolean | null;
  }