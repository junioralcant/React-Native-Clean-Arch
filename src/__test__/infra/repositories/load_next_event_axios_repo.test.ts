import {expect, it, describe} from '@jest/globals';

import {
  loadNextEventParams,
  LoadNextEventRepository,
} from '../../../domain/repository/load_next_repo';
import {NextEventEntity} from '../../../domain/entities/next_event_';
import {anyString} from '../../helpers/fakes';

interface IHttpClient<T = any> {
  get(url: string): Promise<T>;
}

class HttpClientSpy implements IHttpClient {
  callsCount = 0;
  method = '';
  url = '';

  async get(url: string): Promise<any> {
    this.method = 'get';
    this.url = url;
    this.callsCount++;
  }
}

class LoadNextEventRepositoryAxios implements LoadNextEventRepository {
  constructor(
    private readonly httpClient: IHttpClient<NextEventEntity>,
    private readonly url: string,
  ) {}
  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    const url = this.url.replace(':groupId', groupId);
    await this.httpClient.get(url);
    return {} as NextEventEntity;
  }
}

describe('LoadNextEventRepositoryAxios', () => {
  it('should request with correct method', async () => {
    const httpClient = new HttpClientSpy();
    const groupId = anyString();
    const sut = new LoadNextEventRepositoryAxios(httpClient, '');
    await sut.loadNextEvent({groupId});

    expect(httpClient.method).toBe('get');
    expect(httpClient.callsCount).toBe(1);
  });

  it('should request with correct url', async () => {
    const groupId = anyString();
    const url = `https://domain.com/api/groups/:groupId/next_events`;
    const httpClient = new HttpClientSpy();
    const sut = new LoadNextEventRepositoryAxios(httpClient, url);
    await sut.loadNextEvent({groupId});

    expect(httpClient.url).toBe(
      `https://domain.com/api/groups/${groupId}/next_events`,
    );
  });
});
