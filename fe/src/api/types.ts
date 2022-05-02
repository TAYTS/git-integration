import { AxiosRequestConfig } from 'axios';

export type RequestProps = AxiosRequestConfig & {
  query?: { [key: string]: string | string[] | boolean | number };
};
