import {render, screen} from '@testing-library/react-native';
import React from 'react';
import {expect, it, describe} from '@jest/globals';
import {Text} from 'react-native';

const sut = ({position = 'goalkeeper'}: {position?: string}) => {
  render(<PlayerPosition position={position} />);
};

const PlayerPosition = ({position}: {position?: string}) => {
  const positionText = position === 'goalkeeper' ? 'Goleiro' : 'Gandula';
  return <Text>{positionText}</Text>;
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
});
