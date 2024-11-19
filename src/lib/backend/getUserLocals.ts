import { useCookies } from 'react-cookie';
import { get } from './api';
import { get2ankiApi } from './get2ankiApi';
import Users from '../../schemas/public/Users';

interface GetUserLocalsResponse {
  locals: {
    owner: number;
    patreon: boolean;
    subscriber: boolean;
  };
  linked_email: string;
  user?: Users;
}

export const getUserLocals = async (): Promise<GetUserLocalsResponse> => {
  const [, , removeCookie] = useCookies(['token']);

  try {
    return await get(`${get2ankiApi().baseURL}users/debug/locals`);
  } catch (error) {
    removeCookie('token');
    window.location.href = '/login';
    throw error;
  }
};
