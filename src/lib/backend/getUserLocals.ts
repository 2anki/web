import { get } from './api';
import { get2ankiApi } from './get2ankiApi';

interface GetUserLocalsResponse {
  locals: {
    owner: number;
    patreon: boolean;
    subscriber: boolean;
  };
}

export const getUserLocals = async (): Promise<GetUserLocalsResponse> => get(`${get2ankiApi().baseURL}users/debug/locals`);
