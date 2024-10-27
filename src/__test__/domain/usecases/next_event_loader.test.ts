import {expect, it, describe} from '@jest/globals';
import {faker} from '@faker-js/faker';

class NextEventLoaderUseCase {
  constructor(readonly repo: LoadNextEventRepository) {}
  async execute({groupId}: {groupId: string}) {
    await this.repo.loadNextEvent({groupId});
  }
}

class LoadNextEventRepository {
  groupId = '';
  callsCount = 0;

  async loadNextEvent({groupId}: {groupId: string}) {
    this.groupId = groupId;
    this.callsCount++;
  }
}

describe('NextEventLoader', () => {
  it('should load event data from a repository', async () => {
    const groupId = faker.number.int({max: 50000}).toString();
    const repo = new LoadNextEventRepository();
    const sut = new NextEventLoaderUseCase(repo);
    await sut.execute({groupId});
    expect(repo.groupId).toBe(groupId);
    expect(repo.callsCount).toBe(1);
  });
});
