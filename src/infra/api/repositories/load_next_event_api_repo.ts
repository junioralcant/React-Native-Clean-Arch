import {NextEventEntity} from '../../../domain/entities/next_event_';
import {ILoadNextEventRepository} from '../../../domain/repository/load_next_repo';
import {Json} from '../../types/json';
import {toNextEventEntity} from '../adapters/next_event_adapter';
import {HttpGetClient} from '../clients/http_get_clients';

type loadNextEventParams = {groupId: string};

export class LoadNextEventApiRepository implements ILoadNextEventRepository {
  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly url: string,
  ) {}
  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    const response = await this.httpClient.get<Json>({
      url: this.url,
      params: {groupId},
    });

    return toNextEventEntity(response);
  }
}
