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

  constructor({
    name,
    position,
    photo,
    initials,
    isConfirmed,
  }: {
    name: string;
    position?: string;
    photo?: string;
    initials?: string;
    isConfirmed?: boolean;
  }) {
    this.name = name;
    this.position = position ?? '';
    this.photo = photo ?? null;
    this.initials = initials ?? '';
    this.isConfirmed = isConfirmed ?? false;
  }
}
