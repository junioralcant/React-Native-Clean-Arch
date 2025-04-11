import {Text, Image} from 'react-native';

export type PlayerPhotoProps = {
  initials: string;
  photo: string | null;
};

export const PlayerPhoto = ({
  initials = '',
  photo = '',
}: Partial<PlayerPhotoProps> = {}) => {
  return !photo ? (
    <Text>{initials}</Text>
  ) : (
    <Image testID="player_photo" source={{uri: photo}} />
  );
};
