import {Json} from '../../types/json';

export type GetParams = {
  url: string;
  params: Json;
};

export interface HttpGetClient {
  get<T>(params: GetParams): Promise<T>;
}
