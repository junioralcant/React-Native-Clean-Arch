import {
  HttpResponse,
  IHttpClient,
} from '../../../../infra/api/repositories/load_next_event_repository';

export class HttpClientSpy implements IHttpClient {
  callsCount = 0;
  method = '';
  url = '';
  headers: Record<string, string> = {};
  response = {};
  statusCode = 200;

  async get(url: string, headers?: any): Promise<HttpResponse> {
    this.headers = headers;
    this.method = 'get';
    this.url = url;
    this.callsCount++;
    return {data: this.response, statusCode: this.statusCode};
  }
}
