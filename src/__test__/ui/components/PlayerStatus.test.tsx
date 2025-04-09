import '@testing-library/jest-native/extend-expect';
import {expect, it, describe} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {View, Text} from 'react-native';

type PlayerStatusProps = {
  isConfirmed: boolean;
};

const PlayerStatus = ({isConfirmed}: PlayerStatusProps) => {
  return (
    <View
      testID="player_status"
      style={{width: 10, height: 10, backgroundColor: 'green'}}
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
});
