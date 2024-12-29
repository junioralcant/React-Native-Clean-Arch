import {expect, it, describe, beforeEach} from '@jest/globals';
import {anyString} from '../../../helpers/fakes';
import {LoadNextEventApiRepository} from '../../../../infra/api/repositories/load_next_event_api_repo';
import {HttpGetClientSpy} from '../clients/http_get_client_spy';
import {ClientSpy} from './client_spy';

class HttpClient {
  constructor(private readonly client: ClientSpy) {}

  async get() {
    this.client.get('');
  }
}
describe('HttpClient', () => {
  it('should request with correct method', async () => {
    const client = new ClientSpy();
    const sut = new HttpClient(client);
    await sut.get();
    expect(client.method).toBe('get');
    expect(client.callsCount).toBe(1);
  });
});
