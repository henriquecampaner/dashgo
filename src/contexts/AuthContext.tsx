import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react';

import { setCookie, parseCookies, destroyCookie } from 'nookies';

import { authApi } from '../services/apiClient';
import Router from 'next/router';
import { AxiosError } from 'axios';
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
  signOut(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'dashgo.token');
  destroyCookie(undefined, 'dashgo.refreshToken');
  authChannel.postMessage('signOut');
  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');
    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          authChannel.close();
          break;

        case 'signIn':
          Router.push('/dashboard');

        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { 'dashgo.token': token } = parseCookies();

    if (token) {
      authApi
        .get('/me')
        .then((res) => {
          const { email, roles, permissions, name } = res.data;

          setUser({ email, permissions, roles, name });
        })
        .catch((er: AxiosError) => {
          signOut();
        });
    }
  }, []);

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

      setCookie(undefined, 'dashgo.token', token, {
        maxAge: 60 * 60 * 30, // 30 days
        path: '/', //all addresses (global)
      });
      setCookie(undefined, 'dashgo.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 30, // 30 days
        path: '/', //all addresses (global)
      });

      authApi.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');

      authChannel.postMessage('signIn');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ signOut, signIn, isAuthenticated, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
function push(arg0: string) {
  throw new Error('Function not implemented.');
}
