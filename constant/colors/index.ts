import { DagState, InstanceStatusValue } from "src/types/airflow";


export const STATE_COLORS: Record<DagState, string> = {
  "queued": 'darkgray',
  "running": '#01FF70',
  "success": '#2ECC40',
  "failed": 'firebrick',
  "up_for_retry": 'yellow',
  "up_for_reschedule": 'turquoise',
  "upstream_failed": 'orange',
  "skipped": 'darkorchid',
  "scheduled": 'tan',
  'none':'gray'
};

export const STATE_ICONS: Record<DagState, string> = {
  "queued": 'pi pi-clock',
  "running": `pi pi-spin pi-cog`,
  "success": `pi pi-check-circle`,
  "failed": `pi pi-times-circle`,
  "up_for_retry": `pi pi-refresh`,
  "up_for_reschedule":`pi pi-hourglass`,
  "upstream_failed": `pi pi-ban`,
  "skipped": `pi pi-fast-forward`,
  "scheduled": `pi pi-clock`,
  'none':'pi pi-circle'

};
export const getStatusColor = (state: DagState) => {
  return STATE_COLORS[state] || 'lightgray'; // Default color for undefined states
};

export const getStatusIcon = (state: DagState) => {
  return STATE_ICONS[state] || `pi pi-circle-fill`; // Default color for undefined states
};


export const INSTANCE_COLORS: Record<InstanceStatusValue, string> = {
  "healthy":'#2ECC40',
  "unhealthy":'firebrick'
};



export const getRunTypeColor = (runType: string) => {
  switch (runType) {
    case 'manual':
      return 'purple';
    case 'scheduled':
      return 'blue';
    case 'backfill':
      return 'brown';
    case 'triggered':
      return 'yellow';
    case 'unknown':
      return 'gray';
    default:
      return 'gray';
  }
};