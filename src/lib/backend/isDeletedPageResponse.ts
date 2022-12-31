export const isDeletedPageResponse = (error: unknown) => {
  const knownError = error as Error;
  return knownError.message === "Request failed with status code 404";
};
