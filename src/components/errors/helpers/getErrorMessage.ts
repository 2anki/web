export type ErrorHandlerType = (error: unknown) => void;

export const getErrorMessage = (error: unknown): string => {
  let msg = 'Unknown error';
  if (error instanceof Error) {
    msg = `<h1 class='title is-4'>${error.message}</h1>`;
  } else if (typeof error === 'string') {
    return error;
  }
  return msg;
};
