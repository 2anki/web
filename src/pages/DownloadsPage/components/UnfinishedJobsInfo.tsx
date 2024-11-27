export interface UnfinishedJobsInfoProps {
  visible: boolean;
}

export function UnfinishedJobsInfo({ visible }: UnfinishedJobsInfoProps) {
  if (!visible) {
    return null;
  }

  return (
    <div>
      <h4 className="title is-4">Preparing Download</h4>
      <p className="mt-2">
        Your download is being prepared. This may take a few moments, so please
        be patient.
      </p>
    </div>
  );
}
