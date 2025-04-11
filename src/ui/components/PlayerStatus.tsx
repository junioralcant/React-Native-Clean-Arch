import {View} from 'react-native';

export type PlayerStatusProps = {
  isConfirmed: boolean | null;
};

export const PlayerStatus = ({isConfirmed}: PlayerStatusProps) => {
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
