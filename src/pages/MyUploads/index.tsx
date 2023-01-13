import Backend from "../../lib/backend";
import ActiveJobs from "./components/ActiveJobs";

import useUploads from "./hooks/useUploads";
import useActiveJobs from "./hooks/useActiveJobs";
import LoadingIndicator from "../../components/Loading";
import { ErrorHandlerType } from "../../components/errors/helpers/types";
import { FinishedJobs } from "./components/FinishedJobs";
import { EmptyUploadsSection } from "./components/EmptyUploadsSection";
import { DeleteAllButton } from "./components/DeleteAllButton";
import { useDeleteUpload } from "./hooks/useDeleteUpload";
import { useDeleteAll } from "./hooks/useDeleteAll";
import { getUploadIdsOrEmptyArray } from "./helpers/getUploadIdsOrEmptyArray";
import { Container } from "../../components/styled";
import { redirectOnError } from "../../components/shared/redirectOnError";

const backend = new Backend();

interface MyUploadsPageProps {
  setError: ErrorHandlerType;
}

function MyUploadsPage({ setError }: MyUploadsPageProps) {
  const { deleteUpload, deleteUploadError, isDeleting } =
    useDeleteUpload(backend);
  const { loading, uploads, error } = useUploads(backend);
  const [activeJobs, deleteJob] = useActiveJobs(backend, setError);
  const { deleteAllUploads, isDeletingAll, deleteAllError } = useDeleteAll(
    backend,
    getUploadIdsOrEmptyArray(uploads)
  );

  const e = error || deleteAllError || deleteUploadError;
  if (e) {
    redirectOnError(error);
    return null;
  }

  console.log("loading", loading);
  if (loading || isDeletingAll || isDeleting) {
    return <LoadingIndicator />;
  }

  return (
    <Container>
      <h1 className="title">My Uploads</h1>
      <div className="is-flex is-justify-content-space-between">
        <DeleteAllButton
          uploads={uploads}
          isDeletingAll={isDeletingAll}
          deleteAllUploads={deleteAllUploads}
        />
      </div>
      <ActiveJobs jobs={activeJobs} deleteJob={(id) => deleteJob(id)} />
      <EmptyUploadsSection uploads={uploads} />
      <FinishedJobs uploads={uploads} deleteUpload={deleteUpload} />
    </Container>
  );
}

export default MyUploadsPage;
