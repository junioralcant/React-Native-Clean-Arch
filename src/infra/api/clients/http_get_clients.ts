import {Json} from '../../types/json';

type GetParams = {
  url: string;
  params: Json;
};

export interface HttpGetClient {
  get<T>(params: GetParams): Promise<T>;
}
