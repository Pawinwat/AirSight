import { InstanceStatus, Version } from "src/types/airflow";
import { ConnectionData } from "src/types/db";


export interface ConnectionCardData extends ConnectionData {
    status: InstanceStatus
    version:Version
}
export interface MainPageProps {
    connections:ConnectionCardData[];
}

