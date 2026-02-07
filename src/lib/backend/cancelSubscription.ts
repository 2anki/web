import { post } from './api';

const UNAUTHORIZED = 401;

export const cancelSubscription = async (): Promise<{ message: string }> => {
  try {
    const response = await post('/api/users/cancel-subscription', {});
    if (response?.status === UNAUTHORIZED) {
      globalThis.location.href = '/login';
      throw new Error('Authentication required');
    }
    if (response?.status !== 200) {
      throw new Error(
        `Failed to cancel subscription: ${
          response?.statusText || 'Unknown error'
        }`
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
