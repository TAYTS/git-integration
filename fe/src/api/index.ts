import axios, {
  AxiosRequestConfig,
  Method,
  AxiosPromise,
  AxiosRequestHeaders,
} from 'axios';
import queryString from 'query-string';
import { RequestProps } from './types';

/////////////////////////////////////////
/*             utils function           */
/////////////////////////////////////////
const buildHeader = (
  headers: AxiosRequestHeaders | undefined,
): AxiosRequestHeaders => {
  return {
    Accept: 'application/json, text/html',
    'Content-Type': 'application/json',
    ...headers,
  };
};

const request = <T>(props: RequestProps, method: Method): AxiosPromise<T> => {
  const { url, query, headers, ...rest } = props;

  const strQuery = queryString.stringify(query || {}, { encode: true });

  const apiURL = `${url}${strQuery ? `?${strQuery}` : ''}`;

  const axiosOptions: AxiosRequestConfig = {
    url: apiURL,
    method,
    headers: buildHeader(headers),
    ...rest,
  };

  return axios(axiosOptions);
};

const API = {
  get: <T>(props: RequestProps): AxiosPromise<T> => request<T>(props, 'GET'),
  post: <T>(props: RequestProps): AxiosPromise<T> => request<T>(props, 'POST'),
};

export default API;
