import {expect, it, describe, beforeEach} from '@jest/globals';
import {anyString} from '../../../helpers/fakes';
import {Json} from '../../../../infra/types/json';
import {
  GetParams,
  HttpGetClient,
} from '../../../../infra/api/clients/http_get_clients';
import {LoadNextEventApiRepository} from '../../../../infra/api/repositories/load_next_event_api_repo';

class HttpGetClientSpy implements HttpGetClient {
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

describe('LoadNextEventApiRepository', () => {
  let groupId: string;
  let url: string;
  let httpClient: HttpGetClientSpy;
  let sut: LoadNextEventApiRepository;

  beforeEach(() => {
    groupId = anyString();
    url = anyString();
    httpClient = new HttpGetClientSpy();
    httpClient.response = {
      date: '2024-01-01T10:30',
      groupName: 'any_name',
      players: [
        {
          id: 'id 1',
          name: 'name 1',
          isConfirmed: true,
        },
        {
          id: 'id 2',
          name: 'name 2',
          isConfirmed: false,
          position: 'position 2',
          confirmationDate: '2024-01-01T10:30',
          photo: 'photo 2',
        },
      ],
    };
    sut = new LoadNextEventApiRepository(httpClient, url);
  });

  it('should call HttpClient with correct URL and params', async () => {
    await sut.loadNextEvent({groupId});
    expect(httpClient.url).toBe(url);
    expect(httpClient.params).toEqual({groupId});
    expect(httpClient.callsCount).toBe(1);
  });

  it('should request NextEvent on success', async () => {
    const event = await sut.loadNextEvent({groupId});
    expect(event.groupName).toBe('any_name');
    expect(event.date).toBe('2024-01-01T10:30');

    expect(event.players[0].id).toBe('id 1');
    expect(event.players[0].name).toBe('name 1');
    expect(event.players[0].isConfirmed).toBe(true);

    expect(event.players[1].id).toBe('id 2');
    expect(event.players[1].name).toBe('name 2');
    expect(event.players[1].position).toBe('position 2');
    expect(event.players[1].photo).toBe('photo 2');
    expect(event.players[1].confirmationDate).toBe('2024-01-01T10:30');

    expect(event.players[1].isConfirmed).toBe(false);
  });

  it('should rethrow on error', async () => {
    const error = new Error('error');
    httpClient.error = error;
    const response = sut.loadNextEvent({groupId});
    expect(response).rejects.toThrow(error);
  });
});
