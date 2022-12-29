import { ActiveJob } from '../../../lib/types';
import { JobRow } from './styled';

interface Props {
  jobs: ActiveJob[];
  deleteJob: (id: string) => void;
}

export default function ActiveJobs({ jobs, deleteJob }: Props) {
  return (
    <div className='' data-hj-suppress>
      <h2 className="title is-2">Active Jobs</h2>
      <div className="is-pulled-right">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/uploads/mine';
          }}
          className="button"
        >
          Refresh
        </button>
      </div>
      <ul className="my-2">
        {jobs.map((j) => (
          <JobRow>
            <button
              aria-label="delete"
              type="button"
              className="delete"
              onClick={() => deleteJob(j.object_id)}
            />
            <span className="button is-small mx-2 is-info">{j.status || j.object_id}</span>
            {j.title}
          </JobRow>
        ))}
      </ul>
    </div>
  );
}
