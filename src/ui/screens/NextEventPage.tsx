import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {
  INextEventPresenter,
  NextEventPlayerViewModel,
  NextEventViewModel,
} from '../../presentation/presenters/next_event_presenter';
import {PlayerPosition} from '../components/PlayerPosition';

export type NextEventPageProps = {
  readonly presenter: INextEventPresenter;
  readonly groupId: string;
};

const ListSection = ({
  title,
  data,
}: {
  title: string;
  data: NextEventPlayerViewModel[];
}) => {
  return (
    <>
      <Text>{title}</Text>
      <Text>{data.length}</Text>
      {data.map(goalKeeper => (
        <View key={goalKeeper.name}>
          <Text>{goalKeeper.name}</Text>
          <PlayerPosition position={goalKeeper.position} />
        </View>
      ))}
    </>
  );
};

export const NextEventPage = ({presenter, groupId}: NextEventPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nextEvent, setNextEvent] = useState<NextEventViewModel | undefined>();

  useEffect(() => {
    const loadingLoadNextEvent = async () => {
      try {
        setIsLoading(true);
        const response = await presenter.loadNextEvent({groupId});
        setNextEvent(response);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadingLoadNextEvent();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <Text testID="spinner">loading...</Text>;
    }
    if (error) {
      return <Text testID="error">error</Text>;
    }
    return (
      <View>
        {nextEvent && nextEvent.goalKeepers.length > 0 && (
          <ListSection title="DENTRO - GOLEIROS" data={nextEvent.goalKeepers} />
        )}
        {nextEvent && nextEvent.players.length > 0 && (
          <ListSection title="DENTRO - JOGADORES" data={nextEvent.players} />
        )}
        {nextEvent && nextEvent.out.length > 0 && (
          <ListSection title="FORA" data={nextEvent.out} />
        )}
        {nextEvent && nextEvent.doubt.length > 0 && (
          <ListSection title="DÚVIDA" data={nextEvent.doubt} />
        )}
      </View>
    );
  };

  return renderContent();
};
