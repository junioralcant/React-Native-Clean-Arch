import {expect, it, describe} from '@jest/globals';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import {
  INextEventPresenter,
  NextEventPlayerViewModel,
  NextEventViewModel,
} from '../../../presentation/presenters/next_event_presenter';
import {anyString} from '../../helpers/fakes';
import {
  NextEventPage,
  NextEventPageProps,
} from '../../../ui/screens/NextEventPage';

class NextEventPresenterSpy implements INextEventPresenter {
  loadCallsCount = 0;
  reloadCallsCount = 0;
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

  reload = async (groupId: string) => {
    this.reloadCallsCount++;
    this.groupId = groupId;
  };
}

const sut = ({
  presenter = new NextEventPresenterSpy(),
  groupId = anyString(),
}: Partial<NextEventPageProps> = {}) => {
  render(<NextEventPage presenter={presenter} groupId={groupId} />);
};

describe('NextEventPage', () => {
  it('should load event data on page init', async () => {
    const presenter = new NextEventPresenterSpy();
    const groupId = anyString();

    sut({presenter, groupId});

    expect(presenter.loadCallsCount).toBe(1);
    expect(presenter.groupId).toBe(groupId);
    expect(presenter.isReload).toBe(false);

    await waitFor(() => screen.getByTestId('spinner'));
  });

  it('should present spinner while data is loading', async () => {
    sut();
    expect(screen.getByTestId('spinner')).toBeTruthy();
    await waitFor(() => screen.getByTestId('spinner'));
  });

  it('should hide spinner when data is load success', async () => {
    sut();
    expect(screen.getByTestId('spinner')).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
    });
  });

  it('should hide spinner when data is load error', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.loadNextEvent = async () => {
      throw new Error();
    };

    sut({presenter});
    expect(screen.getByTestId('spinner')).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
      expect(screen.getByTestId('error')).toBeTruthy();
    });
  });

  it('should present GoalKeeper section', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      goalKeepers: [
        new NextEventPlayerViewModel({
          name: 'Junior',
        }),
        new NextEventPlayerViewModel({
          name: 'Lidya',
        }),
        new NextEventPlayerViewModel({
          name: 'Mateus',
        }),
      ],
    });

    sut({presenter});
    expect(screen.getByTestId('spinner')).toBeTruthy();

    expect(await screen.findByText('DENTRO - GOLEIROS')).toBeTruthy();
    expect(await screen.findByText('3')).toBeTruthy();
    expect(await screen.findByText('Junior')).toBeTruthy();
    expect(await screen.findByText('Lidya')).toBeTruthy();
    expect(await screen.findByText('Mateus')).toBeTruthy();
    expect(await screen.findAllByTestId('player_position')).toHaveLength(3);
    expect(await screen.findAllByTestId('player_photo')).toHaveLength(3);
    expect(await screen.findAllByTestId('player_status')).toHaveLength(3);
  });

  it('should hide GoalKeeper section when there are no goalkeepers', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      goalKeepers: [],
    });

    sut({presenter});

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
      expect(screen.queryByText('DENTRO - GOLEIROS')).toBeFalsy();
    });
  });

  it('should present Players section', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      players: [
        new NextEventPlayerViewModel({
          name: 'Junior',
        }),
        new NextEventPlayerViewModel({
          name: 'Lidya',
        }),
        new NextEventPlayerViewModel({
          name: 'Mateus',
        }),
      ],
    });

    sut({presenter});
    expect(screen.getByTestId('spinner')).toBeTruthy();

    expect(await screen.findByText('DENTRO - JOGADORES')).toBeTruthy();
    expect(await screen.findByText('3')).toBeTruthy();
    expect(await screen.findByText('Junior')).toBeTruthy();
    expect(await screen.findByText('Lidya')).toBeTruthy();
    expect(await screen.findByText('Mateus')).toBeTruthy();
    expect(await screen.findAllByTestId('player_position')).toHaveLength(3);
    expect(await screen.findAllByTestId('player_photo')).toHaveLength(3);
    expect(await screen.findAllByTestId('player_status')).toHaveLength(3);
  });

  it('should hide Players section when there are no players', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      players: [],
    });

    sut({presenter});

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
      expect(screen.queryByText('DENTRO - JOGADORES')).toBeFalsy();
    });
  });

  it('should present out section', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      out: [
        new NextEventPlayerViewModel({
          name: 'Lidya',
        }),
        new NextEventPlayerViewModel({
          name: 'Mateus',
        }),
      ],
    });

    sut({presenter});
    expect(screen.getByTestId('spinner')).toBeTruthy();

    expect(await screen.findByText('FORA')).toBeTruthy();
    expect(await screen.findByText('2')).toBeTruthy();
    expect(await screen.findByText('Lidya')).toBeTruthy();
    expect(await screen.findByText('Mateus')).toBeTruthy();
    expect(await screen.findAllByTestId('player_position')).toHaveLength(2);
    expect(await screen.findAllByTestId('player_photo')).toHaveLength(2);
    expect(await screen.findAllByTestId('player_status')).toHaveLength(2);
  });

  it('should hide out section when there are no out', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      out: [],
    });

    sut({presenter});

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
      expect(screen.queryByText('FORA')).toBeFalsy();
    });
  });

  it('should present doubt section', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      doubt: [
        new NextEventPlayerViewModel({
          name: 'Lidya',
        }),
        new NextEventPlayerViewModel({
          name: 'Mateus',
        }),
      ],
    });

    sut({presenter});
    expect(screen.getByTestId('spinner')).toBeTruthy();

    expect(await screen.findByText('DÚVIDA')).toBeTruthy();
    expect(await screen.findByText('2')).toBeTruthy();
    expect(await screen.findByText('Lidya')).toBeTruthy();
    expect(await screen.findByText('Mateus')).toBeTruthy();
    expect(await screen.findAllByTestId('player_position')).toHaveLength(2);
    expect(await screen.findAllByTestId('player_photo')).toHaveLength(2);
    expect(await screen.findAllByTestId('player_status')).toHaveLength(2);
  });

  it('should hide doubt section when there are no doubt', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.response = new NextEventViewModel({
      doubt: [],
    });

    sut({presenter});

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
      expect(screen.queryByText('DÚVIDA')).toBeFalsy();
    });
  });

  it('should present error message when data is load error', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.loadNextEvent = async () => {
      throw new Error();
    };

    sut({presenter});
    expect(screen.getByTestId('spinner')).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
      expect(screen.getByTestId('error')).toBeTruthy();
      expect(
        screen.getByText('Algo de errado aconteceu, tente novamente!'),
      ).toBeTruthy();
    });
  });

  it('should load event data on reload click', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.loadNextEvent = async () => {
      throw new Error();
    };
    const groupId = anyString();

    sut({presenter, groupId});

    await waitFor(() => screen.getByTestId('error'));

    fireEvent.press(screen.getByTestId('reload'));

    expect(presenter.reloadCallsCount).toBe(1);
    expect(presenter.groupId).toBe(groupId);
  });

  it('should show spinner when on reload click', async () => {
    const presenter = new NextEventPresenterSpy();
    presenter.loadNextEvent = async () => {
      throw new Error();
    };
    const groupId = anyString();

    sut({presenter, groupId});

    await waitFor(() => screen.getByTestId('error'));

    fireEvent.press(screen.getByTestId('reload'));

    expect(screen.getByTestId('spinner')).toBeTruthy();

    await waitFor(() => screen.getByTestId('error'));

    expect(screen.queryByTestId('spinner')).toBeFalsy();
  });
});
