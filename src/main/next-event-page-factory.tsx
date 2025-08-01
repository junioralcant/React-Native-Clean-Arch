import {NextEventLoaderUseCase} from '../domain/usecases/next_envent_loader';
import {HttpAdapter} from '../infra/api/adapters/http_adapter';
import {HttpAdapterAxios} from '../infra/api/adapters/http_adapter_axios';
import {LoadNextEventApiRepository} from '../infra/api/repositories/load_next_event_api_repo';
import {NextEventPresenter} from '../presentation/presenters/next_event_presenter';
import {NextEventPage} from '../ui/screens/NextEventPage';

export const makeNextEventPage = () => {
  const httpClientAxios = new HttpAdapterAxios();
  const httpClient = new HttpAdapter(httpClientAxios);
  const repo = new LoadNextEventApiRepository(
    httpClient,
    'http://localhost:3000/api/groups/:groupId/next_event',
  );
  const nextEventLoadedUseCase = new NextEventLoaderUseCase(repo);
  const presenter = new NextEventPresenter(nextEventLoadedUseCase);
  return <NextEventPage presenter={presenter} groupId="1" />;
};
