import '@testing-library/jest-native/extend-expect';
import {expect, it, describe} from '@jest/globals';
import {render, screen} from '@testing-library/react-native';
import {Text} from 'react-native';

type PlayerPhotoProps = {
  initials: string;
  photo: string | null;
};

export const PlayerPhoto = ({
  initials = '',
  photo = '',
}: Partial<PlayerPhotoProps> = {}) => {
  return <Text>{initials}</Text>;
};

const sut = ({initials = '', photo = ''}: Partial<PlayerPhotoProps> = {}) =>
  render(<PlayerPhoto initials={initials} photo={photo} />);

describe('PlayerStatus', () => {
  it('should present initials when photo is not provided', () => {
    sut({initials: 'AB'});
    expect(screen.getByText('AB')).toBeTruthy();
  });
});
