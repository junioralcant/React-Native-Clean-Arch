import {NextEventEntity} from '../entities/next_event_';

export type loadNextEventParams = {groupId: string};

export interface LoadNextEventRepository {
  loadNextEvent({groupId}: loadNextEventParams): Promise<NextEventEntity>;
}
