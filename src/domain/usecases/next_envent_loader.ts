import {NextEventEntity} from '../entities/next_event_';
import {ILoadNextEventRepository} from '../repository/load_next_repo';

export interface INextEventLoaderUseCase {
  execute({groupId}: {groupId: string}): Promise<NextEventEntity>;
}

export class NextEventLoaderUseCase implements INextEventLoaderUseCase {
  constructor(readonly repo: ILoadNextEventRepository) {}

  async execute({groupId}: {groupId: string}): Promise<NextEventEntity> {
    return await this.repo.loadNextEvent({groupId});
  }
}
