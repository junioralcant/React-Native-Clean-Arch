import {SessionExpiredError} from '../../../domain/erros/sesstion_expired_error';
import {UnexpectedError} from '../../../domain/erros/unexpecte_error';
import {GetParams, HttpGetClient} from '../clients/http_get_clients';
import {HttpResponse, IClient, StatusCode} from '../contracts/client';

export class HttpAdapter implements HttpGetClient {
  constructor(private readonly client: IClient) {}

  async get<T = any>({
    url,
    headers = {},
    params,
    queryString,
  }: GetParams): Promise<T> {
    const uri = this.buildUri(url, params, queryString);

    const response = await this.client.get(uri, this.buildHeaders(headers));

    return this.handleResponse<T>(response);
  }

  private buildHeaders(
    headers: Record<string, string>,
  ): Record<string, string> {
    const defaultHeaders = {
      'content-type': 'application/json',
      accept: 'application/json',
    };

    const allHeadersConvertedToString = Object.entries(headers).reduce(
      (acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      },
      headers,
    );

    return {
      ...allHeadersConvertedToString,
      ...defaultHeaders,
    };
  }

  private handleResponse<T>(response: HttpResponse): T {
    switch (response.statusCode) {
      case StatusCode.Success:
        return response.data;
      case StatusCode.UnauthorizedError:
        throw new SessionExpiredError();
      default:
        throw new UnexpectedError();
    }
  }

  private buildUri(
    url: string,
    params?: GetParams['params'],
    queryString?: GetParams['queryString'],
  ) {
    if (params) {
      url = Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`:${key}`, value?.toString() ?? ''),
        url,
      );
    }

    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    if (queryString) {
      url = Object.entries(queryString)
        .reduce((acc, [key, value]) => `${acc}${key}=${value}&`, (url += '?'))
        .slice(0, -1);
    }

    return url;
  }
}
