import { castToUser, User } from '../models/User';
import { makeRequest } from './server';

export const loadUsers = async (): Promise<{
  success: boolean;
  users: User[];
}> => {
  const { error, data } = await makeRequest({
    path: '/users',
    method: 'GET',
  });

  if (error) {
    console.log('loading users failed', error);
    return { success: false, users: [] };
  }

  return { success: true, users: data.map(castToUser) };
};
