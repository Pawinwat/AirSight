import { InstanceStatus } from "src/types/airflow";
import { ConnectionData } from "src/types/db";


export interface ConnectionCardData extends ConnectionData {
    status: InstanceStatus
}
export interface MainPageProps {
    connections:ConnectionCardData[];
}

