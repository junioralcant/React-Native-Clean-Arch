import {NextEventEntity} from '../entities/next_event_';
import {LoadNextEventRepository} from '../repository/load_next_repo';

export class NextEventLoaderUseCase {
  constructor(readonly repo: LoadNextEventRepository) {}

  async execute({groupId}: {groupId: string}): Promise<NextEventEntity> {
    return await this.repo.loadNextEvent({groupId});
  }
}
