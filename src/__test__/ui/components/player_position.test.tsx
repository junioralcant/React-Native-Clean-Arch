import {render, screen} from '@testing-library/react-native';
import React from 'react';
import {expect, it, describe} from '@jest/globals';
import {Text} from 'react-native';

const sut = ({position = 'goalkeeper'}: {position?: string}) => {
  render(<PlayerPosition position={position} />);
};

const PlayerPosition = ({position}: {position?: string}) => {
  const getPositionText = () => {
    if (position === 'goalkeeper') return 'Goleiro';
    if (position === 'defender') return 'Zagueiro';
    if (position === 'midfielder') return 'Meia';
    return 'Gandula';
  };

  return <Text>{getPositionText()}</Text>;
};

describe('PlayerPosition', () => {
  it('should handle goalkeeper position', () => {
    sut({position: 'goalkeeper'});
    expect(screen.getByText('Goleiro')).toBeTruthy();
  });

  it('should handle positionless', () => {
    sut({position: ''});
    expect(screen.getByText('Gandula')).toBeTruthy();
  });

  it('should handle defender position', () => {
    sut({position: 'defender'});
    expect(screen.getByText('Zagueiro')).toBeTruthy();
  });

  it('should handle midfielder position', () => {
    sut({position: 'midfielder'});
    expect(screen.getByText('Meia')).toBeTruthy();
  });
});
