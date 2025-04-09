import '@testing-library/jest-native/extend-expect';
import {expect, it, describe} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {View} from 'react-native';

type PlayerStatusProps = {
  isConfirmed: boolean | null;
};

const PlayerStatus = ({isConfirmed}: PlayerStatusProps) => {
  const getBackgroundColor = () => {
    if (isConfirmed === null) return 'grey';
    if (isConfirmed) return 'green';
    return 'red';
  };

  return (
    <View
      testID="player_status"
      style={{
        width: 10,
        height: 10,
        backgroundColor: getBackgroundColor(),
      }}
    />
  );
};

const sut = ({isConfirmed = true}: Partial<PlayerStatusProps> = {}) =>
  render(<PlayerStatus isConfirmed={isConfirmed} />);

describe('PlayerStatus', () => {
  it('should present green status when is confirmed is true', () => {
    sut();
    expect(screen.getByTestId('player_status')).toHaveStyle({
      backgroundColor: 'green',
    });
  });

  it('should present red status when is confirmed is false', () => {
    sut({isConfirmed: false});
    expect(screen.getByTestId('player_status')).toHaveStyle({
      backgroundColor: 'red',
    });
  });

  it('should present grey status when is confirmed is null', () => {
    sut({isConfirmed: null});
    expect(screen.getByTestId('player_status')).toHaveStyle({
      backgroundColor: 'grey',
    });
  });
});
