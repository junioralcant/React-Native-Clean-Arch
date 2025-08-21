import {expect, it, describe, beforeEach} from '@jest/globals';
import {anyString} from '../../../helpers/fakes';
import {CacheGetClientSpy} from '../../../../infra/cache/clients/cache_get_client';
import {LoadNextEventCacheRepository} from '../../../../infra/cache/repositories/load_next_event_cache_repo';

describe('LoadNextEventCacheRepository', () => {
  let groupId: string;
  let key: string;
  let cacheClient: CacheGetClientSpy;
  let sut: LoadNextEventCacheRepository;

  beforeEach(() => {
    groupId = anyString();
    key = anyString();
    cacheClient = new CacheGetClientSpy();
    cacheClient.response = {
      date: new Date('2024-01-01T10:30'),
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
          confirmationDate: new Date('2024-01-01T10:30'),
          photo: 'photo 2',
        },
      ],
    };
    sut = new LoadNextEventCacheRepository(cacheClient, key);
  });

  it('should call CacheClient with correct URL and params', async () => {
    await sut.loadNextEvent({groupId});
    expect(cacheClient.key).toBe(`${key}:${groupId}`);
    expect(cacheClient.callsCount).toBe(1);
  });

  it('should request NextEvent on success', async () => {
    const event = await sut.loadNextEvent({groupId});
    expect(event.groupName).toBe('any_name');
    expect(event.date).toStrictEqual(new Date('2024-01-01T10:30'));

    expect(event.players[0].id).toBe('id 1');
    expect(event.players[0].name).toBe('name 1');
    expect(event.players[0].isConfirmed).toBe(true);

    expect(event.players[1].id).toBe('id 2');
    expect(event.players[1].name).toBe('name 2');
    expect(event.players[1].position).toBe('position 2');
    expect(event.players[1].photo).toBe('photo 2');

    expect(event.players[1].confirmationDate).toStrictEqual(
      new Date('2024-01-01T10:30'),
    );
    expect(event.players[1].isConfirmed).toBe(false);
  });

  it('should rethrow on error', async () => {
    const error = new Error('error');
    cacheClient.error = error;
    const response = sut.loadNextEvent({groupId});
    expect(response).rejects.toThrow(error);
  });
});
