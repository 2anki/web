import { post } from './api';

export const postLinkEmail = (email: string) => post('/api/users/link_email', { email });
