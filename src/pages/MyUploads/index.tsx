import Backend from "../../lib/backend";
import ActiveJobs from "./components/ActiveJobs";

import useUploads from "./hooks/useUploads";
import useActiveJobs from "./hooks/useActiveJobs";
import LoadingIndicator from "../../components/Loading";
import { ErrorHandlerType, ErrorType } from "../../components/errors/helpers/types";
import { FinishedJobs } from "./components/FinishedJobs";
import { EmptyUploadsSection } from "./components/EmptyUploadsSection";
import { DeleteAllButton } from "./components/DeleteAllButton";
import { useDeleteUpload } from "./hooks/useDeleteUpload";
import { useDeleteAll } from "./hooks/useDeleteAll";
import { getUploadIdsOrEmptyArray } from "./helpers/getUploadIdsOrEmptyArray";

const backend = new Backend();

interface MyUploadsPageProps {
  setError: ErrorHandlerType;
}

function MyUploadsPage({ setError }: MyUploadsPageProps) {
  const {deleteUpload, deleteUploadError, isDeleting} = useDeleteUpload(backend);
  const {loading, uploads,  error} =
    useUploads(backend);
  const [activeJobs, deleteJob] = useActiveJobs(backend, setError);
  const {deleteAllUploads, isDeletingAll, deleteAllError} = useDeleteAll(backend, getUploadIdsOrEmptyArray(uploads));

  const e = error || deleteAllError || deleteUploadError;
  if (e) {
    setError(e as ErrorType);
  }

  console.log("loading", loading);
  if (loading || isDeletingAll || isDeleting) {
    return <LoadingIndicator />;
  }

  return (
    <section className="section">
        <div className="container">
          <div className="is-flex is-justify-content-space-between">
            <h1 className="title">My Uploads</h1>
            <DeleteAllButton
              uploads={uploads}
              isDeletingAll={isDeletingAll}
                             deleteAllUploads={deleteAllUploads} />
          </div>
          <ActiveJobs jobs={activeJobs} deleteJob={(id) => deleteJob(id)} />
          <EmptyUploadsSection uploads={uploads} />
          <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
        </div>
      </section>
  );
}

export default MyUploadsPage;
