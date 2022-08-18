import axios from 'axios';
import { ErrorType, ServerError } from './types';

export const getErrorMessage = (error: ErrorType): string => {
  let msg = 'Unknown error';

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ServerError;
    if (data.message) {
      msg = `<h1 class='title is-4'>${data.message}</h1>`;
    }
  } else if (error instanceof Error) {
    msg = `<h1 class='title is-4'>${error.message}</h1>`;
  }

  return msg;
};
