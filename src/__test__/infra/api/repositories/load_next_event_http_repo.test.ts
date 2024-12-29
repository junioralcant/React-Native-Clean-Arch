import {expect, it, describe, beforeEach} from '@jest/globals';

import {anyString} from '../../../helpers/fakes';
import {SessionExpiredError} from '../../../../domain/erros/sesstion_expired_error';
import {UnexpectedError} from '../../../../domain/erros/unexpecte_error';
import {
  LoadNextEventRepository,
  StatusCode,
} from '../../../../infra/api/repositories/load_next_event_repository';
import {ClientSpy} from '../clients/client_spy';

describe('LoadNextEventRepository', () => {
  let groupId: string;
  let url: string;
  let httpClient: ClientSpy;
  let sut: LoadNextEventRepository;

  beforeEach(() => {
    groupId = anyString();
    url = `https://domain.com/api/groups/:groupId/next_events`;
    httpClient = new ClientSpy();
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
