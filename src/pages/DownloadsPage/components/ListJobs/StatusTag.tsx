export type JobStatus =
  | 'started'
  | 'step1_create_workspace'
  | 'step2_creating_flashcards'
  | 'step3_building_deck'
  | 'stale'
  | 'failed'
  | 'cancelled';

interface Prop {
  status: JobStatus;
}

function getStatusStyle(status: JobStatus): { className: string; dotColor: string } {
  switch (status) {
    case 'started':
      return { className: 'stripe-status-info', dotColor: '#3b82f6' };
    case 'step1_create_workspace':
    case 'step2_creating_flashcards':
    case 'step3_building_deck':
      return { className: 'stripe-status-info', dotColor: '#3b82f6' };
    case 'failed':
      return { className: 'stripe-status-danger', dotColor: '#ef4444' };
    case 'cancelled':
      return { className: 'stripe-status-danger', dotColor: '#ef4444' };
    default:
      return { className: 'stripe-status-warning', dotColor: '#f59e0b' };
  }
}

function getStatusText(status: JobStatus): string {
  switch (status) {
    case 'started':
      return 'To Do';
    case 'step1_create_workspace':
    case 'step2_creating_flashcards':
    case 'step3_building_deck':
      return 'In Progress';
    case 'stale':
      return 'Stuck';
    case 'failed':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'In Progress';
  }
}

export function StatusTag({ status }: Prop) {
  const { className, dotColor } = getStatusStyle(status);
  const displayText = getStatusText(status);

  return (
    <span className={`stripe-status ${className}`}>
      <span className="stripe-status-dot" style={{ backgroundColor: dotColor }}></span>
      {displayText}
    </span>
  );
}
