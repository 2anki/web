import { JobRow } from '../styled';
import Jobs, { JobsId } from '../../../../schemas/public/Jobs';
import { RefreshButton } from './RefreshButton';
import { DeleteButton } from './DeleteButton';
import { Listheader } from './ListHeader';
import { isFailedJob } from '../../helpers/isFailedJob';
import { JobStatus, StatusTag } from './StatusTag';

interface Props {
  jobs: Jobs[];
  deleteJob: (id: JobsId) => void;
  restartJob: (job: Jobs) => void;
}

export default function Index({ jobs, deleteJob, restartJob }: Props) {
  if (!jobs || jobs.length === 0) {
    return null;
  }


  const jobRows = <ul className="my-2">
    {jobs.map((j) => (
      <div key={j.id} className="is-flex is-justify-content-space-between ">
        <JobRow>
          <StatusTag status={j.status as JobStatus} />
          {j.title}
        </JobRow>
        <div>
          <div className="is-pulled-right">
            <DeleteButton onDelete={() => deleteJob(j.id)} />
            {isFailedJob(j) && <RefreshButton onRefresh={() => restartJob(j)} />}
          </div>
        </div>
      </div>
    ))}
  </ul>;

  return (
    <div className="" data-hj-suppress>
      <Listheader />
      {jobRows}
    </div>
  );
}
