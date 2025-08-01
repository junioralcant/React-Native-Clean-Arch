import {describe, it, expect, jest} from '@jest/globals';
import {anyString} from '../helpers/fakes';
import {INextEventLoaderUseCase} from '../../domain/usecases/next_envent_loader';
import {NextEventEntity} from '../../domain/entities/next_event_';
import {NextEventPlayerEntity} from '../../domain/entities/next_event_player';
import {NextEventPresenter} from '../../presentation/presenters/next_event_presenter';

class NextEventLoadedUseCaseSpy implements INextEventLoaderUseCase {
  callsCount = 0;
  groupId = '';
  error?: Error;
  response: NextEventEntity = {
    groupName: 'test',
    date: new Date(),
    players: [],
  };

  execute = async ({groupId}: {groupId: string}): Promise<NextEventEntity> => {
    this.callsCount++;
    this.groupId = groupId;
    return this.response;
  };
}

const makeSut = ({
  nextEventLoadedUseCaseSpy = new NextEventLoadedUseCaseSpy(),
}: {
  nextEventLoadedUseCaseSpy?: NextEventLoadedUseCaseSpy;
} = {}) => {
  const sut = new NextEventPresenter(nextEventLoadedUseCaseSpy);
  return {sut, nextEventLoadedUseCaseSpy};
};

