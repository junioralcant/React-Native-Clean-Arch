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
  useEffect(() => {
    const loadingLoadNextEvent = async () => {
      setIsLoading(true);
      await presenter.loadNextEvent({groupId});
      setIsLoading(false);
    };

    loadingLoadNextEvent();
  }, []);

  return isLoading ? (
    <Text testID="spinner">loading...</Text>
  ) : (
    <Text>NextEventPage</Text>
  );
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
    const presenter = new NextEventPresenterSpy();

    sut({presenter});
    expect(screen.getByTestId('spinner')).toBeTruthy();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).toBeFalsy();
    });
  });
});
