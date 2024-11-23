import {expect, it, describe, beforeEach, jest} from '@jest/globals';

import {
  loadNextEventParams,
  LoadNextEventRepository,
} from '../../../domain/repository/load_next_repo';
import {NextEventEntity} from '../../../domain/entities/next_event_';
import {anyString} from '../../helpers/fakes';
import axios from 'axios';
import {NextEventPlayerEntity} from '../../../domain/entities/next_event_player';

export type HttpResponse<TData = any> = {
  data: TData;
};

type NextEventEntityApi = {
  date: string;
  groupName: string;
  players: {
    id: string;
    name: string;
    isConfirmed: boolean;
    photo: string;
    position: string;
    confirmationDate: string;
  }[];
};

class LoadNextEventRepositoryAxios implements LoadNextEventRepository {
  constructor(private readonly url: string) {}
  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    const url = this.url.replace(':groupId', groupId);
    const headers = {
      'content-type': 'application/json',
      accept: 'application/json',
    };

    const {data: response} = await axios.request<NextEventEntityApi>({
      method: 'get',
      url,
      headers,
    });
    return new NextEventEntity({
      date: new Date(response.date),
      groupName: response.groupName,
      players: response.players.map(player =>
        NextEventPlayerEntity.create({
          id: player.id,
          name: player.name,
          isConfirmed: player.isConfirmed,
          photo: player.photo,
          position: player.position,
          confirmationDate: new Date(player.confirmationDate),
        }),
      ),
    });
  }
}

describe('LoadNextEventRepositoryAxios', () => {
  let groupId: string;
  let url: string;
  let sut: LoadNextEventRepositoryAxios;
  let axiosMocked = {};

  beforeEach(() => {
    groupId = anyString();
    url = `https://domain.com/api/groups/:groupId/next_events`;
    axiosMocked = jest.spyOn(axios, 'request').mockResolvedValueOnce({
      data: {
        date: '2024-01-01T10:30:00.000Z',
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
            confirmationDate: '2024-01-01T10:30:00.000Z',
            photo: 'photo 2',
          },
        ],
      },
    });
    sut = new LoadNextEventRepositoryAxios(url);
  });

  it('should request with correct method', async () => {
    await sut.loadNextEvent({groupId});
    expect(axiosMocked).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
      }),
    );
    expect(axiosMocked).toBeCalledTimes(1);
  });

  it('should request with correct url', async () => {
    await sut.loadNextEvent({groupId});

    expect(axiosMocked).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `https://domain.com/api/groups/${groupId}/next_events`,
      }),
    );
  });

  it('should request with correct headers', async () => {
    await sut.loadNextEvent({groupId});

    expect(axiosMocked).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      }),
    );
  });

  it('should request NextEvent on 200', async () => {
    const event = await sut.loadNextEvent({groupId});
    expect(event.groupName).toBe('any_name');
    expect(event.date).toEqual(new Date('2024-01-01T10:30:00.000Z'));

    expect(event.players[0].id).toBe('id 1');
    expect(event.players[0].name).toBe('name 1');
    expect(event.players[0].isConfirmed).toBe(true);

    expect(event.players[1].id).toBe('id 2');
    expect(event.players[1].name).toBe('name 2');
    expect(event.players[1].position).toBe('position 2');
    expect(event.players[1].photo).toBe('photo 2');
    expect(event.players[1].confirmationDate).toEqual(
      new Date('2024-01-01T10:30:00.000Z'),
    );

    expect(event.players[1].isConfirmed).toBe(false);
  });
});
