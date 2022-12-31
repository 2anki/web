import UserUpload from "../../../lib/interfaces/UserUpload";

export const getUploadIdsOrEmptyArray = (uploads: UserUpload[] | undefined) => {
  if (!uploads) {
    return [];
  }
  return uploads.map(u => u.key);
}