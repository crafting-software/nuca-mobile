import { Dispatch, SetStateAction, createContext } from 'react';

export type Auth = {
  userName?: string;
  inProgress: boolean;
  token?: string;
};

interface AuthContext {
  auth: Auth;
  setAuth: Dispatch<SetStateAction<Auth>>;
}

export const AuthContext = createContext<AuthContext>({
  auth: { inProgress: true },
  setAuth: () => {},
});
