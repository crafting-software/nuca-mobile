export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
};

export const castToUser = (
  backendUser: User & { full_name: string }
): User => ({
  ...backendUser,
  name: backendUser.full_name,
});
