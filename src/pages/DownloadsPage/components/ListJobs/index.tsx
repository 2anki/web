import { useState } from 'react';
import Jobs, { JobsId } from '../../../../schemas/public/Jobs';
import { JobStatus, StatusTag } from './StatusTag';
import { getDistance } from '../../../../lib/getDistance';

interface Props {
  jobs: Jobs[];
  deleteJob: (id: JobsId) => void;
  restartJob: (job: Jobs) => void;
}

export default function Index({ jobs, deleteJob, restartJob }: Props) {
  const [hover, setHover] = useState<JobsId | null>(null);

  const isFailedJob = (status: JobStatus) => status === 'failed';

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th className="is-narrow">Action</th>
            <th>Name</th>
            <th>Started</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr
              key={j.id}
              className={`${hover === j.id ? 'has-background-info-light' : ''}`}
              onMouseEnter={() => setHover(j.id)}
              onMouseLeave={() => setHover(null)}
            >
              <td>
                <button
                  type="button"
                  onClick={() =>
                    isFailedJob(j.status as JobStatus)
                      ? restartJob(j)
                      : deleteJob(j.id)
                  }
                  className={`button is-small ${isFailedJob(j.status as JobStatus) ? 'is-warning' : 'is-danger'} is-light`}
                >
                  {isFailedJob(j.status as JobStatus) ? 'Restart' : 'Cancel'}
                </button>
              </td>
              <td>{j.title}</td>
              <td>
                {j.created_at && `Started ${getDistance(j.created_at)} ago`}
              </td>
              <td>
                <StatusTag status={j.status as JobStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
