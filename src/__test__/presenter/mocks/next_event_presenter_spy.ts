import {
  INextEventPresenter,
  NextEventViewModel,
} from '../../../presentation/presenters/next_event_presenter';

export class NextEventPresenterSpy implements INextEventPresenter {
  loadCallsCount = 0;
  groupId = '';
  isReload = false;
  response: NextEventViewModel = {
    goalKeepers: [],
    players: [],
    out: [],
    doubt: [],
  } as NextEventViewModel;

  loadNextEvent = async ({
    groupId,
    isReload = false,
  }: {
    groupId: string;
    isReload?: boolean;
  }): Promise<NextEventViewModel> => {
    this.loadCallsCount++;
    this.groupId = groupId;
    this.isReload = isReload;
    return this.response;
  };
}
