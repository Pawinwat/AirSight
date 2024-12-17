import { DagRun, DagState } from "src/types/airflow";


export const STATE_COLORS: Record<string, string> = {
  "queued": 'darkgray',
  "running": '#01FF70',
  "success": '#2ECC40',
  "failed": 'firebrick',
  "up_for_retry": 'yellow',
  "up_for_reschedule": 'turquoise',
  "upstream_failed": 'orange',
  "skipped": 'darkorchid',
  "scheduled": 'tan',
};
export const getStatusColor = (state: DagState) => {
  return STATE_COLORS[state] || 'lightgray'; // Default color for undefined states
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