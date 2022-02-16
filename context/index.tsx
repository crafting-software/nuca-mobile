import { useState, useMemo, ReactNode } from 'react';
import { AuthContext, Auth } from './AuthContext';

export { AuthContext, Auth };

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({ inProgress: false });

  const authValue = useMemo(() => ({ auth, setAuth }), [auth]);

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
