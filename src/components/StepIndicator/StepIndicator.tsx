import styles from './StepIndicator.module.css';
import { StepIndex } from './jobStepFromStatus';

interface Props {
  readonly currentStep: StepIndex;
  readonly substep?: string;
}

const STEP_LABELS = ['Uploaded', 'Parsing', 'Generating', 'Packaging'] as const;

export function StepIndicator({ currentStep, substep }: Props) {
  return (
    <div
      className={styles.indicator}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={STEP_LABELS.length}
      aria-valuenow={currentStep}
      aria-valuetext={`Step ${currentStep} of ${STEP_LABELS.length}: ${STEP_LABELS[currentStep - 1]}${substep ? ` (${substep})` : ''}`}
    >
      {STEP_LABELS.map((label, index) => {
        const step = (index + 1) as StepIndex;
        let pillClass = styles.pillPending;
        if (step < currentStep) {
          pillClass = styles.pillDone;
        } else if (step === currentStep) {
          pillClass = styles.pillActive;
        }
        return (
          <span key={label} className={`${styles.pill} ${pillClass}`}>
            <span className={styles.dot} />
            {label}
            {step === currentStep && substep && (
              <span className={styles.substep}>({substep})</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
