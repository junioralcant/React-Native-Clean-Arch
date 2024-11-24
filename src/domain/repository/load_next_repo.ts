import {NextEventEntity} from '../entities/next_event_';

export type loadNextEventParams = {groupId: string};

export interface ILoadNextEventRepository {
  loadNextEvent({groupId}: loadNextEventParams): Promise<NextEventEntity>;
}
