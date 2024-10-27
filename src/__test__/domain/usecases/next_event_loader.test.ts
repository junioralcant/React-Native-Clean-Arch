import {expect, it, describe, beforeEach} from '@jest/globals';
import {faker} from '@faker-js/faker';
import {NextEventPlayer} from '../../../domain/entities/next_event_player';

type NextEvent = {
  groupName: string;
  date: Date;
  players: NextEventPlayer[];
};

class NextEventEntity {
  groupName: string;
  date: Date;
  players: NextEventPlayer[] = [];

  constructor({groupName, date, players}: NextEvent) {
    this.groupName = groupName;
    this.date = date;
    this.players = players;
  }
}

class NextEventLoaderUseCase {
  constructor(readonly repo: LoadNextEventRepository) {}

  async execute({groupId}: {groupId: string}): Promise<NextEventEntity> {
    return await this.repo.loadNextEvent({groupId});
  }
}

class LoadNextEventRepository {
  groupId = '';
  callsCount = 0;
  output?: NextEvent;

  async loadNextEvent({groupId}: {groupId: string}): Promise<NextEventEntity> {
    this.groupId = groupId;
    this.callsCount++;
    return this.output!;
  }
}

function makeSut() {
  const repo = new LoadNextEventRepository();
  const sut = new NextEventLoaderUseCase(repo);

  repo.output = {
    groupName: 'any group name',
    date: new Date(),
    players: [
      NextEventPlayer.create({
        id: 'any id 1',
        name: 'any name 1',
        isConfirmed: true,
        confirmationDate: new Date(),
        photo: 'any photo 1',
      }),
      NextEventPlayer.create({
        id: 'any id 2',
        name: 'any name 2',
        isConfirmed: false,
        confirmationDate: new Date(),
        position: 'any position 2',
      }),
    ],
  };

  return {sut, repo};
}

describe('NextEventLoader', () => {
  it('should load event data from a repository', async () => {
    const groupId = faker.number.int({max: 50000}).toString();
    const {sut, repo} = makeSut();

    await sut.execute({groupId});
    expect(repo.groupId).toBe(groupId);
    expect(repo.callsCount).toBe(1);
  });

  it('should return event data on success', async () => {
    const {sut, repo} = makeSut();
    const event = await sut.execute({groupId: ''});
    expect(event.groupName).toBe(repo.output?.groupName);
    expect(event.date).toBe(repo.output?.date);
    expect(event.players.length).toBe(2);

    expect(event.players[0].name).toBe(repo.output?.players[0].name);
    expect(event.players[0].id).toBe(repo.output?.players[0].id);
    expect(event.players[0].initials).not.toBeUndefined();
    expect(event.players[0].isConfirmed).toBe(
      repo.output?.players[0].isConfirmed,
    );
    expect(event.players[0].photo).toBe(repo.output?.players[0].photo);
    expect(event.players[0].confirmationDate).toBe(
      repo.output?.players[0].confirmationDate,
    );

    expect(event.players[1].name).toBe(repo.output?.players[1].name);
    expect(event.players[1].id).toBe(repo.output?.players[1].id);
    expect(event.players[1].initials).not.toBeUndefined();
    expect(event.players[1].isConfirmed).toBe(
      repo.output?.players[1].isConfirmed,
    );
    expect(event.players[1].position).toBe(repo.output?.players[1].position);
    expect(event.players[1].confirmationDate).toBe(
      repo.output?.players[1].confirmationDate,
    );
  });
});
