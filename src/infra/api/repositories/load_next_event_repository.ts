import {NextEventEntity} from '../../../domain/entities/next_event_';
import {NextEventPlayerEntity} from '../../../domain/entities/next_event_player';
import {SessionExpiredError} from '../../../domain/erros/sesstion_expired_error';
import {UnexpectedError} from '../../../domain/erros/unexpecte_error';
import {
  ILoadNextEventRepository,
  loadNextEventParams,
} from '../../../domain/repository/load_next_repo';

export enum StatusCode {
  Success = 200,
  BadRequestError = 400,
  UnauthorizedError = 401,
  ForbiddenError = 403,
  NotFoundError = 404,
  ServerError = 500,
}

export type HttpResponse<TData = any> = {
  statusCode: number;
  data: TData;
};

export interface IHttpClient<T = any> {
  get(url: string, headers?: any): Promise<HttpResponse<T>>;
}

export class LoadNextEventRepository implements ILoadNextEventRepository {
  constructor(
    private readonly httpClient: IHttpClient<NextEventEntity>,
    private readonly url: string,
  ) {}
  async loadNextEvent({
    groupId,
  }: loadNextEventParams): Promise<NextEventEntity> {
    const url = this.url.replace(':groupId', groupId);
    const headers = {
      'content-type': 'application/json',
      accept: 'application/json',
    };
    const response = await this.httpClient.get(url, headers);

    switch (response.statusCode) {
      case StatusCode.Success:
        break;
      case StatusCode.UnauthorizedError:
        throw new SessionExpiredError();
      default:
        throw new UnexpectedError();
    }

    return new NextEventEntity({
      date: response.data.date,
      groupName: response.data.groupName,
      players: response.data.players.map(player =>
        NextEventPlayerEntity.create({
          id: player.id,
          name: player.name,
          isConfirmed: player.isConfirmed,
          photo: player.photo,
          position: player.position,
          confirmationDate: player?.confirmationDate,
        }),
      ),
    });
  }
}
