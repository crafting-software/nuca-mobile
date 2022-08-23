import { Dispatch, SetStateAction, createContext } from 'react';

export interface Auth {
  username?: string;
  inProgress: boolean;
  token?: string;
}

export interface AuthContext {
  auth: Auth;
  setAuth: Dispatch<SetStateAction<Auth>>;
}

export const AuthContext = createContext<AuthContext>({
  auth: { inProgress: true },
  setAuth: () => {},
});
