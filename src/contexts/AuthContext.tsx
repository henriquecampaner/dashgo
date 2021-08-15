import { useContext } from 'react';
import { useState } from 'react';
import { createContext, ReactNode } from 'react';
import { authApi } from '../services/api';
import { useRouter } from 'next/router';
type User = {
  email: string;
  permissions: string[];
  roles: string[];
  name: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const { push } = useRouter();

  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await authApi.post('sessions', {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles, name } =
        response.data;

      setUser({
        email,
        permissions,
        roles,
        name,
      });

      console.log(response.data);

      push('/users');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
