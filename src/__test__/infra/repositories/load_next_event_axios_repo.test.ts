import {expect, it, describe} from '@jest/globals';

import {
  loadNextEventParams,
  LoadNextEventRepository,
} from '../../../domain/repository/load_next_repo';
import {NextEventEntity} from '../../../domain/entities/next_event_';
import {faker} from '@faker-js/faker';

interface IHttpClient<T = any> {
  get(url: string): Promise<T>;
}

class HttpClientSpy implements IHttpClient {
  callsCount = 0;
  method = '';

  async get(url: string): Promise<any> {
    this.method = 'get';
    this.callsCount++;
  }
}

class LoadNextEventRepositoryAxios implements LoadNextEventRepository {
  constructor(private readonly httpClient: IHttpClient<NextEventEntity>) {}
  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    await this.httpClient.get('');
    return {} as NextEventEntity;
  }
}

describe('LoadNextEventRepositoryAxios', () => {
  it('should request with correct method', async () => {
    const httpClient = new HttpClientSpy();
    const groupId = faker.string.uuid();
    const sut = new LoadNextEventRepositoryAxios(httpClient);
    await sut.loadNextEvent({groupId});

    expect(httpClient.method).toBe('get');
    expect(httpClient.callsCount).toBe(1);
  });
});
