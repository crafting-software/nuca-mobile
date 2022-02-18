import { makeRequest } from './server';

export const signIn = async (username: string, password: string) => {
  const { error, data } = await makeRequest({
    path: '/login',
    method: 'POST',
    body: { username, password },
  });

  if (error) {
    console.log('sign in failed', error);
    const message = typeof error === 'string' ? error : (error as any).message;
    return { success: false, message };
  }

  return { success: true, token: data.token };
};
