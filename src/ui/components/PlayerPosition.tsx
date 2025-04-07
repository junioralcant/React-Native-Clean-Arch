import {Text} from 'react-native';

export const PlayerPosition = ({position}: {position?: string}) => {
  const getPositionText = () => {
    if (position === 'goalkeeper') return 'Goleiro';
    if (position === 'defender') return 'Zagueiro';
    if (position === 'midfielder') return 'Meia';
    if (position === 'forward') return 'Atacante';
    return 'Gandula';
  };

  return <Text testID="player_position">{getPositionText()}</Text>;
};
