import {expect, it, describe} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/react-native';
import {useEffect, useState} from 'react';

import {Text} from 'react-native';
import {anyString} from '../../__test__/helpers/fakes';

interface INextEventPresenter {
  loadNextEvent: ({groupId}: {groupId: string}) => Promise<void>;
}

class NextEventPresenterSpy implements INextEventPresenter {
  loadCallsCount = 0;
  groupId = '';
  loadNextEvent = async ({groupId}: {groupId: string}): Promise<void> => {
    this.loadCallsCount++;
    this.groupId = groupId;
  };
}

function NextEventPage({presenter, groupId}: NextEventPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadingLoadNextEvent = async () => {
      try {
        setIsLoading(true);
        await presenter.loadNextEvent({groupId});
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
    return <Text>NextEventPage</Text>;
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
  it('should load event data on page init', () => {
    const presenter = new NextEventPresenterSpy();
    const groupId = anyString();

    sut({presenter, groupId});
    expect(presenter.loadCallsCount).toBe(1);
    expect(presenter.groupId).toBe(groupId);
  });

  it('should present spinner while data is loading', () => {
    sut();
    expect(screen.getByTestId('spinner')).toBeTruthy();
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
});
