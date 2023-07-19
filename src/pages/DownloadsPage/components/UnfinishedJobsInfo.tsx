import { getVisibleText } from '../../../lib/text/getVisibleText';

export interface UnfinishedJobsInfoProps {
  visible: boolean;
}

export function UnfinishedJobsInfo({ visible }: UnfinishedJobsInfoProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="notification">
      <p className="mt-2">{getVisibleText('downloads.unfinished.jobs')}</p>
    </div>
  );
}
