import {NextEventPlayerEntity} from './next_event_player';
type NextEvent = {
  groupName: string;
  date: Date;
  players: NextEventPlayerEntity[];
};

export class NextEventEntity {
  groupName: string;
  date: Date;
  players: NextEventPlayerEntity[] = [];

  constructor({groupName, date, players}: NextEvent) {
    this.groupName = groupName;
    this.date = date;
    this.players = players;
  }
}
