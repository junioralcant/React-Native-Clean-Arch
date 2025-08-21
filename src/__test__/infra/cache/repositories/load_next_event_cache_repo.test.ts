import {expect, it, describe, beforeEach} from '@jest/globals';
import {anyString} from '../../../helpers/fakes';

export type GetParams = {
  key: string;
};

export interface ICacheGetClient {
  get(params: GetParams): Promise<void>;
}

export class CacheGetClientSpy implements ICacheGetClient {
  key? = '';
  callsCount = 0;
  async get(params: GetParams): Promise<void> {
    this.key = params?.key;
    this.callsCount++;
  }
}

type loadNextEventParams = {groupId: string};

export class LoadNextEventCacheRepository {
  constructor(
    private readonly cacheClient: ICacheGetClient,
    private readonly key: string,
  ) {}
  async loadNextEvent({groupId}: loadNextEventParams): Promise<void> {
    await this.cacheClient.get({
      key: `${this.key}:${groupId}`,
    });
  }
}

describe('LoadNextEventCacheRepository', () => {
  let groupId: string;
  let key: string;
  let cacheClient: CacheGetClientSpy;
  let sut: LoadNextEventCacheRepository;

  beforeEach(() => {
    groupId = anyString();
    key = anyString();
    cacheClient = new CacheGetClientSpy();

    sut = new LoadNextEventCacheRepository(cacheClient, key);
  });

  it('should call CacheClient with correct URL and params', async () => {
    await sut.loadNextEvent({groupId});
    expect(cacheClient.key).toBe(`${key}:${groupId}`);
    expect(cacheClient.callsCount).toBe(1);
  });
});
