import {expect, it, describe, beforeEach} from '@jest/globals';
import {ClientSpy} from './client_spy';

class HttpClient {
  constructor(private readonly client: ClientSpy) {}

  async get() {
    this.client.get('');
  }
}
describe('HttpClient', () => {
  let client: ClientSpy;
  let sut: HttpClient;

  beforeEach(() => {
    client = new ClientSpy();
    sut = new HttpClient(client);
  });

  describe('get', () => {
    it('should request with correct method', async () => {
      await sut.get();
      expect(client.method).toBe('get');
      expect(client.callsCount).toBe(1);
    });
  });
});
