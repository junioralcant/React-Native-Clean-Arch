import {expect, it, describe, beforeEach} from '@jest/globals';
import {ClientSpy} from './client_spy';
import {anyString} from '../../../helpers/fakes';

class HttpClient {
  constructor(private readonly client: ClientSpy) {}

  async get({url}: {url: string}) {
    this.client.get(url);
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
  });
});
