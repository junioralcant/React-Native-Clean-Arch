import {NextEventEntity} from '../../domain/entities/next_event_';
import {NextEventPlayerEntity} from '../../domain/entities/next_event_player';
import {INextEventLoaderUseCase} from '../../domain/usecases/next_envent_loader';

export interface INextEventPresenter {
  loadNextEvent({
    groupId,
    isReload,
  }: {
    groupId: string;
    isReload?: boolean;
  }): Promise<NextEventViewModel>;
}

export class NextEventViewModel {
  goalKeepers: NextEventPlayerViewModel[];
  players: NextEventPlayerViewModel[];
  out: NextEventPlayerViewModel[];
  doubt: NextEventPlayerViewModel[];

  constructor({
    goalKeepers,
    players,
    out,
    doubt,
  }: {
    goalKeepers?: NextEventPlayerViewModel[];
    players?: NextEventPlayerViewModel[];
    out?: NextEventPlayerViewModel[];
    doubt?: NextEventPlayerViewModel[];
  }) {
    this.goalKeepers = goalKeepers ?? [];
    this.players = players ?? [];
    this.out = out ?? [];
    this.doubt = doubt ?? [];
  }
}

export class NextEventPlayerViewModel {
  name: string;
  position: string;
  photo: string | null;
  initials: string;
  isConfirmed: boolean;
  confirmationDate: Date | null;

  constructor({
    name,
    position,
    photo,
    initials,
    isConfirmed,
    confirmationDate,
  }: {
    name: string;
    position?: string;
    photo?: string;
    initials?: string;
    isConfirmed?: boolean;
    confirmationDate?: Date | null;
  }) {
    this.name = name;
    this.position = position ?? '';
    this.photo = photo ?? null;
    this.initials = initials ?? '';
    this.isConfirmed = isConfirmed ?? false;
    this.confirmationDate = confirmationDate ?? null;
  }
}

export class NextEventPresenter implements INextEventPresenter {
  constructor(
    private readonly nextEventLoadedUseCase: INextEventLoaderUseCase,
  ) {}

  async loadNextEvent({
    groupId,
    isReload,
  }: {
    groupId: string;
    isReload?: boolean;
  }): Promise<NextEventViewModel> {
    const response = await this.nextEventLoadedUseCase.execute({groupId});

    return this.mapEventToViewModel(response);
  }

  private mapEventToViewModel(event: NextEventEntity): NextEventViewModel {
    return {
      doubt: event.players
        .filter(player => !player.confirmationDate)
        .map(this.mapPlayersToViewModel)
        .sort((a, b) => a.name.localeCompare(b.name)),
      goalKeepers: event.players
        .filter(
          player =>
            player.position === 'goalKeeper' &&
            player.isConfirmed &&
            player.confirmationDate,
        )
        .map(this.mapPlayersToViewModel)
        .sort(
          (a, b) =>
            a.confirmationDate?.getTime()! - b.confirmationDate?.getTime()!,
        ),
      out: event.players
        .filter(player => player.confirmationDate && !player.isConfirmed)
        .map(this.mapPlayersToViewModel)
        .sort(
          (a, b) =>
            a.confirmationDate?.getTime()! - b.confirmationDate?.getTime()!,
        ),
      players: event.players
        .filter(
          player =>
            player.position !== 'goalKeeper' &&
            player.isConfirmed &&
            player.confirmationDate,
        )
        .map(this.mapPlayersToViewModel)
        .sort(
          (a, b) =>
            a.confirmationDate?.getTime()! - b.confirmationDate?.getTime()!,
        ),
    };
  }

  private mapPlayersToViewModel(
    player: NextEventPlayerEntity,
  ): NextEventPlayerViewModel {
    return new NextEventPlayerViewModel({
      name: player.name,
      position: player.position,
      photo: player.photo,
      initials: player.initials,
      isConfirmed: player.isConfirmed,
      confirmationDate: player.confirmationDate,
    });
  }
}
