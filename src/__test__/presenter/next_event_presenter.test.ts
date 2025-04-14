import {describe, it, expect, jest} from '@jest/globals';
import {anyString} from '../helpers/fakes';
import {INextEventLoaderUseCase} from '../../domain/usecases/next_envent_loader';
import {NextEventEntity} from '../../domain/entities/next_event_';

class NextEventPresenter {
  constructor(
    private readonly nextEventLoadedUseCase: INextEventLoaderUseCase,
  ) {}
  loadNextEvent = async ({groupId}: {groupId: string}) => {
    await this.nextEventLoadedUseCase.execute({groupId});
  };
}

class NextEventLoadedUseCaseSpy implements INextEventLoaderUseCase {
  callsCount = 0;
  groupId = '';
  error?: Error;
  execute = async ({groupId}: {groupId: string}): Promise<NextEventEntity> => {
    this.callsCount++;
    this.groupId = groupId;

    return {
      groupName: 'test',
      date: new Date(),
      players: [],
    };
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
});
