export interface INextEventPresenter {
  loadNextEvent: ({groupId}: {groupId: string}) => Promise<NextEventViewModel>;
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

  constructor({name, position}: {name: string; position?: string}) {
    this.name = name;
    this.position = position ?? '';
  }
}
