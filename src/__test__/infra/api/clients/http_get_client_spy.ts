import {
  GetParams,
  HttpGetClient,
} from '../../../../infra/api/clients/http_get_clients';
import {Json} from '../../../../infra/types/json';

export class HttpGetClientSpy implements HttpGetClient {
  url? = '';
  callsCount = 0;
  params: Record<string, string | null> | undefined = {};
  queryString: Record<string, string> | undefined = {};
  headers: any;
  response: any = {};
  error?: Error;

  async get<T>(params: GetParams): Promise<T> {
    this.url = params.url;
    this.params = params.params;
    this.queryString = params.queryString;
    this.headers = params.headers;
    this.callsCount++;
    if (this.error) throw this.error;
    return this.response;
  }
}
