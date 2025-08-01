import {NextEventPlayerEntity} from '../../../domain/entities/next_event_player';

export function toNextEventPlayerEntity(
  player: NextEventPlayerEntity,
): NextEventPlayerEntity {
  return NextEventPlayerEntity.create({
    id: player.id,
    name: player.name,
    isConfirmed: player.isConfirmed,
    photo: player.photo,
    position: player.position,
    confirmationDate: player.confirmationDate
      ? new Date(player.confirmationDate)
      : undefined,
  });
}
