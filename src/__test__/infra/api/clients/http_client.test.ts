import {expect, it, describe, beforeEach} from '@jest/globals';
import {ClientSpy} from './client_spy';
import {anyString} from '../../../helpers/fakes';

class HttpClient {
  constructor(private readonly client: ClientSpy) {}

  async get({
    url,
    headers,
    params,
    queryString,
  }: {
    url: string;
    headers?: any;
    params?: Record<string, string | null>;
    queryString?: Record<string, string>;
  }) {
    const allHeaders = {
      ...headers,
      'content-type': 'application/json',
      accept: 'application/json',
    };

    const uri = this.buildUri(url, params, queryString);

    this.client.get(uri, allHeaders);
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
describe('HttpClient', () => {
  let client: ClientSpy;
  let sut: HttpClient;
  let url: string;

  beforeEach(() => {
    client = new ClientSpy();
    sut = new HttpClient(client);
    url = anyString();
  });

  describe('get', () => {
    it('should request with correct method', async () => {
      await sut.get({url});
      expect(client.method).toBe('get');
      expect(client.callsCount).toBe(1);
    });

    it('should request with correct url', async () => {
      await sut.get({url});
      expect(client.url).toBe(url);
    });

    it('should request with default headers', async () => {
      await sut.get({url});
      expect(client?.headers['content-type']).toBe(`application/json`);
      expect(client?.headers['accept']).toBe(`application/json`);
    });

    it('should append headers', async () => {
      const headers = {
        h1: 'value1',
        h2: 'value2',
      };

      await sut.get({url, headers});
      expect(client?.headers['content-type']).toBe(`application/json`);
      expect(client?.headers['accept']).toBe(`application/json`);
      expect(client?.headers['h1']).toBe(`value1`);
      expect(client?.headers['h2']).toBe(`value2`);
    });

    it('should request with correct params', async () => {
      url = 'http://any_url.com/:param1/:param2';
      await sut.get({
        url,
        params: {
          param1: 'value1',
          param2: 'value2',
        },
      });
      expect(client.url).toBe('http://any_url.com/value1/value2');
    });

    it('should request with optional param', async () => {
      url = 'http://any_url.com/:param1/:param2';
      await sut.get({
        url,
        params: {
          param1: 'value1',
          param2: null,
        },
      });
      expect(client.url).toBe('http://any_url.com/value1');
    });

    it('should request with correct queryString', async () => {
      await sut.get({
        url,
        queryString: {
          query1: 'value1',
          query2: 'value2',
        },
      });
      expect(client.url).toBe(`${url}?query1=value1&query2=value2`);
    });

    it('should request with correct queryString and params', async () => {
      url = 'http://any_url.com/:param3/:param4';

      await sut.get({
        url,
        queryString: {
          query1: 'value1',
          query2: 'value2',
        },
        params: {
          param3: 'value3',
          param4: 'value4',
        },
      });
      expect(client.url).toBe(
        `http://any_url.com/value3/value4?query1=value1&query2=value2`,
      );
    });
  });
});
