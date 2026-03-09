import { InternalAxiosRequestConfig } from 'axios';

// axios 재시도
export type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};
