import {
  GetParams,
  HttpGetClient,
} from '../../../../infra/api/clients/http_get_clients';
import {Json} from '../../../../infra/types/json';

export class HttpGetClientSpy implements HttpGetClient {
  url? = '';
  callsCount = 0;
  params: Json = {};
  response: any = {};
  error?: Error;

  async get<T>(params: GetParams): Promise<T> {
    this.url = params.url;
    this.params = params.params;
    this.callsCount++;
    if (this.error) throw this.error;
    return this.response;
  }
}
