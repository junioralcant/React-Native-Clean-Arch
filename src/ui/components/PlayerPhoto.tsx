import {Text, Image, View} from 'react-native';

export type PlayerPhotoProps = {
  initials: string;
  photo: string | null;
};

export const PlayerPhoto = ({
  initials = '',
  photo = '',
}: Partial<PlayerPhotoProps> = {}) => {
  return (
    <View testID="player_photo">
      {photo ? (
        <Image testID="icon_photo" source={{uri: photo}} />
      ) : (
        <Text>{initials}</Text>
      )}
    </View>
  );
};
