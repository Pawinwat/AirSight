export type InstanceStatus = {
    metadatabase?: { status: string };
    scheduler?: { status: string; latest_scheduler_heartbeat?: string };
    triggerer?: { status: string; latest_triggerer_heartbeat?: string };
    dag_processor?: { status: string; latest_dag_processor_heartbeat?: string };
  };


 export interface Dag {
    dag_id: string;
    dag_display_name: string;
    root_dag_id: string;
    is_paused: boolean;
    is_active: boolean;
    is_subdag: boolean;
    last_parsed_time: string; // ISO date string
    last_pickled: string;     // ISO date string
    last_expired: string;     // ISO date string
    scheduler_lock: boolean;
    pickle_id: string;
    default_view: string;
    fileloc: string;
    file_token: string;
    owners: string[];         // Array of owners, if applicable
    description: string;
    schedule_interval: object; // Define further if you know the exact structure
    timetable_description: string;
    tags: {name:string}[];           // Array of tags associated with the DAG
    max_active_tasks: number;
    max_active_runs: number;
    has_task_concurrency_limits: boolean;
    has_import_errors: boolean;
    next_dagrun: string;             // ISO date string
    next_dagrun_data_interval_start: string; // ISO date string
    next_dagrun_data_interval_end: string;   // ISO date string
    next_dagrun_create_after: string;       // ISO date string
    max_consecutive_failed_dag_runs: number;
  }
  
 export interface AirflowDagsResponse {
    dags: Dag[];
    total_entries: number;
  }
  