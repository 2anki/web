export type ErrorHandlerType = (error: ErrorType) => void;

export type ServerError = { message: string };

export type ErrorType = Error | string | null;
