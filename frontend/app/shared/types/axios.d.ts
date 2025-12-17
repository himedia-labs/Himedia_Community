import { InternalAxiosRequestConfig } from 'axios';

export type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};
