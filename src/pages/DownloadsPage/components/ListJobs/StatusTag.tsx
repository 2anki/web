import styles from '../../../../styles/shared.module.css';

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

function getStatusStyle(status: JobStatus): {
  className: string;
  dotClassName: string;
} {
  switch (status) {
    case 'started':
      return { className: 'stripe-status-info', dotClassName: styles.dotInfo };
    case 'step1_create_workspace':
    case 'step2_creating_flashcards':
    case 'step3_building_deck':
      return { className: 'stripe-status-info', dotClassName: styles.dotInfo };
    case 'failed':
    case 'cancelled':
      return {
        className: 'stripe-status-danger',
        dotClassName: styles.dotDanger,
      };
    default:
      return {
        className: 'stripe-status-warning',
        dotClassName: styles.dotWarning,
      };
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
  const { className, dotClassName } = getStatusStyle(status);
  const displayText = getStatusText(status);

  return (
    <span className={`stripe-status ${className}`}>
      <span className={`stripe-status-dot ${dotClassName}`} />
      {displayText}
    </span>
  );
}
