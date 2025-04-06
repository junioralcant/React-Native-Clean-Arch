import {expect, it, describe} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/react-native';
import {useEffect, useState} from 'react';

import {Text, View} from 'react-native';
import {anyString} from '../../__test__/helpers/fakes';

class NextEventViewModel {
  goalKeepers: NextEventPlayerViewModel[];

  constructor({goalKeepers}: {goalKeepers?: NextEventPlayerViewModel[]}) {
    this.goalKeepers = goalKeepers ?? [];
  }
}

class NextEventPlayerViewModel {
  name: string;

  constructor({name}: {name: string}) {
    this.name = name;
  }
}

interface INextEventPresenter {
  loadNextEvent: ({groupId}: {groupId: string}) => Promise<NextEventViewModel>;
}

class NextEventPresenterSpy implements INextEventPresenter {
  loadCallsCount = 0;
  groupId = '';
  response: NextEventViewModel = {
    goalKeepers: [],
  } as NextEventViewModel;

  loadNextEvent = async ({
    groupId,
  }: {
    groupId: string;
  }): Promise<NextEventViewModel> => {
    this.loadCallsCount++;
    this.groupId = groupId;
    return this.response;
  };
}

function NextEventPage({presenter, groupId}: NextEventPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nextEvent, setNextEvent] = useState<NextEventViewModel | undefined>();

  useEffect(() => {
    const loadingLoadNextEvent = async () => {
      try {
        setIsLoading(true);
        const response = await presenter.loadNextEvent({groupId});
        setNextEvent(response);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadingLoadNextEvent();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <Text testID="spinner">loading...</Text>;
    }
    if (error) {
      return <Text testID="error">error</Text>;
    }
    return (
      <View>
        <Text>DENTRO - GOLEIROS</Text>
        <Text>{nextEvent?.goalKeepers.length}</Text>
        {nextEvent?.goalKeepers.map(goalKeeper => (
          <Text key={goalKeeper.name}>{goalKeeper.name}</Text>
        ))}
      </View>
    );
  };

  return renderContent();
}

type NextEventPageProps = {
  readonly presenter: INextEventPresenter;
  readonly groupId: string;
};

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
  });
});
