export type GetParams = {
    key: string;
  };
  
  export interface ICacheGetClient {
    get<T>(params: GetParams): Promise<T>;
  }
  