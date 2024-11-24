import {expect, it, describe, beforeEach} from '@jest/globals';

import {
  ILoadNextEventRepository,
  loadNextEventParams,
} from '../../../domain/repository/load_next_repo';
import {NextEventEntity} from '../../../domain/entities/next_event_';
import {anyString} from '../../helpers/fakes';
import {NextEventPlayerEntity} from '../../../domain/entities/next_event_player';
import {SessionExpiredError} from '../../../domain/erros/sesstion_expired_error';
import {UnexpectedError} from '../../../domain/erros/unexpecte_error';

enum StatusCode {
  Success = 200,
  BadRequestError = 400,
  UnauthorizedError = 401,
  ForbiddenError = 403,
  NotFoundError = 404,
  ServerError = 500,
}

export type HttpResponse<TData = any> = {
  statusCode: number;
  data: TData;
};

interface IHttpClient<T = any> {
  get(url: string, headers?: any): Promise<HttpResponse<T>>;
}

class HttpClientSpy implements IHttpClient {
  callsCount = 0;
  method = '';
  url = '';
  headers: Record<string, string> = {};
  response = {};
  statusCode = 200;

  async get(url: string, headers?: any): Promise<HttpResponse> {
    this.headers = headers;
    this.method = 'get';
    this.url = url;
    this.callsCount++;
    return {data: this.response, statusCode: this.statusCode};
  }
}

class LoadNextEventRepository implements ILoadNextEventRepository {
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
    const response = await this.httpClient.get(url, headers);

    switch (response.statusCode) {
      case StatusCode.Success:
        break;
      case StatusCode.UnauthorizedError:
        throw new SessionExpiredError();
      default:
        throw new UnexpectedError();
    }

    return new NextEventEntity({
      date: response.data.date,
      groupName: response.data.groupName,
      players: response.data.players.map(player =>
        NextEventPlayerEntity.create({
          id: player.id,
          name: player.name,
          isConfirmed: player.isConfirmed,
          photo: player.photo,
          position: player.position,
          confirmationDate: player?.confirmationDate,
        }),
      ),
    });
  }
}

describe('LoadNextEventRepository', () => {
  let groupId: string;
  let url: string;
  let httpClient: HttpClientSpy;
  let sut: LoadNextEventRepository;

  beforeEach(() => {
    groupId = anyString();
    url = `https://domain.com/api/groups/:groupId/next_events`;
    httpClient = new HttpClientSpy();
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
    sut = new LoadNextEventRepository(httpClient, url);
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

  it('should request NextEvent on 200', async () => {
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

  it('should throw UnexpectedError on status 400', async () => {
    httpClient.statusCode = StatusCode.BadRequestError;
    const response = sut.loadNextEvent({groupId});
    expect(response).rejects.toThrow(new UnexpectedError());
  });

  it('should throw SessionExpiredError on status 401', async () => {
    httpClient.statusCode = StatusCode.UnauthorizedError;
    const response = sut.loadNextEvent({groupId});
    expect(response).rejects.toThrow(new SessionExpiredError());
  });

  it('should throw UnexpectedError on status 403', async () => {
    httpClient.statusCode = StatusCode.ForbiddenError;
    const response = sut.loadNextEvent({groupId});
    expect(response).rejects.toThrow(new UnexpectedError());
  });

  it('should throw UnexpectedError on status 404', async () => {
    httpClient.statusCode = StatusCode.NotFoundError;
    const response = sut.loadNextEvent({groupId});
    expect(response).rejects.toThrow(new UnexpectedError());
  });

  it('should throw UnexpectedError on status 500', async () => {
    httpClient.statusCode = StatusCode.ServerError;
    const response = sut.loadNextEvent({groupId});
    expect(response).rejects.toThrow(new UnexpectedError());
  });
});
