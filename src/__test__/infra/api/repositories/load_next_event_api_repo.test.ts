import {expect, it, describe, beforeEach} from '@jest/globals';
import {anyString} from '../../../helpers/fakes';
import {NextEventEntity} from '../../../../domain/entities/next_event_';
import {NextEventPlayerEntity} from '../../../../domain/entities/next_event_player';
import {ILoadNextEventRepository} from '../../../../domain/repository/load_next_repo';

type loadNextEventParams = {groupId: string};

type GetParams = {
  url: string;
  params: Record<string, string>;
};

interface HttpGetClient {
  get<T>(params: GetParams): Promise<T>;
}

class LoadNextEventApiRepository implements ILoadNextEventRepository {
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly url: string,
  ) {}
  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    const response = await this.httpClient.get<Record<string, any>>({
      url: this.url,
      params: {groupId},
    });

    return adapter.toNextEventEntity(response);
  }
}

function toNextEventEntity(response: any): NextEventEntity {
  return new NextEventEntity({
    date: response.date,
    groupName: response.groupName,
    players: response.players.map(toNextEventPlayerEntity),
  });
}

function toNextEventPlayerEntity(
  player: NextEventPlayerEntity,
): NextEventPlayerEntity {
  return NextEventPlayerEntity.create({
    id: player.id,
    name: player.name,
    isConfirmed: player.isConfirmed,
    photo: player.photo,
    position: player.position,
    confirmationDate: player?.confirmationDate,
  });
}

const adapter = {
  toNextEventEntity,
};

class HttpGetClientSpy implements HttpGetClient {
  url? = '';
  callsCount = 0;
  params: Record<string, string> = {};
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
