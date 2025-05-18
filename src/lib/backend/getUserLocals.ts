import { get } from './api';
import { get2ankiApi } from './get2ankiApi';
import Users from '../../schemas/public/Users';

interface ExtendedUser extends Users {
  picture?: string;
}

interface GetUserLocalsResponse {
  locals: {
    owner: number;
    patreon: boolean;
    subscriber: boolean;
    subscriptionInfo: {
      active: boolean;
      email: string;
      linked_email: string;
    };
  };
  linked_email: string;
  user?: ExtendedUser;
  features?: {
    kiUI: boolean;
  };
}

export const getUserLocals = async (): Promise<GetUserLocalsResponse> =>
  get(`${get2ankiApi().baseURL}users/debug/locals`);
