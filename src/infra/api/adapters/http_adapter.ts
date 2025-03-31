import {SessionExpiredError} from '../../../domain/erros/sesstion_expired_error';
import {UnexpectedError} from '../../../domain/erros/unexpecte_error';
import {IClient, StatusCode} from '../repositories/load_next_event_repository';

export class HttpAdapter {
  constructor(private readonly client: IClient) {}

  async get<T = any>({
    url,
    headers,
    params,
    queryString,
  }: {
    url: string;
    headers?: any;
    params?: Record<string, string | null>;
    queryString?: Record<string, string>;
  }): Promise<T> {
    const allHeaders = {
      ...headers,
      'content-type': 'application/json',
      accept: 'application/json',
    };

    const uri = this.buildUri(url, params, queryString);

    const response = await this.client.get(uri, allHeaders);

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
    params?: Record<string, string | null>,
    queryString?: Record<string, string>,
  ) {
    if (params) {
      url = Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`:${key}`, value ?? ''),
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
