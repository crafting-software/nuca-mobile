import { makeRequest } from './server';

export const signIn2 = async (
  username: string,
  password: string
): Promise<{ success: boolean; message?: string; token?: string }> => {
  const { error, data } = await makeRequest({
    path: '/login',
    method: 'POST',
    body: { username, password },
  });

  if (error) {
    const message = typeof error === 'string' ? error : (error as any).message;
    return { success: false, message };
  }

  return { success: true, token: data.token };
};
