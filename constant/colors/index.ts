export const getStatusColor = (state: string) => {
    switch (state) {
      case 'success':
        return 'green';
      case 'failed':
        return 'red';
      case 'running':
        return 'orange';
      case 'queued':
        return 'blue';
      default:
        return 'gray'; // For any undefined state
    }
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