import { refresh } from '@/entities/session/api/auth-api';
import { logout } from '@/entities/session/model/auth-slice';
import { BASE_URL } from '@/shared/config/base-api';
import { tokenManager } from '@/shared/lib/token-manager';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = tokenManager.getToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const handleLogout = (dispatch: (action: ReturnType<typeof logout>) => void): void => {
  tokenManager.clearToken();
  localStorage.removeItem('refreshToken');
  dispatch(logout());
};

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const requestUrl = typeof args === 'string' ? args : args.url;

  if (requestUrl === '/auth/refresh') {
    handleLogout(api.dispatch);
    return result;
  }

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    handleLogout(api.dispatch);
    return result;
  }

  try {
    const refreshResponse = await refresh({ refreshToken });
    tokenManager.setToken(refreshResponse.accessToken);
    result = await rawBaseQuery(args, api, extraOptions);
  } catch {
    handleLogout(api.dispatch);
  }

  return result;
};
