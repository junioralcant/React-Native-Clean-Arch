import '@testing-library/jest-native/extend-expect';
import {expect, it, describe} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {
  PlayerPhotoProps,
  PlayerPhoto,
} from '../../../ui/components/PlayerPhoto';

const sut = ({initials = '', photo = ''}: Partial<PlayerPhotoProps> = {}) =>
  render(<PlayerPhoto initials={initials} photo={photo} />);

describe('PlayerStatus', () => {
  it('should present initials when photo is not provided', () => {
    sut({initials: 'AB'});
    expect(screen.getByText('AB')).toBeTruthy();
  });

  it('should not present initials when photo is provided', () => {
    sut({photo: 'https://via.placeholder.com/150'});
    expect(screen.queryByText('AB')).toBeFalsy();
    expect(screen.getByTestId('player_photo').props.source.uri).toBe(
      'https://via.placeholder.com/150',
    );
  });
});
