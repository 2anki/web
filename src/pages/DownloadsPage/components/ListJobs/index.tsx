import { useState } from 'react';
import Jobs, { JobsId } from '../../../../schemas/public/Jobs';
import { JobStatus, StatusTag } from './StatusTag';
import { getDistance } from '../../../../lib/getDistance';
import RefreshIcon from '../../../../components/icons/RefreshIcon';
import TrashIcon from '../../../../components/icons/TrashIcon';
import './ListJobs.css';

interface Props {
  jobs: Jobs[];
  deleteJob: (id: JobsId) => void;
  restartJob: (job: Jobs) => void;
  refreshJobs: () => Promise<void>;
}

export default function Index({ jobs, deleteJob, restartJob, refreshJobs }: Props) {
  const [hover, setHover] = useState<JobsId | null>(null);

  const isFailedJob = (status: JobStatus) => status === 'failed';

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="stripe-container">
      <table className="stripe-table">
        <thead>
        <tr>
          <th style={{ width: '120px' }}>Action</th>
          <th>Name</th>
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
                {isFailedJob(j.status as JobStatus) && (
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
                  title={isFailedJob(j.status as JobStatus) ? 'Delete' : 'Cancel'}
                  aria-label={isFailedJob(j.status as JobStatus) ? 'Delete job' : 'Cancel job'}
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </div>
            </td>
            <td data-hj-suppress>
              <div className="stripe-job-title">{j.title}</div>
            </td>
            <td>
              {j.created_at && (
                <div className="stripe-time-ago">
                  Started {getDistance(j.created_at)} ago
                </div>
              )}
            </td>
            <td>
              {isFailedJob(j.status as JobStatus) ? (
                j.job_reason_failure && (
                  <div className="stripe-error">
                    Reason: {j.job_reason_failure}
                  </div>
                )
              ) : (
                <StatusTag status={j.status as JobStatus} />
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
