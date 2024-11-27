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

function getIndicator(status: JobStatus) {
  switch (status) {
    case 'started':
      return 'is-info';
    case 'step1_create_workspace':
    case 'step2_creating_flashcards':
    case 'step3_building_deck':
      return 'is-info';
    default:
      return 'is-warning';
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
  const indicator = getIndicator(status);
  const displayText = getStatusText(status);

  return (
    <span className={`is-small mx-2 tag ${indicator}`}>{displayText}</span>
  );
}
