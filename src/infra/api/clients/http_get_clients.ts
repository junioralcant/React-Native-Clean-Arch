import {Json} from '../../types/json';

export type GetParams = {
  url: string;
  headers?: any;
  params?: Record<string, string | null>;
  queryString?: Record<string, string>;
};

export interface HttpGetClient {
  get<T>(params: GetParams): Promise<T>;
}
