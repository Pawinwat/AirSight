export type InstanceStatusValue = "healthy" | "unhealthy"
export type InstanceStatus = Record<string, {
  status: InstanceStatusValue,
} & {
  [key: string]: string
}>
// export type InstanceStatus = {
//   metadatabase?: { status: string };
//   scheduler?: { status: string; latest_scheduler_heartbeat?: string };
//   triggerer?: { status: string; latest_triggerer_heartbeat?: string };
//   dag_processor?: { status: string; latest_dag_processor_heartbeat?: string };
// };

export interface AirflowVersion {
  "version": "string",
  "git_version": "string"
}
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
  schedule_interval: {
    __type: string
    value: string
  }; // Define further if you know the exact structure
  timetable_description: string;
  tags: { name: string }[];           // Array of tags associated with the DAG
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



export interface AirflowDagRunsResponse {
  dag_runs: DagRun[];
  total_entries: number;
}
export type DagState = 'success' | 'failed' | 'running' | 'queued' | 'upstream_failed' | 'skipped' | 'none' |'up_for_retry'|'up_for_reschedule'|'scheduled';

export interface DagRun {
  conf: Record<string, unknown>; // Represents an object with any key-value pairs
  dag_id: string;
  dag_run_id: string;
  data_interval_end: string; // ISO date string
  data_interval_start: string; // ISO date string
  end_date: string | null; // ISO date string or null
  execution_date: string; // ISO date string
  external_trigger: boolean;
  last_scheduling_decision: string | null; // ISO date string or null
  logical_date: string; // ISO date string
  note: string | null; // String or null
  run_type: "manual" | "scheduled" | "backfill" | "triggered" | "unknown"; // Enum of possible run types
  start_date: string | null; // ISO date string or null
  state: DagState; // Limited to known states
}

export interface Version {
  version: string,
  git_version: string
}

export interface TaskInstance {
  task_id: string;
  task_display_name: string;
  dag_id: string;
  dag_run_id: string;
  execution_date: string; // ISO date string
  start_date: string | null; // ISO date string or null
  end_date: string | null; // ISO date string or null
  duration: number;
  state: DagState | null; // Nullable state
  try_number: number;
  map_index: number;
  max_tries: number;
  hostname: string;
  unixname: string;
  pool: string;
  pool_slots: number;
  queue: string;
  priority_weight: number;
  operator: string;
  queued_when: string | null; // ISO date string or null
  pid: number | null; // Nullable for cases where it's not set
  executor: string;
  executor_config: string;
  sla_miss?: {
    task_id: string;
    dag_id: string;
    execution_date: string; // ISO date string
    email_sent: boolean;
    timestamp: string; // ISO date string
    description: string;
    notification_sent: boolean;
  };
  rendered_map_index: string;
  rendered_fields: Record<string, unknown>; // Generic object
  trigger?: {
    id: number;
    classpath: string;
    kwargs: string;
    created_date: string; // ISO date string
    triggerer_id: number;
  };
  triggerer_job?: {
    id: number;
    dag_id: string;
    state: string;
    job_type: string;
    start_date: string; // ISO date string
    end_date: string | null; // ISO date string or null
    latest_heartbeat: string; // ISO date string
    executor_class: string;
    hostname: string;
    unixname: string;
  };
  note: string | null; // Nullable note
};

export interface AirflowTaskInstanceResponse {
  task_instances: TaskInstance[];
  total_entries: number;
}
