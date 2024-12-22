import {NextEventEntity} from '../../../domain/entities/next_event_';
import {Json} from '../../types/json';
import {toNextEventPlayerEntity} from './next_event_player_adapter';

export function toNextEventEntity(response: Json): NextEventEntity {
  return new NextEventEntity({
    date: response.date,
    groupName: response.groupName,
    players: response.players.map(toNextEventPlayerEntity),
  });
}
