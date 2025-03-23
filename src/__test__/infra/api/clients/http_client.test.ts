import {expect, it, describe, beforeEach} from '@jest/globals';
import {ClientSpy} from './client_spy';
import {anyString} from '../../../helpers/fakes';

class HttpClient {
  constructor(private readonly client: ClientSpy) {}

  async get({url, headers}: {url: string; headers?: any}) {
    const allHeaders = {
      ...headers,
      'content-type': 'application/json',
      accept: 'application/json',
    };

    this.client.get(url, allHeaders);
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
  });
});
