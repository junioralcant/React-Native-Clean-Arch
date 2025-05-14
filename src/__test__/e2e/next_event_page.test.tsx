import {expect, it, describe} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/react-native';
import {
  NextEventPageProps,
  NextEventPage,
} from '../../ui/screens/NextEventPage';
import {anyString} from '../helpers/fakes';
import {NextEventPresenter} from '../../presentation/presenters/next_event_presenter';
import {NextEventLoaderUseCase} from '../../domain/usecases/next_envent_loader';
import {LoadNextEventApiRepository} from '../../infra/api/repositories/load_next_event_api_repo';
import {HttpAdapter} from '../../infra/api/adapters/http_adapter';
import {ClientSpy} from '../infra/api/clients/client_spy';

const client = new ClientSpy();
client.response = {
  id: '1',
  date: new Date('2025-05-13T10:00:00.000Z'),
  groupName: 'Group 1',
  players: [
    {
      id: '1',
      name: 'Player 1',
      isConfirmed: true,
      photo: 'photo1',
      position: 'Goalkeeper',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '2',
      name: 'Player 2',
      isConfirmed: true,
      photo: 'photo2',
      position: 'Defender',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '3',
      name: 'Player 3',
      isConfirmed: true,
      photo: 'photo3',
      position: 'Midfielder',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '4',
      name: 'Player 4',
      isConfirmed: true,
      photo: 'photo4',
      position: 'Forward',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '5',
      name: 'Player 5',
      isConfirmed: true,
      photo: 'photo5',
      position: 'Goalkeeper',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '6',
      name: 'Player 6',
      isConfirmed: true,
      photo: 'photo6',
      position: 'Defender',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '7',
      name: 'Player 7',
      isConfirmed: false,
      photo: 'photo7',
      position: 'Midfielder',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '8',
      name: 'Player 8',
      isConfirmed: true,
      photo: 'photo8',
      position: 'Forward',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
    {
      id: '9',
      name: 'Player 9',
      isConfirmed: true,
      photo: 'photo9',
      position: 'Forward',
      confirmationDate: new Date('2025-05-13T10:00:00.000Z'),
    },
  ],
};
const httpAdapter = new HttpAdapter(client);
const loadNextEventApiRepository = new LoadNextEventApiRepository(
  httpAdapter,
  '',
);
const nextEventLoaderUseCase = new NextEventLoaderUseCase(
  loadNextEventApiRepository,
);

const sut = ({
  presenter = new NextEventPresenter(nextEventLoaderUseCase),
  groupId = anyString(),
}: Partial<NextEventPageProps> = {}) => {
  render(<NextEventPage presenter={presenter} groupId={groupId} />);
};

describe('NextEventPage E2E', () => {
  it('should render next event page', async () => {
    sut();
    await waitFor(() => {
      expect(screen.getByText('Player 1')).toBeTruthy();
      expect(screen.getByText('Player 2')).toBeTruthy();
      expect(screen.getByText('Player 3')).toBeTruthy();
      expect(screen.getByText('Player 4')).toBeTruthy();
      expect(screen.getByText('Player 5')).toBeTruthy();
      expect(screen.getByText('Player 6')).toBeTruthy();
      expect(screen.getByText('Player 7')).toBeTruthy();
      expect(screen.getByText('Player 8')).toBeTruthy();
    });
  });
});
