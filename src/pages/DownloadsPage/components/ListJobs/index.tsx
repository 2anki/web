import { useState } from 'react';
import Jobs, { JobsId } from '../../../../schemas/public/Jobs';
import { JobStatus, StatusTag } from './StatusTag';
import { getDistance } from '../../../../lib/getDistance';
import RefreshIcon from '../../../../components/icons/RefreshIcon';
import TrashIcon from '../../../../components/icons/TrashIcon';
import './ListJobs.css';
import sharedStyles from '../../../../styles/shared.module.css';

interface Props {
  readonly jobs: Jobs[];
  readonly deleteJob: (id: JobsId) => void;
  readonly restartJob: (job: Jobs) => void;
  readonly refreshJobs: () => Promise<void>;
}

export default function Index({
  jobs,
  deleteJob,
  restartJob,
  refreshJobs,
}: Props) {
  const [hover, setHover] = useState<JobsId | null>(null);

  const isFailedJob = (status: JobStatus) => status === 'failed';
  const isDoneJob = (status: JobStatus) => status === 'done';

  const renderStatusCell = (j: Jobs) => {
    if (isDoneJob(j.status as JobStatus)) {
      return (
        <a
          href={`/api/upload/jobs/${j.object_id}/download`}
          className="stripe-button stripe-button-primary"
        >
          Download
        </a>
      );
    }
    if (isFailedJob(j.status as JobStatus)) {
      return j.job_reason_failure ? (
        <div className="stripe-error">Reason: {j.job_reason_failure}</div>
      ) : null;
    }
    return <StatusTag status={j.status as JobStatus} />;
  };

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="stripe-container">
      <table className="stripe-table">
        <thead>
          <tr>
            <th className={sharedStyles.actionColumnNarrow}>Action</th>
            <th>Name</th>
            <th>Service</th>
            <th>Started</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr
              key={j.id}
              onMouseEnter={() => setHover(j.id)}
              onMouseLeave={() => setHover(null)}
            >
              <td>
                <div className="stripe-actions">
                  {isFailedJob(j.status as JobStatus) && j.restartable && (
                    <button
                      type="button"
                      onClick={() => restartJob(j)}
                      className="stripe-button stripe-button-warning"
                      title="Restart"
                      aria-label="Restart job"
                    >
                      <RefreshIcon width={16} height={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteJob(j.id)}
                    className="stripe-button stripe-button-danger"
                    title={
                      isFailedJob(j.status as JobStatus) ? 'Delete' : 'Cancel'
                    }
                    aria-label={
                      isFailedJob(j.status as JobStatus)
                        ? 'Delete job'
                        : 'Cancel job'
                    }
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
              </td>
              <td data-hj-suppress>
                <div className="stripe-job-title">{j.title}</div>
              </td>
              <td>{j.type ?? 'Notion'}</td>
              <td>
                {j.created_at && (
                  <div className="stripe-time-ago">
                    Started {getDistance(j.created_at)} ago
                  </div>
                )}
              </td>
              <td>{renderStatusCell(j)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
