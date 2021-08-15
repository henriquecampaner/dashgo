import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false;
let failedRequestQueue = [];

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export function setupApiClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const authApi = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['dashgo.token']}`,
    },
  });

  // Intercept all requests
  authApi.interceptors.response.use(
    // If response ok, just keep going
    (response) => {
      return response;
    },
    // On error:
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          // Get the latest cookies
          cookies = parseCookies(ctx);

          const { 'dashgo.refreshToken': refreshToken } = cookies;

          // get all the requests with error and their configs (routes, params, etc)
          const originalConfig = error.config;

          // This will prevent rerequests
          if (!isRefreshing) {
            isRefreshing = true;

            authApi
              .post('/refresh', {
                refreshToken,
              })
              .then((res) => {
                const { token } = res.data;

                setCookie(ctx, 'dashgo.token', token, {
                  maxAge: 60 * 60 * 30, // 30 days
                  path: '/', //all addresses (global)
                });

                setCookie(
                  ctx,
                  'dashgo.refreshToken',
                  res.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 30, // 30 days
                    path: '/', //all addresses (global)
                  }
                );

                authApi.defaults.headers[
                  'Authorization'
                ] = `Bearer ${token}`;

                // Request all the failures request with the new token
                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestQueue = [];
              })
              .catch((err) => {
                failedRequestQueue.forEach((request) =>
                  request.onFailure(err)
                );
                failedRequestQueue = [];

                if (process.browser) {
                  signOut();
                } else {
                  ``;
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }
          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers[
                  'Authorization'
                ] = `Bearer ${token}`;
                // Rerequest with new token

                resolve(authApi(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return authApi;
}
