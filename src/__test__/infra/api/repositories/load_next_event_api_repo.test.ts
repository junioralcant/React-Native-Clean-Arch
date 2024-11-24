import {expect, it, describe, beforeEach} from '@jest/globals';
import {anyString} from '../../../helpers/fakes';

type loadNextEventParams = {groupId: string};

type GetParams = {
  url: string;
};

interface HttpGetClient {
  get(params: GetParams): Promise<void>;
}

class LoadNextEventApiRepository {
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly url: string,
  ) {}
  async loadNextEvent({groupId}: loadNextEventParams): Promise<void> {
    this.httpClient.get({url: this.url});
  }
}

class HttpGetClientSpy implements HttpGetClient {
  url? = '';
  callsCount = 0;

  async get(params: GetParams): Promise<void> {
    this.url = params.url;
    this.callsCount++;
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
    sut = new LoadNextEventApiRepository(httpClient, url);
  });

  it('should call HttpClient with correct URL', async () => {
    await sut.loadNextEvent({groupId});
    expect(httpClient.url).toBe(url);
    expect(httpClient.callsCount).toBe(1);
  });
});
