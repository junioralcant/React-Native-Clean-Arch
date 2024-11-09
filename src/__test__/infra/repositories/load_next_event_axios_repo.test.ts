import {expect, it, describe, beforeEach} from '@jest/globals';

import {
  loadNextEventParams,
  LoadNextEventRepository,
} from '../../../domain/repository/load_next_repo';
import {NextEventEntity} from '../../../domain/entities/next_event_';
import {anyString} from '../../helpers/fakes';

interface IHttpClient<T = any> {
  get(url: string, headers?: any): Promise<T>;
}

class HttpClientSpy implements IHttpClient {
  callsCount = 0;
  method = '';
  url = '';
  headers: Record<string, string> = {};

  async get(url: string, headers?: any): Promise<any> {
    this.headers = headers;
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
    const headers = {
      'content-type': 'application/json',
      accept: 'application/json',
    };
    await this.httpClient.get(url, headers);
    return {} as NextEventEntity;
  }
}

describe('LoadNextEventRepositoryAxios', () => {
  let groupId: string;
  let url: string;
  let httpClient: HttpClientSpy;
  let sut: LoadNextEventRepositoryAxios;

  beforeEach(() => {
    groupId = anyString();
    url = `https://domain.com/api/groups/:groupId/next_events`;
    httpClient = new HttpClientSpy();
    sut = new LoadNextEventRepositoryAxios(httpClient, url);
  });

  it('should request with correct method', async () => {
    await sut.loadNextEvent({groupId});
    expect(httpClient.method).toBe('get');
    expect(httpClient.callsCount).toBe(1);
  });

  it('should request with correct url', async () => {
    await sut.loadNextEvent({groupId});
    expect(httpClient.url).toBe(
      `https://domain.com/api/groups/${groupId}/next_events`,
    );
  });

  it('should request with correct headers', async () => {
    await sut.loadNextEvent({groupId});
    expect(httpClient?.headers['content-type']).toBe(`application/json`);
    expect(httpClient?.headers['accept']).toBe(`application/json`);
  });
});
