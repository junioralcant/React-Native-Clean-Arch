import {expect, it, describe} from '@jest/globals';
import {NextEventPlayerEntity} from '../../../domain/entities/next_event_player';
import {NextEventEntity} from '../../../domain/entities/next_event_';
import {
  loadNextEventParams,
  LoadNextEventRepository,
} from '../../../domain/repository/load_next_repo';
import {NextEventLoaderUseCase} from '../../../domain/usecases/next_envent_loader';
import {anyString} from '../../helpers/fakes';

class LoadNextEventRepositorySpy implements LoadNextEventRepository {
  groupId = '';
  callsCount = 0;
  output?: NextEventEntity;
  error?: Error;

  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    this.groupId = groupId;
    this.callsCount++;
    if (this.error) throw this.error;

    return this.output!;
  }
}

function makeSut() {
  const repo = new LoadNextEventRepositorySpy();
  const sut = new NextEventLoaderUseCase(repo);

  repo.output = {
    groupName: 'any group name',
    date: new Date(),
    players: [
      NextEventPlayerEntity.create({
        id: 'any id 1',
        name: 'any name 1',
        isConfirmed: true,
        confirmationDate: new Date(),
        photo: 'any photo 1',
      }),
      NextEventPlayerEntity.create({
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

describe('NextEventLoaderUseCase', () => {
  it('should load event data from a repository', async () => {
    const groupId = anyString();
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

  it('should rethrow if repository throws an error', async () => {
    const {sut, repo} = makeSut();
    const error = new Error('any error');
    repo.error = error;
    const promise = sut.execute({
      groupId: anyString(),
    });

    expect(promise).rejects.toThrow(error);
  });
});
