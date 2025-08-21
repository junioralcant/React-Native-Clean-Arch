export type GetParams = {
    key: string;
  };
  
  export interface ICacheGetClient {
    get<T>(params: GetParams): Promise<T>;
  }
  
  export class CacheGetClientSpy implements ICacheGetClient {
    key? = '';
    callsCount = 0;
    response: any = {};
    error?: Error;
    async get<T>(params: GetParams): Promise<T> {
      this.key = params?.key;
      this.callsCount++;
      if (this.error) throw this.error;
      return this.response;
    }
  }