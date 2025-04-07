import {render, screen} from '@testing-library/react-native';
import React from 'react';
import {expect, it, describe} from '@jest/globals';
import {PlayerPosition} from '../../../ui/components/PlayerPosition';

const sut = ({position = 'goalkeeper'}: {position?: string}) => {
  render(<PlayerPosition position={position} />);
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

  it('should handle forward position', () => {
    sut({position: 'forward'});
    expect(screen.getByText('Atacante')).toBeTruthy();
  });
});