describe('NextEventPresenter', () => {
  it('should get event data', async () => {
    const groupId = anyString();
    const {sut, nextEventLoadedUseCaseSpy} = makeSut();
    await sut.loadNextEvent({groupId});
    expect(nextEventLoadedUseCaseSpy.callsCount).toBe(1);
    expect(nextEventLoadedUseCaseSpy.groupId).toBe(groupId);
  });

  it('should throw error if use case throws error', async () => {
    const groupId = anyString();
    const nextEventLoadedUseCaseSpy = new NextEventLoadedUseCaseSpy();
    jest
      .spyOn(nextEventLoadedUseCaseSpy, 'execute')
      .mockRejectedValue(new Error('Error message'));

    const {sut} = makeSut({nextEventLoadedUseCaseSpy});
    const response = sut.loadNextEvent({groupId});

    expect(response).rejects.toThrow('Error message');
  });

  it('should build list sorted by name', async () => {
    const groupId = anyString();
    const nextEventLoadedUseCaseSpy = new NextEventLoadedUseCaseSpy();

    nextEventLoadedUseCaseSpy.response = {
      groupName: 'test',
      date: new Date(),
      players: [
        NextEventPlayerEntity.create({
          id: '1',
          name: 'Bia Doe',
          isConfirmed: true,
        }),
        NextEventPlayerEntity.create({
          id: '2',
          name: 'Ana Doe',
          isConfirmed: true,
        }),
        NextEventPlayerEntity.create({
          id: '3',
          name: 'Carla Doe',
          isConfirmed: true,
        }),
        NextEventPlayerEntity.create({
          id: '4',
          name: 'Diana Doe',
          isConfirmed: true,
        }),
      ],
    };

    const {sut} = makeSut({nextEventLoadedUseCaseSpy});
    const response = await sut.loadNextEvent({groupId});

    expect(response.doubt[0].name).toBe('Ana Doe');
    expect(response.doubt[1].name).toBe('Bia Doe');
    expect(response.doubt[2].name).toBe('Carla Doe');
    expect(response.doubt[3].name).toBe('Diana Doe');
  });

  it('should return doubt with correct data', async () => {
    const groupId = anyString();
    const nextEventLoadedUseCaseSpy = new NextEventLoadedUseCaseSpy();
    const player = NextEventPlayerEntity.create({
      id: '1',
      name: 'Bia Doe',
      isConfirmed: true,
      photo: 'https://example.com/photo.jpg',
      position: 'Goalkeeper',
    });
    nextEventLoadedUseCaseSpy.response = {
      groupName: 'test',
      date: new Date(),
      players: [player],
    };

    const {sut} = makeSut({nextEventLoadedUseCaseSpy});
    const response = await sut.loadNextEvent({groupId});

    expect(response.doubt[0].name).toBe('Bia Doe');
    expect(response.doubt[0].isConfirmed).toBe(true);
    expect(response.doubt[0].initials).toBe('BD');
    expect(response.doubt[0].photo).toBe('https://example.com/photo.jpg');
    expect(response.doubt[0].position).toBe('Goalkeeper');
  });

  it('should return out list sorted by confirmation date', async () => {
    const groupId = anyString();
    const nextEventLoadedUseCaseSpy = new NextEventLoadedUseCaseSpy();

    nextEventLoadedUseCaseSpy.response = {
      groupName: 'test',
      date: new Date(),
      players: [
        NextEventPlayerEntity.create({
          id: '1',
          name: 'Bia Doe',
          isConfirmed: false,
          photo: 'https://example.com/photo.jpg',
          position: 'Goalkeeper',
          confirmationDate: new Date('2025-04-18T12:00:00'),
        }),
        NextEventPlayerEntity.create({
          id: '2',
          name: 'Ana Doe',
          isConfirmed: false,
          confirmationDate: new Date('2025-04-18T13:00:00'),
        }),
        NextEventPlayerEntity.create({
          id: '2',
          name: 'Ana Doe',
          isConfirmed: false,
          confirmationDate: new Date('2025-04-18T11:00:00'),
        }),
        NextEventPlayerEntity.create({
          id: '3',
          name: 'Carla Doe',
          isConfirmed: false,
          confirmationDate: new Date('2025-04-18T10:00:00'),
        }),
      ],
    };

    const {sut} = makeSut({nextEventLoadedUseCaseSpy});
    const response = await sut.loadNextEvent({groupId});

    expect(response.out[0].name).toBe('Carla Doe');
    expect(response.out[1].name).toBe('Ana Doe');
    expect(response.out[2].name).toBe('Bia Doe');
  });

  it('should return goalkeepers list sorted by confirmation date', async () => {
    const groupId = anyString();
    const nextEventLoadedUseCaseSpy = new NextEventLoadedUseCaseSpy();
    nextEventLoadedUseCaseSpy.response = {
      groupName: 'test',
      date: new Date(),
      players: [
        NextEventPlayerEntity.create({
          id: '1',
          name: 'Bia Doe',
          isConfirmed: true,
          photo: 'https://example.com/photo.jpg',
          position: 'goalKeeper',
          confirmationDate: new Date('2025-04-18T12:00:00'),
        }),
        NextEventPlayerEntity.create({
          id: '2',
          name: 'Ana Doe',
          isConfirmed: false,
          confirmationDate: new Date('2025-04-18T13:00:00'),
        }),
        NextEventPlayerEntity.create({
          id: '2',
          name: 'Ana Doe',
          isConfirmed: true,
          confirmationDate: new Date('2025-04-18T11:00:00'),
          position: 'goalKeeper',
        }),
        NextEventPlayerEntity.create({
          id: '3',
          name: 'Carla Doe',
          isConfirmed: true,
          confirmationDate: new Date('2025-04-18T10:00:00'),
        }),
      ],
    };

    const {sut} = makeSut({nextEventLoadedUseCaseSpy});
    const response = await sut.loadNextEvent({groupId});

    expect(response.goalKeepers.length).toBe(2);
    expect(response.goalKeepers[0].name).toBe('Ana Doe');
    expect(response.goalKeepers[1].name).toBe('Bia Doe');
  });

  it('should return players list sorted by confirmation date', async () => {
    const groupId = anyString();
    const nextEventLoadedUseCaseSpy = new NextEventLoadedUseCaseSpy();
    nextEventLoadedUseCaseSpy.response = {
      groupName: 'test',
      date: new Date(),
      players: [
        NextEventPlayerEntity.create({
          id: '1',
          name: 'Bia Doe',
          isConfirmed: true,
          photo: 'https://example.com/photo.jpg',
          position: 'goalKeeper',
          confirmationDate: new Date('2025-04-18T12:00:00'),
        }),
        NextEventPlayerEntity.create({
          id: '2',
          name: 'Nina Doe',
          isConfirmed: true,
          confirmationDate: new Date('2025-04-18T13:00:00'),
        }),
        NextEventPlayerEntity.create({
          id: '3',
          name: 'Ana Doe',
          isConfirmed: true,
          confirmationDate: new Date('2025-04-18T11:00:00'),
          position: 'goalKeeper',
        }),
        NextEventPlayerEntity.create({
          id: '4',
          name: 'Carla Doe',
          isConfirmed: true,
          confirmationDate: new Date('2025-04-18T10:00:00'),
          position: 'defender',
        }),
      ],
    };

    const {sut} = makeSut({nextEventLoadedUseCaseSpy});
    const response = await sut.loadNextEvent({groupId});

    expect(response.players.length).toBe(2);
    expect(response.players[0].name).toBe('Carla Doe');
    expect(response.players[1].name).toBe('Nina Doe');
  });
});
