import {expect, it, describe} from '@jest/globals';
import {render} from '@testing-library/react-native';
import {useEffect} from 'react';

import {Text} from 'react-native';
import {anyString} from '../../__test__/helpers/fakes';

interface INextEventPresenter {
  loadNextEvent: ({groupId}: {groupId: string}) => void;
}

class NextEventPresenterSpy implements INextEventPresenter {
  loadCallsCount = 0;
  groupId = '';
  loadNextEvent = ({groupId}: {groupId: string}) => {
    this.loadCallsCount++;
    this.groupId = groupId;
  };
}

function NextEventPage({presenter, groupId}: NextEventPageProps) {
  useEffect(() => {
    presenter.loadNextEvent({groupId});
  }, []);

  return <Text>NextEventPage</Text>;
}

type NextEventPageProps = {
  readonly presenter: INextEventPresenter;
  readonly groupId: string;
};

const sut = ({
  presenter = new NextEventPresenterSpy(),
  groupId = anyString(),
}: Partial<NextEventPageProps>) => {
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
});
