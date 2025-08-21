import {NextEventEntity} from '../../../domain/entities/next_event_';
import {Json} from '../../types/json';
import {toNextEventEntity} from '../clients/adapters/next_event_adapter';
import {ICacheGetClient} from '../clients/cache_get_client';

type loadNextEventParams = {groupId: string};

export class LoadNextEventCacheRepository {
  constructor(
    private readonly cacheClient: ICacheGetClient,
    private readonly key: string,
  ) {}
  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    const response = await this.cacheClient.get<Json>({
      key: `${this.key}:${groupId}`,
    });

    return toNextEventEntity(response);
  }
}
